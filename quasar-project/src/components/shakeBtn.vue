<template>
  <q-btn rounded  color="blue-grey-8" :label=props.btnLabel :class="{ shake: enabled }"></q-btn>
</template>

<script setup>
import { ref, onMounted, defineProps, onBeforeUnmount } from 'vue';
const id_destroy=ref(0);
const enabled=ref(false);
const props = defineProps({
  btnLabel: String
})
const shake=function()
{
  enabled.value=!enabled.value;
}
const start=function()
{
  id_destroy.value=setInterval(shake,3500);
}
const stop=function()
{
  clearInterval(id_destroy.value);
}
onMounted(start);
onBeforeUnmount(stop);
</script>
<style lang="css">
.shake {
  animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  transform: translate3d(0, 0, 0);
}

@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }

  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}

</style>
