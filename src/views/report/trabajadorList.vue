<template>
  <div class="app-container">
    <div class="filter-container">
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

    <p>Reporte general</p>
    <el-table
      :data="listtotal"
      v-loading.body="listLoading"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column align="center" label="Fecha:">
        <template slot-scope="scope">
          <span>{{ scope.row.dateOperation }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Trabajador:">
        <template slot-scope="scope">
          <router-link :to="'/report/trabajadordetail/'+scope.row.usersId">
            <el-button type="primary" size="small">{{ scope.row.users.name }}</el-button>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Pais:">
        <template slot-scope="scope">
          <span>{{ scope.row.PaisSend }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Monto:">
        <template slot-scope="scope">
          <span>{{ getDecimal(scope.row.amountSend) }} {{ scope.row.typeMoney }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Bolivares:">
        <template slot-scope="scope">
          <span>{{ getDecimal(scope.row.amountReceive) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Tipo:">
        <template slot-scope="scope">
          <span>{{ scope.row.typePayment }}</span>
        </template>
      </el-table-column>
    </el-table>
    <p>Total</p>
    <el-table
      border
      fit
      highlight-current-row
      style="width: 100%"
      v-loading.body="listLoading"
      :data="tableData"
    >
      <el-table-column label="Monto:">
        <template slot-scope="scope">
          <span>{{ getDecimal(scope.row.amountSend) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Bolivares:">
        <template slot-scope="scope">
          <span>{{ getDecimal(scope.row.amountReceive) }}</span>
        </template>
      </el-table-column>
    </el-table>
    <p>Reporte por estado</p>
    <el-table
      :data="list"
      v-loading.body="listLoading"
      border
      fit
      highlight-current-row
      style="width: 100%"
      :row-class-name="tableStatus"
    >
      <el-table-column align="center" label="Fecha:">
        <template slot-scope="scope">
          <span>{{ scope.row.dateOperation }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Trabajador:">
        <template slot-scope="scope">
          <span>{{ scope.row.users.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Pais:">
        <template slot-scope="scope">
          <span>{{ scope.row.PaisSend }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Saldo:">
        <template slot-scope="scope">
          <span>{{ getDecimal(scope.row.amountSend) }} {{ scope.row.typeMoney }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Tipo:">
        <template slot-scope="scope">
          <span>{{ scope.row.typePayment }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Estado: ">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{scope.row.status | statusLabel }}</el-tag>
        </template>
      </el-table-column>
    </el-table>
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
      listtotal: null,
      total: 0,
      amountSend: 0,
      amountReceive: 0,
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
        dateend: ""
      },
      importanceOptions: undefined,
      downloadLoading: false,
      sortOptions: [
        { label: "Ascendiente", key: "ASC" },
        { label: "Descendiente", key: "DESC" }
      ],
      tableData: [
        {
          amountSend: "",
          amountReceive: ""
        }
      ]
    };
  },
  filters: {
    statusLabel(status) {
      const statusMap = {
        0: "Eliminado",
        1: "Pendiente",
        2: "Completado",
        3: "Pendiente con Error"
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
    ...mapGetters(["roles"])
  },
  created() {
    if (this.roles.includes("Trabajador")) {
      this.currentRole = false;
    }
    this.getList();
  },
  methods: {
    getDecimal(val) {
      return Number.parseFloat(val).toFixed(2);
    },
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
      getAll(this.listQuery, "reportes-trabajador").then(response => {
        this.list = response.data;
        this.listtotal = response.total;
        this.tableData[0].amountSend = response.amountSend;
        this.tableData[0].amountReceive = response.amountReceive;
        console.log(this.tableData[0].amountSend);
        console.log(this.tableData[0].amountReceive);

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
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then(excel => {
        const tHeader = [
          "Fecha",
          "Pais",
          "Monto",
          "Moneda",
          "Bolivares",
          "Trabajador"
        ];
        const filterVal = [
          "dateOperation",
          "PaisSend",
          "amountSend",
          "typeMoney",
          "amountReceive",
          { name: "users" }
        ];
        const data = this.formatJson(filterVal, this.list);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "reporte-trabajador"
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
