<template>
    <div class="q-pa-md" >
      <q-carousel ref="myCarousel" style="display: flex;height: 100%;" v-model="slide"  vertical  transition-prev="slide-down"  transition-next="slide-up"  swipeable  animated   control-color="white"
        navigation-icon="radio_button_unchecked"    padding  arrows  class="bg-black text-white shadow-1 rounded-borders" >
        <q-carousel-slide v-for="i in slides" :key=Number(i) :name=i class="column no-wrap flex-center">
          <div style="display: flex;flex-direction: column;align-items: center;align-content: center;justify-content: space-around;justify-items: center;width: 100%;height:100%">
            <AppTeasing v-if="i==1" @tuto-teasing-finished="[slide='2',test()]"></AppTeasing>
            <AppCapabilities v-if="i==2" ></AppCapabilities>
            <AppKnowledge v-if="i==3" @tuto-know-finished="slide='4'"></AppKnowledge>
            <AppExtra v-if="i==4" @tuto-extra-finished="slide='5'"></AppExtra>
            <ProcessExplainer  v-if="i==5" ></ProcessExplainer>
            <AppOutro v-if="i==6" @tuto-outro-finished="emit('tuto-intro-finished')" ></AppOutro>
          </div>
        </q-carousel-slide>
      </q-carousel>
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
const emit=defineEmits(['tuto-intro-finished'])
var slide= ref('1');
var slides=   ref(['1','2','3','4','5','6']);

const test=function()
{
  console.log(myCarousel.value)
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
