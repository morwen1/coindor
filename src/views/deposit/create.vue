<template>
  <deposit-detail :is-edit='false'></deposit-detail>
</template>

<script>
import depositDetail from './components/depositDetail'

export default {
  name: 'createDeposit',
  components: { depositDetail }
}
</script>
