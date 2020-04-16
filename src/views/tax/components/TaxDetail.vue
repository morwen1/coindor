<template>
  <div class="createPost-container">
    <el-form class="form-container" :model="postForm" :rules="rules" ref="postForm">
      <div class="createPost-main-container">
        <el-row :gutter="12">
          <el-col :span="18">
            <el-col :span="12">
              <el-form-item style="margin-bottom: 40px;" label="Pais:" prop="pais">
                <br>
                <el-select
                  filterable
                  placeholder="Seleccionar"
                  v-model="postForm.pais"
                  @change="selectPais"
                >
                  <el-option
                    v-for="(item,index) in pais"
                    :key="index"
                    :label="item.label"
                    :value="index"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item style="margin-bottom: 40px;" label="Moneda:" prop="money">
                <br>
                <el-select
                  filterable
                  placeholder="Seleccionar"
                  v-model="postForm.money"
                  @change="selectMoney"
                >
                  <el-option v-for="item in moneys" :key="item" :label="item" :value="item"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item style="margin-bottom: 40px;" label="Nombre Descriptivo:" prop="name">
                <el-input
                  type="text"
                  v-model="postForm.name"
                  placeholder="Dolares Especiales, Soles Especiales, Etc"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item style="margin-bottom: 40px;" label="Tasa:" prop="tax">
                <el-input type="number" v-model="postForm.tax"></el-input>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item style="margin-bottom: 40px;" label="Estado:" prop="status">
                <br>
                <el-select placeholder="Seleccionar" v-model="postForm.status">
                  <el-option
                    v-for="item in status"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item style="margin-bottom: 40px;" label="Visible en Pagina Web:">
                <br>
                <el-select placeholder="Seleccionar" v-model="postForm.public">
                  <el-option
                    v-for="item in public"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
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
  pais: "",
  name: "",
  money: "",
  tax: "",
  status: "",
  public: ""
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
      listLoading: true,
      userListOptions: [],
      listQuery: {
        page: 1,
        limit: 1000
      },
      rules: {
        pais: [{ required: true, trigger: "blur", validator: validateRequire }],
        money: [
          { required: true, trigger: "blur", validator: validateRequire }
        ],
        tax: [{ required: true, trigger: "blur", validator: validateRequire }],
        status: [
          { required: true, trigger: "blur", validator: validateRequire }
        ]
      },
      
      public: [
        {
          value: "1",
          label: "Si"
        },
        {
          value: "0",
          label: "No"
        }
      ],
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

      pais: [
        {
          value: "Argentina",
          label: "Argentina",
          money: ["Pesos Argentinos", "Dólares"]
        },
        {
          value: "Bolivia",
          label: "Bolivia",
          money: ["Boliviano", "Dólares"]
        },
        {
          value: "Brasil",
          label: "Brasil",
          money: ["Reals", "Dólares"]
        },
        {
          value: "Chile",
          label: "Chile",
          money: ["Pesos Chileno", "Dólares"]
        },
        {
          value: "Colombia",
          label: "Colombia",
          money: ["Pesos Colombiano", "Dólares"]
        },
        {
          value: "Costa Rica",
          label: "Costa Rica",
          money: ["Colón costarricense", "Dólares"]
        },
        {
          value: "Cuba",
          label: "Cuba",
          money: ["Pesos Cubano", "Dólares"]
        },
        {
          value: "Ecuador",
          label: "Ecuador",
          money: ["Dólares"]
        },
        {
          value: "El Salvador",
          label: "El Salvador",
          money: ["Dólares"]
        },
        {
          value: "Guayana Francesa",
          label: "Guayana Francesa",
          money: ["Euro", "Dólares"]
        },
        {
          value: "Granada",
          label: "Granada",
          money: ["Dólares del Caribe Oriental", "Dólares"]
        },
        {
          value: "Guatemala",
          label: "Guatemala",
          money: ["Quetzal", "Dólares"]
        },
        {
          value: "Guayana",
          label: "Guayana",
          money: ["Dólares guyanés", "Dólares"]
        },
        {
          value: "Haiti",
          label: "Haiti",
          money: ["Gourde", "Dólares"]
        },
        {
          value: "Honduras",
          label: "Honduras",
          money: ["Lempiras hondureños", "Dólares"]
        },
        {
          value: "Jamaica",
          label: "Jamaica",
          money: ["Dólareses jamaiquino", "Dólares"]
        },
        {
          value: "Mexico",
          label: "Mexico",
          money: ["Pesos mexicanos", "Dólares"]
        },
        {
          value: "Nicaragua",
          label: "Nicaragua",
          money: ["Córdobas", "Dólares"]
        },
        {
          value: "Paraguay",
          label: "Paraguay",
          money: ["Guaraní paraguayos", "Dólares"]
        },
        {
          value: "Panama",
          label: "Panama",
          money: ["Balboa", "Dólares"]
        },
        {
          value: "Peru",
          label: "Peru",
          money: ["Soles", "Dólares"]
        },
        {
          value: "Puerto Rico",
          label: "Puerto Rico",
          money: ["Dólares"]
        },
        {
          value: "Republica Dominicana",
          label: "Republica Dominicana",
          money: ["Pesos dominicano", "Dólares"]
        },
        {
          value: "Surinam",
          label: "Surinam",
          money: ["Dólares surinamés", "Dólares"]
        },
        {
          value: "Uruguay",
          label: "Uruguay",
          money: ["Pesos uruguayo", "Dólares"]
        },
        {
          value: "Venezuela",
          label: "Venezuela",
          money: ["Bolivares", "Dólares"]
        },
        {
          value: "Espana",
          label: "Espana",
          money: ["Euros", "Dólares"]
        },
        {
          value: "Estados Unidos",
          label: "Estados Unidos",
          money: ["Dólares"]
        },
        {
          value: "Europa",
          label: "Europa",
          money: ["Euros", "Dólares"]
        }
      ],
      value5: [],
      value: "",
      options: [],
      organization: [],
      moneys: []
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
      get(id, "tax")
        .then(response => {
          this.postForm = response.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    selectPais() {
      this.postForm.money = undefined;
      console.log(this.pais[this.postForm.pais].money);
      this.moneys = this.pais[this.postForm.pais].money;
      this.postForm.pais = this.pais[this.postForm.pais].value;
    },
    selectMoney() {
      this.postForm.name = this.postForm.money;
    },
    submitForm() {
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true;
          if (this.isEdit) {
            update(this.postForm, "tax", this.postForm.id)
              .then(response => {
                this.$message({
                  title: "Éxito",
                  message: "Tasa actualizada",
                  type: "success",
                  duration: 2000
                });
                setTimeout(() => this.$router.push({ path: "/tax" }), 2000);
              })
              .catch(error => {
                console.log(error);
                this.loading = false;
              });
          } else {
            create(this.postForm, "tax")
              .then(response => {
                this.$message({
                  title: "Éxito",
                  message: "Tasa creado",
                  type: "success",
                  duration: 2000
                });
                setTimeout(() => this.$router.push({ path: "/tax" }), 2000);
              })
              .catch(error => {
                console.log(error);
                this.loading = false;
              });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
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
