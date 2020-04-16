<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        @keyup.enter.native="handleFilter"
        style="width: 200px;"
        class="filter-item"
        placeholder="Cedula / DNI"
        v-model="listQuery.dni"
      ></el-input>
      <el-input
        @keyup.enter.native="handleFilter"
        style="width: 250px;"
        class="filter-item"
        placeholder="Nombre"
        v-model="listQuery.name"
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
      <el-table-column align="center" label="Cedula">
        <template slot-scope="scope">
          <span>{{scope.row.dni}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Nombres">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Apellidos">
        <template slot-scope="scope">
          <span>{{scope.row.lastname}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Telefono">
        <template slot-scope="scope">
          <span>{{scope.row.phone}}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="Estado">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{scope.row.status | statusLabel }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Actions">
        <template slot-scope="scope">
          <router-link :to="'/client/edit/'+scope.row.id">
            <el-button type="primary" size="small" icon="el-icon-edit">Edit</el-button>
          </router-link>
          <router-link :to="'/affiliates/list/'+scope.row.id">
            <el-button type="primary" size="small"><svg-icon icon-class="peoples" /></el-button>
          </router-link>

          <el-button
            v-if="role"
            type="danger"
            @click="eliminarinmueble(scope.row.id)"
            size="small"
            style="margin-left: 0px; "
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
import { getAll, borrar } from "@/api/apigeneral";
import waves from "@/directive/waves";
import { mapGetters } from "vuex";
export default {
  name: "clientlist",
  directives: {
    waves
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        dni: undefined,
        name: undefined,
        usersid: undefined,
        sort: "DESC"
      },
      role: true,
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
        1: "Activado",
        2: "Desactivado"
      };
      return statusMap[status];
    },
    statusFilter(status) {
      const statusMap = {
        1: "success",
        3: "danger"
      };
      return statusMap[status];
    }
  },
  computed: {
    ...mapGetters(["roles", "iduser"])
  },
  created() {
    if (!this.roles.includes("Administrador", "Trabajador Avanzado")) {
      this.listQuery.usersid = this.iduser;
      this.role = false;
    } 
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      getAll(this.listQuery, "client").then(response => {
        this.list = response.data.items;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },
    eliminarinmueble(id) {
      this.$confirm("Esto eliminará temporalmente este cliente?", "Warning", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "warning"
      })
        .then(() => {
          borrar(id, "client")
            .then(response => {
              this.$message({
                title: "Éxito",
                message: "Cliente Eliminado",
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
          "Cedula",
          "Nombre",
          "Apellido",
          "Telefono",
          "Correo",
          "Nacionalidad",
          "Direccion"
        ];
        const filterVal = [
          "dni",
          "name",
          "lastname",
          "phone",
          "email",
          "nationality",
          "direction"
        ];
        const data = this.formatJson(filterVal, this.list);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "Clientes"
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
