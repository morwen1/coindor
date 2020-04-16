<template>
  <div class="app-container">
      <div class="filter-container">
            <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="Pais" v-model="listQuery.pais">
            </el-input>
            <el-select @change='handleFilter' style="width: 140px" class="filter-item" v-model="listQuery.sort">
              <el-option v-for="item in sortOptions" :key="item.id" :label="item.fullname" :value="item.key">
              </el-option>
            </el-select>
            <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">Buscar</el-button>
            <el-button class="filter-item" type="primary" :loading="downloadLoading" v-waves icon="el-icon-download" @click="handleDownload">Exportar</el-button>
        </div>
    <el-table :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column  align="center" label="Pais">
        <template  slot-scope="scope">
          <span>{{scope.row.pais}}</span>
        </template>
      </el-table-column>

      <el-table-column  align="center" label="Moneda">
        <template slot-scope="scope">
          <span>{{scope.row.money}}</span>
        </template>
      </el-table-column>
      <el-table-column  align="center" label="Tasa">
        <template slot-scope="scope">
          <span>{{scope.row.tax}}</span>
        </template>
      </el-table-column>
      <el-table-column  align="center" label="Ultima actualización">
        <template slot-scope="scope">
          <span>{{scope.row.date}}</span>
        </template>
      </el-table-column>

      <el-table-column class-name="status-col" label="Estado" >
        <template  slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{scope.row.status | statusLabel }}</el-tag>
        </template>
      </el-table-column>
        <el-table-column  align="center" label="Creado por">
        <template slot-scope="scope">
          <span>{{scope.row.users.name}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Actions" >
        <template slot-scope="scope">
          <router-link :to="'/tax/edit/'+scope.row.id">
            <el-button type="primary" size="small" icon="el-icon-edit">Edit</el-button>
          </router-link>
          <el-button v-loading="loading"  type="danger" @click="eliminarinmueble(scope.row.id)" size="small" ><i class="el-icon-delete"></i></el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.page"
        :page-sizes="[10,20,30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

  </div>
</template>

<script>
import { getAll, borrar } from '@/api/apigeneral'
import waves from '@/directive/waves' 
export default {
  name: 'taxList',
  directives: {
    waves
  },
  data() {
    return {
      list: null,
      total: 0,
      loading: false,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 50,
        dni: undefined,
        sort: 'DESC',
      },
      importanceOptions: undefined,
      downloadLoading: false,
      sortOptions: [{ label: 'Ascendiente', key: 'ASC' }, { label: 'Descendiente', key: 'DESC' }],
    }
  },
  filters: {
    statusLabel(status) {
      const statusMap = {
        1: 'Activado',
        2: 'Desactivado'
      }
      return statusMap[status]
    },
    statusFilter(status) {
      const statusMap = {
        1: 'success',
        3: 'danger',
      }
      return statusMap[status]
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      getAll(this.listQuery, 'tax').then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    eliminarinmueble(id) {
      this.$confirm('Esto eliminará esta tasa?', 'Warning', {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          borrar(id,'tax').then(response => {
            this.$message({
              title: 'Éxito',
              message: 'Tasa Eliminada',
              type: 'success',
              duration: 2000
            })
            this.getList()
          }).catch(err => {
            console.log(err)
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: 'Borrado cancelado'
          });          
        });
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.page = val
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleDownload() {
      let d = new Date();
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['Pais', 'Moneda', 'Tasa', 'Fecha de Actualización']
        const filterVal = ['pais', 'money', 'tax', 'date']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'Tasas-'+ d.getDate()
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
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
