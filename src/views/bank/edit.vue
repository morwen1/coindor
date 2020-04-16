<template>
  <bank-detail :is-edit='true'></bank-detail>
</template>

<script>
import bankDetail from './components/BankDetail'

export default {
  name: 'editbank',
  components: { bankDetail }
}
</script>
