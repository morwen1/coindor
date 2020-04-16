<template>
  <div class="createPost-container">
    <el-form class="form-container" :model="postForm" :rules="rules" ref="postForm">
      <div class="createPost-main-container">
        <el-row :gutter="12" >
           <el-col :span="20"  >
           <el-col :span="12" >
              <el-form-item  label="Banco:" class="postInfo-container-item"  >
                  <el-input type="text" v-model="infobank.bank" disabled="disabled"> </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12"  >
            <el-form-item  label="Nombre de Cuenta:" class="postInfo-container-item"  >
                <el-input type="text" v-model="infobank.name" disabled="disabled"> </el-input>
            </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item style="margin-bottom: 40px; width:100%;" label="Operacion:" prop="operation">
                <br/>
                <el-select  filterable placeholder="Seleccionar" v-model="postForm.operation" >
                  <el-option
                    v-for="item in operation"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="postForm.operation=='1'">
              <el-form-item style="margin-bottom: 40px;" label="Monto:" prop="amount" >
                <el-input type="number" v-model="postForm.amount" step="any" min="0" :max="infobank.amount" :v-validate="'required|min:0|max:infobank.amount'"> </el-input>
              </el-form-item>
            </el-col>
             <el-col :span="12" v-else>
              <el-form-item style="margin-bottom: 40px;" label="Monto:" prop="amount" >
                <el-input type="number" v-model="postForm.amount" step="any" min="0" v-validate="'required|min:0'"> </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item style="margin-bottom: 40px;" label="Mensaje:" prop="message">
                 <el-input
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4}"
                  placeholder="Motivo de la operación"
                  v-model="postForm.message">
                </el-input>
              </el-form-item>
              
            </el-col>
            <el-col :span="24">
              <el-button v-loading="loading" style="margin-left: 10px;" type="success" @click="submitForm">Realizar Operación
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
  bankId: "",
  message: "",
  amount: "",
  operation: "",
}

export default {
  name: 'bankOperation',
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

    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      listLoading: true,
      userListOptions: [],
      listQuery: {
        page: 1,
        limit: 1000
      },
      rules: {
        bankId: [{ required: true, trigger: 'blur', validator: validateRequire }],
        amount: [{ required: true, trigger: 'blur', validator: validateRequire }],
        operation: [{ required: true, trigger: 'blur', validator: validateRequire }]
      },
      operation:[
         {
            value: 1, 
            label: 'Retiro' 
          },{
            value: 2, 
            label:'Deposito' 
          },{
            value: 3, 
            label:'Pago Externo' 
          }],
        value5: [],
        value: '',
        options: [],
        infobank: []
    }
  },
  created() {
    const id = this.$route.params && this.$route.params.id
    this.fetchData(id)
  },
  methods: {
    getList() {
      this.listLoading = true
    },
    fetchData(id) {
      get(id,'bank').then(response => {
        this.infobank = response.data
        this.postForm.bankId = response.data.id
      }).catch(err => {
        console.log(err)
      })
    },
    
    submitForm() {
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true
            create(this.postForm, 'bank-operation').then(response => {
              this.$message({
                title: 'Éxito',
                message: 'Operación Realizada',
                type: 'success',
                duration: 2000
              })
              setTimeout( () => this.$router.push({ path: '/bank'}), 2000);
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
