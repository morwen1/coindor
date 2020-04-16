<template>
  <el-row class="panel-group" :gutter="40">
      <el-col :xs="24" :sm="24" :lg="24" class="card-panel-col">
      <div class='card-panel' >
        <div class="card-panel-description2">
          <div class="card-panel-text" style="font-size: 1.2vw; line-height: 50px; text-align:center"> Sistema Administrativo Casa de Cambio</div>
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col">
       <router-link :to="'/transferencia/create'">
      <div class='card-panel' >
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="documentation" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text" style="font-size: 1.2vw; line-height: 50px;"> Crear Transferencia</div>
        </div>
      </div>
        </router-link>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col">
       <router-link :to="'/transferencia'">
      <div class="card-panel" >
        <div class="card-panel-icon-wrapper icon-message">
          <svg-icon icon-class="list" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text"  style="font-size: 1.2vw; line-height: 50px;"> Lista de Transferencia</div>
        </div>
      </div>
        </router-link>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col">
       <router-link :to="'/client/create'">
      <div class='card-panel'>
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="people" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text"  style="font-size: 1.2vw; line-height: 50px;"> Crear Cliente</div>
         
        </div>
      </div>
        </router-link>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col">
       <router-link :to="'/tax'">
      <div class='card-panel'>
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="chart" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text"  style="font-size: 1.2vw; line-height: 50px;"> Cambiar Tasa</div>
         
        </div>
      </div>
        </router-link>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col">
       <router-link :to="'/report/dia'">
      <div class='card-panel'>
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="excel" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text"  style="font-size: 1.2vw; line-height: 50px;"> Reportes</div>
         
        </div>
      </div>
        </router-link>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col">
       <router-link :to="'/bank'">
      <div class='card-panel'>
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="dashboard" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text"  style="font-size: 1.2vw; line-height: 50px;"> Cuentas Bancarias</div>
         
        </div>
      </div>
        </router-link>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="8" class="card-panel-col">
       <router-link :to="'/users'">
      <div class='card-panel'>
        <div class="card-panel-icon-wrapper icon-people">
          <svg-icon icon-class="peoples" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text"  style="font-size: 1.2vw; line-height: 50px;"> Personal - Empleados</div>
         
        </div>
      </div>
        </router-link>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'

export default {
  components: {
    CountTo
  },
  methods: {
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.panel-group {
  margin-top: 18px;
  .card-panel-col{
    margin-bottom: 32px;
  }
  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 10px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);
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
        background: #34bfa3
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
      color: #34bfa3
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
     .card-panel-description2 {
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
</style>
