<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        @keyup.enter.native="handleFilter"
        style="width: 200px;"
        class="filter-item"
        placeholder="Codigo"
        v-model="listQuery.codigo"
      ></el-input>
      <el-select
        @change="handleFilter"
        style="width: 140px"
        class="filter-item"
        v-model="listQuery.sort"
      >
        <el-option
          v-for="item in sortOptions"
          :key="item.id"
          :label="item.fullname"
          :value="item.key"
        ></el-option>
      </el-select>
      <el-date-picker v-model="listQuery.datestart" type="date" placeholder="Fecha de inicio"></el-date-picker>
      <el-date-picker v-model="listQuery.dateend" type="date" placeholder="Fecha de final"></el-date-picker>
      <el-button
        class="filter-item"
        type="primary"
        v-waves
        icon="el-icon-search"
        @click="handleFilter"
      >Buscar</el-button>
      <el-button
        class="filter-item"
        type="primary"
        :loading="downloadLoading"
        v-waves
        icon="el-icon-download"
        @click="handleDownload"
      >Exportar</el-button>
    </div>
    <el-table
      :data="list"
      v-loading.body="listLoading"
      border
      fit
      highlight-current-row
      style="width: 100%"
      :row-class-name="tableStatus"
    >
      <el-table-column align="center" label="Fecha">
        <template slot-scope="scope">
          <span>{{scope.row.dateOperation}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Codigo">
        <template slot-scope="scope">
          <router-link :to="'/transferencia/ver/'+scope.row.id">
            <span style="color:blue;">#{{scope.row.transactionId}}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column label="Trabajador:">
        <template slot-scope="scope">
          <span>{{ scope.row.users.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Monto">
        <template slot-scope="scope">
          <span>{{ scope.row.amountSend }} {{ scope.row.typeMoney }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Tipo ">
        <template slot-scope="scope">
          <span>{{ scope.row.typePayment }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Cliente">
        <template slot-scope="scope">
          <span>{{ scope.row.client.name }} {{ scope.row.users.lastname }}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="Estado">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{scope.row.status | statusLabel }}</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="listQuery.page"
        :page-sizes="[10,20,30, 50]"
        :page-size="listQuery.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { getAll, borrar } from "@/api/apigeneral";
import waves from "@/directive/waves"; // 水波纹指令
import { mapGetters } from "vuex";
export default {
  name: "userslist",
  directives: {
    waves
  },
  data() {
    return {
      list: null,
      total: 0,
      listarchive: null,
      totalarchive: 0,
      listtrash: null,
      totaltrash: 0,
      activeName: "Pendientes",
      loading: false,
      listLoading: true,
      currentRole: true,
      listQuery: {
        page: 1,
        limit: 50,
        codigo: undefined,
        sort: "DESC",
        datestart: "",
        dateend: "",
        user: ""
      },
      urlimprimir: process.env.BASE_API + "imprimir/",
      importanceOptions: undefined,
      downloadLoading: false,
      sortOptions: [
        { label: "Ascendiente", key: "ASC" },
        { label: "Descendiente", key: "DESC" }
      ]
    };
  },
  filters: {
    statusLabel(status) {
      const statusMap = {
        0: "Eliminado",
        1: "Pendiente",
        2: "Completado",
        3: "Alerta"
      };
      return statusMap[status];
    },
    statusFilter(status) {
      const statusMap = {
        0: "danger",
        1: "info",
        2: "success",
        3: "danger"
      };
      return statusMap[status];
    }
  },
  computed: {
    ...mapGetters(["roles", "iduser", "name"])
  },
  created() {
    const id = this.$route.params && this.$route.params.id;
    console.log(this.id);
    this.listQuery.user = id;
    this.getList();
  },

  methods: {
    tableStatus({ row }) {
      if (row.status == "2") {
        return "success-row";
      } else if (row.status == "3") {
        return "warning-row";
      }
      return "";
    },
    getList() {
      this.listLoading = true;
      getAll(this.listQuery, "transaction-general").then(response => {
        this.list = response.data.items;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },

    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    handleDownload() {
      let f = new Date();
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then(excel => {
        const tHeader = [
          "Identificador",
          "Pais",
          "Fecha",
          "Cliente",
          "Telefono",
          "Banco",
          "Beneficiario",
          "CV Beneficiario",
          "Tipo de Cuenta",
          "Monto",
          "Moneda",
          "Trabajador",
          "Observaciones"
        ];
        const filterVal = [
          "transactionId",
          "paisSend",
          "dateOperation",
          { lastname: "client", name: "client" },
          { phone: "client" },
          { bank: "account_bank" },
          { lastname: "account_bank", name: "account_bank" },
          { dni: "account_bank", typeDocument: "account_bank" },
          { typeAccount: "account_bank" },
          "amountReceive",
          "amountSend",
          { name: "users" },
          "message"
        ];
        const data = this.formatJson(filterVal, this.list);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename:
            "Transferencias Trabajador" +
            f.getDate() +
            "-" +
            f.getMonth() +
            "-" +
            f.getFullYear() +
            " " +
            f.getHours() +
            f.getMinutes() +
            f.getSeconds()
        });
        this.downloadLoading = false;
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else if (this.isObject(j)) {
            let val = "";
            Object.keys(j).forEach(function(key) {
              let object = j[key];
              let value = key;
              val = v[object][value] + " " + val;
            });
            return val;
          } else {
            return v[j];
          }
        })
      );
    },
    isObject(value) {
      return value && typeof value === "object" && value.constructor === Object;
    }
  }
};
</script>
<style>
.el-table .warning-row {
  background: #e06060;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>
<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
</style>
