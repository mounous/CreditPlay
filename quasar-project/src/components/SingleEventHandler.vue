<template>
  <q-card style="width: 500px">
    <div>
      <q-carousel v-model="slide" transition-prev="scale" transition-next="scale" animated swipeable
        control-color="primary" class="rounded-borders" ref="carouselElement">
        <q-carousel-slide name="EvtMetaTypeSlide" class="column no-wrap flex-center">
          <q-btn label="Modulation" @click="[event_.metaType='Modulation',moveToNextSlide()]" color="primary"></q-btn>
          <q-btn label="Rachat" @click="[event_.metaType='Rachat',moveToNextSlide()]" color="primary"></q-btn>
        </q-carousel-slide>
        <q-carousel-slide name="EvtTypeSlide" class="column no-wrap flex-center" >
          <div>
          <SingleEventTypePicker @update-from-type-pick="[updateFromPicker($event),canValidateMod=true]" @can-finish="canValidateMod=$event['val']" ></SingleEventTypePicker>
          </div>
          <div class="row">
            <div class="q-ma-md">
              <q-btn label="retour" @click="moveToPrevSlide" color="primary"></q-btn>
            </div>

            <div class="q-ma-md">
              <q-btn label="Valider"  @click="
                sendFinish();
                " color="primary" :disable="canValidateMod==false"></q-btn>
            </div>
          </div>
        </q-carousel-slide>
        <q-carousel-slide name="Rachat" class="column no-wrap flex-center" >
          <div>
          <buyPicker @update-from-rebuy-pick="updateFromRebuyPicker($event)" @can-finish="canValidateRebuy=$event['val']"></buyPicker>
        </div>
            <div class="row">
            <div class="q-ma-md">
              <q-btn label="retour" @click="moveToPrevSlide" color="primary"></q-btn>
            </div>

            <div class="q-ma-md">
              <q-btn label="Valider"  @click="sendFinish()
                " :disable="canValidateRebuy==false" color="primary"></q-btn>
            </div>
          </div>

        </q-carousel-slide>
      </q-carousel>
    </div>
  </q-card>
</template>

<script setup>

import { ref ,defineEmits} from 'vue';
import { month_names } from '../utils/date_utility.js';
import {  apply_events_chain,build_event_name } from '../utils/credit_utility.js';
import SingleEventTypePicker from './SingleEventTypePicker.vue';
import buyPicker from './buyPicker.vue';
import { simu } from 'stores/store';
import { optionsReBuyType } from 'src/utils/bank_utility.js';
var canValidateMod=ref(false);
var canValidateRebuy=ref(false);
const carouselElement=ref(null);
const default_month_str = 'choisir un mois ';
const default_year_str = 'choisir une année';
var event_ = ref({
  title: '',
  type: 'Augmenter mensualité',
  year_str: default_year_str,
  month_str: default_month_str,
  year:2020,
  month:1,
  id: 1,
  selected: false,
  new_mens: -1.0,
  mensDiff:0,
  modVal:'',
  amortEvt: [],
  metaType:'',
  rebuyVal:'',
  reLoanDate:'',
  reLoanRate:0,
  reLoanPenalties:0,
  reloanDuration:0,
  savingsLeft:0,
});
const emit = defineEmits(['save-event']);


var slide = ref('EvtMetaTypeSlide');



const updateFromPicker=function(evtDataFromPicker){
  event_.value['type']=evtDataFromPicker['type'];
  event_.value['modVal']=evtDataFromPicker['modVal'];
  event_.value['mensDiff']=evtDataFromPicker['mensDiff'];
  event_.value['new_mens']=evtDataFromPicker['new_mens'];
  event_.value['selected']=false;
  event_.value['year']=evtDataFromPicker['year'];
  event_.value['month']=evtDataFromPicker['month'];
  event_.value['year_str']=String(evtDataFromPicker['year']);
  event_.value['month_str']=month_names[event_.value.month-1];
  console.log(evtDataFromPicker);
};
const updateFromRebuyPicker=function(evtDataFromPicker){
  event_.value['type']=evtDataFromPicker['rebuyType'];
  event_.value['rebuyVal']=evtDataFromPicker['rebuyVal'];
  event_.value['reloanRate']=evtDataFromPicker['reloanRate'];
  event_.value['rebuyPenalties']=evtDataFromPicker['rebuyPenalties'];
  event_.value['reloanDuration']=evtDataFromPicker['reloanDuration'];
  event_.value['year_str']=evtDataFromPicker['year_str'];
  event_.value['month_str']=evtDataFromPicker['month_str'];
  event_.value['year']=evtDataFromPicker['year'];
  event_.value['month']=evtDataFromPicker['month'];
  //rachat épargne
  if(event_.value.type==optionsReBuyType[0])
  {
    simu.value.credit.has_been_rebougth=true;
    event_.value['savingsLeft']=evtDataFromPicker['savingsLeft'];
  }
}
const sendFinish=function () {
  event_.value.title=build_event_name(event_.value.metaType);
  simu.value.events.push(event_.value);
  apply_events_chain();
    emit('save-event');
  };
const moveToNextSlide=function(move = true) {
    if (move) {
      if(slide.value=='EvtMetaTypeSlide' && event_.value.metaType=='Rachat')
      {
        carouselElement.value.goTo('Rachat')
      }
      else
      {
        carouselElement.value.next();
      }
    }
  };
const moveToPrevSlide=function() {
  if(slide.value=='Rachat')
  {
    carouselElement.value.goTo('EvtMetaTypeSlide');
  }
  else
  {
    carouselElement.value.previous();
  }
  };
</script>
<style>
.dateselector {
  min-width: 180px;
}

</style>
