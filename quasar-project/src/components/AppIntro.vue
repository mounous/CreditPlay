<template>
    <div class="q-pa-md" >
      <q-carousel style="display: flex;height: 100%;" v-model="slide"  vertical  transition-prev="slide-down"  transition-next="slide-up"  swipeable  animated   control-color="white"
        navigation-icon="radio_button_unchecked"    padding  arrows  class="bg-black text-white shadow-1 rounded-borders" >
        <q-carousel-slide v-for="i in slides" :key=Number(i) :name=i class="column no-wrap flex-center">
          <div style="display: flex;flex-direction: column;align-items: center;align-content: center;justify-content: space-around;justify-items: center;width: 100%;height:100%">
            <AppTeasing v-if="i==1" @tuto-teasing-finished="slide='4'"></AppTeasing>
            <div class="q-ma-md text-center" style="display: flex;flex-direction: column;align-items: center;" v-if="i==10">
              <th class="q-mt-md q-ml-md q-mr-md q-mb-xs" style="color: white;font-size:25px;">{{transStr(stringsIDs.str_tuto_icon)}}</th>
              <q-icon name="help" size="xl" class="q-ma-xl"></q-icon>
              <q-btn @click="emit('tuto-intro-finished')" label="OK" color="blue-grey-8"></q-btn>
            </div>
            <AppKnowledge v-if="i==5" @tuto-know-finished="slide='6'"></AppKnowledge>
            <AppExtra v-if="i==6" @tuto-extra-finished="slide='9'"></AppExtra>
            <AppCapabilities v-if="i==4" ></AppCapabilities>
            <ProcessExplainer  v-if="i==9" ></ProcessExplainer>
        </div>
        </q-carousel-slide>
      </q-carousel>
    </div>
</template>

<script setup>
import { ref,defineEmits } from 'vue'
import {stringsIDs,transStr} from '../stores/languages'
import ProcessExplainer from './ProcessExplainer.vue';
import AppCapabilities from './AppCapabilities.vue';
import AppTeasing from './AppTeasing.vue';
import AppKnowledge from './AppKnowledge.vue';
import AppExtra from './AppExtra.vue';
const emit=defineEmits(['tuto-intro-finished'])
var slide= ref('1');
var slides=   ref(['1','4','5','6','7','8','9','10']);


</script>
