<template>
  <div>
    <q-input  class="q-ma-md" label="Pénalités" hint="% du capital restant dû" style="max-width:110px" maxlength="8" v-model="penalties_rebuy"
            type="number" lazy-rules :rules="[(val) => (val >= 0.0) || 'Les pénalités ne sont pas payées par la banque']"
            bg-color="blue-grey-8" outlined dense></q-input>
    <q-select
      rounded
      outlined
      v-model="event_type"
      :options="options_rebuy"
      label="choisir un type de rachat action"
      @update:model-value= getoptRebuy()
      :disable="penalties_rebuy==0.0"
    ></q-select>
    <div class="row">
        <q-select
          class="evtTypeVal"
          rounded
          outlined
          v-model="rachatVal"
          :options="options_rebuy_val"
          label="choisir une option"
          :disable="
            (event_type != optionsReBuyType[0] &&
            event_type != optionsReBuyType[1]) || penalties_rebuy==0.0
          "
          @update:model-value="sendRebuyPicked()"
          v-if="event_type == optionsReBuyType[0]"
        ></q-select>
        <q-input v-if="event_type == optionsReBuyType[1]"  class="q-ma-md" dense style="max-width: 100px;" label="Date de rachat" bg-color="blue-grey-8" filled v-model="date_reloan" mask="date" @update:model-value="sendRebuyPicked()">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date dark v-model="date_reloan" :locale="formatCalendar"
                    :navigation-min-year-month="reloanMin" width="200px"
                    :navigation-max-year-month="reloanMax">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Fermer" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-input v-if="event_type == optionsReBuyType[1]" class="q-ma-md" label="Taux" style="max-width:100px" maxlength="8" v-model="rate_reloan"
            type="number" lazy-rules :rules="[(val) => (val >= 0.0) || 'Le taux ne semble pas réel']"
            bg-color="blue-grey-8" outlined dense @update:model-value="sendRebuyPicked()"></q-input>
            <q-input v-if="event_type == optionsReBuyType[1]" class="q-ma-md" label="Durée" style="max-width:100px" maxlength="8" v-model="duration_reloan"
            type="number" lazy-rules :rules="[(val) => (val >= 0.0) || 'Cette durée est impossible']"
            bg-color="blue-grey-8" outlined dense @update:model-value="sendRebuyPicked()"></q-input>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue';
import {provideRebuyOptions,optionsReBuyType, hasSavings} from '../pages/bank_utility';
import { formatCalendar } from '../pages/calendar_utility';
import {simu} from '../stores/store.ts';
import {getLatestMensuality} from '../pages/credit_utility'
var latest=getLatestMensuality();
var reloanMax=ref(latest.l_y.toString()+'/'+latest.l_m.toString().padStart(2,'0'));
var reloanMin=ref(simu.value.credit.startingDate.split('/')[0]+'/'+simu.value.credit.startingDate.split('/')[1]);
var date_reloan=ref('');
var event_type = ref('Sélectionnez une action');
var rachatVal = ref('undefined');
const emit = defineEmits(['update-from-rebuy-pick']);
var rate_reloan=ref(0.0);
var penalties_rebuy=ref(0.0);
var duration_reloan=ref(0);
const safeRebuyOptions=function()
{
  if(hasSavings())
  {
    return optionsReBuyType;
  }
  else
  {
    return [optionsReBuyType[1]];
  }
};
var options_rebuy = ref(safeRebuyOptions());
const getoptRebuy=function(){
  //prevent computation of rebuy with savings if no savings
  options_rebuy_val.value=provideRebuyOptions(event_type.value,Number(penalties_rebuy.value));
};
var options_rebuy_val=ref([]);
const sendRebuyPicked = function () {
  emit('update-from-rebuy-pick', { rebuyType:event_type.value,rebuyVal:rachatVal.value,reLoanDate:date_reloan.value,reloanRate:Number(rate_reloan.value),rebuyPenalties:Number(penalties_rebuy.value),reloanDuration:Number(duration_reloan.value)});
};
//

</script>



<style>
.evtTypeVal {
  min-width: 180px;
}
</style>
