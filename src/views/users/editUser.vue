<template>
  <div class="createPost-container" v-loading="loading">
    <el-form class="form-container" :model="postForm" :rules="rules" ref="postForm">
      <div class="createPost-main-container">
        <el-row :gutter="12" >
          <el-col :span="18">
            <el-col :span="12">
              <el-form-item style="margin-bottom: 40px;"  label="Nombre:" prop="name">
                <MDinput name="Nombre Completo"  :maxlength="100" v-model="postForm.name" >
                </MDinput>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item style="margin-bottom: 40px;" label="Email:" prop="email">
                <MDinput name="email"  :maxlength="100" type="email" v-model="postForm.email" :disabled="true">
                </MDinput>
              </el-form-item>
            </el-col>
            <el-col :span="24">
                <h2 style="color: #606266; margin-top: 0px;">   <svg-icon icon-class="peoples" class-name="card-panel-icon" /> Datos de usuario</h2>
            </el-col>
            <el-col :span="12">
              <el-form-item style="margin-bottom: 40px;" label="Cedula:" prop="dni">
                <MDinput name="dni" type="number"  v-model="postForm.dni"  >
                </MDinput>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item style="margin-bottom: 40px;" label="Contraseña:" prop="password">
                <MDinput name="password"  :maxlength="100"  v-model="postForm.password" type="text" >
                </MDinput>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">Guardar
              </el-button>
            </el-col>
          </el-col>
        </el-row>
      </div>
    </el-form>
  </div>
</template>

<script>
import { create, update, get, getAll } from "@/api/apigeneral";
import MDinput from '@/components/MDinput'
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.min.css'// 多选框组件css
import { validateEmail,validateNumber } from '@/utils/validate'

const defaultForm = {
  name: '',
  email: '',
  dni: '',
  password: '',
  status: '',
  id: undefined,
  role: "",
}

export default {
  name: 'usersDetail',
  components: { MDinput, Multiselect },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(rule.field + ' es requerido'))
      } else {
        callback()
      }
    }
    const validateSourceUri = (rule, value, callback) => {
      if (validateEmail(value)) {
        callback()
      } else {
        callback(new Error(rule.field + ' no es una direccion de correo valida'))
      }
    }

    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      userListOptions: [],
      listQuery: {
        page: 1,
        limit: 1000
      },
      rules: {
        name: [{ required: true, trigger: 'blur', validator: validateRequire }],
        email: [{ required: true, trigger: 'blur', validator: validateSourceUri,validateRequire }],
        dni: [{ required: true, trigger: 'blur', validator: validateRequire }],
        password: [{ required: true, trigger: 'blur', validator: validateRequire }],
        status: [{ required: true, trigger: 'blur', validator: validateRequire }],
      },

        value5: [],
        value: '',
        options: [],
        organization: [],
        id: undefined
    }
  },
  created() {
    this.fetchData()
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
    },
    fetchData() {
       this.loading= true,
      get(0,'users').then(response => {
        this.postForm = response.data
        this.loading= false
      }).catch(err => {
        console.log(err)
      })
    },
    submitForm() {
      this.$refs.postForm.validate(valid => {
        if (valid) {
            update(this.postForm, 'users',this.postForm.id).then(response => {
              this.$message({
                title: 'Éxito',
                message: 'Perfil actualizado',
                type: 'success',
                duration: 2000
              })
               setTimeout( () => this.$router.push({ path: '/'}), 2000);
            }).catch(error => {
              console.log(error)
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.avatar{
  width: 200px;
  height: 200px;
  border-radius: 50%;
}
.createPost-container {
  position: relative;
  .createPost-main-container {
    padding: 40px 45px 20px 50px;
    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;
      .postInfo-container-item {
        float: left;
      }
    }
    .editor-container {
      min-height: 500px;
      margin: 0 0 30px;
      .editor-upload-btn-container {
        text-align: right;
        margin-right: 10px;
        .editor-upload-btn {
          display: inline-block;
        }
      }
    }
  }
  .word-counter {
    width: 40px;
    position: absolute;
    right: -10px;
    top: 0px;
  }
}
</style>
