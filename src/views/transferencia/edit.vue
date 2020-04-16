<template>
   <transferencia-detail :is-edit='true'></transferencia-detail>
</template>

<script>
import transferenciaDetail from './components/transferenciaDetail'

export default {
  name: 'editInmueble',
  components: { transferenciaDetail }
}
</script>
