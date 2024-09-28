<template>
   <div class="q-pa-md" style="background-color: black;display: flex; flex-direction: column;align-items: center;justify-content: center;" :key="stepN">
    <th style="color: white;font-size:18px;">{{transStr(stringsIDs.str_tuto_process_10)}}</th>
    <div style="display: flex;flex-direction: column ;align-content:flex-start ;align-items: flex-start;justify-content: flex-start;justify-items: flex-start;">
      <div v-for="step in steps" :key="step.id" class="row q-mt-md q" style="flex-wrap: nowrap;">
        <div style="display: flex;flex-direction: row;align-items: center;justify-content: center;justify-items: center;align-content: center;" class="q-mr-md">
          <q-icon name="check" size="xx-large" :class="{active:step.id<=stepN}" ></q-icon>
          <!--q-icon name="check" size="xx-large" class="active" ></q-icon!-->
        </div>
        <div style="display: flex;flex-direction: column;">
          <th style="font-size: 17px;text-align: left;" :class="{active:step.id<=stepN}"> {{ step.title }}</th>
          <th style="font-size: 14px;text-align: left;" :class="{active:step.id<=stepN}"> {{ step.caption }}</th>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, onBeforeUnmount,defineEmits } from 'vue'

import { stringsIDs,transStr } from 'src/stores/languages';

var steps=ref([
  {id:1,  title :transStr(stringsIDs.str_tuto_process_11),   caption:transStr(stringsIDs.str_tuto_process_12)},
  {id:2,  title :transStr(stringsIDs.str_tuto_process_13),   caption:''},
  {id:3,  title :transStr(stringsIDs.str_tuto_process_15),   caption:transStr(stringsIDs.str_tuto_process_16)},
  {id:4,  title :transStr(stringsIDs.str_tuto_process_17),   caption:''},
  {id:5,  title :transStr(stringsIDs.str_tuto_process_18),   caption:transStr(stringsIDs.str_tuto_process_19)},
])

var stepN= ref(0);
var Id_destroy=ref();
var mustLaunchEvt=ref(true);
var emit=defineEmits(['explained-end'])
var display2=ref(stepN.value>=2)
const roll =function()
{
  display2.value=true;
  stepN.value++;
  if(stepN.value==7)
  {
    if(mustLaunchEvt.value)
    {
      mustLaunchEvt.value=false;
      emit('explained-end');
    }
    stepN.value=0;
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

</script>
<style lang="scss">
.inactive
{
  background-color: black;
  color: rgb(48, 58, 66);
};
.active
{
  background-color: black;
  color: green;
};
</style>
