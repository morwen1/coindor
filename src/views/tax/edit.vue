<template>
  <tax-detail :is-edit='true'></tax-detail>
</template>

<script>
import taxDetail from './components/TaxDetail'

export default {
  name: 'edittax',
  components: { taxDetail }
}
</script>
