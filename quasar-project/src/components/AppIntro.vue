<template>
    <div style="display: flex;flex-direction: column;" >
      <div style="display: flex;flex-direction: column;align-items: center;align-content: center;justify-content: space-around;justify-items: center;height: 7%;">
          <q-btn v-if="slide!='1'" icon="keyboard_arrow_up" size="20px" style="background-color:black;color: white;"  ref="myIconUp" @click="myCarousel.previous()"></q-btn>
      </div>
      <q-carousel ref="myCarousel" style="display: flex;height: 86%" v-model="slide"  vertical  transition-prev="slide-down"  transition-next="slide-up"  swipeable  animated
        class="bg-black text-white rounded-borders" >
        <q-carousel-slide v-for="i in slides" :key=Number(i) :name=i class="column no-wrap flex-center">
          <div style="display: flex;flex-direction: column;align-items: center;align-content: center;justify-content: space-around;justify-items: center">
            <AppTeasing v-if="i==1" @tuto-teasing-finished="startShake()"></AppTeasing>
            <AppCapabilities v-if="i==2" @cap-finished="startShake()" ></AppCapabilities>
            <AppKnowledge v-if="i==3" @tuto-know-finished="startShake()"></AppKnowledge>
            <AppExtra v-if="i==4" @tuto-extra-finished="startShake()"></AppExtra>
            <ProcessExplainer  v-if="i==5" @explained-end="startShake()"></ProcessExplainer>
            <AppOutro v-if="i==6" @tuto-outro-finished="emit('tuto-intro-finished')" ></AppOutro>
          </div>
        </q-carousel-slide>
      </q-carousel>
      <div style="display: flex;flex-direction: column;align-items: center;align-content: center;justify-content: space-around;justify-items: center;height: 7%">
          <q-btn v-if="slide!='6'" :class="{ shake: shakeThis }"  icon="keyboard_arrow_down" size="20px" style="background-color:black;color: white;"  ref="myIconDown" @click="[myCarousel.next(),stopShake()]"></q-btn>
      </div>
    </div>
</template>

<script setup>
import AppOutro from './AppOutro.vue';
import { ref,defineEmits } from 'vue'
import ProcessExplainer from './ProcessExplainer.vue';
import AppCapabilities from './AppCapabilities.vue';
import AppTeasing from './AppTeasing.vue';
import AppKnowledge from './AppKnowledge.vue';
import AppExtra from './AppExtra.vue';
var myCarousel=ref();
var myIconUp=ref();
var myIconDown=ref();
const emit=defineEmits(['tuto-intro-finished'])
var slide= ref('1');
var slides=   ref(['1','2','3','4','5','6']);
var shakeThis=ref(false);
var id_destroy=ref();
const shake=function()
{
  shakeThis.value=!shakeThis.value;
}
const startShake=function()
{
  shakeThis.value=true;
  id_destroy.value=setInterval(shake,2500);
}
const stopShake=function()
{
  shakeThis.value=false;
  clearInterval(id_destroy.value);
}
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
