<template>
  <retirement-detail :is-edit='true'></retirement-detail>
</template>

<script>
import retirementDetail from './components/RetirementDetail'

export default {
  name: 'editretirement',
  components: { retirementDetail }
}
</script>
