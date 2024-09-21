<template>
    <div class="q-ma-md text-center" style="display: flex;flex-direction: column;align-items: center;" >
      <th class="q-mt-md q-ml-md q-mr-md q-mb-xs" style="color: white;font-size:25px;">{{transStr(stringsIDs.str_tuto_icon)}}</th>
      <q-icon name="help" size="xl" class="rotating q-ma-xl"></q-icon>
      <shakeBtn @click="emit('tuto-outro-finished')"  btn-label='OK'></shakeBtn>
    </div>
</template>

<script setup>
import shakeBtn from './shakeBtn.vue';
import {defineEmits } from 'vue'
import {stringsIDs,transStr} from '../stores/languages'

const emit=defineEmits(['tuto-outro-finished']);

</script>

<style scoped lang="css">

@-webkit-keyframes rotating /* Safari and Chrome */ {
  from {
    -webkit-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes rotating {
  from {
    -ms-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -webkit-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  to {
    -ms-transform: rotate(360deg);
    -moz-transform: rotate(360deg);
    -webkit-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
.rotating {
  -webkit-animation: rotating 1.5s linear ;
  -moz-animation: rotating 1.5s linear ;
  -ms-animation: rotating 1.5s linear ;
  -o-animation: rotating 1.5s linear ;
  animation: rotating 1.5s linear ;
}

</style>

