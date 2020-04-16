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

    <p>Cantidad de Transacciones ({{ trxtotal }})</p>
    <p>Reporte general</p>
    <el-table
      :data="listgeneral"
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
      <el-table-column align="center" label="Pais:">
        <template slot-scope="scope">
          <span>{{ scope.row.PaisSend }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Monto:">
        <template slot-scope="scope">
          <span>{{ getDecimal(scope.row.total) }} {{ scope.row.typeMoney }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Bolivares:">
        <template slot-scope="scope">
          <span>{{ getDecimal(scope.row.amountReceive) }}</span>
        </template>
      </el-table-column>
    </el-table>
    <p>Reporte por tipo</p>
    <el-table
      :data="listtipo"
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
      <el-table-column align="center" label="Estado: ">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{scope.row.status | statusLabel }}</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <p>Reporte por estado</p>
    <el-table
      :data="listestado"
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
      <el-table-column align="center" label="Estado: ">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{scope.row.status | statusLabel }}</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <p v-if="listretiro">Reporte retiros</p>
    <el-table
      :data="listretiro"
      v-loading.body="listLoading"
      border
      fit
      highlight-current-row
      style="width: 100%"
      :row-class-name="tableStatus"
      v-if="listretiro"
    >
      <el-table-column align="center" label="Fecha:">
        <template slot-scope="scope">
          <span>{{ scope.row.dateOperation }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Pais:">
        <template slot-scope="scope">
          <span>{{ scope.row.pais }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Monto:">
        <template slot-scope="scope">
          <span>{{ getDecimal(scope.row.amount) }} {{ scope.row.typeMoney }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Motivo:">
        <template slot-scope="scope">
          <span>{{ scope.row.message }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Trabajador:">
        <template slot-scope="scope">
          <span>{{ scope.row.users.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Actions">
        <template slot-scope="scope">
          <el-button
            v-loading="loading"
            type="danger"
            @click="eliminarinmueble(scope.row.id)"
            size="small"
          >
            <i class="el-icon-delete"></i>
          </el-button>
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
      listtotal: null,
      listgeneral: null,
      listestado: null,
      listretiro: null,
      listtipo: null,
      trxtotal: 0,
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
      getAll(this.listQuery, "reportes-dia").then(response => {
        this.listgeneral = response.general;
        this.listestado = response.estado;
        this.listretiro = response.retiros;
        this.listtipo = response.tipo;
        this.trxtotal = response.trxtotal;
        this.listLoading = false;
      });
    },
    eliminarinmueble(id) {
      this.$confirm("Esto eliminará este retiro?", "Warning", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "warning"
      })
        .then(() => {
          borrar(id, "retirement")
            .then(response => {
              this.$message({
                title: "Éxito",
                message: "Retiro Eliminado",
                type: "success",
                duration: 2000
              });
              this.getList();
            })
            .catch(err => {
              console.log(err);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "Borrado cancelado"
          });
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
          "Bolivares"
        ];
        const filterVal = [
          "dateOperation",
          "PaisSend",
          "total",
          "typeMoney",
          "amountReceive"
        ];
        const data = this.formatJson(filterVal, this.listgeneral);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "reporte-diario"
        });
        this.downloadLoading = false;
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
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
