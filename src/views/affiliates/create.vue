<template>
  <client-detail :is-edit='false'></client-detail>
</template>

<script>
import clientDetail from './components/ClientDetail'

export default {
  name: 'createClient',
  components: { clientDetail }
}
</script>
