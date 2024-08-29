<template>
   <div class="q-pa-md" style="background-color: black;display: flex; flex-direction: column;align-items: center;justify-content: center;">
    <th class="q-ma-md" style="color: white;font-size:20px;">{{transStr(stringsIDs.str_tuto_process_10)}}</th>
    <q-stepper v-model="step" vertical style="background-color: black;" inactive-color="blue-grey-8" done-color="green" active-color="blue-grey-8" animated >
      <q-step :name="1"  :title=transStr(stringsIDs.str_tuto_process_11) :caption=transStr(stringsIDs.str_tuto_process_12)       active-icon="feed" icon="feed"              :done="step > 1">  </q-step>
      <q-step :name="2"  :title=transStr(stringsIDs.str_tuto_process_13) :caption=transStr(stringsIDs.str_tuto_process_14)       active-icon="feed" :done="step > 2" > </q-step>
      <q-step :name="3"  :title=transStr(stringsIDs.str_tuto_process_15) :caption=transStr(stringsIDs.str_tuto_process_16)       icon="toc"              active-icon="feed" :done="step>3" > </q-step>
      <q-step :name="4"  :title=transStr(stringsIDs.str_tuto_process_17)                                                         icon="import_export"              active-icon="feed" :done="step>4" > </q-step>
      <q-step :name="5"  :title=transStr(stringsIDs.str_tuto_process_18) :caption=transStr(stringsIDs.str_tuto_process_19)       icon="bar_chart"        active-icon="feed" :done="step>5" >  </q-step>
    </q-stepper>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, onBeforeUnmount } from 'vue'

import { stringsIDs,transStr } from 'src/stores/languages';
var Id_destroy=ref();
const emit=defineEmits(['process-finished']);

const roll =function()
{
  step.value++;
  if(step.value==7)
  {
    step.value=1;
  }
}

const startup=function()
{
  Id_destroy.value=setInterval(roll,1500);
}
onBeforeMount(startup);
const destroy=function()
{
  clearInterval(Id_destroy.value);
}
onBeforeUnmount(destroy);
var step= ref(1);
</script>
