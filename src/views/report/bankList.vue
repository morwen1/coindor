<template>
  <div class="app-container">
    <el-tabs type="border-card">
      <el-tab-pane label="Depositos en Bancos Propios" v-if="currentRole==true">
        <div class="filter-container">
       <el-select
        @change="handleFilter"
        style="width: 30%; margin-top:10px;"
        class="filter-item"
        v-model="listQuery.bankpropio"
        placeholder="Bancos Propios"
        clearable  filterable
      >
        <el-option v-for="item in banks" :key="item.id" :label="item.name" :value="item.id"></el-option>
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
    </div>
        <el-table
      :data="listbankspropios"
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
      <el-table-column align="center" label="Banco:">
        <template slot-scope="scope">
          <small>{{ scope.row.bank.bank }}</small>
          <br>
          <span>{{ scope.row.bank.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Monto:">
        <template slot-scope="scope">
          <span>{{ getDecimal(scope.row.amount) }} </span>
          <span v-if="scope.row.typeMoney=='Moneda'">{{ scope.row.bank.typeMoney }}</span>
          <span v-else>{{ scope.row.typeMoney }}</span>
        </template>
      </el-table-column>
      
      <el-table-column align="center" label="Estado:" width="200">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{scope.row.status | statusLabelDeposit }}</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <br>
    <el-table
      :data="listbankspropiostotal"
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
      <el-table-column align="center" label="Banco:">
        <template slot-scope="scope">
          <small>{{ scope.row.bank.bank }}</small>
          <br>
          <span>{{ scope.row.bank.name }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Monto:">
        <template slot-scope="scope">
          <span>{{ getDecimal(scope.row.amount) }} </span>
          <span v-if="scope.row.typeMoney=='Moneda'">{{ scope.row.bank.typeMoney }}</span>
          <span v-else>{{ scope.row.typeMoney }}</span>
        </template>
      </el-table-column>
    </el-table>

      </el-tab-pane>
      <el-tab-pane label="Bancos de Venezuela">
        
         <div class="filter-container">
      <!-- <el-select
        @change="handleFilter"
        style="width: 30%; margin-top:10px;"
        class="filter-item"
        v-model="listQuery.bankpropio"
        placeholder="Bancos Propios"
      >
        <el-option v-for="item in banks" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>-->
      <el-select
        @change="handleFilter"
        style="width: 30%; margin-top:10px;"
        class="filter-item"
        v-model="listQuery.bank"
        placeholder="Bancos Venezuela"
        clearable  filterable
      >
        <el-option  v-for="item in bank"
                :key="item.value"
                :label="item.label"
                :value="item.value" >
        </el-option>
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
    </div>

  <p>Reportes de Bancos Venezolanos</p>
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
      <el-table-column align="center" label="Banco:">
        <template slot-scope="scope">
          <small v-if="listQuery.bank!='OTROS'">{{ scope.row.bankTransaction }}</small>
          <small v-else>OTROS - TERCEROS</small>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Moneda Recibida:" width="200">
        <template slot-scope="scope">
		      <span>{{ getDecimal(scope.row.amountSend) }} {{ scope.row.typeMoney }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Bolivares Gastados">
        <template slot-scope="scope">
          <span>{{ getDecimal(scope.row.amountReceive) }} </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Estado">
        <template slot-scope="scope">
            <el-tag :type="scope.row.status | statusFilter">{{scope.row.status | statusLabel }}</el-tag>
        </template>
      </el-table-column>

    </el-table>
    <br>
    <el-table v-if="listbank"
      :data="listbank"
      v-loading.body="listLoading"
      border
      fit
      style="width: 100%"
    >
      <el-table-column align="center" label="Fecha:">
        <template slot-scope="scope">
          <span>{{ scope.row.dateOperation }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Banco:">
        <template slot-scope="scope">
          <small v-if="listQuery.bank!='OTROS'">{{ scope.row.bankTransaction }}</small>
          <small v-else>OTROS - TERCEROS</small>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Moneda Recibida:" width="200">
        <template slot-scope="scope">
		      <span>{{ getDecimal(scope.row.amountSend) }} {{ scope.row.typeMoney }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="Bolivares Gastados">
        <template slot-scope="scope">
          <span>{{ getDecimal(scope.row.amountReceive) }} </span>
        </template>
      </el-table-column>
    </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { getAll, borrar } from "@/api/apigeneral";
import waves from "@/directive/waves"; // 水波纹指令
import { mapGetters } from "vuex";
export default {
  name: "banklist",
  directives: {
    waves
  },
  data() {
    return {
      list2: null,
      list: null,
      listbank: false,
      listtotal: null,
      listbankspropios: null,
      listbankspropiostotal:null,
      total: 0,
      listarchive: null,
      totalarchive: 0,
      listtrash: null,
      totaltrash: 0,
      activeName: "Pendientes",
      loading: false,
      listLoading: true,
      currentRole: true,
      banks: true,
      listQuery: {
        page: 1,
        limit: 30,
        bank: undefined,
        sort: "DESC",
        datestart: "",
        dateend: ""
      },
      bank: [
          { 
            value:"OTROS",
            label:"OTROS"
          },
          { 
            value:"100%BANCO",
            label:"100%BANCO"
          },
          { 
            value:"ABN AMRO BANK",
            label:"ABN AMRO BANK"
          },
          { 
            value:"BANCAMIGA BANCO MICROFINANCIERO, C.A.",
            label:"BANCAMIGA BANCO MICROFINANCIERO, C.A."
          },
          { 
            value:"BANCO ACTIVO BANCO COMERCIAL, C.A.",
            label:"BANCO ACTIVO BANCO COMERCIAL, C.A."
          },
          { 
            value:"BANCO AGRICOLA",
            label:"BANCO AGRICOLA"
          },
          { 
            value:"BANCO BICENTENARIO",
            label:"BANCO BICENTENARIO"
          },
          { 
            value:"BANCO CARONI, C.A. BANCO UNIVERSAL",
            label:"BANCO CARONI, C.A. BANCO UNIVERSAL"
          },
          { 
            value:"BANCO DE DESARROLLO DEL MICROEMPRESARIO",
            label:"BANCO DE DESARROLLO DEL MICROEMPRESARIO"
          },
          { 
            value:"BANCO DE VENEZUELA S.A.I.C.A.",
            label:"BANCO DE VENEZUELA S.A.I.C.A."
          },
          { 
            value:"BANCO DEL CARIBE C.A.",
            label:"BANCO DEL CARIBE C.A."
          },
          { 
            value:"BANCO DEL PUEBLO SOBERANO C.A.",
            label:"BANCO DEL PUEBLO SOBERANO C.A."
          },
          { 
            value:"BANCO DEL TESORO",
            label:"BANCO DEL TESORO"
          },
          { 
            value:"BANCO ESPIRITO SANTO, S.A.",
            label:"BANCO ESPIRITO SANTO, S.A."
          },
          { 
            value:"BANCO EXTERIOR C.A.",
            label:"BANCO EXTERIOR C.A."
          },
          { 
            value:"BANCO INDUSTRIAL DE VENEZUELA.",
            label:"BANCO INDUSTRIAL DE VENEZUELA."
          },
          { 
            value:"BANCO INTERNACIONAL DE DESARROLLO, C.A.",
            label:"BANCO INTERNACIONAL DE DESARROLLO, C.A."
          },
          { 
            value:"BANCO MERCANTIL C.A.",
            label:"BANCO MERCANTIL C.A."
          },
          { 
            value:"BANCO NACIONAL DE CREDITO",
            label:"BANCO NACIONAL DE CREDITO"
          },
          { 
            value:"BANCO OCCIDENTAL DE DESCUENTO.",
            label:"BANCO OCCIDENTAL DE DESCUENTO."
          },
          { 
            value:"BANCO PLAZA",
            label:"BANCO PLAZA"
          },
          { 
            value:"BANCO PROVINCIAL BBVA",
            label:"BANCO PROVINCIAL BBVA"
          },
          { 
            value:"BANCO VENEZOLANO DE CREDITO S.A.",
            label:"BANCO VENEZOLANO DE CREDITO S.A."
          },
          { 
            value:"BANCRECER S.A. BANCO DE DESARROLLO",
            label:"BANCRECER S.A. BANCO DE DESARROLLO"
          },
          { 
            value:"BANESCO BANCO UNIVERSAL",  
            label:"BANESCO BANCO UNIVERSAL"
          }  ,
          { 
            value:"BANFANB",
            label:"BANFANB"
          },
          { 
            value:"BANGENTE",
            label:"BANGENTE"
          },
          { 
            value:"BANPLUS BANCO COMERCIAL C.A",
            label:"BANPLUS BANCO COMERCIAL C.A"
          },
          { 
            value:"CITIBANK.",
            label:"CITIBANK."
          },
          { 
            value:"CORP BANCA.",
            label:"CORP BANCA."
          },
          { 
            value:"DELSUR BANCO UNIVERSAL",
            label:"DELSUR BANCO UNIVERSAL"
          },
          { 
            value:"FONDO COMUN",
            label:"FONDO COMUN"
          },
          { 
            value:"INSTITUTO MUNICIPAL DE CRÉDITO POPULAR",
            label:"INSTITUTO MUNICIPAL DE CRÉDITO POPULAR"
          },
          { 
            value:"MIBANCO BANCO DE DESARROLLO, C.A.",
            label:"MIBANCO BANCO DE DESARROLLO, C.A."
          },
          { 
            value:"SOFITASA",
            label:"SOFITASA"
          }
      ],
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
        0: 'Eliminado',
        1: 'Pendiente',
        2: 'Completado',
        3: 'Pendiente con Error',
      }
      return statusMap[status]
    },
    statusLabelDeposit(status) {
      const statusMap = {
        0: 'Sin Comprobar',
        1: 'Comprobado',
        2: 'Utilizado',
      }
      return statusMap[status]
    },
    statusFilter(status) {
      const statusMap = {
        0: 'danger',
        1: 'info',
        2: 'success',
        3: 'danger',
      }
      return statusMap[status]
    },
    
  },
  computed: {
    ...mapGetters(["roles"])
  },
  created() {
    if (this.roles.includes("Visualizador de Transferencia")) {
      console.log("Es visualizador de transferencia")
      this.currentRole = false;
    }
    this.getList();
  },
  methods: {
    getDecimal(val){
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
      getAll(this.listQuery, "reportes-banco").then(response => {
        this.list = response.data;
        this.listbank = response.bank;
      }),
      getAll(this.listQuery, "reportes-bancopropio").then(response => {
        this.listbankspropios = response.data;
        this.listbankspropiostotal = response.total;
        this.listLoading = false;
      });
      getAll(this.listQuery, "bank").then(response => {
        this.banks = response.data.items;
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
          "Codigo",
          "Nombre",
          "Area",
          "Baños",
          "Habitaciónes",
          "Provincia",
          "Ciudad",
          "Dirección",
          "Precio"
        ];
        const filterVal = [
          "code",
          "name",
          "area",
          "bedrooms",
          "bathrooms",
          "province",
          "city",
          "direction",
          "price"
        ];
        const data = this.formatJson(filterVal, this.list);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: "table-list"
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
