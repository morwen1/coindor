<template>
  <transferencia-detail :is-edit='false'></transferencia-detail>
</template>

<script>
import transferenciaDetail from './components/transferenciaDetail'

export default {
  name: 'createInmueble',
  components: { transferenciaDetail }
}
</script>
