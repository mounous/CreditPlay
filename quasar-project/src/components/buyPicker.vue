<template>
  <div class="q-ma-md col flex flex-center">
    <div >
      <q-input class="q-ma-md" label="Pénalités" hint="% du capital restant dû" style="max-width:110px" maxlength="8"
        v-model="penalties_rebuy" type="number" lazy-rules
        :rules="[(val) => (val >= 0.0) || 'Les pénalités ne sont pas payées par la banque']" bg-color="blue-grey-8"
        outlined dense></q-input>
    </div>
    <div>
      <q-select rounded outlined v-model="event_type" :options="options_rebuy" label="choisir un type de rachat action"
        @update:model-value=getoptRebuy() :disable="penalties_rebuy <= 0.0"></q-select>
    </div>
    <div>
      <q-select v-if="event_type == optionsReBuyType[0]" class="evtTypeVal" rounded outlined v-model="rachatVal"
        :options="options_rebuy_val" label="choisir une option" :disable="(event_type != optionsReBuyType[0] &&
          event_type != optionsReBuyType[1]) || penalties_rebuy == 0.0
          " @update:model-value="sendRebuyPicked()"></q-select>
    </div>
    <div v-if="event_type == optionsReBuyType[0] && rebuy_saving_eco_left != '' && rebuy_saving_capital_to_pay != ''">
      Economies restantes après rachat : {{ rebuy_saving_eco_left }}
    </div>
    <div v-if="event_type == optionsReBuyType[0] && rebuy_saving_eco_left != '' && rebuy_saving_capital_to_pay != ''">
      Valeur du rachat : {{ rebuy_saving_capital_to_pay }}
    </div>

    <q-dialog v-model="mustPopWarning" v-if="event_type == optionsReBuyType[0]">
      <q-card>
        <div class="q-ma-xl col flex flex-center">
          <div>
            Des opérations antérieures au rachat de crédit renseigné ont été renseignées.
            Ces opérations ne font plus sens après un rachat. Ces opérations seront supprimées si vous validez :
          </div>
          <div v-for="elmnt in listToDisplay" :key="elmnt.id">
            <div>{{ elmnt.title }}</div>
          </div>
          <div>
            <q-btn label="valider" @click="[mustPopWarning = false, sendRebuyPicked(force = true)]"></q-btn>
            <q-btn label="Annuler"
              @click="[mustPopWarning = false, rachatVal = DEFAULT_RACHAT_VAL_VALUE, listToDisplay = []]"></q-btn>
          </div>
        </div>
      </q-card>
    </q-dialog>
  </div>
  <div class="row">
    <q-input v-if="event_type == optionsReBuyType[1]" class="q-ma-md" dense style="max-width: 100px;"
      label="Date de rachat" bg-color="blue-grey-8" filled v-model="date_reloan" mask="date" @click="mustpop = true">
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy v-model="mustpop" cover transition-show="scale" transition-hide="scale">
            <q-date dark v-model="date_reloan" :locale="formatCalendar" :navigation-min-year-month="reloanMin"
              width="200px" :navigation-max-year-month="reloanMax" :default-year-month="reloanMin"
              @update:model-value="[mustpop = false, sendRebuyPicked()]">
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Fermer" color="primary" flat />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
    <q-input v-if="event_type == optionsReBuyType[1]" class="q-ma-md" label="Taux" style="max-width:100px" maxlength="8"
      v-model="rate_reloan" type="number" lazy-rules :rules="[(val) => (val >= 0.0) || 'Le taux ne semble pas réel']"
      bg-color="blue-grey-8" outlined dense @update:model-value="sendRebuyPicked()"></q-input>
    <q-input v-if="event_type == optionsReBuyType[1]" class="q-ma-md" label="Durée" style="max-width:100px"
      maxlength="8" v-model="duration_reloan" type="number" lazy-rules
      :rules="[(val) => (val >= 0.0) || 'Cette durée est impossible']" bg-color="blue-grey-8" outlined dense
      @update:model-value="sendRebuyPicked()"></q-input>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue';
import { provideRebuyOptions, optionsReBuyType, hasSavings } from '../pages/bank_utility';
import { formatCalendar } from '../pages/calendar_utility';
import { simu } from '../stores/store.ts';
import { getLatestMensuality, getEraliestNewEventDate } from '../pages/credit_utility'
import { subOneMonthToStringDate, addOneMonthToStringDate, compareDates, getMonthNbr, month_names } from '../pages/date_utility'

var reloanMax = ref(subOneMonthToStringDate(getLatestMensuality().l_y.toString() + '/' + getLatestMensuality().l_m.toString().padStart(2, '0')));
var reloanMin = ref(addOneMonthToStringDate(getEraliestNewEventDate().l_y.toString() + '/' + getEraliestNewEventDate().l_m.toString().padStart(2, '0')));
var date_reloan = ref('');
var event_type = ref('Sélectionnez une action');
const DEFAULT_RACHAT_VAL_VALUE = 'choisir une option';
var rachatVal = ref(DEFAULT_RACHAT_VAL_VALUE);
const emit = defineEmits(['update-from-rebuy-pick']);
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
const safeRebuyOptions = function () {
  if (hasSavings()) {
    return optionsReBuyType;
  }
  else {
    return [optionsReBuyType[1]];
  }
};
var options_rebuy = ref(safeRebuyOptions());
const getoptRebuy = function () {
  if(event_type.value==optionsReBuyType[0]){
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
  if (rachatVal.value == DEFAULT_RACHAT_VAL_VALUE && event_type.value === optionsReBuyType[0]) {
    return;
  }
  else {
    if (event_type.value === optionsReBuyType[0])//rebuy with savings
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
    else {
      event_year_str = date_reloan.value.split('/')[0];
      event_month = Number(date_reloan.value.split('/')[1]);
      event_month_str = month_names[event_month - 1];
    }
  }
  var event_year = Number(event_year_str);
  if (force) {
    for (var i = 0; i < simu.value.events.length; i++) {
      if (compareDates(simu.value.events[i].year, simu.value.events[i].month, event_year, event_month)) {
        simu.value.events.pop();
      }
      mustPopWarning.value = false;
    }
    emit('update-from-rebuy-pick', { rebuyType: event_type.value, rebuyVal: rachatVal.value, year_str: event_year_str, month_str: event_month_str, year: event_year, month: event_month, reloanRate: Number(rate_reloan.value), rebuyPenalties: Number(penalties_rebuy.value), reloanDuration: Number(duration_reloan.value) });
  }
  else {
    //prevent to rebuy with savings before the last event : warn the user and delete all events after rebuy with the user agreeement
    if (event_type.value === optionsReBuyType[0]) {
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
      emit('update-from-rebuy-pick', { rebuyType: event_type.value, rebuyVal: rachatVal.value, year_str: event_year_str, month_str: event_month_str, year: event_year, month: event_month, reloanRate: Number(rate_reloan.value), rebuyPenalties: Number(penalties_rebuy.value), reloanDuration: Number(duration_reloan.value) });
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
