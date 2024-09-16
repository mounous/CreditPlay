<template>
  <!--span v-if="show_tuto==true" style="color:white;text-align: center;font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;font-size: 20px;">{{ props.txt }}</span!-->
  <!--span v-if="show_tuto==true" style="color:white;text-align: center;font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;font-size: 20px;">{{ props.txt }}</span!-->
  <div v-if="props.xl==false">
    <transition name="bounce">
      <span v-if="show_tuto==true && show==true" style="color:white;text-align: center;font-family:Arial, Helvetica, sans-serif;font-size: 20px;">{{ props.txt }}</span>
    </transition>
  </div>
  <div v-if="props.xl==true">
    <transition name="bounce">
      <span v-if="show_tuto==true && show==true" style="color:white;text-align: center;font-family:Arial, Helvetica, sans-serif;font-size: 25px;">{{ props.txt }}</span>
    </transition>
  </div>
</template>

<script setup>
import { defineProps,onMounted,ref } from 'vue';
import { show_tuto } from 'src/stores/store';

var show=ref(false);
const setShow=function()
{
  show.value=true;
}
onMounted(setShow)
var props=defineProps
(
  { txt:String,
    xl:{type :Boolean,default:false}
  }
);
</script>
<style>
.bounce-enter-active {
  animation: bounce-in .8s;
}
.bounce-leave-active {
  animation: bounce-in .6s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
</style>
