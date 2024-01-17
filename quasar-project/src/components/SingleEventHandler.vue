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
        <q-carousel-slide name="EvtTypeSlide" class="column no-wrap flex-center">
          <q-select rounded outlined v-model="event_.type" :options="optionsType" label="choisir une action" />
          <div class="row">
            <div class="q-ma-md">
              <q-select class="evtTypeVal" rounded outlined v-model="event_.new_mens" :options="options_mens"
                label="choisir une mensualité" :disable="event_.type != 'Augmenter mensualité' &&
                  event_.type != 'Réduire mensualité'
                  " ref="evtTypeValMens"></q-select>
            </div>

            <div class="q-ma-md">
              <q-select class="evtTypeVal" rounded outlined v-model="event_.new_dur" :options="options_years"
                label="choisir une année de fin" :disable="event_.type != 'Augmenter la durée' &&
                  event_.type != 'Réduire la durée'
                  " ref="evtTypeValYears"></q-select>
            </div>
          </div>
          <div class="row">
            <div class="q-ma-md">
              <q-btn label="retour" @click="moveToPrevSlide" color="primary"></q-btn>
            </div>

            <div class="q-ma-md">
              <q-btn label="Valider" @click="
                moveToNextSlide(
                  validateEvtDur(event_) || validateEvtMens(event_)
                )
                " color="primary"></q-btn>
            </div>
          </div>
        </q-carousel-slide>
        <q-carousel-slide name="EvtDateSlide" class="column no-wrap flex-center">
          <q-select class="dateselector" rounded outlined v-model="event_.year" :options="years_t"
            label="Année de l'évènement" :rules="[(val) => validateEvtYear(val) || 'année invalide']" />
          <q-select class="dateselector" rounded outlined v-model="event_.month" :options="month_t"
            label="Mois de l'évènement" :rules="[(val) => validateEvtMonth(val) || 'mois invalide']" />
          <div class="row">
            <div class="q-ma-md">
              <q-btn label="retour" @click="moveToPrevSlide" color="primary"></q-btn>
            </div>
            <div class="q-ma-md">
              <q-btn label="Valider" @click="
                moveToNextSlide(
                  validateEvtYear(event_.year) &&
                  validateEvtMonth(event_.month)
                )
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
import { SessionStorage } from 'quasar';
import { ref ,defineEmits} from 'vue';
import { month_names, sortEvents } from '../pages/credit_utility.js';
const carouselElement=ref(null);
const default_month_str = 'choisir un mois ';
const default_year_str = 'choisir une année';
var month_t = ref(['Janvier']);
var years_t = ref(['2030']);
const emit = defineEmits(['save-event']);
const yearoption = function () {
  var credit_length = SessionStorage.getItem('years');
  var currentY = new Date().getFullYear();
  years_t.value = [];
  for (let year = currentY + 1; year < currentY + credit_length; year++) {
    years_t.value.push(year.toString());
  }
};
const monthoption = function () {
  month_t.value = [];
  for (let m = 0; m < month_names.length; m++) {
    month_t.value.push(month_names[m]);
  }
};
yearoption();
monthoption();

var slide = ref('EvtNameSlide');
var options_mens = ['900', '1000', '2000'];
var options_years = ['1', '2', '3', '4'];
var optionsType = [
  'Augmenter mensualité',
  'Réduire mensualité',
  'Augmenter la durée',
  'Réduire la durée',
];


var event_ = ref({
  title: '',
  type: 'Augmenter mensualité',
  year: default_year_str,
  month: default_month_str,
  id: 1,
  selected: true,
  new_mens: -1.0,
  new_dur: 'undefined',
});

const validateEvtName = function (nom) {
  slide.value = 'EvtTypeSlide';
  if (nom.length == 0) {
    event_.value['title'] = 'Modulation';
  } else {
    event_.value['title'] = nom;
  }
  return true;
};

const validateEvtMens=function (event_in) {
  if (
    (event_in.type == 'Augmenter mensualité' ||
      event_in.type == 'Réduire mensualité') &&
    event_in.new_mens != -1.0
  ) {
    return true;
  }
  return false;
};
const validateEvtDur=function(event_in) {
  if (
    (event_in.type == 'Augmenter la durée' ||
      event_in.type == 'Réduire la durée') &&
    event_in.new_dur != 'undefined'
  ) {
    return true;
  }
  return false;
};
const validateEvtYear=function(val) {
  if (val == default_year_str) {
    return false;
  }
  return true;
};
const validateEvtMonth=function(val) {
  if (val == default_month_str) {
    return false;
  }
  return true;
};
const saveEventsubmit=function() {
  console.log('saveEventsubmit');
  if (!SessionStorage.has('events')) {
    //first event registered
    var events = [event_.value];
  } else {
    var events = SessionStorage.getItem('events');
    events.push(event_.value);
  }
  SessionStorage.set('events', sortEvents(events));
  console.log('saveEventsubmitEnd');
  return events;
};

const sendFinish=function () {

    emit('save-event', saveEventsubmit());
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

.evtTypeVal {
  min-width: 180px;
}
</style>
