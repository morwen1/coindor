<template>
  <div class="app-container" v-loading="loading">
    <div class="filter-container">
      <el-input
        @keyup.enter.native="handleFilter"
        style="width: 100px;"
        class="filter-item"
        placeholder="Codigo"
        v-model="listQuery.codigo"
      ></el-input>
      <el-select
        @change="handleFilter"
        style="width: 300px"
        class="filter-item"
        v-model="listQuery.bank"
      >
        <el-option v-for="item in banks" :key="item.id" :label="item.name" :value="item.id">
          <span>{{ item.bank }} - {{ item.name }}</span>
        </el-option>
      </el-select>
      <el-select
        @change="handleFilter"
        style="width: 100px"
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
      <el-date-picker
        style="width: 150px"
        v-model="listQuery.datestart"
        type="date"
        placeholder="Fecha de inicio"
      ></el-date-picker>
      <el-date-picker
        style="width: 150px"
        v-model="listQuery.dateend"
        type="date"
        placeholder="Fecha de final"
      ></el-date-picker>
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
    >
      <el-table-column align="center" label="Banco">
        <template slot-scope="scope">
          <small>{{scope.row.bank.bank}}</small>
          <br />
          <span>{{scope.row.bank.name}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Numero de Referencia">
        <template slot-scope="scope">
          <span>{{scope.row.numOperation}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Monto">
        <template slot-scope="scope">
          <span>{{scope.row.amount}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Moneda">
        <template slot-scope="scope">
          <span>{{scope.row.typeMoney}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Fecha de Deposito">
        <template slot-scope="scope">
          <span>{{scope.row.dateOperation}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Registrado por">
        <template slot-scope="scope">
          <span>{{scope.row.users.name}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="Estado">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{scope.row.status | statusLabel }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Actions">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status==0"
            v-loading="loading"
            type="success"
            @click="confirmDeposit(scope.row.id)"
            size="small"
          >Confirmar Deposito</el-button>
          <router-link :to="'/deposit/edit/'+scope.row.id" v-if="scope.row.status!=2">
            <el-button type="primary" size="small">
              <svg-icon icon-class="edit" />
            </el-button>
          </router-link>
          <el-button
            v-if="!currentRole && scope.row.status==0"
            v-loading="loading"
            type="danger"
            @click="eliminarinmueble(scope.row.id)"
            size="small"
          >
            <i class="el-icon-delete"></i>
          </el-button>
          <el-button
            v-if="currentRole"
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
import { getAll, update, borrar } from "@/api/apigeneral";
import waves from "@/directive/waves";
import { mapGetters } from "vuex";
import Vue from "vue";
export default {
  name: "depositList",
  directives: {
    waves
  },
  data() {
    return {
      role: undefined,
      currentRole: true,
      list: null,
      total: 0,
      loading: false,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 50,
        codigo: undefined,
        sort: "DESC",
        datestart: "",
        dateend: ""
      },
      listQueryBank: {
        page: 1,
        limit: 10000,
        dni: undefined,
        sort: "ASC"
      },
      importanceOptions: undefined,
      downloadLoading: false,
      sortOptions: [
        { label: "Ascendiente", key: "ASC" },
        { label: "Descendiente", key: "DESC" }
      ],
      banks: []
    };
  },
  filters: {
    statusLabel(status) {
      const statusMap = {
        0: "Sin Comprobar",
        1: "Comprobado",
        2: "Comprobado y Utilizado"
      };
      return statusMap[status];
    },
    statusFilter(status) {
      const statusMap = {
        0: "info",
        1: "warning",
        2: "success"
      };
      return statusMap[status];
    }
  },
  computed: {
    ...mapGetters(["roles"])
  },
  created() {
    this.getList();
    if (!this.roles.includes("Administrador")) {
      this.currentRole = false;
    }
  },
  methods: {
    getList() {
      this.listLoading = true;
      this.loading = true;
      this.list = undefined;
      getAll(this.listQuery, "deposit").then(response => {
        this.list = response.data.items;
        this.total = response.data.total;
        this.listLoading = false;
        this.loading = false;
      }),
        getAll(this.listQueryBank, "bank").then(response => {
          this.banks = response.data.items;
          this.listLoading = false;
        });
    },
    eliminarinmueble(id) {
      this.$confirm("Esto eliminará este deposito?", "Warning", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "warning"
      })
        .then(() => {
          borrar(id, "deposit")
            .then(response => {
              this.$message({
                title: "Éxito",
                message: "Deposito Eliminado",
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

    confirmDeposit(id) {
      this.loading = true;
      update(this.listQuery, "confirmar", id)
        .then(response => {
          this.$message({
            title: "Éxito",
            message: "Deposito aprobado",
            type: "success",
            duration: 2000
          });
          this.loading = false;
          this.getList();
        })
        .catch(error => {
          console.log(error);
          this.loading = false;
        });
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
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
          "N Transferencia",
          "Banco",
          "Nombre - Propietario",
          "Numero de referencia",
          "Monto",
          "Tipo de Moneda",
          "Fecha de Deposito"
        ];

        const filterVal = [
          "transactionId",
          { bank: "bank" },
          { name: "bank" },
          "numOperation",
          "amount",
          "typeMoney",
          "dateOperation"
        ];
        const data = this.formatJson(filterVal, this.list);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "depositos-list"
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
