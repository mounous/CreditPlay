<template>
   <div style="display: flex;flex-direction: column;align-items: center;align-content:center;justify-content: center;justify-items: center;">
      <th class="q-ma-md" style="color: white;font-size:20px;">{{transStr(stringsIDs.str_tuto_save_proc_intro)}}</th>
        <q-stepper v-model="step" vertical style="background-color: black;" inactive-color="blue-grey-8" done-color="green" active-color="blue-grey-8" animated  >
        <q-step :name="1"  :title=transStr(stringsIDs.str_tuto_save_proc_1) :caption=transStr(stringsIDs.str_tuto_save_proc_2)       active-icon="feed" icon="feed" :done="step > 1">  </q-step>
        <q-step :name="2"  :title=transStr(stringsIDs.str_tuto_save_proc_3) :caption=transStr(stringsIDs.str_tuto_save_proc_4)       active-icon="feed" icon="feed" :done="step > 2" > </q-step>
        <q-step :name="3"  :title=transStr(stringsIDs.str_tuto_save_proc_5) :caption=transStr(stringsIDs.str_tuto_save_proc_6)       active-icon="feed" icon="feed" :done="step>3" > </q-step>
      </q-stepper>
      <shakeBtn  class="q-ma-md" btn-label=">>"></shakeBtn>
      </div>
</template>

<script setup>

import shakeBtn from 'src/components/shakeBtn.vue';
import { ref, onBeforeMount, onBeforeUnmount } from 'vue'
import { stringsIDs,transStr } from 'src/stores/languages';

var Id_destroy=ref();


const roll =function()
{
  step.value++;
  if(step.value==5)
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
