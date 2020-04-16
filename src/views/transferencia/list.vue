<template>
  <el-tabs v-model="activeName" tab-position="top" style="width:98%; margin: 0 auto;">
    <div class="app-container" style="padding-bottom: 0px;">
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
          class="filter-item"
          v-model="listQuery.banks"
          placeholder="Banco "
          clearable
          filterable
        >
          <el-option
            v-for="item in banks"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-select
          @change="handleFilter"
          style="width: 80px"
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
          style="width: 180px"
          class="top4"
          v-model="listQuery.datestart"
          type="date"
          placeholder="Fecha de inicio"
        ></el-date-picker>
        <el-date-picker
          style="width: 180px"
          class="top4"
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
          v-if="!searchAvanzadoPendientes"
        >Buscar</el-button>
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-arrow-down"
          @click="searchAvanzadoPendientes = !searchAvanzadoPendientes"
          v-if="!searchAvanzadoPendientes"
        >Buscador Avanzado</el-button>
      </div>
      <div class="filter-container animated fadeIn" v-if="searchAvanzadoPendientes">
        <el-input
          @keyup.enter.native="handleFilter"
          style="width: 200px;"
          class="filter-item"
          placeholder="Identificacion del cliente"
          v-model="listQuery.client"
        ></el-input>
        <el-input
          @keyup.enter.native="handleFilter"
          style="width: 120px;"
          class="filter-item"
          placeholder="N° Deposito"
          v-model="listQuery.deposit"
        ></el-input>
        <el-checkbox v-model="tabletDeposit" class="top4">Deposito</el-checkbox>
        <el-checkbox v-model="tabletUser" class="top4">Trabajador</el-checkbox>
        <el-checkbox v-model="tabletAmount" class="top4">Cantidad Recibida</el-checkbox>
        <br>
        <el-select v-if="tabletUser"
          placeholder="Seleccionar Trabajador"
          filterable
          v-model="listQuery.usersid"
          style="width: 30%; margin-bottom:20px;"
        >
          <el-option v-for="item in trabajador" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <br>
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
          icon="el-icon-arrow-up"
          @click="searchAvanzadoPendientes = !searchAvanzadoPendientes"
        >Buscador Avanzado</el-button>
        <el-button
          class="filter-item"
          type="primary"
          :loading="downloadLoading"
          v-waves
          icon="el-icon-download"
          @click="handleDownload"
          v-if="!excelnew"
        >Exportar</el-button>
        <el-button
          class="filter-item"
          type="primary"
          :loading="downloadLoading"
          v-waves
          icon="el-icon-download"
          @click="handleDownloadComisionista"
          v-if="excelnew"
        >Exportar Excel</el-button>
      </div>
    </div>
    <el-tab-pane label="Pendientes" name="Pendientes">
      <div class="app-container">
        <el-table
          :data="list"
          v-loading.body="listLoading"
          border
          fit
          highlight-current-row
          style="width: 100%"
          :row-class-name="tableStatus"
        >
          <el-table-column align="center" label="Codigo" fixed>
            <template slot-scope="scope">
              <router-link :to="'/transferencia/ver/'+scope.row.id">
                <span style="color:blue;">#{{scope.row.transactionId}}</span>
              </router-link>
            </template>
          </el-table-column>
          <el-table-column label="Fecha:">
            <template slot-scope="scope">
              <span>{{ scope.row.dateOperation }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="Cliente">
            <template slot-scope="scope">
              <small>{{scope.row.client.dni}}</small>
              <br>
              <span>{{scope.row.client.name}} {{scope.row.client.lastname}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="Pais" width="200">
            <template slot-scope="scope">{{ scope.row.paisSend }}
			   <a  v-bind:href="urlpdf+scope.row.id" target="_blank" v-if="scope.row.paisSend=='Chile'" >
                <el-button type="primary" size="small">
                  <small>COMPROBANTE DE PAGO</small>
                </el-button>
              </a>
			</template>
          </el-table-column>
          <el-table-column align="center" label="Monto">
            <template slot-scope="scope">{{ scope.row.amountReceive }} BsS</template>
          </el-table-column>
          <el-table-column align="center" label="Banco" width="200">
            <template slot-scope="scope">{{ scope.row.account_bank.bank }}</template>
          </el-table-column>
          <el-table-column align="center" label="Envia" width="200" v-if="tabletAmount">
            <template slot-scope="scope">{{ scope.row.amountSend }} {{ scope.row.typeMoney }}</template>
          </el-table-column>
          <el-table-column
            align="center"
            label="Numero de Deposito"
            width="200"
            v-if="tabletDeposit"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.deposit">{{ scope.row.deposit.numOperation }}</span>
              <span v-else>Efectivo</span>
            </template>
          </el-table-column>
          <el-table-column class-name="status-col" label="Estado">
            <template slot-scope="scope">
              <el-tag :type="scope.row.status | statusFilter">{{scope.row.status | statusLabel }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" label="Trabajador:" width="200" v-if="tabletUser">
            <template slot-scope="scope">{{ scope.row.users.name }}</template>
          </el-table-column>
          <el-table-column align="center" label="Acciones">
            <template slot-scope="scope">
              <router-link :to="'/transferencia/ver/'+scope.row.id">
                <el-button type="primary" size="small">
                  <i class="el-icon-view"></i>
                </el-button>
              </router-link>
              <router-link :to="'/transferencia/edit/'+scope.row.id" v-if="currentRole">
                <el-button type="primary" size="small">
                  <svg-icon icon-class="edit"/>
                </el-button>
              </router-link>
              <el-button
                type="primary"
                size="small"
                @click="callprinter(scope.row.id, scope.row.printer)"
                v-if="!excelnew"
              >
                <i class="el-icon-printer"></i>
              </el-button>
              <el-button
                v-loading="loading"
                type="danger"
                @click="eliminarinmueble(scope.row.id)"
                size="small"
                v-if="currentRole"
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
    </el-tab-pane>
    <el-tab-pane label="Completados - Archivados" name="Archivados">
      <div class="app-container">
        <el-table
          :data="listarchive"
          v-loading.body="listLoading"
          border
          fit
          highlight-current-row
          style="width: 100%"
          :row-class-name="tableStatus"
        >
          <el-table-column align="center" label="Codigo" fixed>
            <template slot-scope="scope">
              <router-link :to="'/transferencia/ver/'+scope.row.id">
                <span style="color:blue;">#{{scope.row.transactionId}}</span>
              </router-link>
            </template>
          </el-table-column>
          <el-table-column label="Fecha:">
            <template slot-scope="scope">
              <span>{{ scope.row.dateOperation }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="Cliente">
            <template slot-scope="scope">
              <small>{{scope.row.client.dni}}</small>
              <br>
              <span>{{scope.row.client.name}} {{scope.row.client.lastname}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="Pais ">
            <template slot-scope="scope">
				{{ scope.row.paisSend }}
				  <a  v-bind:href="urlpdf+scope.row.id" target="_blank" v-if="scope.row.paisSend=='Chile'" >
                <el-button type="primary" size="small">
                  <small>COMPROBANTE DE PAGO</small>
                </el-button>
              </a>
			</template>
          </el-table-column>
          <el-table-column align="center" label="Monto">
            <template slot-scope="scope">{{ scope.row.amountReceive }} BsS</template>
          </el-table-column>
          <el-table-column align="center" label="Banco" width="200">
            <template slot-scope="scope">{{ scope.row.account_bank.bank }}</template>
          </el-table-column>
          <el-table-column align="center" label="Envia" width="200" v-if="tabletAmount">
            <template slot-scope="scope">{{ scope.row.amountSend }} {{ scope.row.typeMoney }}</template>
          </el-table-column>
          <el-table-column
            align="center"
            label="Numero de Deposito"
            width="200"
            v-if="tabletDeposit"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.deposit">{{ scope.row.deposit.numOperation }}</span>
              <span v-else>Efectivo</span>
            </template>
          </el-table-column>
          <el-table-column class-name="status-col" label="Estado">
            <template slot-scope="scope">
              <el-tag :type="scope.row.status | statusFilter">{{scope.row.status | statusLabel }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" label="Trabajador:" width="200" v-if="tabletUser">
            <template slot-scope="scope">{{ scope.row.users.name }}</template>
          </el-table-column>
          <el-table-column align="center" label="Acciones">
            <template slot-scope="scope">
              <router-link :to="'/transferencia/ver/'+scope.row.id">
                <el-button type="primary" size="small">
                  <i class="el-icon-view"></i>
                </el-button>
              </router-link>
              <a v-bind:href="urlimprimir+scope.row.id" target="_blank" v-if="!excelnew">
                <el-button type="primary" size="small">
                  <i class="el-icon-printer"></i>
                </el-button>
              </a>
              <el-button
                v-loading="loading"
                type="danger"
                @click="eliminarinmueble(scope.row.id)"
                size="small"
                v-if="currentRole"
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
            :total="totalarchive"
          ></el-pagination>
        </div>
      </div>
    </el-tab-pane>
    <el-tab-pane label="Papelera" name="Papelera" v-if="currentRole">
      <div class="app-container">
        <el-table
          :data="listtrash"
          v-loading.body="listLoading"
          border
          fit
          highlight-current-row
          style="width: 100%"
        >
          <el-table-column align="center" label="Codigo">
            <template slot-scope="scope">
              <router-link :to="'/transferencia/ver/'+scope.row.id">
                <span>#{{scope.row.transactionId}}</span>
              </router-link>
            </template>
          </el-table-column>
          <el-table-column label="Fecha:">
            <template slot-scope="scope">
              <span>{{ scope.row.dateOperation }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="Cliente">
            <template slot-scope="scope">
              <span>{{scope.row.client.name}} {{scope.row.client.lastname}}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="Pais ">
            <template slot-scope="scope">{{ scope.row.paisSend }}</template>
          </el-table-column>
          <el-table-column align="center" label="Monto">
            <template slot-scope="scope">{{ scope.row.amountReceive }} BsS</template>
          </el-table-column>
          <el-table-column align="center" label="Banco">
            <template slot-scope="scope">{{ scope.row.account_bank.bank }}</template>
          </el-table-column>
          <el-table-column class-name="status-col" label="Estado">
            <template slot-scope="scope">
              <el-tag :type="scope.row.status | statusFilter">{{scope.row.status | statusLabel }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" label="Acciones">
            <template slot-scope="scope">
              <router-link :to="'/transferencia/ver/'+scope.row.id">
                <el-button type="primary" size="small">
                  <i class="el-icon-view"></i>
                </el-button>
              </router-link>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { getAll, borrar, update } from "@/api/apigeneral";
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
      visualizador: false,
      total: 0,
      role: undefined,
      trabajador: null,
      listarchive: null,
      totalarchive: 0,
      listtrash: null,
      totaltrash: 0,
      activeName: "Pendientes",
      loading: false,
      listLoading: true,
      currentRole: true,
      excelnew: false,
      searchAvanzadoPendientes: false,
      searchAvanzadoProcesados: false,
      tabletAmount: false,
      tabletUser: false,
      tabletDeposit: false,
      listQuery: {
        page: 1,
        limit: 50,
        codigo: undefined,
        sort: "ASC",
        datestart: "",
        dateend: "",
        usersid: undefined,
        banks: undefined,
        client: undefined,
        deposit: undefined,
        gestorid: undefined
      },
      urlimprimir: process.env.BASE_API + "imprimir/",
      urlpdf:"http://coindor.cl/api/pdf/",
      importanceOptions: undefined,
      downloadLoading: false,
      sortOptions: [
        { label: "Ascendiente", key: "ASC" },
        { label: "Descendiente", key: "DESC" }
      ],
      banks: [
        {
          value: "OTROS",
          label: "OTROS"
        },
        {
          value: "100%BANCO",
          label: "100%BANCO"
        },
        {
          value: "ABN AMRO BANK",
          label: "ABN AMRO BANK"
        },
        {
          value: "BANCAMIGA BANCO MICROFINANCIERO, C.A.",
          label: "BANCAMIGA BANCO MICROFINANCIERO, C.A."
        },
        {
          value: "BANCO ACTIVO BANCO COMERCIAL, C.A.",
          label: "BANCO ACTIVO BANCO COMERCIAL, C.A."
        },
        {
          value: "BANCO AGRICOLA",
          label: "BANCO AGRICOLA"
        },
        {
          value: "BANCO BICENTENARIO",
          label: "BANCO BICENTENARIO"
        },
        {
          value: "BANCO CARONI, C.A. BANCO UNIVERSAL",
          label: "BANCO CARONI, C.A. BANCO UNIVERSAL"
        },
        {
          value: "BANCO DE DESARROLLO DEL MICROEMPRESARIO",
          label: "BANCO DE DESARROLLO DEL MICROEMPRESARIO"
        },
        {
          value: "BANCO DE VENEZUELA S.A.I.C.A.",
          label: "BANCO DE VENEZUELA S.A.I.C.A."
        },
        {
          value: "BANCO DEL CARIBE C.A.",
          label: "BANCO DEL CARIBE C.A."
        },
        {
          value: "BANCO DEL PUEBLO SOBERANO C.A.",
          label: "BANCO DEL PUEBLO SOBERANO C.A."
        },
        {
          value: "BANCO DEL TESORO",
          label: "BANCO DEL TESORO"
        },
        {
          value: "BANCO ESPIRITO SANTO, S.A.",
          label: "BANCO ESPIRITO SANTO, S.A."
        },
        {
          value: "BANCO EXTERIOR C.A.",
          label: "BANCO EXTERIOR C.A."
        },
        {
          value: "BANCO INDUSTRIAL DE VENEZUELA.",
          label: "BANCO INDUSTRIAL DE VENEZUELA."
        },
        {
          value: "BANCO INTERNACIONAL DE DESARROLLO, C.A.",
          label: "BANCO INTERNACIONAL DE DESARROLLO, C.A."
        },
        {
          value: "BANCO MERCANTIL C.A.",
          label: "BANCO MERCANTIL C.A."
        },
        {
          value: "BANCO NACIONAL DE CREDITO",
          label: "BANCO NACIONAL DE CREDITO"
        },
        {
          value: "BANCO OCCIDENTAL DE DESCUENTO.",
          label: "BANCO OCCIDENTAL DE DESCUENTO."
        },
        {
          value: "BANCO PLAZA",
          label: "BANCO PLAZA"
        },
        {
          value: "BANCO PROVINCIAL BBVA",
          label: "BANCO PROVINCIAL BBVA"
        },
        {
          value: "BANCO VENEZOLANO DE CREDITO S.A.",
          label: "BANCO VENEZOLANO DE CREDITO S.A."
        },
        {
          value: "BANCRECER S.A. BANCO DE DESARROLLO",
          label: "BANCRECER S.A. BANCO DE DESARROLLO"
        },
        {
          value: "BANESCO BANCO UNIVERSAL",
          label: "BANESCO BANCO UNIVERSAL"
        },
        {
          value: "BANFANB",
          label: "BANFANB"
        },
        {
          value: "BANGENTE",
          label: "BANGENTE"
        },
        {
          value: "BANPLUS BANCO COMERCIAL C.A",
          label: "BANPLUS BANCO COMERCIAL C.A"
        },
        {
          value: "CITIBANK.",
          label: "CITIBANK."
        },
        {
          value: "CORP BANCA.",
          label: "CORP BANCA."
        },
        {
          value: "DELSUR BANCO UNIVERSAL",
          label: "DELSUR BANCO UNIVERSAL"
        },
        {
          value: "FONDO COMUN",
          label: "FONDO COMUN"
        },
        {
          value: "INSTITUTO MUNICIPAL DE CRÉDITO POPULAR",
          label: "INSTITUTO MUNICIPAL DE CRÉDITO POPULAR"
        },
        {
          value: "MIBANCO BANCO DE DESARROLLO, C.A.",
          label: "MIBANCO BANCO DE DESARROLLO, C.A."
        },
        {
          value: "SOFITASA",
          label: "SOFITASA"
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
    if (!this.roles.includes("Administrador", "Trabajador Avanzado")) {
      (this.currentRole = false), (this.listQuery.usersid = this.iduser);
      this.role = this.roles[0];
      console.log(this.role);
      if (this.role == "Comisionista") {
        this.listQuery.usersid = undefined;
        this.visualizador = true;
        this.excelnew = true;
        this.tabletUser = true;
      }
      if (this.role == "Visualizador de Transferencia") {
        this.listQuery.usersid = undefined;
        this.visualizador = true;
      }
      if (this.role == "Gestor") {
        this.listQuery.gestorid = this.iduser;
        this.listQuery.usersid = undefined;
        this.visualizador = true;
        this.excelnew = true;
        this.tabletUser = true;
      }
    }
    this.getList();
  },
  methods: {
    tableStatus({ row }) {
      if (row.alert == "1" && row.status == "3") {
        return "warning-row"; //Error
      } else if (row.alert == "2") {
        return "devolucion-row"; //Devolución
      } else if (row.alert == "3") {
        return "informativa-row"; // Informativa
      } else if (row.status == "2") {
        return "success-row";
      } else if (row.alert == "2" && row.status == "2") {
        return "devolucion-row";
      }
      return "";
    },
    getList() {
      this.list = undefined;
      this.listarchive = undefined;
      this.listtrash = undefined;
      this.listLoading = true;
      getAll(this.listQuery, "transaction").then(response => {
        this.list = response.data.items;
        this.total = response.data.total;
        if (this.visualizador) {
          var jediPersonnel = this.list.filter(function(list) {
            if (list.deposit) {
              if (list.deposit.status != 0) return list.deposit;
            } else {
              return list;
            }
          });
          this.list = jediPersonnel;
        }
        this.listLoading = false;
      });
      getAll(this.listQuery, "transaction-archive").then(response => {
        this.listarchive = response.data.items;
        this.totalarchive = response.data.total;
        this.listLoading = false;
      }),
        getAll(this.listQuery, "transaction-trash").then(response => {
          this.listtrash = response.data.items;
          this.totaltrash = response.data.total;
          this.listLoading = false;
        }),
        getAll(this.listQuery, "trabajador")
          .then(response => {
            this.trabajador = response.data;
            console.log(this.trabajador);
          })
          .catch(err => {
            console.log(err);
          });
    },
    eliminarinmueble(id) {
      this.$confirm(
        "Esto eliminará temporalmente esta transferencia desas continuar?",
        "Warning",
        {
          confirmButtonText: "OK",
          cancelButtonText: "Cancel",
          type: "warning"
        }
      )
        .then(() => {
          borrar(id, "transaction")
            .then(response => {
              this.$message({
                title: "Éxito",
                message: "Tranferencia Eliminado",
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
    callprinter(id, printer) {
      var data = { printer: printer + 1 };
      if (printer >= 1) {
        this.$confirm(
          "Ya se ha impreso " + printer + " deseas realizar otra impresión?",
          "Warning",
          {
            confirmButtonText: "Si",
            cancelButtonText: "Cancel",
            type: "warning"
          }
        )
          .then(() => {
            this.loading = true;
            update(data, "printer", id)
              .then(response => {
                this.getList();
                this.loading = false;
                window.open(this.urlimprimir + id, "_blank");
              })
              .catch(error => {
                console.log(error);
                this.getList();
                this.loading = false;
              });
          })
          .catch(() => {
            this.loading = false;
          });
      } else {
        update(data, "printer", id)
          .then(response => {
            this.getList();
            this.loading = false;
            window.open(urlimprimir + id, "_blank");
          })
          .catch(error => {
            console.log(error);
            this.getList();
            this.loading = false;
          });

        window.open(this.urlimprimir + id, "_blank");
      }
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
          "message"
        ];
        const data = this.formatJson(filterVal, this.list);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename:
            "Transferencias Pendientes-" +
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
          "Soles",
          "Gestor",
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
          "gestor",
          "message"
        ];
        const data = this.formatJson(filterVal, this.listarchive);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename:
            "Transferencias Completadas-" +
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

    handleDownloadComisionista() {
      let f = new Date();
      this.downloadLoading = true;
      import("@/vendor/Export2Excel").then(excel => {
        const tHeader = [
          "Identificador",
          "Banco",
          "Numero de Cuenta",
          "Beneficiario",
          "CV Beneficiario",
          "Tipo de Cuenta",
          "Monto",
          "Operador"
        ];
        const filterVal = [
          "transactionId",
          { bank: "account_bank" },
          { accountNumber: "account_bank" },
          { lastname: "account_bank", name: "account_bank" },
          { dni: "account_bank", typeDocument: "account_bank" },
          { typeAccount: "account_bank" },
          "amountReceive",
          { name: "users" }
        ];
        const data = this.formatJson(filterVal, this.list);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename:
            "Transferencias Pendientes-" +
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
  background: rgba(215, 44, 44, 0.5);
}
.el-table .devolucion-row {
  background: rgba(37, 138, 224, 0.5);
}
.el-table .informativa-row {
  background: rgba(255, 255, 0, 0.4);
}
.el-table .success-row {
  background: rgba(42, 213, 44, 0.3);
}
.top4 {
  top: -4px;
}

.animated {
  -webkit-animation-duration: 1s;
  animation-duration: 1s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
}

.animated.infinite {
  -webkit-animation-iteration-count: infinite;
  animation-iteration-count: infinite;
}

.animated.hinge {
  -webkit-animation-duration: 2s;
  animation-duration: 2s;
}

.animated.bounceIn,
.animated.bounceOut,
.animated.flipOutX,
.animated.flipOutY {
  -webkit-animation-duration: 0.75s;
  animation-duration: 0.75s;
}

@-webkit-keyframes fadeIn {
  from {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.fadeIn {
  -webkit-animation-name: fadeIn;
  animation-name: fadeIn;
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
