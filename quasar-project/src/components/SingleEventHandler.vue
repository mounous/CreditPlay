<template>
  <q-card style="width: 500px">
    <div>
      <q-carousel v-model="slide" transition-prev="scale" transition-next="scale" animated swipeable
        control-color="primary" class="rounded-borders" ref="carouselElement">
        <q-carousel-slide name="EvtNameSlide" class="column no-wrap flex-center">
          <q-input filled v-model="event_.title" label="Nom de l'événement" hint="exemple : Modulation 1" lazy-rules
            :rules="[(val) => validateEvtName(val) || 'Nom par défaut choisi']" />
          <div class="q-ma-md">
            <q-btn label="Valider" @click="[moveToNextSlide(), validateEvtName(event_.title)]" color="primary"></q-btn>
          </div>
        </q-carousel-slide>
        <q-carousel-slide name="EvtDateSlide" class="column no-wrap flex-center">
          <q-select class="dateselector" rounded outlined v-model="event_.year_str" :options="years_t"
            label="Année de l'évènement" :rules="[((val) => validateEvtYear(val) || 'année invalide'),monthoption]" />
          <q-select class="dateselector" rounded outlined v-model="event_.month_str" :options="month_t"
            label="Mois de l'évènement" :rules="[(val) => validateEvtMonth(val) || 'mois invalide']" />
          <div class="row">
            <div class="q-ma-md">
              <q-btn label="retour" @click="moveToPrevSlide" color="primary"></q-btn>
            </div>
            <div class="q-ma-md">
              <q-btn label="Valider" @click="
                moveToNextSlide(
                  validateEvtYear(event_.year_str) &&
                  validateEvtMonth(event_.month_str)
                )
                " color="primary"></q-btn>
            </div>
          </div>
        </q-carousel-slide>
        <q-carousel-slide name="EvtTypeSlide" class="column no-wrap flex-center" >
          <SingleEventTypePicker @update-from-type-pick="updateFromPicker($event)" :year-of-event="event_.year" :month-of-event="event_.month"></SingleEventTypePicker>>
          <div class="row">
            <div class="q-ma-md">
              <q-btn label="retour" @click="moveToPrevSlide" color="primary"></q-btn>
            </div>

            <div class="q-ma-md">
              <q-btn label="Valider" @click="
                moveToNextSlide(true)
                " color="primary"></q-btn>
            </div>
          </div>
        </q-carousel-slide>
        <q-carousel-slide name="EvtSaveSlide" class="column no-wrap flex-center">
          <q-btn label="Valider" @click="sendFinish()" color="primary" />
        </q-carousel-slide>
      </q-carousel>
    </div>
  </q-card>
</template>

<script setup>

import { ref ,defineEmits} from 'vue';
import { month_names,getMonthNbr } from '../pages/date_utility.js';
import {  apply_events_chain } from '../pages/credit_utility.js';
import SingleEventTypePicker from './SingleEventTypePicker.vue';
import { simu } from 'stores/store';
const carouselElement=ref(null);
const default_month_str = 'choisir un mois ';
const default_year_str = 'choisir une année';
var month_t = ref(['Janvier']);
var years_t = ref(['2030']);
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
});
const emit = defineEmits(['save-event']);
const yearoption = function () {
  var currentY = Number(simu.value.credit.startingDate.slice(0,4));
  console.log(currentY);
  years_t.value = [];
  for (let year = currentY ; year < currentY + simu.value.credit.year; year++) {
    years_t.value.push(year.toString());
  }
};
const monthoption = function () {
  month_t.value = [];
  if((simu.value.credit.startingDate.slice(0,4))!=event_.value.year)
  {
    for (let m = 0; m < month_names.length; m++) {
      month_t.value.push(month_names[m]);
    }
  }
  else
  {
    for (let m = Number(simu.value.credit.startingDate.slice(5,7)); m < month_names.length; m++) {
      month_t.value.push(month_names[m]);
    }
  }
};
yearoption();
monthoption();

var slide = ref('EvtNameSlide');



const validateEvtName = function (nom) {
  if (nom.length == 0) {
    event_.value['title'] = 'Modulation';
  } else {
    event_.value['title'] = nom;
  }
  moveToNextSlide(true);
  return true;
};

const validateEvtYear=function(val) {
  if (val == default_year_str) {
    return false;
  }
  event_.value['year']=Number(event_.value.year_str);
  return true;
};
const validateEvtMonth=function(val) {
  if (val == default_month_str) {
    return false;
  }
  event_.value['month']=getMonthNbr(event_.value.month_str);
  return true;
};

const updateFromPicker=function(evtDataFromPicker){
  event_.value['type']=evtDataFromPicker['type'];
  event_.value['modVal']=evtDataFromPicker['modVal'];
  event_.value['mensDiff']=evtDataFromPicker['mensDiff'];
  event_.value['new_mens']=evtDataFromPicker['new_mens'];
  event_.value['selected']=false;
  console.log(evtDataFromPicker);
};
const sendFinish=function () {
  simu.value.events.push(event_.value);
  apply_events_chain();
    emit('save-event');
  };
const moveToNextSlide=function(move = true) {
    if (move) {
      carouselElement.value.next();
    }
  };
const moveToPrevSlide=function() {
  carouselElement.value.previous();
  };
</script>
<style>
.dateselector {
  min-width: 180px;
}

</style>
