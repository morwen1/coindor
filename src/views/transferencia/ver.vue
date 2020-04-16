<template>
  <div class="createPost-container" v-loading="loading">
    <el-form class="form-container" :model="postForm" :rules="rules" ref="postForm">
      <div class="createPost-main-container">
        <el-row>
          <div class="postInfo-container">
            <p class="warn-content">Identificador: #{{ postForm.transactionId }}</p>
            <el-alert v-if="postForm.status==3" title="Alerta" type="error" show-icon>
              <br>
              {{ postForm.message }}
              <br>
            </el-alert>
            <el-alert
              v-if="postForm.status!=3  && postForm.message"
              title="Información"
              type="info"
              show-icon
            >
              <br>
              {{ postForm.message }}
              <br>
            </el-alert>
            <el-row class="animated fadeIn" v-if="edit">
              <code>
                Datos del Cliente
                <el-button type="primary" size="small" @click="openEditClient()">
                  <svg-icon icon-class="edit"/>Editar Cliente
                </el-button>
              </code>
              <el-col :span="8">
                <el-form-item label="Nombre y Apellido" class="postInfo-container-item">
                  <br>
                  <strong>{{ postFormCliente.name }} - {{ postFormCliente.lastname }}</strong>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="Cedula / Dni:" class="postInfo-container-item">
                  <br>
                  <strong>{{ postFormCliente.dni }}</strong>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="Telefono principal:" class="postInfo-container-item">
                  <br>
                  <strong>{{ postFormCliente.phone }}</strong>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row class="animated fadeIn" v-if="comisionista">
              <el-col :span="24">
                <code>Envian desde:</code>
              </el-col>
              <el-col :span="8">
                <el-form-item label="Pais" class="postInfo-container-item" prop="paisSend">
                  <br>
                  <strong>{{ postForm.paisSend }}</strong>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="Moneda" class="postInfo-container-item">
                  <br>
                  <strong>{{ postForm.typeMoney }}</strong>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="Cantidad" class="postInfo-container-item" prop="tax">
                  <br>
                  <strong>{{ postForm.amountSend }}</strong>
                </el-form-item>
              </el-col>
              <el-col :span="8" v-if="postForm.commission">
                <el-form-item label="Comisión" class="postInfo-container-item"  >
                  <br>
                  <strong>{{ postForm.commission }} {{ postForm.typeMoney }}</strong>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="Tasa" class="postInfo-container-item" prop="tax">
                  <br>
                  <strong>{{ postForm.tax }}</strong>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <code>
                  Recibe :
                  <strong>{{ postForm.amountReceive }}</strong> Bolivares Soberano
                  <el-button
                    type="primary"
                    size="small"
                    @click="openprice()"
                    v-if="role=='Administrador'"
                  >
                    <svg-icon icon-class="edit"/>Editar Monto
                  </el-button>
                  <br>
                </code>
              </el-col>
            </el-row>
            <el-row class="animated fadeIn" v-if="edit">
              <el-col :span="8">
                <el-form-item label="Forma de pago" class="postInfo-container-item">
                  <br>
                  <strong>{{ postForm.typePayment }}</strong>
                </el-form-item>
              </el-col>
              <el-col :span="8" class="animated fadeIn">
                <el-form-item
                  :label="'Fecha de pago en ' + postForm.typePayment"
                  class="postInfo-container-item"
                >
                  <br>
                  <strong>{{ postForm.dateOperation }}</strong>
                </el-form-item>
              </el-col>

              <el-col :span="8" v-if="postForm.bankId" class="animated fadeIn">
                <el-form-item label="Banco donde fue depositado" class="postInfo-container-item">
                  <br>
                  <strong v-if="postForm.bank">{{ postForm.bank.bank }}</strong>
                </el-form-item>
              </el-col>
              <el-col :span="8" v-if="postForm.bankId" class="animated fadeIn">
                <el-form-item
                  label="Numero de Deposito"
                  class="postInfo-container-item"
                  prop="numOperation"
                >
                  <br>
                  <strong>{{ postForm.numOperation }}</strong>
                </el-form-item>
              </el-col>
              <el-col :span="8" v-if="postForm.deposit">
                <el-button
                  type="success"
                  size="small"
                  @click="confirmDeposit()"
                  v-if="(postForm.deposit.status==0 && edit )"
                >Confirmar Deposito Bancario</el-button>
                <el-tag type="success" v-if="postForm.deposit.status==1">Deposito ya confirmado.</el-tag>
                <el-tag type="success" v-if="postForm.deposit.status==2">Deposito ya confirmado.</el-tag>
              </el-col>
              <el-col :span="24" v-if="postForm.voucherReceive" class="animated fadeIn">
                <el-form-item label="Comprobante de pago" class="postInfo-container-item">
                  <br>
                  <img :src="postForm.voucherReceive.img" style="width: 50%; height:auto">
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="postForm.account_bankId" class="animated fadeIn">
              <code>
                Cuenta Bancaria
                <el-button type="primary" size="small" @click="openUpdateBank()" v-if="edit">
                  <svg-icon icon-class="edit"/>Editar Cuenta Bancaria
                </el-button>
              </code>
              <el-col :span="12" :xs="24" :sm="12" :md="8">
                <el-form-item label="Nombres:" class="postInfo-container-item" prop="name">
                  <br>
                  <strong>{{ postFormBank.name }}</strong>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8">
                <el-form-item label="Apellidos:" class="postInfo-container-item" prop="lastname">
                  <br>
                  <strong>{{ postFormBank.lastname }}</strong>
                </el-form-item>
              </el-col>
              <el-col :span="12" :xs="24" :sm="12" :md="8">
                <el-form-item label="Email:" class="postInfo-container-item" prop="email">
                  <br>
                  <strong>{{ postFormBank.email }}</strong>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8">
                <el-form-item label="Telefono:" class="postInfo-container-item" prop="phone">
                  <br>
                  <strong>{{ postFormBank.phone }}</strong>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8">
                <el-form-item
                  label="Tipo de Documento:"
                  class="postInfo-container-item"
                  prop="typeDocument"
                >
                  <br>
                  <strong>{{ postFormBank.typeDocument }}</strong>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8">
                <el-form-item label="Cedula / DNI:" class="postInfo-container-item" prop="dni">
                  <br>
                  <strong>{{ postFormBank.dni }}</strong>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8">
                <el-form-item
                  label="Tipo de Cuenta:"
                  class="postInfo-container-item"
                  prop="typeAccount"
                >
                  <br>
                  <strong>{{ postFormBank.typeAccount }}</strong>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="12" :md="8">
                <el-form-item label="Banco:" class="postInfo-container-item" prop="bank">
                  <br>
                  <strong v-if="postFormBank.bank">{{ postFormBank.bank }}</strong>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12">
                <el-form-item
                  label="Numero de cuenta:"
                  class="postInfo-container-item"
                  prop="accountNumber"
                >
                  <br>
                  <strong>{{ postFormBank.accountNumber }}</strong>
                </el-form-item>
              </el-col>
            </el-row>
<el-row><el-col :span="24" :xs="24" :sm="24" :md="24" v-if="postForm.status==2">
                <el-col :span="24" v-if="postForm.voucherSend" class="animated fadeIn">
                  <el-form-item
                    label="Comprobante de transferencia"
                    class="postInfo-container-item"
                  >
                    <br>
                    <img :src="postForm.voucherSend.img" style="width: 50%; height:auto">
                  </el-form-item>
                </el-col>
                <el-col :span="24" class="animated fadeIn">
                  <el-form-item label="Fecha de pago" class="postInfo-container-item">
                    <br>
                    {{postForm.dateApproved}}
                  </el-form-item>
                </el-col>
                <el-col :span="24" v-if="postForm.gestorId" class="animated fadeIn">
                  <el-form-item label="Gestor" class="postInfo-container-item">
                    <br>
                    {{postForm.gestor.name}}
                  </el-form-item>
                </el-col>
                <el-col :span="24" v-if="postForm.bankDiscount" class="animated fadeIn">
                  <el-form-item
                    label="Banco que hizo la transferencia:"
                    class="postInfo-container-item"
                    v-if="postForm.bankDiscount.bank.bank"
                  >
                    <br>
                    {{postForm.bankDiscount.bank.bank}} - {{postForm.bankDiscount.bank.name}}
                  </el-form-item>
                </el-col>
              </el-col></el-row>
            <el-row class="animated fadeIn" v-if="currentRole">
              <code>Datos para aprobación</code>
              
              <el-col :span="24" :xs="24" :sm="24" :md="24" v-if="postForm.status==1">
                <el-col :span="20" :xs="20" :sm="20" :md="20">
                  <el-form-item
                    label="Cuenta Bancaria a debitar:"
                    class="postInfo-container-item"
                    style="width: 100%;"
                  >
                    <el-select
                      v-model="postForm.bankDiscount"
                      placeholder="Cuenta Bancaria"
                      style="width: 90%;"
                      filterable
                      :disabled="postForm.status!=1"
                    >
                      <el-option
                        v-bind:class="{ 'select-danger': parseInt(item.amount) < parseInt(postForm.amountReceive) }"
                        v-for="item in options2"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                        :disabled="parseInt(item.amount) < parseInt(postForm.amountReceive)"
                      >
                        <span>{{ item.bank }} - {{ item.name }} - Saldo: {{ item.amount }}</span>
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="24" v-if="postForm.voucherSend" class="animated fadeIn">
                  <el-form-item
                    label="Comprobante de transferencia"
                    class="postInfo-container-item"
                  >
                    <br>
                    <img :src="postForm.voucherSend.img" style="width: 50%; height:auto">
                  </el-form-item>
                </el-col>
                <el-col :span="24" class="animated fadeIn">
                  <el-form-item
                    label="Adjuntar comprobante de pagado:"
                    class="postInfo-container-item"
                  >
                    <dropzone
                      v-on:dropzone-success="dropzoneS"
                      v-on:dropzone-removedFile="dropzoneR"
                      v-on:dropzone-processing="dropzoneP"
                      v-on:dropzone-error="dropzoneE"
                      id="myVueDropzone"
                      :url="urlupload"
                    ></dropzone>
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :sm="24" :md="24">
                  <el-form-item
                    label="Fecha de pago:"
                    class="postInfo-container-item"
                    prop="accountNumber"
                  >
                    <el-date-picker
                      v-model="postForm.dateApproved"
                      type="datetime"
                      format="yyyy-MM-dd HH:mm:ss"
                      label="Fecha del pago"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="24" v-if="postForm.gestorId" class="animated fadeIn">
                  <el-form-item label="Gestor" class="postInfo-container-item">
                    <br>
                    {{postForm.gestor.name}}
                  </el-form-item>
                </el-col>
              </el-col>
              <div v-if="postForm.deposit">
                <el-col :xs="24" :sm="24" :md="24" v-if="postForm.deposit.status==0">
                  <el-alert title="Comprobar Deposito" type="warning" show-icon>
                    <br>Deben confirmar el deposito bancario para completar Transferencia
                    <br>
                  </el-alert>
                </el-col>
                <el-col :xs="8" :sm="8" :md="4" v-else>
                  <div v-if="transacionDisabled == false">
                    <el-button
                      v-loading="loading"
                      style="margin-left: 10px;"
                      type="success"
                      v-if="postForm.status==1 && transacionDisabled == false"
                      @click="SaveTransaction(); transacionDisabled = true;"
                      :disabled="transacionDisabled"
                    >Completar Transferencia</el-button>
                  </div>
                </el-col>
              </div>
              <div v-else>
                <el-col :xs="8" :sm="8" :md="4" v-if="postForm.status==1">
                  <div v-if="transacionDisabled == false">
                    <el-button
                      v-loading="loading"
                      style="margin-left: 10px;"
                      type="success"
                      v-if="postForm.status==1 && transacionDisabled == false"
                      @click="SaveTransaction(); transacionDisabled = true;"
                      :disabled="transacionDisabled"
                    >Completar Transferencia</el-button>
                  </div>
                </el-col>
              </div>
			  
              <el-col :xs="8" :sm="8" :md="4" class="animated fadeIn" v-if="postForm.paisSend=='Chile'">
					<el-button
					  v-loading="loading"
					  style="margin-left: 10px;"
					  type="primary"
						@click="comprobantechile"
					>
					  Imprimir Comprobante
					</el-button>
              </el-col>
              <el-col :xs="8" :sm="8" :md="4" class="animated fadeIn">
                <el-button
                  v-loading="loading"
                  style="margin-left: 10px;"
                  type="warning"
                  @click="openreporte"
                >
                  <i class="el-icon-phone-outline"></i> Generar Alerta
                </el-button>
              </el-col>
              <el-col :xs="8" :sm="8" :md="4" v-if="postForm.status==2" class="animated fadeIn">
                <el-button
                  v-loading="loading"
                  style="margin-left: 10px;"
                  type="primary"
                  @click="whatsaps"
                  v-if="edit"
                >
                  <i class="el-icon-phone-outline"></i> Enviar mensaje a cliente
                </el-button>
              </el-col>
            </el-row>
            <el-row class="animated fadeIn" v-if="currentRole">
              <el-col :xs="2" :sm="2" :md="2">
                <el-button
                  v-loading="loading"
                  style="margin-left: 10px;"
                  type="info"
                  @click="backlist"
                >
                  <i class="el-icon-back"></i>
                </el-button>
              </el-col>
              <el-col :xs="8" :sm="8" :md="4" v-if="postForm.status==3">
                <el-button
                  v-loading="loading"
                  style="margin-left: 10px;"
                  type="warning"
                  @click="alertadown"
                >Quitar Alerta</el-button>
              </el-col>
              <el-col :xs="8" :sm="8" :md="4" v-if="postForm.status==3" class="animated fadeIn">
                <el-button
                  v-loading="loading"
                  style="margin-left: 10px;"
                  type="warning"
                  @click="whatsapsalerta"
                >
                  <i class="el-icon-phone-outline"></i> Ponerse en contacto con cliente
                </el-button>
              </el-col>
            </el-row>

            <el-row class="animated fadeIn" v-else>
              <el-col :xs="8" :sm="8" :md="4" class="animated fadeIn">
                <el-button
                  v-loading="loading"
                  style="margin-left: 10px;"
                  type="primary"
                  @click="whatsaps"
                >
                  <i class="el-icon-phone-outline"></i> Enviar mensaje a cliente
                </el-button>
              </el-col>
              <el-col :xs="8" :sm="8" :md="4" v-if="postForm.status==3">
                <el-button
                  v-loading="loading"
                  style="margin-left: 10px;"
                  type="warning"
                  @click="alertadown"
                >Quitar Alerta</el-button>
              </el-col>
            </el-row>
          </div>
        </el-row>
      </div>
    </el-form>

    <el-dialog title="Reajustar Precio" :visible.sync="dialogFormPrecioVisible">
      <el-form
        ref="postForm"
        :model="postForm"
        label-position="left"
        label-width="auto"
        style="width: 100%;"
      >
        <el-row>
          <el-col :span="12" :xs="24" :sm="12" :md="12">
            <el-form-item
              label="Monto que recibe en Bolivares:"
              class="postInfo-container-item"
              prop="amountReceive"
            >
              <el-input type="text" v-model="postForm.amountReceive"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormPrecioVisible = false">Cancelar</el-button>
        <el-button type="primary" @click="priceReajustar" v-loading="loading">Reajustar precio</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormAlertVisible">
      <el-form
        ref="postForm"
        :model="postForm"
        label-position="left"
        label-width="auto"
        style="width: 100%;"
      >
        <el-row>
          <el-col :span="12" :xs="24" :sm="24" :md="24">
            <el-form-item label="Mensaje de alerta:" class="postInfo-container-item">
              <el-input
                type="textarea"
                :autosize="{ minRows: 2, maxRows: 4}"
                placeholder="Mensaje adjuntado"
                v-model="postForm.message"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12" :xs="24" :sm="24" :md="24">
            <el-form-item label="Tipo de Alerta:" class="postInfo-container-item">
              <el-select placeholder="Seleccionar" filterable v-model="postForm.alert">
                <el-option
                  v-for="item in alertType"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <span
            v-if="postForm.bankDiscount"
          >Esta acción hara que se haga una nota de debito a tu cuenta bancaria</span>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormAlertVisible = false; transacionDisabled = false;">Cancelar</el-button>
        <el-button type="primary" @click="ReporteTransaction" v-loading="loading">Actualizar Alerta</el-button>
      </div>
    </el-dialog>
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
            <el-form-item label="Cedula / DNI:" class="postInfo-container-item" prop="dni">
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
                  v-for="item in banks"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
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
import { mapGetters } from "vuex";
import Vue from "vue";

const transactionForm = {
  id: undefined,
  paisReceive: "Venezuela",
  transactionId: undefined,
  amountReceive: "",
  typeMoney: "",
  dateOperation: "",
  voucherReceive: "",
  numOperation: "",
  paisSend: "",
  amountSend: "",
  voucherSend: "",
  message: "",
  repayment: "",
  typePayment: "",
  status: 1,
  dateApproved: "",
  clientId: undefined,
  account_bankId: undefined,
  userApprovedId: undefined,
  bankId: undefined,
  tax: undefined,
  alert: "",
  bankDiscount: undefined
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
  name: "verTransaction",
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
      imagenval: 0,
      imagen: [],
      urlupload: process.env.BASE_API + "multimedia",
      urlimprimir: process.env.BASE_API + "imprimir/",
      markers: [],
      places: [],
      currentPlace: null,
      postForm: Object.assign({}, transactionForm),
      postFormCliente: Object.assign({}, clienteForm),
      postFormBank: Object.assign({}, accountBank),
      transacionDisabled: false,
      listLoading: true,
      role: undefined,
      edit: true,
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
      dialogFormAlertVisible: false,
      dialogFormPrecioVisible: false,
      dialogStatus: "",
      textMap: {
        update: "Editar",
        create: "Crear"
      },
      dialogBankVisible: false,
      dialogStatusBank: "",
      dialogPvVisible: false,
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
        }
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
      options2: [],
      banks: [
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
      ],

      alertType: [
        {
          value: 1,
          label: "Error"
        },
        {
          value: 2,
          label: "Devolución"
        },
        {
          value: 3,
          label: "Informativa"
        }
      ],
      // Caracteristicas
      checkAll: false,
      isIndeterminate: true,
      // Tasas
      paistaxes: [],
      moneytaxes: [],
      taxId: undefined,
      datetax: "",
      //Bancos receptores
      accountbanks: [],
      currentRole: true,
      comisionista: true
    };
  },
  computed: {
    ...mapGetters(["roles"])
  },
  created() {
    const id = this.$route.params && this.$route.params.id;
    this.fetchData(id);

    this.role = this.roles[0];
    if (!this.roles.includes("Administrador", "Trabajador Avanzado")) {
      this.currentRole = false;
      if (this.role == "Visualizador de Transferencia") {
        (this.currentRole = true), (this.edit = false);
      }
      if (this.role == "Gestor") {
        (this.currentRole = true),(this.comisionista = false), (this.edit = false);
      }
      if (this.role == "Comisionista") {
        (this.currentRole = true),(this.comisionista = false), (this.edit = false);
      }
    }
  },

  methods: {
    openprice() {
      this.dialogFormPrecioVisible = true;
    },
    openreporte() {
      this.transacionDisabled = true;
      this.dialogStatus = "Reporte";
      this.dialogFormAlertVisible = true;
    },
    dropzoneS(file, xhr, response) {
      this.postForm.voucherSend = file.xhr.response;
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

    fetchData(id) {
      this.loading = true;
      get(id, "transaction")
        .then(response => {
          this.postForm = response.data;
          this.postFormCliente = response.data.client;
          this.postFormBank = response.data.account_bank;
          this.loading = false;
        })
        .catch(err => {
          console.log(err);
        });
      get("Venezuela", "bank-pais")
        .then(response => {
          this.options2 = response.data;
        })
        .catch(err => {
          console.log(err);
        });
    },

    SaveTransaction() {
      this.loading = true;
      this.transacionDisabled = true;
      console.log("Save Transaction " + this.transacionDisabled);
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.postForm.status = 2;
          update(this.postForm, "transaction", this.postForm.id)
            .then(response => {
              this.$message({
                title: "Éxito",
                message: "Transacción aprobada",
                type: "success",
                duration: 2000
              });
              this.fetchData(this.postForm.id);
              this.loading = false;
            })
            .catch(error => {
              console.log(error);
              this.loading = false;
              this.transacionDisabled = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    alertadown() {
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.transacionDisabled = true;
          this.postForm.status = 1;
          update(this.postForm, "transaction", this.postForm.id)
            .then(response => {
              this.$message({
                title: "Reporte",
                message: "Alerta Removida",
                type: "info",
                duration: 2000
              });
              this.fetchData(this.postForm.id);
              this.loading = false;
              this.dialogFormAlertVisible = false;
              this.transacionDisabled = false;
              this.postForm.bankDiscount = undefined;
            })
            .catch(error => {
              console.log(error);
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    ReporteTransaction() {
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.postForm.status = 3;
          update(this.postForm, "transaction", this.postForm.id)
            .then(response => {
              this.$message({
                title: "Reporte",
                message: "Notificación creada",
                type: "warning",
                duration: 2000
              });
              this.fetchData(this.postForm.id);
              this.loading = false;
              this.dialogFormAlertVisible = false;
            })
            .catch(error => {
              console.log(error);
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    priceReajustar() {
      this.$refs.postForm.validate(valid => {
        if (valid) {
          this.loading = true;
          update(this.postForm, "transaction", this.postForm.id)
            .then(response => {
              this.$message({
                title: "Precio",
                message: "Precio ajustado",
                type: "info",
                duration: 2000
              });
              this.fetchData(this.postForm.id);
              this.loading = false;
              this.dialogFormPrecioVisible = false;
            })
            .catch(error => {
              console.log(error);
              this.loading = false;
              this.dialogFormPrecioVisible = false;
            });
        } else {
          this.dialogFormPrecioVisible = false;
          console.log("error submit!!");
          return false;
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
              this.dialogFormVisible = false;
            });
        }
      });
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
              this.dialogBankVisible = false;
              this.loading = false;
            });
        }
      });
    },
    confirmDeposit() {
      this.loading = true;
      update(this.postForm.deposit, "aprobar", this.postForm.deposit.id)
        .then(response => {
          this.$message({
            title: "Éxito",
            message: "Deposito aprobado",
            type: "success",
            duration: 2000
          });
          (this.postForm.deposit.status = 2), (this.loading = false);
        })
        .catch(error => {
          console.log(error);
          this.loading = false;
        });
    },
    openEditClient() {
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
    },
    openUpdateBank() {
      this.dialogStatusBank = "update";
      this.dialogBankVisible = true;
    },
    backlist() {
      this.loading = true;
      setTimeout(() => this.$router.push({ path: "/transferencia" }), 500);
    },
    handleSizeChange(val) {
      this.listQuery.limit = val;
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
    },
    whatsaps() {
      if (this.postForm.voucherSend) {
        window.open(
          "https://api.whatsapp.com/send?phone=" +
            this.postFormCliente.phone +
            "&text=Pago Realizado! Gracias por confiar en nuestros servicios, te adjuntamos tu comprobante puedes visualizarlo entrando a este enlance " +
            this.postForm.voucherSend.img,
          "_blank"
        );
      } else {
        window.open(
          "https://api.whatsapp.com/send?phone=" +
            this.postFormCliente.phone +
            "&text=Pago Realizado! Gracias por confiar en nuestros servicios",
          "_blank"
        );
      }
    },
    whatsapsalerta() {
      window.open(
        "https://api.whatsapp.com/send?phone=" +
          this.postFormCliente.phone +
          "&text=Notificación:",
        "_blank"
      );
    },
	comprobantechile() {
      window.open(
        "https://casadecambio.online/api/pdf/" +
          this.postForm.id ,
        "_blank"
      );
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

.select-danger {
  background-color: #ff9393;
}
</style>