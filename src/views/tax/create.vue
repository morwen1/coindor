<template>
  <tax-detail :is-edit='false'></tax-detail>
</template>

<script>
import taxDetail from './components/TaxDetail'

export default {
  name: 'createtax',
  components: { taxDetail }
}
</script>
