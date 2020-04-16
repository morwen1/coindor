<template>
  <div class="app-container">
    <el-form class="form-container" :model="postForm" :rules="rules" ref="postForm">
      <div class="createPost-main-container">
        <el-row :gutter="12">
          <el-col :span="24">
            <p>Para la utilización de carga masiva de depositos, debe ponerse en contacto con el soporte tecnico del software de casa de cambio para darle el formato de carga</p>
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
              <el-form-item style="margin-bottom: 40px;" label="Tipo de Moneda" prop="typeMoney">
                <br>
                <el-select filterable placeholder="Seleccionar" v-model="postForm.typeMoney">
                  <el-option v-for="item in money" :key="item" :label="item" :value="item"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <upload-excel-component :on-success="handleSuccess" :before-upload="beforeUpload"/>
              <el-table
                :data="tableData"
                border
                highlight-current-row
                style="width: 100%;margin-top:20px;"
              >
                <el-table-column
                  v-for="item of tableHeader"
                  :key="item"
                  :prop="item"
                  :label="item"
                />
              </el-table>
            </el-col>
            <el-col :span="24">
              <el-button
                v-loading="loading"
                style="margin-left: 10px;"
                type="success"
                @click="submitForm"
              >Guardar Depositos</el-button>
            </el-col>
          </el-col>
        </el-row>
      </div>
    </el-form>
  </div>
</template>

<script>
import UploadExcelComponent from "@/components/UploadExcel/index.vue";
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
  name: "UploadExcel",
  components: { UploadExcelComponent, MDinput, Multiselect },
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
      tableData: [],
      tableHeader: [],
      loading: false,
      listLoading: true,
      userListOptions: [],
      value5: [],
      value: "",
      options: [],
      total: [],
      list: [],
      namebank: [],
      organization: [],
      money: [],
      listQuery: {
        page: 1,
        limit: 1000,
        vnzla: false
      },
      rules: {
        bankId: [
          { required: true, trigger: "blur", validator: validateRequire }
        ],
        typeMoney: [
          { required: true, trigger: "blur", validator: validateRequire }
        ]
      }
    };
  },
  created() {
    this.postForm = Object.assign({}, defaultForm);
    this.getList();
  },
  methods: {
    selectBank() {
      this.money = undefined;
      this.money = ["Dólares"];
      this.money.push(this.list[this.namebank].typeMoney);
      this.postForm.bankId = this.list[this.namebank].id;
    },
    getList() {
      this.listLoading = true;
      getAll(this.listQuery, "bank").then(response => {
        this.list = response.data.items;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1;
      if (isLt1M) {
        return true;
      }
      this.$message({
        message: "Por favor, no cargue archivos de más de 1 m de tamaño.",
        type: "warning"
      });
      return false;
    },
    handleSuccess({ results, header }) {
      this.tableData = results;
      this.tableHeader = header;
    },

    submitForm() {
      console.log(this.tableData);
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true;
          for (var i = 0; i < this.tableData.length; i++) {
            var data = {
              bankId: this.postForm.bankId,
              numOperation: this.tableData[i].Operation,
              amount: this.tableData[i].Monto,
              status: 1,
              dateOperation: this.tableData[i].Fecha,
              typeMoney: this.postForm.typeMoney
            };
            console.log(data);
            create(data, "masivo")
              .then(response => {
                this.$message({
                  title: "Éxito",
                  message: "Deposito creado",
                  type: "success",
                  duration: 2000
                });
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