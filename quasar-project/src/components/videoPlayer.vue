<template>

  <shakeBtn v-if="play==false" :btn-label=transStr(stringsIDs.str_tuto_video)  @click="play=true"></shakeBtn>
  <q-card style="background-color: black;width: 100%;">
      <q-video v-if="play==true" :src=videosrc  />
  </q-card>
</template>

<script setup>
import shakeBtn from 'src/components/shakeBtn.vue';
import { onBeforeMount,ref,defineProps } from 'vue';
import {getLangId,transStr,stringsIDs,FRENCH_ID} from '../stores/languages'
var play=ref(false);
var videosrc=ref('');
const props = defineProps({
  name: Number
})
const setupVideo=function()
{
  if(props.name==stringsIDs.str_simulate_credit)
  {
    if(getLangId()==FRENCH_ID)
    {
      videosrc.value='https://www.youtube.com/embed/sixo83vrOF8';
    }
    else
    {
      videosrc.value='https://www.youtube.com/embed/yFX_QoSTmC0?si=Ph-hl7ZKy09QN4mW';
    }
  }
  if(props.name==stringsIDs.str_modulate_credit)
  {
    if(getLangId()==FRENCH_ID)
    {
      videosrc.value='https://www.youtube.com/embed/FwObaGbUlSs?si=dU0xatI78_kkjNNa';
    }
    else
    {
      videosrc.value='https://www.youtube.com/embed/EIoL0ZnZjFY?si=gpBlRTapczyg97Gu';
    }
  }
  if(props.name==stringsIDs.str_reloan_credit)
  {
    if(getLangId()==FRENCH_ID)
    {
      videosrc.value='https://www.youtube.com/embed/DtbNvEapgKU?si=PMxZfforMl1jjTES';
    }
    else
    {
      videosrc.value='https://youtube.com/embed/VcbevJl37M8?si=1GKY8L4mY44FRFdE';
    }
  }
  if(props.name==stringsIDs.str_savings_help)
  {
    if(getLangId()==FRENCH_ID)
    {
      videosrc.value='https://www.youtube.com/embed/CsJbUS5z_XU?si=9bPWDA1TeqLkdQ1n';
    }
    else
    {
      videosrc.value='https://www.youtube.com/embed/CfWYyYQlg4g?si=kmWkliEMQzvepdY9';
    }
  }
  if(props.name==stringsIDs.str_rebuy_savings_help)
  {
    if(getLangId()==FRENCH_ID)
    {
      videosrc.value='https://www.youtube.com/embed/BQwLXegnkTs?si=8TSc_CfHg-LyHAt9';
    }
    else
    {
      videosrc.value='https://www.youtube.com/embed/x1PNnoaFNVM?si=ORMybfS7mPNxuh5o';
    }
  }
}
onBeforeMount(setupVideo);
</script>
