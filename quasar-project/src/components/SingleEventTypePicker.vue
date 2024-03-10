<template>
  <div>
    <p>Capital restant du à la date de l'évènement : {{situationAtDate }}</p>
  </div>
  <div>
    <q-select
      rounded
      outlined
      v-model="event_type"
      :options="optionsEvtType"
      label="choisir une action"
      @update:model-value="getopt"
    />
    <div class="row">
      <div class="q-ma-md">
        <q-select
          class="evtTypeVal"
          rounded
          outlined
          v-model="modVal"
          :options="options_mod"
          label="choisir une mensualité"
          :disable="
            event_type != optionsEvtType[0] &&
            event_type != optionsEvtType[1]
          "
          @update:model-value="sendPicked(validateMod())"
        ></q-select>
      </div>


    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue';
import {provideModOptions,returnBaseData,optionsEvtType} from '../pages/credit_utility.js'
const props = defineProps({yearOfEvent : Number,monthOfEvent:Number});

console.log(props);
var event_type = ref('Sélectionnez une action');
var modVal = ref('undefined');
var mensDiff=ref(0);
var new_mens=ref(0);
const emit = defineEmits(['update-from-type-pick']);
var options_mod = ref([]);
const getopt=function(){
  options_mod.value=provideModOptions(event_type.value,props.yearOfEvent,props.monthOfEvent);
};

var situationAtDate=ref(returnBaseData(props.yearOfEvent,props.monthOfEvent).capital_left.toString());

const validateMod = function () {
  if (
    (event_type.value == optionsEvtType[0] ||
      event_type.value == optionsEvtType[1]) &&
      modVal.value != 'undefined'
  ) {
    mensDiff.value=Number(modVal.value.split('(')[1].split('mois')[0]);
    new_mens.value=Number(modVal.value.split('€')[0])
    return true;
  }
  return false;
};


const sendPicked = function (bmove) {
  if (bmove) {
    emit('update-from-type-pick', { type:event_type.value,modVal:modVal.value,mensDiff:mensDiff.value,new_mens:new_mens.value});
  }
};


</script>



<style>
.evtTypeVal {
  min-width: 180px;
}
</style>
