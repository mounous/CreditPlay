<template>
  <div class="q-ma-xs col flex flex-center">
    <div class="col">
    <div >
      <q-input class="q-ma-md" :label=transStr(stringsIDs.str_penalties) :hint=transStr(stringsIDs.str_penalties_hint) style="max-width:110px" maxlength="8"
        v-model="penalties_rebuy" type="number" lazy-rules
        :rules="[(val) => (val >= 0.0) || transStr(stringsIDs.str_penalties_rule)]" bg-color="blue-grey-8"
        outlined dense></q-input>
    </div>
    <div>
      <q-select rounded outlined v-model="event_type_str" :options="options_rebuy" :label=transStr(stringsIDs.str_choose_rebuy_type)
        @update:model-value="[event_type=getrebuyTypeFromStr(event_type_str), rate_reloan=0,duration_reloan=0, rebuy_saving_eco_left='',rebuy_saving_capital_to_pay='',rachatVal=DEFAULT_RACHAT_VAL_VALUE,getoptRebuy(),emit('can-finish',{val:false})]" :disable="penalties_rebuy <= 0.0"></q-select>
    </div>
    <div>
      <q-select v-if="event_type == EVT_TYPE_REBUY_SAVINGS" class="evtTypeVal" rounded outlined v-model="rachatVal"
        :options="options_rebuy_val" :label=transStr(stringsIDs.str_choose_option) :disable="(event_type !=EVT_TYPE_REBUY_SAVINGS &&
          event_type != EVT_TYPE_REBUY_CREDIT) || penalties_rebuy == 0.0
          " @update:model-value="[sendRebuyPicked(),emit('can-finish',{val:true})]"></q-select>
    </div>
    <div v-if="event_type ==EVT_TYPE_REBUY_SAVINGS && rebuy_saving_eco_left != '' && rebuy_saving_capital_to_pay != ''">
       {{ transStr(stringsIDs.str_savings_left) + rebuy_saving_eco_left }}
    </div>
    <div v-if="event_type == EVT_TYPE_REBUY_SAVINGS && rebuy_saving_eco_left != '' && rebuy_saving_capital_to_pay != ''">
       {{ transStr(stringsIDs.str_capital_rebought)+ rebuy_saving_capital_to_pay }}
    </div>
  </div>
    <q-dialog v-model="mustPopWarning" v-if="event_type == EVT_TYPE_REBUY_SAVINGS">
      <q-card>
        <div class="q-ma-xl col flex flex-center">
          <div>
            {{ transSt(sentancesIDs.s_warning_post_rebuy_ops) }}
          </div>
          <div v-for="elmnt in listToDisplay" :key="elmnt.id">
            <div>{{ elmnt.title }}</div>
          </div>
          <div>
            <q-btn :label=transStr(stringsIDs.str_validate) @click="[mustPopWarning = false, sendRebuyPicked(force = true),emit('can-finish',{val:true})]"></q-btn>
            <q-btn :label=transStr(stringsIDs.str_cancel)
              @click="[mustPopWarning = false, rachatVal = DEFAULT_RACHAT_VAL_VALUE, listToDisplay = [],emit('can-finish',{val:false})]"></q-btn>
          </div>
        </div>
      </q-card>
    </q-dialog>
  </div>
  <div class="row wrap">
    <q-input v-if="event_type == EVT_TYPE_REBUY_CREDIT" class="q-ma-xs" dense style="max-width: 100px;"
      :label=transStr(stringsIDs.str_rebuy_date) bg-color="blue-grey-8" filled v-model="date_reloan"  @click="mustpop = true" readonly>
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy v-model="mustpop" cover transition-show="scale" transition-hide="scale">
            <q-date dark v-model="unformatedrebuydate" :locale=getTranslatedFormatedCalendar() :navigation-min-year-month="reloanMin"
              width="200px" :navigation-max-year-month="reloanMax" :default-year-month="reloanMin"
              @update:model-value="[mustpop = false,date_reloan=formatDate(unformatedrebuydate), sendRebuyPicked()]">
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Fermer" color="primary" flat />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
    <q-input v-if="event_type == EVT_TYPE_REBUY_CREDIT" class="q-ma-xs" :label=transStr(stringsIDs.str_rate) style="max-width:70px" maxlength="8"
      v-model="rate_reloan" type="number" lazy-rules :rules="[(val) => (val >= 0.0) || transStr(stringsIDs.str_rate_impossible)]"
      bg-color="blue-grey-8" outlined dense @update:model-value="sendRebuyPicked()"></q-input>
    <q-input v-if="event_type == EVT_TYPE_REBUY_CREDIT" class="q-ma-xs" :label=transStr(stringsIDs.str_duration) style="max-width:70px"
      maxlength="8" v-model="duration_reloan" type="number" lazy-rules
      :rules="[(val) => (val >= 0) || transStr(stringsIDs.str_durationPos)]" bg-color="blue-grey-8" outlined dense
      @update:model-value="[duration_reloan=Math.round(duration_reloan),sendRebuyPicked()]"></q-input>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue';
import { provideRebuyOptions,  hasSavings } from '../utils/bank_utility';
import { getTranslatedFormatedCalendar } from '../stores/languages';
import { simu } from '../stores/store.ts';
import { transStr,stringsIDs,transRebuymodType,getrebuyTypeFromStr,transSt,sentancesIDs } from 'src/stores/languages';
import { getLatestMensuality, getEarliestNewEventDate,EVT_TYPE_REBUY_CREDIT,EVT_TYPE_REBUY_SAVINGS } from '../utils/credit_utility'
import { subOneMonthToStringDate, addOneMonthToStringDate, compareDates, getMonthNbr, month_names,formatDate } from '../utils/date_utility'

var reloanMax = ref(subOneMonthToStringDate(getLatestMensuality().l_y.toString() + '/' + getLatestMensuality().l_m.toString().padStart(2, '0')));
console.log('test1');
var reloanMin = ref(addOneMonthToStringDate(getEarliestNewEventDate().l_y.toString() + '/' + getEarliestNewEventDate().l_m.toString().padStart(2, '0')));
console.log('test2');
var date_reloan = ref('');
var event_type_str=ref(transStr(stringsIDs.str_select_action));
const DEFAUL_EVT_TYPE=-1;
var event_type = ref(DEFAUL_EVT_TYPE);
const DEFAULT_RACHAT_VAL_VALUE = transStr(stringsIDs.str_choose_opt);
var rachatVal = ref(DEFAULT_RACHAT_VAL_VALUE);
const emit = defineEmits(['update-from-rebuy-pick','can-finish']);
var rate_reloan = ref(0.0);
var penalties_rebuy = ref(0.0);
var duration_reloan = ref(0);
var mustpop = ref(false);
var mustPopWarning = ref(false);
var listToDisplay = ref([]);
var options_rebuy_val = ref([]);
var Display_rebuy_savings = ref([]);
var rebuy_saving_eco_left = ref('');
var rebuy_saving_capital_to_pay = ref('');
var unformatedrebuydate=ref(reloanMin.value);
const safeRebuyOptions = function () {
  if (hasSavings()) {
    return transRebuymodType();
  }
  else {
    return [transRebuymodType()[EVT_TYPE_REBUY_CREDIT]];
  }
};
var options_rebuy = ref(safeRebuyOptions());
const getoptRebuy = function () {
  if(event_type.value==EVT_TYPE_REBUY_SAVINGS){
    var result = provideRebuyOptions(event_type.value, Number(penalties_rebuy.value));
    options_rebuy_val.value = result[0];
    Display_rebuy_savings.value = result[1];
  }
};

const sendRebuyPicked = function (force = false) {
  //compute event attributes based on the event value
  var event_year_str = '0';
  var event_month_str = '0';
  var event_month = 0;
  if (rachatVal.value == DEFAULT_RACHAT_VAL_VALUE && event_type.value === EVT_TYPE_REBUY_SAVINGS) {
    return;
  }
  else {
    if (event_type.value === EVT_TYPE_REBUY_SAVINGS)//rebuy with savings
    {
      event_year_str = rachatVal.value.split(' ')[1];
      event_month_str = rachatVal.value.split(' ')[0];
      event_month = getMonthNbr(event_month_str);
      var found = false;
      var j = 0;
      while (j < options_rebuy_val.value.length && found != true) {
        if (options_rebuy_val.value[j] == rachatVal.value) {
          found = true;
        }
        j++;
      }
      if (found == true) {
        rebuy_saving_eco_left.value = Display_rebuy_savings.value[j - 1].eco_left;
        rebuy_saving_capital_to_pay.value = Display_rebuy_savings.value[j - 1].value_paid;
      }
      else {
        rebuy_saving_eco_left.value = '';
        rebuy_saving_capital_to_pay.value = '';
      }
    }
    else {//rebuy with credit
      event_year_str = date_reloan.value.split('/')[2];
      event_month = Number(date_reloan.value.split('/')[1]);
      event_month_str = month_names[event_month - 1];
      if(rate_reloan.value!=0 && duration_reloan.value!=0 &&date_reloan.value!='' && event_month>0 && Number(event_year_str)<=getLatestMensuality().l_y && Number(event_year_str)>=getEarliestNewEventDate().l_y)
      {
        emit('can-finish',{val:true});
      }
      else
      {
        emit('can-finish',{val:false});
      }
    }
  }
  var event_year = Number(event_year_str);
  if (force) {
    for (var i = simu.value.events.length-1; i >=0; i--) {
      if (compareDates(simu.value.events[i].year, simu.value.events[i].month, event_year, event_month)>0) {
        simu.value.events.pop();
      }
    }
    mustPopWarning.value = false;
    emit('update-from-rebuy-pick', { rebuyType: event_type.value, rebuyVal: rachatVal.value, year_str: event_year_str, month_str: event_month_str, year: event_year, month: event_month, reloanRate: Number(rate_reloan.value), rebuyPenalties: Number(penalties_rebuy.value), reloanDuration: Number(duration_reloan.value),savingsLeft: rebuy_saving_eco_left.value });
  }
  else {
    //prevent to rebuy with savings before the last event : warn the user and delete all events after rebuy with the user agreeement
    if (event_type.value === EVT_TYPE_REBUY_SAVINGS) {
      for (var i = 0; i < simu.value.events.length; i++) {
        if (compareDates(simu.value.events[i].year, simu.value.events[i].month, event_year, event_month) >= 0) {
          listToDisplay.value.push({ id: 0, title: simu.value.events[i].title });
          listToDisplay.value.at(-1).id = listToDisplay.value.length;
          mustPopWarning.value = true;
        }
      }
    }
    else {
      mustPopWarning.value = false;
    }
    if (mustPopWarning.value == false) {
      emit('update-from-rebuy-pick', { rebuyType: event_type.value, rebuyVal: rachatVal.value, year_str: event_year_str, month_str: event_month_str, year: event_year, month: event_month, reloanRate: Number(rate_reloan.value), rebuyPenalties: Number(penalties_rebuy.value), reloanDuration: Number(duration_reloan.value),savingsLeft: rebuy_saving_eco_left.value });
    }
  }
};
//

</script>



<style>
.evtTypeVal {
  min-width: 180px;
}
</style>
