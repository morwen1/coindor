<template>
  <div class="createPost-container">
    <el-form class="form-container" :model="postForm" :rules="rules" ref="postForm">

      <div class="createPost-main-container">
        <el-row :gutter="12" >
          <el-col :span="18">
		    <el-alert
    title="Retiros"
    type="info"
    description="En este apartado podras notificar cualquier retiro de dinero que no este ligado a una transferencia o operación bancaria, para su posterior aprobación"
    show-icon>
  </el-alert>
  
            <el-col :span="12">
              <el-form-item style="margin-bottom: 40px; width: 100%;" label="Pais:" prop="pais" >
                <br/>
                <el-select  filterable placeholder="Seleccionar" v-model="postForm.pais" style="width: 70%;">
                  <el-option
                    v-for="item in pais"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item style="margin-bottom: 40px; width: 40%;" label="Cantidad:" prop="amount">
                 <el-input type="text" v-model="postForm.amount" > </el-input>
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item style="margin-bottom: 40px;" label="Mensaje:" prop="message">
                 <el-input
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4}"
                  placeholder="Motivo de retiro Ejemplo: Deposito en Wester Union"
                  v-model="postForm.message">
                </el-input>
              </el-form-item>
              
            </el-col>
               <el-col :span="8"  class="animated fadeIn">
                  <el-form-item  label="Fecha de retiro " class="postInfo-container-item"   prop="dateOperation">
                    <el-date-picker v-model="postForm.dateOperation" type="datetime" format="yyyy-MM-dd" label="Fecha de Retiro">
                    </el-date-picker>
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
  pais: "",
  amount: "",
  message: "",
  dateOperation: "",
  status: 1
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
      listLoading: true,
      userListOptions: [],
      listQuery: {
        page: 1,
        limit: 1000
      },
      rules: {
        pais: [{ required: true, trigger: 'blur', validator: validateRequire }],
        amount: [{ required: true, trigger: 'blur', validator: validateRequire }],
        message: [{ required: true, trigger: 'blur', validator: validateRequire }],
        dateOperation: [{ required: true, trigger: 'blur', validator: validateRequire }],
      },
      status:[{
          value: '1',
          label: 'Activado'
        }, {
          value: '2',
          label: 'Desactivado'
        }],

       pais:[{
          value: 'Argentina', 
          label: 'Argentina' },
          {
            value:'Bolivia', 
            label:'Bolivia' },
          {
            value:'Brasil', 
            label:'Brasil' },
          {
            value:'Chile', 
            label:'Chile' },
          {
            value:'Colombia', 
            label:'Colombia' },
          {
            value:'Costa Rica', 
            label:'Costa Rica' },
          {
            value:'Cuba', 
            label:'Cuba' },
          {
            value:'Ecuador', 
            label:'Ecuador' 
          },
          {
            value:'El Salvador', 
            label:'El Salvador'}, 
          {
            value:'Guayana Francesa',
            label:'Guayana Francesa'},
          {
            value:'Granada', 
            label:'Granada' },
          {
            value:'Guatemala', 
            label:'Guatemala' },
          {
            value:'Guayana',
            label:'Guayana'},
          {
            value:'Haiti',
            label:'Haiti'},
          {
            value:'Honduras' ,
            label:'Honduras' },
          {
            value:'Jamaica' ,
            label:'Jamaica' },
          {
            value:'Mexico' ,
            label:'Mexico' },
          {
            value:'Nicaragua' ,
            label:'Nicaragua' },
          {
            value:'Paraguay', 
            label:'Paraguay' },
          {
            value:'Panama',
            label:'Panama'},
          {
            value:'Peru',
            label:'Peru'},
          {
            value:'Puerto Rico',
            label:'Puerto Rico'},
          {
            value:'Republica Dominicana',
            label:'Republica Dominicana'},
          {
            value:'Surinam',
            label:'Surinam'},
          {
            value:'Uruguay' ,
            label:'Uruguay' },
          {
            value:'Venezuela',
            label:'Venezuela'
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
      get(id,'retirement').then(response => {
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
            update(this.postForm, 'retirement', this.postForm.id).then(response => {
              this.$message({
                title: 'Éxito',
                message: 'Retiro actualizada',
                type: 'success',
                duration: 2000
              })
               setTimeout( () => this.$router.push({ path: '/retirement'}), 2000);
            }).catch(error => {
              console.log(error)
              this.loading = false
            })
          } else {
            create(this.postForm, 'retirement').then(response => {
              this.$message({
                title: 'Éxito',
                message: 'Retiro creado',
                type: 'success',
                duration: 2000
              })
              setTimeout( () => this.$router.push({ path: '/retirement'}), 2000);
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
