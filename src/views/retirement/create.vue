<template>
  <retirement-detail :is-edit='false'></retirement-detail>
</template>

<script>
import retirementDetail from './components/RetirementDetail'

export default {
  name: 'createretirement',
  components: { retirementDetail }
}
</script>
