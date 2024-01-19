<template>
  <div>
    <q-select
      rounded
      outlined
      v-model="event_type"
      :options="optionsType"
      label="choisir une action"
      @update:model-value="getopt"
    />
    <div class="row">
      <div class="q-ma-md">
        <q-select
          class="evtTypeVal"
          rounded
          outlined
          v-model="new_mens"
          :options="options_mens"
          label="choisir une mensualité"
          :disable="
            event_type != 'Augmenter mensualité' &&
            event_type != 'Réduire mensualité'
          "
          @update:model-value="sendPicked(validateEvtMens())"
        ></q-select>
      </div>

      <div class="q-ma-md">
        <q-select
          class="evtTypeVal"
          rounded
          outlined
          v-model="new_dur"
          :options="options_years"
          label="choisir une année de fin"
          :disable="
            event_type != 'Augmenter la durée' &&
            event_type != 'Réduire la durée'
          "
          @update:model-value="sendPicked(validateEvtDur())"
        ></q-select>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue';
import {provideYearOptions,provideMensOptions} from '../pages/credit_utility.js'
const props = defineProps({yearOfEvent : String,monthOfEvent:String});
console.log(props);
var event_type = ref('Sélectionnez une action');
var new_dur = ref('undefined');
var new_mens = ref(-1);
const emit = defineEmits(['update-from-type-pick']);
var options_mens = ref([]);
var options_years = ref([]);
const getopt=function(){
  options_years.value=provideYearOptions(event_type.value);
  options_mens.value=provideMensOptions(event_type.value);
};

var optionsType = [
  'Augmenter mensualité',
  'Réduire mensualité',
  'Augmenter la durée',
  'Réduire la durée',
];
const validateEvtMens = function () {
  if (
    (event_type.value == 'Augmenter mensualité' ||
      event_type.value == 'Réduire mensualité') &&
    new_mens.value != -1.0
  ) {
    new_dur.value = 'undefined';
    return true;
  }
  return false;
};
const validateEvtDur = function () {
  if (
    (event_type.value == 'Augmenter la durée' ||
      event_type.value == 'Réduire la durée') &&
    new_dur.value != 'undefined'
  ) {
    new_mens.value = -1;
    return true;
  }
  return false;
};

const sendPicked = function (bmove) {
  if (bmove) {
    emit('update-from-type-pick', { type:event_type, mens:new_mens, dur:new_dur });
  }
};
</script>
<style>
.evtTypeVal {
  min-width: 180px;
}
</style>
