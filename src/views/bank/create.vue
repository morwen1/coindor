<template>
  <bank-detail :is-edit='false'></bank-detail>
</template>

<script>
import bankDetail from './components/BankDetail'

export default {
  name: 'createbank',
  components: { bankDetail }
}
</script>
