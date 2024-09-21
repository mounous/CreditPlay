<template>
    <div style="display:flex;flex-direction: column;align-items: center;align-content: center;justify-content: center;justify-items: center;width: 100%;height: 100%;" >
        <transition name="bounce">
          <th class="q-ma-md text-center" style="color: white;font-size:25px;" v-if="initPhase>=0 && initPhase<3">{{transStr(stringsIDs.str_tuto+5)}}</th>
        </transition>
        <transition name="enter">
          <th class="q-ma-md text-center" style="color: white;font-size:20px;" v-if="initPhase>=1 && initPhase<3">{{transStr(stringsIDs.str_did_u_know_1)}}</th>
        </transition>
        <transition name="enter">
          <th class="q-ma-md text-center" style="color: white;font-size:20px;" v-if="initPhase>=2 && initPhase<3">{{transStr(stringsIDs.str_did_u_know_2)}}</th>
        </transition>
    </div>
</template>

<script setup>
import { ref,defineEmits,onMounted } from 'vue'
import {stringsIDs,transStr} from '../stores/languages'

const emit=defineEmits(['tuto-know-finished']);
//var myscrolling=ref();
var initPhase=ref(1);

var destroy_id=ref();
const getOut=function()
{
  emit('tuto-know-finished');
}
const play=function()
{
  initPhase.value++;
  if(initPhase.value==3)
  {
    clearInterval(destroy_id.value) ;
    setTimeout(getOut,250);
  }
}
const launchAnimation=function()
{
  initPhase.value=0;
  destroy_id.value=setInterval(play,2500);
}
onMounted(launchAnimation);
</script>

<style>
.bounce-enter-active {
  animation: bounce-in .5s;
}
.bounce-leave-active {
  animation: bounce-in .5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(2);
  }
  100% {
    transform: scale(1);
  }
}

.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>

