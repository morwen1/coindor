<template>
  <div class="createPost-container">
    <el-form class="form-container" :model="postForm" :rules="rules" ref="postForm">
      <div class="createPost-main-container">
        <el-row :gutter="12" >
          <el-col :span="18">
            <el-col :span="12">
              <el-form-item style="margin-bottom: 40px;"  label="Nombres:" prop="nombre">
                <MDinput name="nombre"  :maxlength="100" v-model="postForm.name" >
                </MDinput>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item style="margin-bottom: 40px;" label="Apellidos:" prop="apellido">
                <MDinput name="apellido" :maxlength="100" v-model="postForm.lastname" >
                </MDinput>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item style="margin-bottom: 40px;" label="Nacionalidad:" >
                <MDinput name="apellido" :maxlength="100" v-model="postForm.nationality" >
                </MDinput>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item style="margin-bottom: 40px;" label="Cedula:" prop="dni">
                <MDinput name="dni" type="number"  v-model="postForm.dni"  >
                </MDinput>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item style="margin-bottom: 40px;" label="Email:" >
                <MDinput name="email"  :maxlength="100" type="email" v-model="postForm.email" >
                </MDinput>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item style="margin-bottom: 40px;" label="Numero telefonico:" prop="phone">
                <MDinput name="phone"  :maxlength="100"  v-model="postForm.phone" >
                </MDinput>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item style="margin-bottom: 40px;" label="Numero telefonico alternativo:" >
                <MDinput name="phone"  :maxlength="100"  v-model="postForm.phone2" >
                </MDinput>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item style="margin-bottom: 40px;" label="Estado:" prop="status">
                <el-select  placeholder="Seleccionar" v-model="postForm.status" >
                  <el-option
                    v-for="item in status"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item style="margin-bottom: 40px;" label="Dirección:" >
                <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="Dirección"
                v-model="postForm.direction">
              </el-input>
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
  id: undefined,
  name: "",
  lastname: "",
  email: "",
  dni: "",
  phone: "",
  status: "",
  nationality: "",
  phone2: "",
  direction: "",
}

export default {
  name: 'clientDetail',
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
        lastname: [{ required: true, trigger: 'blur', validator: validateRequire }],
        dni: [{ required: true, trigger: 'blur', validator: validateRequire }],
        status: [{ required: true, trigger: 'blur', validator: validateRequire }],
        phone: [{ required: true, trigger: 'blur', validator: validateRequire }],
      },
      status:[{
          value: '1',
          label: 'Activado'
        }, {
          value: '2',
          label: 'Desactivado'
        }],
        value5: [],
        value: '',
        options: [],
        organization: []
    }
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id
       this.fetchData(id)
    } else {
      this.postForm = Object.assign({}, defaultForm)
    }
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
    },
    fetchData(id) {
      get(id,'client-search').then(response => {
        this.postForm = response.data
      }).catch(err => {
        console.log(err)
      })
    },
    submitForm() {
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
          if (this.isEdit) {
            update(this.postForm, 'client', this.postForm.id).then(response => {
              this.$message({
                title: 'Éxito',
                message: 'Cliente actualizado',
                type: 'success',
                duration: 2000
              })
               setTimeout( () => this.$router.push({ path: '/client'}), 2000);
            }).catch(error => {
              console.log(error)
              this.loading = false
            })
          } else {
            create(this.postForm, 'client').then(response => {
              this.$message({
                title: 'Éxito',
                message: 'Client creado',
                type: 'success',
                duration: 2000
              })
              setTimeout( () => this.$router.push({ path: '/client'}), 2000);
            }).catch(error => {
              console.log(error)
              this.loading = false
            })
          }
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
