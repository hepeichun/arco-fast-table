<template>
  <a-avatar trigger-type="mask">
    <img alt="avatar" :src="props.url"/>
    <template #trigger-icon>
      <icon-eye @click="preview" />
    </template>
  </a-avatar>
  <a-image-preview v-model:visible="visible" :src="props.url"/>
</template>

<script lang="ts" setup>
import {defineProps, ref} from "vue";

const props = defineProps({
  url: {
    type: String,
    default(){
      return '';
    },
  }
})

const visible = ref(false)

const preview = () => {
  visible.value = !visible.value;
}

</script>

<style lang="less" scoped>

</style>