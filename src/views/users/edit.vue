<template>
  <users-detail :is-edit='true'></users-detail>
</template>

<script>
import UsersDetail from './components/UsersDetail'

export default {
  name: 'editUsers',
  components: { UsersDetail }
}
</script>
