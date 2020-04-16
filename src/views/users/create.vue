<template>
  <users-detail :is-edit='false'></users-detail>
</template>

<script>
import UsersDetail from './components/UsersDetail'

export default {
  name: 'createUsers',
  components: { UsersDetail }
}
</script>
