<template>
    <div class="q-pa-md" @click="automatic_scroll=!automatic_scroll">
      <q-carousel style="display: flex;height: 100%;" v-model="slide"  vertical  transition-prev="slide-down"  transition-next="slide-up"  swipeable  animated   control-color="white"
        navigation-icon="radio_button_unchecked"    padding  arrows  class="bg-black text-white shadow-1 rounded-borders" >
        <q-carousel-slide v-for="i in slides" :key=Number(i) :name=i class="column no-wrap flex-center">
          <div class="col q-mt-md text-center">
            <th class="q-ma-md" style="color: white;font-size:25px;">{{transStr(stringsIDs.str_tuto+Number(i))}}</th>
            <div v-if="i==stringsIDs.str_tuto_process_9-stringsIDs.str_tuto">
              <q-btn @click.stop class="q-ma-md" size="large" :label="transStr(stringsIDs.str_tuto_play)" color='blue-grey-8' @click="emit('show-tuto')"></q-btn>
              <q-btn @click.stop class="q-ma-md" size="large" :label="transStr(stringsIDs.str_tuto_giveUp)" color='blue-grey-8' @click="emit('skip-tuto')"></q-btn>
            </div>
          </div>
        </q-carousel-slide>
      </q-carousel>
    </div>
</template>

<script setup>
import { ref, onBeforeMount, onBeforeUnmount,defineEmits } from 'vue'
import {stringsIDs,transStr} from '../stores/languages'
var automatic_scroll=ref(true);
var Id_destroy=ref();
var slide= ref('1');
var currentSlide=ref(1);
const emit=defineEmits(['show-tuto','skip-tuto']);
var slides=   ref(['1','2','3','4','5','6','7','8','9']);
var times_sec=ref([2,   2,  2,  9,  8,  8,  4,  5,  -1  ]);
const roll =function()
{
  if(Number(slide.value)!=stringsIDs.str_tuto_process_9-stringsIDs.str_tuto)
  {
    if(automatic_scroll.value==true)
    {
      clearInterval(Id_destroy.value);
      if(times_sec.value[ currentSlide.value]!=-1)
      {
        Id_destroy.value=setInterval(roll,times_sec.value[ currentSlide.value]*1000);
      }
      currentSlide.value++;
      slide.value=currentSlide.value.toString();
    }
    else
    {
      currentSlide.value=Number(slide.value);
    }
  }
  else
  {
    clearInterval(Id_destroy.value);
  }
}

const startup=function()
{
  Id_destroy.value=setInterval(roll,times_sec.value[0]*1000);
}
onBeforeMount(startup);
const destroy=function()
{
  clearInterval(Id_destroy.value);
}
onBeforeUnmount(destroy);

</script>
