<template>
  <client-detail :is-edit='true'></client-detail>
</template>

<script>
import clientDetail from './components/ClientDetail'

export default {
  name: 'editClient',
  components: { clientDetail }
}
</script>
