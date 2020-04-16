<template>
  <div class="createPost-container">
    <el-form class="form-container" :model="postForm" :rules="rules" ref="postForm">
      <div class="createPost-main-container">
        <el-row :gutter="12">
          <el-col :span="18">
            <el-col :span="12">
              <el-form-item style="margin-bottom: 40px;" label="Bancos" prop="bankId">
                <br>
                <el-select
                  filterable
                  placeholder="Seleccionar"
                  v-model="namebank"
                  @change="selectBank"
                >
                  <el-option
                    v-for="(item,index) in list"
                    :key="index"
                    :label="item.name"
                    :value="index"
                  >
                    <span>{{ item.bank }} - {{ item.name }}</span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item
                style="margin-bottom: 40px;"
                label="Numero de Referencia:"
                prop="numOperation"
              >
                <el-input type="text" v-model="postForm.numOperation"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24">
              <el-form-item
                label="Fecha de Deposito:"
                class="postInfo-container-item"
                prop="dateOperation"
              >
                <br>
                <el-date-picker
                  v-model="postForm.dateOperation"
                  type="datetime"
                  format="yyyy/MM/dd hh:mm:ss"
                  value-format="yyyy-MM-dd hh:mm:ss"
                  label="Fecha de Deposito"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item style="margin-bottom: 40px;" label="Monto:" prop="amount">
                <el-input type="number" v-model="postForm.amount"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item style="margin-bottom: 40px;" label="Tipo de Moneda" prop="typeMoney">
                <br>
                <el-select filterable placeholder="Seleccionar" v-model="postForm.typeMoney">
                  <el-option
                    v-for="item in money"
                    :key="item"
                    :label="item"
                    :value="item"
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
  bankId: "",
  numOperation: "",
  amount: "",
  status: "",
  dateOperation: undefined,
  typeMoney: ""
};

export default {
  name: "depositDetail",
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
        limit: 1000,
        vnzla:false
      },
      rules: {
        bankId: [
          { required: true, trigger: "blur", validator: validateRequire }
        ],
        amount: [
          { required: true, trigger: "blur", validator: validateRequire }
        ],
        numOperation: [
          { required: true, trigger: "blur", validator: validateRequire }
        ],
        dateOperation: [
          { required: true, trigger: "blur", validator: validateRequire }
        ],
        typeMoney: [
          { required: true, trigger: "blur", validator: validateRequire }
        ]
      },
      money: [],
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
      total: [],
      list: [],
      namebank: [],
      organization: []
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
    selectBank() {
      this.money = undefined;
      this.money = ["Dólares"];
      this.money.push(this.list[this.namebank].typeMoney);
      this.postForm.bankId = this.list[this.namebank].id
    },
    getList() {
      this.listLoading = true;
      getAll(this.listQuery, "bank").then(response => {
        this.list = response.data.items;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },
    fetchData(id) {
      get(id, "deposit")
        .then(response => {
          this.postForm = response.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    submitForm() {
      this.postForm.dateOperation = new Date(this.postForm.dateOperation);
      //this.postForm.dateOperation = date.toLocaleString();
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true;
          if (this.isEdit) {
            update(this.postForm, "deposit", this.postForm.id)
              .then(response => {
                this.$message({
                  title: "Éxito",
                  message: "Deposito Actualizado",
                  type: "success",
                  duration: 2000
                });
                setTimeout(() => this.$router.push({ path: "/deposit" }), 2000);
              })
              .catch(error => {
                console.log(error);
                this.loading = false;
              });
          } else {
            create(this.postForm, "deposit")
              .then(response => {
                this.$message({
                  title: "Éxito",
                  message: "Deposito creado",
                  type: "success",
                  duration: 2000
                });
                setTimeout(() => this.$router.push({ path: "/deposit" }), 2000);
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
