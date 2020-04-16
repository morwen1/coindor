<template>
  <deposit-detail :is-edit='true'></deposit-detail>
</template>

<script>
import depositDetail from './components/depositDetail'

export default {
  name: 'editdeposit',
  components: { depositDetail }
}
</script>
