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

    <p>Historial de Movimientos</p>
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
      <el-table-column align="center" label="Operación:">
        <template slot-scope="scope">
          <el-tag :type="scope.row.operation | statusFilter">{{scope.row.operation | statusLabel }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Monto:">
        <template slot-scope="scope">
          <span>{{ getDecimal(scope.row.amount) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Mensaje:">
        <template slot-scope="scope">
          <span>{{ scope.row.message }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Transacción:">
        <template slot-scope="scope">
          <router-link
            :to="'/transferencia/ver/'+scope.row.transactionId"
            v-if="scope.row.transactionId"
          >
            <el-button type="primary" size="small">
              <i class="el-icon-view"></i>
            </el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="listQuery.page"
        :page-sizes="[10,20,30, 100]"
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
  name: "detail",
  directives: {
    waves
  },
  data() {
    return {
      listtotal: null,
      listgeneral: null,
      listestado: null,
      listretiro: null,
      listtipo: null,
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
        limit: 100,
        bankId: undefined,
        sort: "DESC",
        datestart: "",
        dateend: ""
      },
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
        1: "Retiro",
        2: "Deposito",
        3: "Pago Externo"
      };
      return statusMap[status];
    },
    statusFilter(status) {
      const statusMap = {
        1: "danger",
        2: "success",
        3: "info"
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
    const id = this.$route.params && this.$route.params.id;
    this.listQuery.bankId = id;
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
      getAll(this.listQuery, "bank-operation").then(response => {
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
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then(excel => {
        const tHeader = [
          "Fecha",
          "Mensaje",
          "Monto",
          "Transacción",
          "Banco"
        ];
        const filterVal = [
          "dateOperation",
          "message",
          "amount",
          "transactionId",
          "bank.bank",
        ];
        const data = this.formatJson(filterVal, this.list);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "movimientos"
        });
        this.downloadLoading = false;
      });
    },
     formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else if (this.isObject(j)) { 
          let val =""
          Object.keys(j).forEach(function(key) {
            let object = j[key]
            let value = key
            val = v[object][value] + " " + val
          });
          return val
        } else {
           return v[j]
        }


      }))
    },
    isObject (value) {
      return value && typeof value === 'object' && value.constructor === Object;
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
