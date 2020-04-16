<template>
  <el-col :span="24" :show-timeout="100" >
    <el-form-item style="margin-bottom: 40px;" label="Instagram:">
      <MDinput name="name"  required :maxlength="100">
      </MDinput>
    </el-form-item>
  </el-col>

</template>

<script>
import MDinput from '@/components/MDinput'
export default {
  name: 'redsocial',
  components: { MDinput },
  data() {
  },
}
</script>
