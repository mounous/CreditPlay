<template>
  <q-page v-touch-swipe.mouse="handleSwipeExt">
    <div class="full-height column justify-arround content-center verticalFlex">
      <div class="col">
        <q-btn-toggle class="q-ma-md" name="has_started_button" v-model="has_started" unelevated rounded dense
          size="14px" @click="switchNavConstraint" glossy color=black :options="[
            { label: transStr(stringsIDs.str_alreadySigned), value: 'yes' },
            { label: transStr(stringsIDs.str_simulation), value: 'no' }
          ]" />
      </div>
      <div class="col">
        <q-input :label=transStr(stringsIDs.str_signature_date) bg-color="blue-grey-8" filled
          v-model="simu.credit.startingDate" @click="mustpop=true" readonly>
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy v-model="mustpop" cover transition-show="scale" transition-hide="scale">
                <q-date dark v-model="unformated" :locale="formatCalendar" :navigation-min-year-month="minNav"
                  width="200px" :navigation-max-year-month="maxNav"
                  :disable="has_started != 'yes' && has_started != 'no'"
                  @update:model-value="[mustpop=false,simu.credit.startingDate=formatDate(unformated),parseCreditDate()]">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup :label=transStr(stringsIDs.str_close) color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
      <div class="col">

        <q-dialog v-model="resetMustPop" cover transition-show="scale" transition-hide="scale">
          <q-card>
            <div class="col flex flex center justify-around">
              <div class="q-ma-md">
                {{transSt(sentancesIDs.s_warning_overwriteSimu)}}
              </div>
              <div class="row nowrap">
                <q-btn :label=transStr(stringsIDs.str_cancel) @click="resetMustPop = false"></q-btn>
                <q-btn :label=transStr(stringsIDs.str_simulation) @click="onForceSubmmit"></q-btn>
              </div>
            </div>
          </q-card>
        </q-dialog>
      </div>
      <div class="col">
        <q-input filled type="number" bg-color="blue-grey-8" v-model="simu.credit.amount" :label=transStr(stringsIDs.str_amount_borrowed)
          lazy-rules :rules="[
            (val) => val>0 || transStr(stringsIDs.str_neg_amount),
          ]" @update:model-value="simu.credit.amount=Number(simu.credit.amount)" />
      </div>
      <div class="col">
        <q-input filled :label=transStr(stringsIDs.str_rate) bg-color="blue-grey-8" type="number" step="any" v-model="simu.credit.rate"
          lazy-rules :rules="[(val) => (val>0) || transStr(stringsIDs.str_rate_impossible)]"
          @update:model-value="simu.credit.rate=Number(simu.credit.rate)" />
      </div>
      <div class="col">
        <q-input filled type="number" bg-color="blue-grey-8" v-model="simu.credit.duration_y" :label=transStr(stringsIDs.str_duration)
          lazy-rules :rules="[(val)=>(val>0)||transStr(stringsIDs.str_durationPos)]"
          @update:model-value="[simu.credit.duration_y=Number(Math.round(simu.credit.duration_y))]" />
      </div>
      <div class="col column content-center">
        <div>
          <q-btn :label=transStr(stringsIDs.str_valid) type="submit" color="black" rounded @click="onSubmit" />
        </div>
      </div>
    </div>
  </q-page>
</template>

<style lang="scss">
.verticalFlex {
  min-height: inherit;
  max-width: 100%;
}
</style>



<script setup>

import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { computeMensuality, computeCredit_init } from '../utils/credit_utility.js';
import { setStartFormFilled,simu } from 'stores/store';
import { formatCalendar } from '../utils/calendar_utility.js';
import {formatDate} from '../utils/date_utility.js'
import { useQuasar } from 'quasar';
import {targetPage} from '../utils/swipe_utils.js'
import {transStr,stringsIDs,transSt,sentancesIDs} from '../stores/languages.ts'

const router = useRouter();
const $q=useQuasar();
var has_started = ref('CHOOSE');
var minNav = ref('0000/01');
var maxNav = ref('0000/01');
var mustpop=ref(false)
var resetMustPop=ref(false);
var unformated=ref('00/00/0000');


const handleSwipeExt=function ({ evt, touch, mouse, direction, duration, distance })
{
  router.push(targetPage(direction,router.currentRoute.value.fullPath));
}



const parseCreditDate=function(){
  simu.value.credit.y=Number(simu.value.credit.startingDate.split('/')[2]);
  simu.value.credit.m=Number(simu.value.credit.startingDate.split('/')[1]);
}

function onSubmit() {
  if(simu.value.events.length==0)
  {
    if(checkInputs())
    {
      computeMensuality();
      computeCredit_init();
      setStartFormFilled(true);
      router.push('/lineChart');
    }
  }
  else
  {
    resetMustPop.value=true;
  }
};

function onForceSubmmit(){
  resetMustPop.value=false;
  if(checkInputs())
  {
    simu.value.events=[]
    simu.value.credit.has_been_rebougth=false;
    computeMensuality();
    computeCredit_init();
    setStartFormFilled(true);
    router.push('/lineChart');
  }
}

function switchNavConstraint() {
  var currentY = new Date().getFullYear().toString();
  var currentM = (new Date().getMonth() + 1).toString().padStart(2, '0');
  var limit = currentY + '/' + currentM;
  if (has_started.value == 'yes') {
    maxNav.value = limit;
    minNav.value = '1900/01';
    simu.value.credit.startingDate='10/07/2023';
    parseCreditDate();
  }
  else {
    maxNav.value = '2100/01';
    minNav.value = limit;
  }
}

const checkInputs=function()
{
  if(has_started.value!='yes' && has_started.value!='no')
  {
    $q.notify({ color: 'orange-4', textColor: 'black', icon: 'warning', message: 'Choisir un type de crédit (en cours/simulation)', });
    return false;
  }
  else if(simu.value.credit.startingDate=='')
  {
    $q.notify({ color: 'orange-4', textColor: 'black', icon: 'warning', message: 'Renseigner une date de départ', });
    return false;
  }
  else if( simu.value.credit.amount==0 )
  {
    $q.notify({ color: 'orange-4', textColor: 'black', icon: 'warning', message: 'Renseigner une somme empruntée', });
    return false;
  }
   else if( simu.value.credit.rate==0)
  {
    $q.notify({ color: 'orange-4', textColor: 'black', icon: 'warning', message: 'Renseigner un taux', });
    return false;
  }
  else if (simu.value.credit.duration_y==0)
  {
    $q.notify({ color: 'orange-4', textColor: 'black', icon: 'warning', message: 'Renseigner une durée', });
    return false;
  }
  return true;
}

</script>
