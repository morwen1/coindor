<template>
  <div class="app-container">
      <el-alert :span="18"
    title="Retiros"
    type="info"
    description="En este apartado podras notificar cualquier retiro de dinero que no este ligado a una transferencia o operación bancaria, para su posterior aprobación"
    show-icon>
  </el-alert>
      <div class="filter-container">
             <el-date-picker
              v-model="listQuery.datestart"
              type="date"
              placeholder="Fecha de inicio">
            </el-date-picker>
            <el-date-picker
              v-model="listQuery.dateend"
              type="date"
              placeholder="Fecha de final">
            </el-date-picker>
            <el-select @change='handleFilter' style="width: 140px" class="filter-item" v-model="listQuery.sort">
              <el-option v-for="item in sortOptions" :key="item.id" :label="item.fullname" :value="item.key">
              </el-option>
            </el-select>
            <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">Buscar</el-button>
        </div>
		
    <el-table :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%">
      <el-table-column  align="center" label="Monto">
        <template  slot-scope="scope">
          <span>{{scope.row.amount}}</span>
        </template>
      </el-table-column>

      <el-table-column  align="center" label="Motivo">
        <template slot-scope="scope">
          <span>{{scope.row.message}}</span>
        </template>
      </el-table-column>
      <el-table-column  align="center" label="Fecha">
        <template slot-scope="scope">
          <span>{{scope.row.dateOperation}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Actions" >
        <template slot-scope="scope">
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
  name: 'retirementList',
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
        limit: 10,
        sort: 'DESC',
        datestart: '',
        dateend: '',
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
      getAll(this.listQuery, 'retirement').then(response => {
        this.list = response.data.items
        this.total = response.data.total
        this.listLoading = false
      })
    },
    eliminarinmueble(id) {
      this.$confirm('Esto eliminará este retiro?', 'Warning', {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          borrar(id,'retirement').then(response => {
            this.$message({
              title: 'Éxito',
              message: 'Retiro Eliminado',
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
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['Pais', 'Cantidad', 'Fecha de Operacion', 'Mensaje']
        const filterVal = ['pais', 'amount', 'dateOperation', 'message']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
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
