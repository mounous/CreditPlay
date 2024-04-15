<template>
  <q-input class="q-ma-md" dense style="max-width: 100px;" label="Date de modulation" bg-color="blue-grey-8" filled v-model="date_mod" mask="date" >
    <template v-slot:append>
      <q-icon name="event" class="cursor-pointer">
        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
          <q-date dark v-model="date_mod" :locale="formatCalendar" :navigation-min-year-month="mod_min_date"
            width="200px" :navigation-max-year-month="mod_max_date" :default-year-month="mod_min_date" @update:model-value="validateModDate()">
            <div class="row items-center justify-end" >
              <q-btn v-close-popup label="Fermer" color="primary" flat />
            </div>
          </q-date>
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
  <div v-if="event_y != 0 && event_m != 0">
    <p>Capital restant du à la date de l'évènement : {{ situationAtDate }}</p>
  </div>
  <div v-if="event_y != 0 && event_m != 0">
    <q-select rounded outlined v-model="event_type" :options="optionsEvtType" label="choisir une action"
      @update:model-value="getopt" />
    <div v-if="event_y != 0 && event_m != 0" class="row">
      <div class="q-ma-md">
        <q-select class="evtTypeVal" rounded outlined v-model="modVal" :options="options_mod"
          label="choisir une mensualité" :disable="event_type != optionsEvtType[0] &&
    event_type != optionsEvtType[1]
    " @update:model-value="sendPicked(validateMod())"></q-select>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue';
import { provideModOptions, returnBaseData, optionsEvtType,getLatestMensuality,getEraliestNewEventDate } from '../pages/credit_utility.js'
import { formatCalendar } from 'src/pages/calendar_utility';
import { useQuasar } from 'quasar';
import{subOneMonthToStringDate,addOneMonthToStringDate} from '../pages/date_utility'
var event_type = ref('Sélectionnez une action');
var modVal = ref('undefined');
var mensDiff = ref(0);
var new_mens = ref(0);
var event_y=ref(0);
var event_m=ref(0);
var mod_max_date=ref(subOneMonthToStringDate(getLatestMensuality().l_y.toString()+'/'+getLatestMensuality().l_m.toString().padStart(2,'0')));
var mod_min_date=ref(addOneMonthToStringDate(getEraliestNewEventDate().l_y.toString()+'/'+getEraliestNewEventDate().l_m.toString().padStart(2,'0')));
var date_mod=ref(mod_min_date.value);
const validateModDate=function(){
  event_y.value=Number(date_mod.value.split('/')[0]);
  event_m.value=Number(date_mod.value.split('/')[1]);
  situationAtDate.value=returnBaseData(event_y.value, event_m.value).capital_left.toString();
}
const emit = defineEmits(['update-from-type-pick']);
var options_mod = ref([]);
const getopt = function () {
  options_mod.value = provideModOptions(event_type.value,event_y.value,event_m.value);
  if(options_mod.value.length==1 && options_mod.value[0]=='1 mensualité restante, modulation impossible')
  {
    const $q=useQuasar();
    $q.notify({  color: 'orange-4', textColor: 'black',  icon: 'warning',  message: options_mod.value[0],  });
    options_mod.value=['undefined'];
  }
};

var situationAtDate = ref('');

const validateMod = function () {
  if (
    (event_type.value == optionsEvtType[0] ||
      event_type.value == optionsEvtType[1]) &&
    modVal.value != 'undefined'
  ) {
    mensDiff.value = Number(modVal.value.split('(')[1].split('mois')[0]);
    new_mens.value = Number(modVal.value.split('€')[0])
    return true;
  }
  return false;
};


const sendPicked = function (bmove) {
  if (bmove) {
    emit('update-from-type-pick', { type: event_type.value, modVal: modVal.value, mensDiff: mensDiff.value, new_mens: new_mens.value,year:event_y.value,month:event_m.value });
  }
};


</script>



<style>
.evtTypeVal {
  min-width: 180px;
}
</style>
