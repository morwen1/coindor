<template>
  <div class="createPost-container">
    <el-form class="form-container" :model="postForm" :rules="rules" ref="postForm">
      <div class="createPost-main-container">
        <el-row :gutter="12">
          <el-col :span="12" :xs="24" :sm="12" :md="12">
            <el-form-item label="Nombres:" class="postInfo-container-item" prop="name">
              <el-input type="text" v-model="postForm.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12">
            <el-form-item label="Apellidos:" class="postInfo-container-item" prop="lastname">
              <el-input type="text" v-model="postForm.lastname"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" :xs="24" :sm="12" :md="12">
            <el-form-item label="Email:" class="postInfo-container-item" prop="email">
              <el-input type="text" v-model="postForm.email"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12">
            <el-form-item label="Telefono:" class="postInfo-container-item" prop="phone">
              <el-input type="text" v-model="postForm.phone"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12">
            <el-form-item
              label="Tipo de Documento:"
              class="postInfo-container-item"
              prop="typeDocument"
            ><br>
              <el-select placeholder="Seleccionar" filterable v-model="postForm.typeDocument">
                <el-option
                  v-for="item in typeDocument"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12">
            <el-form-item label="Cedula / DNI:" class="postInfo-container-item" prop="dni">
              <el-input type="text" v-model="postForm.dni"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24">
            <el-form-item
              label="Numero de cuenta:"
              class="postInfo-container-item"
              prop="accountNumber"
            >
              <el-input type="text" v-model="postForm.accountNumber"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12">
            <el-form-item
              label="Tipo de Cuenta:"
              class="postInfo-container-item"
              prop="typeAccount"
            >
              <el-select placeholder="Seleccionar" filterable v-model="postForm.typeAccount">
                <el-option
                  v-for="item in typeAccount"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12">
            <el-form-item label="Banco:" class="postInfo-container-item" prop="bank">
              <el-select placeholder="Seleccionar" filterable v-model="postForm.bank">
                <el-option
                  v-for="(item,index) in banks"
                  :key="index"
                  :label="item.label"
                  :value="index"
                ></el-option>
              </el-select>
            </el-form-item>
            <p
              v-if="bankAccountAccept"
              style="color:red;"
            >El numero de cuenta bancaria no corresponde al banco.</p>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12">
            <el-form-item label="Alias:" class="postInfo-container-item">
              <el-input type="text" v-model="postForm.alias"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-button
              v-loading="loading"
              style="margin-left: 10px;"
              type="success"
              @click="submitForm"
            >Guardar</el-button>
          </el-col>
        </el-row>
      </div>
    </el-form>
  </div>
</template>

<script>
import { create, update, get, getAll } from "@/api/apigeneral";
import MDinput from "@/components/MDinput";
import Multiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.min.css"; // 多选框组件css
import { validateEmail, validateNumber } from "@/utils/validate";

const defaultForm = {
  id: undefined,
  name: "",
  lastname: "",
  typeDocument: "",
  dni: "",
  email: "",
  phone: "",
  typeAccount: "",
  accountNumber: "",
  bank: "",
  pais: "Venezuela",
  status: 1,
  alias: "",
  clientId: ""
};

export default {
  name: "clientDetail",
  components: { MDinput, Multiselect },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(rule.field + " es requerido"));
      } else {
        callback();
      }
    };
    const validateSourceUri = (rule, value, callback) => {
      if (validateEmail(value)) {
        callback();
      } else {
        callback(
          new Error(rule.field + " no es una direccion de correo valida")
        );
      }
    };

    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      userListOptions: [],
      listQuery: {
        page: 1,
        limit: 1000
      },
      rules: {
        name: [{ required: true, trigger: "blur", validator: validateRequire }],
        lastname: [
          { required: true, trigger: "blur", validator: validateRequire }
        ],
        dni: [{ required: true, trigger: "blur", validator: validateRequire }],
        status: [
          { required: true, trigger: "blur", validator: validateRequire }
        ],
        bank: [{ required: true, trigger: "blur", validator: validateRequire }],
        typeAccount: [{ required: true, trigger: "blur", validator: validateRequire }],
        accountNumber: [{ required: true, trigger: "blur", validator: validateRequire }],
      },
      status: [
        {
          value: "1",
          label: "Activado"
        },
        {
          value: "2",
          label: "Desactivado"
        }
      ],
      value5: [],
      value: "",
      options: [],
      bankAccountAccept: false,
      organization: [],
      typeDocument: [
        {
          value: "V",
          label: "V"
        },
        {
          value: "J",
          label: "J"
        },
        {
          value: "P",
          label: "P"
        },
        {
          value: "E",
          label: "E"
        }
      ],
      typeAccount: [
        {
          value: "Ahorro",
          label: "Ahorro"
        },
        {
          value: "Corriente",
          label: "Corriente"
        }
      ],
      banks: [
        {
          value: "100%BANCO",
          label: "100%BANCO",
          code: "0156"
        },
        {
          value: "ABN AMRO BANK",
          label: "ABN AMRO BANK",
          code: "0196"
        },
        {
          value: "BANCAMIGA BANCO MICROFINANCIERO, C.A.",
          label: "BANCAMIGA BANCO MICROFINANCIERO, C.A.",
          code: "0172"
        },
        {
          value: "BANCO ACTIVO BANCO COMERCIAL, C.A.",
          label: "BANCO ACTIVO BANCO COMERCIAL, C.A.",
          code: "0171"
        },
        {
          value: "BANCO AGRICOLA",
          label: "BANCO AGRICOLA",
          code: "0166"
        },
        {
          value: "BANCO BICENTENARIO",
          label: "BANCO BICENTENARIO",
          code: "0175"
        },
        {
          value: "BANCO CARONI, C.A. BANCO UNIVERSAL",
          label: "BANCO CARONI, C.A. BANCO UNIVERSAL",
          code: "0128"
        },
        {
          value: "BANCO DE DESARROLLO DEL MICROEMPRESARIO",
          label: "BANCO DE DESARROLLO DEL MICROEMPRESARIO",
          code: "0164"
        },
        {
          value: "BANCO DE VENEZUELA S.A.I.C.A.",
          label: "BANCO DE VENEZUELA S.A.I.C.A.",
          code: "0102"
        },
        {
          value: "BANCO DEL CARIBE C.A.",
          label: "BANCO DEL CARIBE C.A.",
          code: "0114"
        },
        {
          value: "BANCO DEL PUEBLO SOBERANO C.A.",
          label: "BANCO DEL PUEBLO SOBERANO C.A.",
          code: "0149"
        },
        {
          value: "BANCO DEL TESORO",
          label: "BANCO DEL TESORO",
          code: "0163"
        },
        {
          value: "BANCO ESPIRITO SANTO, S.A.",
          label: "BANCO ESPIRITO SANTO, S.A.",
          code: "0176"
        },
        {
          value: "BANCO EXTERIOR C.A.",
          label: "BANCO EXTERIOR C.A.",
          code: "0115"
        },
        {
          value: "BANCO INDUSTRIAL DE VENEZUELA.",
          label: "BANCO INDUSTRIAL DE VENEZUELA.",
          code: "0003"
        },
        {
          value: "BANCO INTERNACIONAL DE DESARROLLO, C.A.",
          label: "BANCO INTERNACIONAL DE DESARROLLO, C.A.",
          code: "0173"
        },
        {
          value: "BANCO MERCANTIL C.A.",
          label: "BANCO MERCANTIL C.A.",
          code: "0105"
        },
        {
          value: "BANCO NACIONAL DE CREDITO",
          label: "BANCO NACIONAL DE CREDITO",
          code: "0191"
        },
        {
          value: "BANCO OCCIDENTAL DE DESCUENTO.",
          label: "BANCO OCCIDENTAL DE DESCUENTO.",
          code: "0116"
        },
        {
          value: "BANCO PLAZA",
          label: "BANCO PLAZA",
          code: "0138"
        },
        {
          value: "BANCO PROVINCIAL BBVA",
          label: "BANCO PROVINCIAL BBVA",
          code: "0108"
        },
        {
          value: "BANCO VENEZOLANO DE CREDITO S.A.",
          label: "BANCO VENEZOLANO DE CREDITO S.A.",
          code: "0104"
        },
        {
          value: "BANCRECER S.A. BANCO DE DESARROLLO",
          label: "BANCRECER S.A. BANCO DE DESARROLLO",
          code: "0168"
        },
        {
          value: "BANESCO BANCO UNIVERSAL",
          label: "BANESCO BANCO UNIVERSAL",
          code: "0134"
        },
        {
          value: "BANFANB",
          label: "BANFANB",
          code: "0177"
        },
        {
          value: "BANGENTE",
          label: "BANGENTE",
          code: "0146"
        },
        {
          value: "BANPLUS BANCO COMERCIAL C.A",
          label: "BANPLUS BANCO COMERCIAL C.A",
          code: "0174"
        },
        {
          value: "CITIBANK.",
          label: "CITIBANK.",
          code: "0190"
        },
        {
          value: "CORP BANCA.",
          label: "CORP BANCA.",
          code: "0121"
        },
        {
          value: "DELSUR BANCO UNIVERSAL",
          label: "DELSUR BANCO UNIVERSAL",
          code: "0157"
        },
        {
          value: "FONDO COMUN",
          label: "FONDO COMUN",
          code: "0151"
        },
        {
          value: "INSTITUTO MUNICIPAL DE CRÉDITO POPULAR",
          label: "INSTITUTO MUNICIPAL DE CRÉDITO POPULAR",
          code: "0601"
        },
        {
          value: "MIBANCO BANCO DE DESARROLLO, C.A.",
          label: "MIBANCO BANCO DE DESARROLLO, C.A.",
          code: "0169"
        },
        {
          value: "SOFITASA",
          label: "SOFITASA",
          code: "0137"
        }
      ]
    };
  },
  created() {
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id;
      this.fetchData(id);
    } else {
      this.postForm = Object.assign({}, defaultForm);
    }
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
    },
    fetchData(id) {
      get(id, "accountbank")
        .then(response => {
          this.postForm = response.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    submitForm() {
      this.bankAccountAccept = false;
      var codeBank = 1
      var codeAccount = 1
        if(codeBank == codeAccount){
          this.$refs.postForm.validate(valid => {
            if (valid) {
              this.loading = true;
              update(this.postForm, "accountbank", this.postForm.id)
                .then(response => {
                  this.postForm.id = response.response;
                  this.$message({
                    title: "Éxito",
                    message: "Cuenta Actualiza",
                    type: "success",
                    duration: 2000
                  });
                  this.loading = false;
                })
                .catch(error => {
                  console.log(error);
                  this.loading = false;
                });
            }
          });
        }else{
          this.bankAccountAccept = true;
          console.log('La cuenta bancaria no corresponde al banco.')
        }
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.avatar {
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
