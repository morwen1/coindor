<template>
  <div class="createPost-container">
    <el-form class="form-container" :model="postForm" :rules="rules" ref="postForm">
      <div class="createPost-main-container">
        <el-row>
          <div class="postInfo-container">
            <el-row>
              <el-col :span="20">
                <el-form-item style="margin-bottom: 40px;" prop="clientId">
                  <MDinput
                    v-model="postFormCliente.dni"
                    required
                    :maxlength="100"
                    @keyup.enter.native="searchClient"
                  >Cedula del cliente o Numero de Cliente</MDinput>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <el-button
                  class="filter-item"
                  v-loading="loading"
                  style="margin-top: 20px;"
                  type="primary"
                  icon="el-icon-search"
                  @click="searchClient"
                  :disabled="!postFormCliente.dni"
                ></el-button>
              </el-col>
            </el-row>
            <el-row v-if="pross >=1" class="animated fadeIn">
              <code>
                <el-button type="primary" size="small" @click="openEditClient()">
                  <svg-icon icon-class="edit"/>Editar Cliente
                </el-button>
              </code>
              <el-col :span="8">
                <el-form-item label="Nombre y Apellido:" class="postInfo-container-item">
                  <el-input type="text" v-model="postFormCliente.name" disabled="disabled"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="Cedula / Numero de Cliente / DNI:"
                  class="postInfo-container-item"
                >
                  <el-input type="text" v-model="postFormCliente.dni" disabled="disabled"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="Telefono principal:" class="postInfo-container-item">
                  <el-input type="text" v-model="postFormCliente.phone" disabled="disabled"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <code>Envian desde:</code>
              </el-col>
              <el-col :span="8">
                <el-form-item label="Pais" class="postInfo-container-item" prop="paisSend">
                  <el-select
                    placeholder="Seleccionar"
                    v-model="postForm.paisSend"
                    @change="togglePaisSend()"
                  >
                    <el-option
                      v-for="item in paistaxes"
                      :key="item.pais"
                      :label="item.pais"
                      :value="item.pais"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="Moneda" class="postInfo-container-item">
                  <el-select placeholder="Seleccionar" v-model="taxId" @change="toggleTax()">
                    <el-option
                      v-for="item in moneytaxes"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="Tasa" class="postInfo-container-item" prop="tax">
                  <el-input type="text" v-model="postForm.tax" :disabled="roles!='Administrador'"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="Cantidad" class="postInfo-container-item" prop="amountSend">
                  <el-input
                    type="number"
                    v-model="postForm.amountSend"
                    min="0"
                    @change="calcularTax"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <code>
                  Recibe :
                  <strong>{{ postForm.amountReceive }}</strong> Bolivares Soberano
                  <br>
                  <small v-if="postForm.tax>0">Ultima Actualización: {{ datetax }}</small>
                </code>
              </el-col>
            </el-row>
            <el-row v-if="pross >=2" class="animated fadeIn">
              <el-col :span="8">
                <el-form-item label="Forma de pago" class="postInfo-container-item">
                  <el-select
                    placeholder="Seleccionar"
                    v-model="postForm.typePayment"
                    prop="typePayment"
                  >
                    <el-option
                      v-for="item in typePayment"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8" class="animated fadeIn">
                <el-form-item
                  :label="'Fecha de pago en ' + postForm.typePayment"
                  class="postInfo-container-item"
                >
                  <el-date-picker
                    v-model="postForm.dateOperation"
                    type="datetime"
                    format="yyyy-MM-dd HH:mm:ss"
                    label="Fecha del pago"
                  ></el-date-picker>
                </el-form-item>
              </el-col>

              <el-col :span="8" v-if="postForm.typePayment=='Deposito'" class="animated fadeIn">
                <el-form-item label="Banco donde fue depositado" class="postInfo-container-item">
                  <el-select placeholder="Seleccionar" v-model="postForm.bankId">
                    <el-option
                      v-for="item in bankId"
                      :key="item.id"
                      :label="item.bank"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8" v-if="postForm.typePayment=='Deposito'" class="animated fadeIn">
                <el-form-item
                  label="Numero de Deposito"
                  class="postInfo-container-item"
                  prop="numOperation"
                >
                  <el-input type="text" v-model="postForm.numOperation" @change="checkedDeposit">
                    <el-button
                      slot="append"
                      icon="el-icon-search"
                      :loading="checkedLoading"
                      @click="checkedDeposit"
                      v-loading="loading"
                    ></el-button>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24" v-if="depositAlert" class="animated fadeIn">
                <el-alert title="Información de Deposito" :type="depositType" show-icon>
                  <br>
                  {{ depositMessage }}
                  <br>
                </el-alert>
              </el-col>

              <el-col
                :span="24"
                v-if="postForm.typePayment=='Deposito'"
                class="animated fadeIn"
                style="padding: 10px 0px;"
              >
                <dropzone
                  v-on:dropzone-success="dropzoneS"
                  v-on:dropzone-removedFile="dropzoneR"
                  v-on:dropzone-processing="dropzoneP"
                  v-on:dropzone-error="dropzoneE"
                  id="myVueDropzone"
                  :url="urlupload"
                ></dropzone>
              </el-col>
            </el-row>
            <el-row v-if="pross >=2" class="animated fadeIn">
              <el-col :span="24">
                <code>Cuenta a Transferir</code>
              </el-col>
              <el-col :span="20">
                <el-form-item
                  label="Beneficiado:"
                  class="postInfo-container-item"
                  style="width: 100%;"
                >
                  <el-select
                    placeholder="Seleccionar"
                    filterable
                    v-model="postForm.account_bankId"
                    prop="account_bankId"
                    @change="toggleAccountBank()"
                    style="width: 90%;"
                  >
                    <el-option
                      v-for="item in accountbanks"
                      :key="item.id"
                      :label="item.accountslug"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="2">
                <el-button
                  class="filter-item"
                  type="primary"
                  v-loading="loading"
                  @click="openCreateBank"
                >
                  <i class="el-icon-plus"></i>
                </el-button>
              </el-col>
            </el-row>
            <el-row v-if="postForm.account_bankId" class="animated fadeIn">
              <code>
                <el-button type="primary" size="small" @click="openUpdateBank()">
                  <svg-icon icon-class="edit"/>Editar Cuenta Bancaria
                </el-button>
              </code>
              <el-col :span="12" :xs="24" :sm="12" :md="8">
                <el-form-item label="Nombres:" class="postInfo-container-item" prop="name">
                  <el-input type="text" v-model="postFormBank.name" disabled="disabled"></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8">
                <el-form-item label="Apellidos:" class="postInfo-container-item" prop="lastname">
                  <el-input type="text" v-model="postFormBank.lastname" disabled="disabled"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12" :xs="24" :sm="12" :md="8">
                <el-form-item label="Email:" class="postInfo-container-item" prop="email">
                  <el-input type="text" v-model="postFormBank.email" disabled="disabled"></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8">
                <el-form-item label="Telefono:" class="postInfo-container-item" prop="phone">
                  <el-input type="text" v-model="postFormBank.phone" disabled="disabled"></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8">
                <el-form-item
                  label="Tipo de Documento:"
                  class="postInfo-container-item"
                  prop="typeDocument"
                >
                  <el-input type="text" v-model="postFormBank.typeDocument" disabled="disabled"></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8">
                <el-form-item label="Cedula / DNI:" class="postInfo-container-item" prop="dni">
                  <el-input type="text" v-model="postFormBank.dni" disabled="disabled"></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8">
                <el-form-item
                  label="Tipo de Cuenta:"
                  class="postInfo-container-item"
                  prop="typeAccount"
                >
                  <el-input type="text" v-model="postFormBank.typeAccount" disabled="disabled"></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8">
                <el-form-item label="Banco:" class="postInfo-container-item" prop="bank">
                  <el-input type="text" v-model="postFormBank.bank" disabled="disabled"></el-input>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12">
                <el-form-item
                  label="Numero de cuenta:"
                  class="postInfo-container-item"
                  prop="accountNumber"
                >
                  <el-input type="text" v-model="postFormBank.accountNumber" disabled="disabled"></el-input>
                </el-form-item>
              </el-col>
			      <el-row v-if="roles=='Administrador'" class="animated fadeIn">
                <el-col :span="24">
                  <code>Quien registro esta transferencia ? <small>Dejar campo vacio si no desea asignar a trabajador.</small></code>
                </el-col>
                <el-col :span="20">
                  <el-form-item
                    label="Trabajadores:"
                    class="postInfo-container-item"
                    style="width: 40%;"
                  >
                    <el-select
                      placeholder="Seleccionar"
                      filterable
                      v-model="postForm.usersId"
                      style="width: 90%;"
                    >
                      <el-option
                        v-for="item in trabajador"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row v-if="gestor" class="animated fadeIn">
                <el-col :span="24">
                  <code>Deseas asignar esta transferencia a un gestor?</code>
                </el-col>
                <el-col :span="20">
                  <el-form-item
                    label="Gestores:"
                    class="postInfo-container-item"
                    style="width: 40%;"
                  >
                    <el-select
                      placeholder="Seleccionar"
                      filterable
                      v-model="postForm.gestorId"
                      style="width: 90%;"
                    >
                      <el-option
                        v-for="item in gestor"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-col :xs="24" :sm="24" :md="24">
                <el-button
                  v-loading="loading"
                  style="margin-left: 10px;"
                  type="success"
                  @click="SaveTransaction"
                  :disabled="transacionDisabled"
                >Guardar Transacción</el-button>
              </el-col>
            </el-row>
          </div>
        </el-row>
      </div>
    </el-form>
    <el-dialog :title="textMap[dialogStatus]+ ' Cliente'" :visible.sync="dialogFormVisible">
      <el-form
        :rules="rulesclient"
        ref="postFormCliente"
        :model="postFormCliente"
        label-position="left"
        label-width="auto"
        style="width: 80%;"
      >
        <el-row :gutter="36">
          <el-col :span="12" :xs="24" :sm="12" :md="12">
            <el-form-item label="Nombres:" class="postInfo-container-item" prop="name">
              <el-input type="text" v-model="postFormCliente.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12">
            <el-form-item label="Apellidos:" class="postInfo-container-item" prop="lastname">
              <el-input type="text" v-model="postFormCliente.lastname"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12">
            <el-form-item
              label="Cedula / Numero de Cliente / DNI:"
              class="postInfo-container-item"
              prop="dni"
            >
              <el-input type="text" v-model="postFormCliente.dni" disabled="disabled"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12">
            <el-form-item label="Email:" class="postInfo-container-item">
              <el-input type="text" v-model="postFormCliente.email"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12">
            <el-form-item label="Numero Telefónico" class="postInfo-container-item" prop="phone">
              <el-input type="text" v-model="postFormCliente.phone"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">Cancelar</el-button>
        <el-button
          v-if="dialogStatus=='create'"
          type="primary"
          @click="createClient"
          v-loading="loading"
        >Crear</el-button>
        <el-button v-else type="primary" @click="updateClient" v-loading="loading">Actualizar</el-button>
      </div>
    </el-dialog>
    <el-dialog
      :title="textMap[dialogStatusBank] +' Cuenta Bancaria'"
      :visible.sync="dialogBankVisible"
    >
      <el-form
        :rules="rulesaccountbank"
        ref="postFormBank"
        :model="postFormBank"
        label-position="left"
        label-width="auto"
        style="width: 80%;"
      >
        <el-row :gutter="36">
          <el-col :span="12" :xs="24" :sm="12" :md="12">
            <el-form-item label="Nombres:" class="postInfo-container-item" prop="name">
              <el-input type="text" v-model="postFormBank.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12">
            <el-form-item label="Apellidos:" class="postInfo-container-item" prop="lastname">
              <el-input type="text" v-model="postFormBank.lastname"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" :xs="24" :sm="12" :md="12">
            <el-form-item label="Email:" class="postInfo-container-item" prop="email">
              <el-input type="text" v-model="postFormBank.email"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12">
            <el-form-item label="Telefono:" class="postInfo-container-item" prop="phone">
              <el-input type="text" v-model="postFormBank.phone"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12">
            <el-form-item
              label="Tipo de Documento:"
              class="postInfo-container-item"
              prop="typeDocument"
            >
              <el-select placeholder="Seleccionar" filterable v-model="postFormBank.typeDocument">
                <el-option
                  v-for="item in typeDocument"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12">
            <el-form-item label="Cedula / DNI:" class="postInfo-container-item" prop="dni">
              <el-input type="text" v-model="postFormBank.dni"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24">
            <el-form-item
              label="Numero de cuenta:"
              class="postInfo-container-item"
              prop="accountNumber"
            >
              <el-input type="text" v-model="postFormBank.accountNumber"></el-input>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12">
            <el-form-item
              label="Tipo de Cuenta:"
              class="postInfo-container-item"
              prop="typeAccount"
            >
              <el-select placeholder="Seleccionar" filterable v-model="postFormBank.typeAccount">
                <el-option
                  v-for="item in typeAccount"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12">
            <el-form-item label="Banco:" class="postInfo-container-item" prop="bank">
              <el-select placeholder="Seleccionar" filterable v-model="postFormBank.bank">
                <el-option
                  v-for="(item,index) in banks"
                  :key="index"
                  :label="item.label"
                  :value="index"
                ></el-option>
              </el-select>
            </el-form-item>
            <p v-if="bankAccountAccept" style="color:red;">El numero de cuenta bancaria no corresponde al banco.</p>
          </el-col>
          <el-col :xs="24" :sm="12" :md="12">
            <el-form-item label="Alias:" class="postInfo-container-item">
              <el-input type="text" v-model="postFormBank.alias"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogBankVisible = false">Cancelar</el-button>
        <el-button
          v-if="dialogStatusBank=='create'"
          type="primary"
          @click="createBank"
          v-loading="loading"
        >Crear</el-button>
        <el-button v-else type="primary" @click="updateBank" v-loading="loading">Actualizar</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { create, update, get, getAll } from "@/api/apigeneral";
import { filterItems, filterValue } from "@/filters";
import MDinput from "@/components/MDinput";
import Multiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.min.css";
import { validateEmail, validateNumber } from "@/utils/validate";
import waves from "@/directive/waves";
import Tinymce from "@/components/Tinymce";
import Upload from "@/components/Upload/singleImage3";
import Dropzone from "@/components/Dropzone";
import Vue from "vue";
import { mapGetters } from "vuex";
const transactionForm = {
  id: undefined,
  paisReceive: "Venezuela",
  amountReceive: "",
  typeMoney: "",
  dateOperation: "",
  voucherReceive: "",
  numOperation: "",
  paisSend: "",
  amountSend: "",
  voucherSend: "",
  commission:"",
  message: "",
  repayment: "",
  typePayment: "",
  status: 1,
  clientId: undefined,
  account_bankId: undefined,
  userApprovedId: undefined,
  bankId: undefined,
  gestorId: undefined,
  usersId: undefined,
  tax: undefined
};
const clienteForm = {
  id: undefined,
  name: "",
  lastname: "",
  email: "",
  dni: "",
  phone: "",
  status: "",
  nationality: "",
  phone2: ""
};
const taxInfo = {
  id: undefined,
  pais: "",
  money: "",
  date: "",
  tax: ""
};
const accountBank = {
  id: undefined,
  name: "",
  lastname: "",
  typeDocument: "",
  dni: "",
  email: "",
  phone: "",
  typeAccount: "",
  accountNumber: "",
  bank: "",
  pais: "Venezuela",
  status: 1,
  alias: "",
  clientId: ""
};
export default {
  name: "transferenciaDetail",
  components: { MDinput, Multiselect, Tinymce, Upload, Dropzone },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  directives: {
    waves
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === "") {
        callback(new Error(rule.name + " es requerido"));
      } else {
        callback();
      }
    };
    return {
      //Configuracion
      configuration: undefined,
      gestor: undefined,
      trabajador: undefined,
      //Fin Configuracion
      imagenval: 0,
      imagen: [],
      urlupload: process.env.BASE_API + "multimedia",
      markers: [],
      places: [],
      currentPlace: null,
      postForm: Object.assign({}, transactionForm),
      postFormCliente: Object.assign({}, clienteForm),
      postFormBank: Object.assign({}, accountBank),
      urlimprimir: process.env.BASE_API + "imprimir/",
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 1000,
        codigo: undefined,
        sort: "DESC"
      },
      loading: false,
      pross: 0,
      status: null,
      dialogFormVisible: false,
      dialogStatus: "",
      textMap: {
        update: "Editar",
        create: "Crear"
      },
      dialogBankVisible: false,
      dialogStatusBank: "",
      dialogPvVisible: false,
      bankAccountAccept: false,
      rules: {
        clientId: [{ validator: validateRequire, name: "Cliente" }],
        account_bankId: [
          { validator: validateRequire, name: "Banco del Cliente" }
        ],
        paisReceive: [{ validator: validateRequire, name: "Pais que recibe" }],
        amountReceive: [{ validator: validateRequire, name: "Monto" }],
        typeMoney: [{ validator: validateRequire, name: "Tipo de Moneda" }],
        dateOperation: [
          { validator: validateRequire, name: "Fecha de Operación" }
        ],
        paisSend: [{ validator: validateRequire, name: "Pais que Envia" }],
        amountSend: [{ validator: validateRequire, name: "Monto que envia" }],
        bankId: [{ validator: validateRequire, name: "Banco Receptor" }],
        status: [{ validator: validateRequire, name: "Estado" }],
        typePayment: [{ validator: validateRequire, name: "Tipo de pago" }],
        tax: [{ validator: validateRequire, name: "Tasa" }]
      },
      rulesclient: {
        name: [{ validator: validateRequire, name: "Nombre" }],
        lastname: [{ validator: validateRequire, name: "Apellidos" }],
        email: [{ validator: validateRequire, name: "Email / Correo" }],
        dni: [{ validator: validateRequire, name: "Cedula / Dni" }],
        phone: [{ validator: validateRequire, name: "Telefono" }],
        status: [{ validator: validateRequire, name: "Estado" }]
      },
      rulesaccountbank: {
        name: [{ validator: validateRequire, name: "Nombre" }],
        lastname: [{ validator: validateRequire, name: "Apellidos" }],
        typeDocument: [
          { validator: validateRequire, name: "Tipo de documento" }
        ],
        dni: [{ validator: validateRequire, name: "Cedula" }],
        typeAccount: [{ validator: validateRequire, name: "Tipo de Cuenta" }],
        accountNumber: [
          { validator: validateRequire, name: "Numero de cuenta" }
        ],
        bank: [{ validator: validateRequire, name: "Banco" }],
        clientId: [{ validator: validateRequire, name: "cliente" }]
      },
      money: [
        {
          value: "Peso dominicano",
          label: "RD $"
        },
        {
          value: "$",
          label: "Dolares"
        }
      ],
      status: [
        {
          value: "1",
          label: "Publicado"
        },
        {
          value: "2",
          label: "No Publicado"
        }
      ],
      typePayment: [
        {
          value: "Deposito",
          label: "Deposito"
        },
        {
          value: "Efectivo",
          label: "Efectivo"
        },
       /*{
          value: "Comisionista",
          label: "Comisionista"
        },*/
      ],
      typeDocument: [
        {
          value: "V",
          label: "V"
        },
        {
          value: "J",
          label: "J"
        },
        {
          value: "P",
          label: "P"
        },
        {
          value: "E",
          label: "E"
        }
      ],
      typeAccount: [
        {
          value: "Ahorro",
          label: "Ahorro"
        },
        {
          value: "Corriente",
          label: "Corriente"
        }
      ],
      banks: [
        {
          value: "100%BANCO",
          label: "100%BANCO",
          code: "0156"
        },
        {
          value: "ABN AMRO BANK",
          label: "ABN AMRO BANK",
          code: "0196"
        },
        {
          value: "BANCAMIGA BANCO MICROFINANCIERO, C.A.",
          label: "BANCAMIGA BANCO MICROFINANCIERO, C.A.",
          code: "0172"
        },
        {
          value: "BANCO ACTIVO BANCO COMERCIAL, C.A.",
          label: "BANCO ACTIVO BANCO COMERCIAL, C.A.",
          code: "0171"
        },
        {
          value: "BANCO AGRICOLA",
          label: "BANCO AGRICOLA",
          code: "0166"
        },
        {
          value: "BANCO BICENTENARIO",
          label: "BANCO BICENTENARIO",
          code: "0175"
        },
        {
          value: "BANCO CARONI, C.A. BANCO UNIVERSAL",
          label: "BANCO CARONI, C.A. BANCO UNIVERSAL",
          code: "0128"
        },
        {
          value: "BANCO DE DESARROLLO DEL MICROEMPRESARIO",
          label: "BANCO DE DESARROLLO DEL MICROEMPRESARIO",
          code: "0164"
        },
        {
          value: "BANCO DE VENEZUELA S.A.I.C.A.",
          label: "BANCO DE VENEZUELA S.A.I.C.A.",
          code: "0102"
        },
        {
          value: "BANCO DEL CARIBE C.A.",
          label: "BANCO DEL CARIBE C.A.",
          code: "0114"
        },
        {
          value: "BANCO DEL PUEBLO SOBERANO C.A.",
          label: "BANCO DEL PUEBLO SOBERANO C.A.",
          code: "0149"
        },
        {
          value: "BANCO DEL TESORO",
          label: "BANCO DEL TESORO",
          code: "0163"
        },
        {
          value: "BANCO ESPIRITO SANTO, S.A.",
          label: "BANCO ESPIRITO SANTO, S.A.",
          code: "0176"
        },
        {
          value: "BANCO EXTERIOR C.A.",
          label: "BANCO EXTERIOR C.A.",
          code: "0115"
        },
        {
          value: "BANCO INDUSTRIAL DE VENEZUELA.",
          label: "BANCO INDUSTRIAL DE VENEZUELA.",
          code: "0003"
        },
        {
          value: "BANCO INTERNACIONAL DE DESARROLLO, C.A.",
          label: "BANCO INTERNACIONAL DE DESARROLLO, C.A.",
          code: "0173"
        },
        {
          value: "BANCO MERCANTIL C.A.",
          label: "BANCO MERCANTIL C.A.",
          code: "0105"
        },
        {
          value: "BANCO NACIONAL DE CREDITO",
          label: "BANCO NACIONAL DE CREDITO",
          code: "0191"
        },
        {
          value: "BANCO OCCIDENTAL DE DESCUENTO.",
          label: "BANCO OCCIDENTAL DE DESCUENTO.",
          code: "0116"
        },
        {
          value: "BANCO PLAZA",
          label: "BANCO PLAZA",
          code: "0138"
        },
        {
          value: "BANCO PROVINCIAL BBVA",
          label: "BANCO PROVINCIAL BBVA",
          code: "0108"
        },
        {
          value: "BANCO VENEZOLANO DE CREDITO S.A.",
          label: "BANCO VENEZOLANO DE CREDITO S.A.",
          code: "0104"
        },
        {
          value: "BANCRECER S.A. BANCO DE DESARROLLO",
          label: "BANCRECER S.A. BANCO DE DESARROLLO",
          code: "0168"
        },
        {
          value: "BANESCO BANCO UNIVERSAL",
          label: "BANESCO BANCO UNIVERSAL",
          code: "0134"
        },
        {
          value: "BANFANB",
          label: "BANFANB",
          code: "0177"
        },
        {
          value: "BANGENTE",
          label: "BANGENTE",
          code: "0146"
        },
        {
          value: "BANPLUS BANCO COMERCIAL C.A",
          label: "BANPLUS BANCO COMERCIAL C.A",
          code: "0174"
        },
        {
          value: "CITIBANK.",
          label: "CITIBANK.",
          code: "0190"
        },
        {
          value: "CORP BANCA.",
          label: "CORP BANCA.",
          code: "0121"
        },
        {
          value: "DELSUR BANCO UNIVERSAL",
          label: "DELSUR BANCO UNIVERSAL",
          code: "0157"
        },
        {
          value: "FONDO COMUN",
          label: "FONDO COMUN",
          code: "0151"
        },
        {
          value: "INSTITUTO MUNICIPAL DE CRÉDITO POPULAR",
          label: "INSTITUTO MUNICIPAL DE CRÉDITO POPULAR",
          code: "0601"
        },
        {
          value: "MIBANCO BANCO DE DESARROLLO, C.A.",
          label: "MIBANCO BANCO DE DESARROLLO, C.A.",
          code: "0169"
        },
        {
          value: "SOFITASA",
          label: "SOFITASA",
          code: "0137"
        }
      ],

      transacionDisabled: false,
      // Caracteristicas
      checkAll: false,
      checkedLoading: false,
      isIndeterminate: true,
      // Tasas
      paistaxes: [],
      moneytaxes: [],
      taxId: undefined,
      datetax: "",
      //Bancos receptores
      accountbanks: [],
      // Depositos
      depositAlert: false,
      depositType: undefined,
      depositMessage: ""
    };
  },
	computed: {
    ...mapGetters(["roles"])
  },
  created() {
	this.role = this.roles[0];
	console.log('Rol: '+this.role)
    this.fetchSetting();
    if (this.isEdit) {
      const id = this.$route.params && this.$route.params.id;
      this.fetchData(id);
    } else {
      this.postForm = Object.assign({}, transactionForm);
      this.postFormCliente = Object.assign({}, clienteForm);
      this.fetchTax();
    }
  },
  methods: {
    dropzoneS(file, xhr, response) {
      this.postForm.voucherReceive = file.xhr.response;
      console.log("Success de simple");
      this.$message({ message: "Imagen agregada", type: "success" });
    },
    dropzoneR(file) {
      console.log("Remove File");
    },
    dropzoneE(file, xhr, response) {
      console.log("Error File");
    },
    dropzoneP(file, xhr, response) {
      console.log("Processing");
    },
    /** Configuration */
    fetchSetting() {
      getAll(this.listQuery, "configuration")
        .then(response => {
          this.configuration = response.data;
        })
        .catch(err => {
          console.log(err);
        });
      getAll(this.listQuery, "gestor")
        .then(response => {
          this.gestor = response.data;
          console.log(this.gestor);
        })
        .catch(err => {
          console.log(err);
        });
	  getAll(this.listQuery, "trabajador")
        .then(response => {
          this.trabajador = response.data;
          console.log(this.trabajador);
        })
        .catch(err => {
          console.log(err);
        });
    },
    /** End COnfiguration */
    /** Deposito */
    checkedDeposit() {
      this.loading = true;
      this.checkedLoading = true;
      this.transacionDisabled = true;
      create(this.postForm, "comprobar")
        .then(response => {
          (this.depositAlert = true), (this.depositType = response.type);
          this.depositMessage = response.message;
          this.loading = false;
          if (this.depositType == "error") {
            this.transacionDisabled = true;
            this.checkedLoading = false;
            console.log("Entro a disabled");
          } else if (this.depositType == "info") {
            if (this.configuration) {
              console.log("Company Configuration On");
              if (this.configuration.isDeposit == "1") {
                this.transacionDisabled = true;
                this.checkedLoading = false;
                console.log("Company Configuration Disabled");
              }
            } else {
              this.transacionDisabled = false;
              this.checkedLoading = false;
            }
          } else {
            this.transacionDisabled = false;
            console.log("No entro a disabled");
            this.checkedLoading = false;
          }
        })
        .catch(error => {
          console.log(error);
          this.transacionDisabled = true;
          this.loading = false;
          this.checkedLoading = false;
        });
    },
    /** End Deposito */
    /** Client */
    searchClient(tipo) {
      var temporal = this.postFormCliente.dni;
      get(this.postFormCliente.dni, "client")
        .then(response => {
          var response = response;
          this.postFormCliente = response.data;
          this.postForm.clientId = response.data.id;
          this.$message({
            type: "success",
            message:
              this.postFormCliente.name + " " + this.postFormCliente.lastname
          });
          this.pross = 1;
          console.log(this.postFormCliente);
          this.fetchAccountBank();
        })
        .catch(err => {
          this.pross = 0;
          this.$confirm(
            "Quieres crear un nuevo cliente?",
            "Cliente no existe",
            {
              confirmButtonText: "Si",
              cancelButtonText: "No",
              type: "info"
            }
          )
            .then(() => {
              this.dialogStatus = "create";
              this.dialogFormVisible = true;
              this.$nextTick(() => {
                this.postFormCliente = Object.assign({}, clienteForm);
                this.postFormCliente.dni = temporal;
              });
            })
            .catch(() => {
              console.log("No Client");
            });
          console.log(err);
        });
    },

    openEditClient() {
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
    },
    createClient() {
      this.$refs.postFormCliente.validate(valid => {
        if (valid) {
          this.loading = true;
          this.postFormCliente.status = 1;
          create(this.postFormCliente, "client")
            .then(response => {
              this.postForm.clientId = response.response;
              this.$message({
                title: "Éxito",
                message: "Cliente agregado",
                type: "success",
                duration: 2000
              });
              this.pross = 1;
              this.dialogFormVisible = false;
              this.loading = false;
              this.fetchAccountBank();
            })
            .catch(error => {
              console.log(error);
              this.loading = false;
            });
        }
      });
    },
    updateClient() {
      this.$refs.postFormCliente.validate(valid => {
        if (valid) {
          this.loading = true;
          update(this.postFormCliente, "client", this.postFormCliente.id)
            .then(response => {
              this.$message({
                title: "Éxito",
                message: "Cliente Actualizado",
                type: "success",
                duration: 2000
              });
              this.loading = false;
              this.dialogFormVisible = false;
              this.loading = false;
            })
            .catch(error => {
              console.log(error);
              this.loading = false;
            });
        }
      });
    },
    /** End Client */
    /** Tasas  */
    fetchTax() {
      getAll(this.listQuery, "tax-pais")
        .then(response => {
          this.paistaxes = response.data.items;
        })
        .catch(err => {
          console.log(err);
        });
    },

    togglePaisSend() {
      get(this.postForm.paisSend, "tax-money")
        .then(response => {
          this.moneytaxes = response.data;
        })
        .catch(err => {
          console.log(err);
        });
      get(this.postForm.paisSend, "bank-pais")
        .then(response => {
          this.bankId = response.data;
        })
        .catch(err => {
          console.log(err);
        });
      this.taxId = undefined;
    },
    toggleTax() {
      get(this.taxId, "tax")
        .then(response => {
          (this.postForm.paisSend = response.data.pais),
            (this.postForm.typeMoney = response.data.money),
            (this.postForm.tax = response.data.tax),
            (this.datetax = response.data.date);
          this.updateTax();
        })
        .catch(err => {
          console.log(err);
        });
    },
    calcularTax: function(event) {
		if(this.postForm.paisSend =='Colombia'){
			console.log('Entro a colombia')
		  this.postForm.amountReceive = (
			  this.postForm.amountSend / this.postForm.tax
		  ).toFixed(2);
		}else{
		  this.postForm.amountReceive = (
			this.postForm.tax * this.postForm.amountSend
		  ).toFixed(2);
		}
      this.pross = 2;
    },
    updateTax() {
      this.postForm.amountReceive = (
        this.postForm.tax * this.postForm.amountSend
      ).toFixed(2);
      this.pross = 2;
    },
    /** End Tasas */
    /** Account Banks */
    fetchAccountBank() {
      console.log("Search Account bank for " + this.postForm.clientId);
      console.log(this.postForm.clientId);
      var listQuery = {
        page: 1,
        limit: 1000,
        client: this.postForm.clientId,
        sort: "DESC"
      };
      getAll(listQuery, "accountbank")
        .then(response => {
          this.accountbanks = response.data.items;
        })
        .catch(err => {
          console.log(err);
        });
    },
    toggleAccountBank() {
      get(this.postForm.account_bankId, "accountbank")
        .then(response => {
          this.postFormBank = response.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    openCreateBank() {
      this.dialogStatusBank = "create";
      this.dialogBankVisible = true;
    },
    openUpdateBank() {
      this.dialogStatusBank = "update";
      this.dialogBankVisible = true;
    },
    createBank() {
      this.bankAccountAccept = false;
      var codeBank = this.banks[this.postFormBank.bank].code
      var codeAnterior = this.banks[this.postFormBank.bank].code
      var codeAccount = this.postFormBank.accountNumber.substr(0,4)
        if(codeBank == codeAccount){
          this.$refs.postFormBank.validate(valid => {
            if (valid) {
              this.postFormBank.bank =  this.banks[this.postFormBank.bank].value
              this.loading = true;
              this.postFormBank.status = 1;
              this.postFormBank.clientId = this.postForm.clientId;
              create(this.postFormBank, "accountbank")
                .then(response => {
                  this.postFormBank.id = response.response;
                  this.$message({
                    title: "Éxito",
                    message: "Cuenta Agregada",
                    type: "success",
                    duration: 2000
                  });
                  this.pross = 4;
                  this.dialogBankVisible = false;
                  this.loading = false;
                  this.fetchAccountBank();
                })
                .catch(error => {
                  this.postFormBank.bank =  codeAnterior
                  console.log(error);
                  this.loading = false;
                });
            }
          });
        }else{
          this.bankAccountAccept = true;
          console.log('La cuenta bancaria no corresponde al banco.')
        }
    },
    updateBank() {
      this.$refs.postFormBank.validate(valid => {
        if (valid) {
          this.loading = true;
          update(this.postFormBank, "accountbank", this.postFormBank.id)
            .then(response => {
              this.$message({
                title: "Éxito",
                message: "Cuenta Actualizada",
                type: "success",
                duration: 2000
              });
              this.dialogBankVisible = false;
              this.loading = false;
              this.fetchAccountBank();
            })
            .catch(error => {
              console.log(error);
              this.loading = false;
            });
        }
      });
    },
    /** End Banks */
    fetchData(id) {
      get(id, "transaction")
        .then(response => {
          this.postForm = response.data;
          this.postFormCliente = response.data.client;
          this.postFormBank = response.data.account_bank;
          this.pross = 3;
        })
        .catch(err => {
          console.log(err);
        });
    },
    SaveTransaction() {
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.transacionDisabled = true;
          if (this.isEdit) {
            update(this.postForm, "transaction", this.postForm.id)
              .then(response => {
                this.$message({
                  title: "Éxito",
                  message: "Transacción actualizado",
                  type: "success",
                  duration: 2000
                });
                setTimeout(
                  () => this.$router.push({ path: "/transferencia" }),
                  2000
                );
              })
              .catch(error => {
                console.log(error);
                this.loading = false;
                this.transacionDisabled = false;
              });
          } else {
            create(this.postForm, "transaction")
              .then(response => {
                this.$message({
                  title: "Éxito",
                  message: "Transacción creada",
                  type: "success",
                  duration: 2000
                });
                window.open(this.urlimprimir + response.response, "_blank");
                setTimeout(
                  () => this.$router.push({ path: "/transferencia" }),
                  2000
                );
                
              })
              .catch(error => {
                console.log(error);
                this.loading = false;
                this.transacionDisabled = false;
              });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";

.avatar {
  width: 200px;
  height: 200px;
  border-radius: 50%;
}
.createPost-container {
  position: relative;
  .createPost-main-container {
    padding: 40px 45px 20px 50px;
    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;
      .postInfo-container-item {
        float: left;
      }
    }
    .editor-container {
      min-height: 500px;
      margin: 0 0 30px;
      .editor-upload-btn-container {
        text-align: right;
        margin-right: 10px;
        .editor-upload-btn {
          display: inline-block;
        }
      }
    }
  }
  .word-counter {
    width: 40px;
    position: absolute;
    right: -10px;
    top: 0px;
  }
}
.panel-group {
  margin-top: 18px;
  .card-panel-col {
    margin-bottom: 32px;
  }
  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);
    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }
      .icon-people {
        background: #40c9c6;
      }
      .icon-message {
        background: #36a3f7;
      }
      .icon-money {
        background: #f4516c;
      }
      .icon-shoppingCard {
        background: #34bfa3;
      }
    }
    .icon-people {
      color: #40c9c6;
    }
    .icon-message {
      color: #36a3f7;
    }
    .icon-money {
      color: #f4516c;
    }
    .icon-shoppingCard {
      color: #34bfa3;
    }
    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-icon {
      float: left;
      font-size: 48px;
    }
    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 20px;
      }
    }
    .card-panel-description-center {
      text-align: center;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}
.grid-container {
  display: grid;
  grid-template-columns: auto auto auto auto;
  grid-gap: 10px;
  padding: 10px;
  border-radius: 5px;
}
.grid-container > div {
  background-color: #e7eff7;
  text-align: center;
  padding: 20px 0;
  font-size: 30px;
}
.bg-danger {
  border: solid 4px #fa6b18 !important;
  border-radius: 8px;
}
/* Container needed to position the button. Adjust the width as needed */
.imgcontainer {
  position: relative;
  width: 100%;
}

/* Make the image responsive */
.imgcontainer img {
  width: 100%;
  height: auto;
}

/* Style the button and place it in the middle of the container/image */
.imgcontainer .btn {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  background-color: #555;
  color: white;
  font-size: 16px;
  padding: 12px 24px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

.imgcontainer .btn:hover {
  background-color: black;
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
.is-disabled {
  color: #121213 !important;
}
</style>
