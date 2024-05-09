<template>
  <q-input class="q-ma-md" dense style="max-width: 100px;" :label=transStr(stringsIDs.str_mod_date) bg-color="blue-grey-8" filled v-model="date_mod" @click="mustpop=true" readonly>
    <template v-slot:append>
      <q-icon name="event" class="cursor-pointer">
        <q-popup-proxy v-model="mustpop" cover transition-show="scale" transition-hide="scale">
          <q-date dark v-model="date_modunformated" :locale=getTranslatedFormatedCalendar() :navigation-min-year-month="mod_min_date"
            width="200px" :navigation-max-year-month="mod_max_date" :default-year-month="mod_min_date" @update:model-value="date_mod=formatDate(date_modunformated),[validateModDate(),mustpop=false,event_type =DEFAULT_EVENT_TYPE,emit('can-finish',{val:false}),modVal=DEFAULT_MODVAL]">
            <div class="row items-center justify-end" >
              <q-btn v-close-popup :label=transStr(stringsIDs.str_close) color="primary" flat />
            </div>
          </q-date>
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
  <div v-if="event_y != 0 && event_m != 0">
    <p> {{transStr(stringsIDs.str_capital_left)+ situationAtDate }}</p>
  </div>
  <div v-if="event_y != 0 && event_m != 0">
    <q-select rounded outlined v-model="event_type_str" :options=transevtmodType() :label=transStr(stringsIDs.str_choose_act)
      @update:model-value="[event_type=getModTypeFromStr(event_type_str) ,getopt(),modVal=DEFAULT_MODVAL,emit('can-finish',{val:false})]"/>
    <div v-if="event_y != 0 && event_m != 0" class="row">
      <div class="q-ma-md">
        <q-select class="evtTypeVal" rounded outlined v-model="modVal" :options="options_mod"
          :label=transStr(stringsIDs.str_choose_mensuality) :disable="event_type == DEFAULT_EVENT_TYPE
    " @update:model-value="sendPicked(validateMod())"></q-select>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue';
import { provideModOptions, returnBaseData,getLatestMensuality,getEarliestNewEventDate } from '../utils/credit_utility.js'
import { getTranslatedFormatedCalendar } from '../stores/languages';
import { useQuasar } from 'quasar';
import { formatDate } from '../utils/date_utility.js';
import{subOneMonthToStringDate,addOneMonthToStringDate} from '../utils/date_utility.js'
import{transevtmodType,getModTypeFromStr,transStr,stringsIDs} from '../stores/languages'
import {getCurrencySymbol} from '../stores/currencies'
const DEFAULT_EVENT_TYPE_STR=transStr(stringsIDs.str_select_action);
const DEFAULT_EVENT_TYPE=-1;
var event_type_str = ref(DEFAULT_EVENT_TYPE_STR);
var event_type = ref(DEFAULT_EVENT_TYPE);
var mustpop=ref(false);
const DEFAULT_MODVAL=transStr(stringsIDs.str_choose_opt);
var modVal = ref(DEFAULT_MODVAL);
var mensDiff = ref(0);
var new_mens = ref(0);
var event_y=ref(0);
var event_m=ref(0);
var mod_max_date=ref(subOneMonthToStringDate(getLatestMensuality().l_y.toString()+'/'+getLatestMensuality().l_m.toString().padStart(2,'0')));
var mod_min_date=ref(addOneMonthToStringDate(getEarliestNewEventDate().l_y.toString()+'/'+getEarliestNewEventDate().l_m.toString().padStart(2,'0')));
var date_mod=ref(mod_min_date.value);
var date_modunformated=ref(date_mod.value);
const validateModDate=function(){
  event_y.value=Number(date_mod.value.split('/')[2]);
  event_m.value=Number(date_mod.value.split('/')[1]);
  situationAtDate.value=returnBaseData(event_y.value, event_m.value).capital_left.toString();
}
const emit = defineEmits(['update-from-type-pick','can-finish']);
var options_mod = ref([]);
const getopt = function () {
  options_mod.value = provideModOptions(event_type.value,event_y.value,event_m.value);
  if(options_mod.value.length==1 && options_mod.value[0]==transStr(stringsIDs.str_mod_impossible))
  {
    const $q=useQuasar();
    $q.notify({  color: 'orange-4', textColor: 'black',  icon: 'warning',  message: options_mod.value[0],  });
    options_mod.value=['undefined'];
  }
};

var situationAtDate = ref('');

const validateMod = function () {
  if (
    (event_type.value !=DEFAULT_EVENT_TYPE) &&
    modVal.value != DEFAULT_MODVAL
  ) {
    mensDiff.value = Number(modVal.value.split('(')[1].split('mois')[0]);
    new_mens.value = Number(modVal.value.split(getCurrencySymbol())[0])
    emit('can-finish',{val:true});
    return true;
  }
  emit('can-finish',{val:false});
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
