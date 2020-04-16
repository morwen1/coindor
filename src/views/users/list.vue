<template>
  <div class="app-container">
    <el-table
      :data="list"
      v-loading.body="listLoading"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column align="center" label="Correo">
        <template slot-scope="scope">
          <span>{{scope.row.email}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Cedula">
        <template slot-scope="scope">
          <span>{{scope.row.dni}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="Nombre">
        <template slot-scope="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Rol">
        <template slot-scope="scope">{{ scope.row.role }}</template>
      </el-table-column>

      <el-table-column class-name="status-col" label="Estado">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{scope.row.status | statusLabel }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Actions">
        <template slot-scope="scope">
          <router-link :to="'/users/edit/'+scope.row.id">
            <el-button type="primary" size="small" icon="el-icon-edit">Edit</el-button>
          </router-link>
          <el-button
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
import { getUserAll, getAll, update } from "@/api/users";
import { borrar } from '@/api/apigeneral';
import { mapGetters } from "vuex";
export default {
  name: "userslist",
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10
      }
    };
  },
  computed: {
    ...mapGetters(["roles"])
  },
  filters: {
    statusLabel(status) {
      const statusMap = {
        1: "Activado",
        2: "Por Confirmar",
        3: "Desactivado"
      };
      return statusMap[status];
    },
    statusFilter(status) {
      const statusMap = {
        1: "success",
        2: "info",
        3: "danger"
      };
      return statusMap[status];
    }
  },
  created() {
    this.getList();
    if (this.roles.includes("Trabajador")) {
      this.currentRole = false;
    }
  },
  methods: {
    getList() {
      this.listLoading = true;
      getUserAll(this.listQuery).then(response => {
        this.list = response.data.items;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },
    eliminarinmueble(id) {
      this.$confirm(
        "Esto eliminará temporalmente este trabajador?",
        "Warning",
        {
          confirmButtonText: "OK",
          cancelButtonText: "Cancel",
          type: "warning"
        }
      )
        .then(() => {
          borrar(id, "users")
            .then(response => {
              this.$message({
                title: "Éxito",
                message: "Trabajador Eliminado",
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
