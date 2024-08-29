<template>
    <div class="q-pa-md" >
      <q-carousel style="display: flex;height: 100%;" v-model="slide"  vertical  transition-prev="slide-down"  transition-next="slide-up"  swipeable  animated   control-color="white"
        navigation-icon="radio_button_unchecked"    padding  arrows  class="bg-black text-white shadow-1 rounded-borders" >
        <q-carousel-slide v-for="i in slides" :key=Number(i) :name=i class="column no-wrap flex-center">
          <div class="col q-mt-md text-center"  v-if="i<stringsIDs.str_tuto_process_9-stringsIDs.str_tuto">
            <th class="q-ma-md" style="color: white;font-size:25px;">{{transStr(stringsIDs.str_tuto+Number(i))}}</th>
          </div>
          <div class="col q-mt-md text-center"  v-if="i==10">
            <th class="q-ma-md" style="color: white;font-size:25px;">{{transStr(stringsIDs.str_tuto_icon)}}</th>
            <q-btn @click="emit('tuto-intro-finished')" label="OK" color="blue-grey-8"></q-btn>
          </div>
          <AppCapabilities v-if="i==stringsIDs.str_tuto_process_4-stringsIDs.str_tuto"></AppCapabilities>
          <ProcessExplainer  v-if="i==stringsIDs.str_tuto_process_9-stringsIDs.str_tuto" ></ProcessExplainer>
        </q-carousel-slide>
      </q-carousel>
    </div>
</template>

<script setup>
import { ref,defineEmits } from 'vue'
import {stringsIDs,transStr} from '../stores/languages'
import ProcessExplainer from './ProcessExplainer.vue';
import AppCapabilities from './AppCapabilities.vue';
const emit=defineEmits(['tuto-intro-finished'])
var slide= ref('1');
var slides=   ref(['1','2','3','4','5','6','7','8','9','10']);


</script>
