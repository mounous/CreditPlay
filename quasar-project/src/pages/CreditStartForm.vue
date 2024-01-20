<template>
  <q-page class="bg-white column">
    <div>
        <q-btn-toggle class="q-ma-md" name="has_started_button" v-model="has_started" push
          @click="switchNavConstraint" glossy toggle-color="blue" :options="[
            { label: 'Crédit en cours', value: 'yes' },
            { label: 'Simulation', value: 'no' }
          ]" />
      </div>
    <div class="q-pa-md" style="max-width: 300px">
        <q-input label="Date de signature" filled v-model="date" mask="date" :rules="['date']">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer" >
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date dark v-model="date" :locale="formatCalendar" :navigation-min-year-month="minNav"
      :navigation-max-year-month="maxNav" :disable="has_started!='yes' && has_started!='no'" @update:model-value="saveStartingDate">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>

    <q-form  @submit="onSubmit" @reset="onReset" class="q-gutter-md">

      <q-input filled type="number" v-model="amount_l" label="Somme empruntée" hint="pas d'unité, pas de virgule"
        lazy-rules :rules="[
          (val) => validateAmount(val) || 'Merci de renseigner la somme',
        ]" />

      <q-input filled label="TAEG" type="number" step="any" v-model="taeg_l" lazy-rules
        :rules="[(val) => validateTAEG(val) || 'Ce TAEG semble irréel']" />

      <q-input filled type="number" v-model="years_l" label="Durée d'emprunt" lazy-rules :rules="[
        (val) =>
          validateYears(val) || 'Merci de renseigner la durée en année',
      ]" />

      <div>
        <q-btn label="Submit" type="submit" color="primary" />
        <q-btn label="Reset" type="reset" color="primary" flat class="q-ml-sm" />
      </div>
    </q-form>
  </q-page>
</template>

<script setup>
import { SessionStorage, useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { computeMensuality, computeCredit } from './credit_utility.js';
import { setStartFormFilled } from 'stores/example-store'
const router = useRouter();
var amount_l = ref(SessionStorage.getItem('amount'));
var years_l = ref(SessionStorage.getItem('years'));
var taeg_l = ref(SessionStorage.getItem('taeg'));
var has_started = ref('CHOOSE');
var minNav=ref('0000/01');
var maxNav=ref('0000/01');

var date =ref(new Date().toISOString().slice(0,10).split('-').join('/'));

const $q = useQuasar();
function validateTAEG(taeg) {
  SessionStorage.set('taeg', taeg);
  const taeg_lu = SessionStorage.getItem('taeg');
  return taeg_lu == taeg;
};
function validateYears(years) {
  SessionStorage.set('years', years);
  const years_lu = SessionStorage.getItem('years');
  return years_lu == years;
};
function validateAmount(amount) {
  SessionStorage.set('amount', amount);
  const amount_lu = SessionStorage.getItem('amount');
  return amount_lu == amount;
};
function onSubmit() {
  saveStartingDate();
  computeMensuality();
  computeCredit();

  $q.notify({
    color: 'green-4',
    textColor: 'white',
    icon: 'cloud_done',
    message: 'Submitted',
  });
  setStartFormFilled(true);
  router.push('/summary');
};
function onReset() {
  years_l.value = 0;
  taeg_l.value = 0;
  amount_l.value = 0;
  accept.value = false;
};
var formatCalendar= {
        /* starting with Sunday */
        days: 'Dimanche_lundi_Mardi_Mercredi_Jeudi_Vendredi_Samedi'.split('_'),
        daysShort: 'Dim_Lun_Mar_Mer_Jeu_Ven_Sam'.split('_'),
        months: 'Janvier_Fevrier_Mars_Avril_mai_Juin_Juillet_Aout_Septembre_Octobre_Novembre_Decembre'.split('_'),
        monthsShort: 'jan_Fev_Mar_Avr_Mai_Jui_Jui_Aou_Sep_Oct_Nov_Dec'.split('_'),
        firstDayOfWeek: 1, // 0-6, 0 - Sunday, 1 Monday, ...
        format24h: true,
        pluralDay: 'jours'
      };
function switchNavConstraint()
{
  var currentY=new Date().getFullYear().toString();
  var currentM=(new Date().getMonth()+1).toString().padStart(2,'0');
  var limit=currentY+'/'+currentM;
  if(has_started.value=='yes')
  {
    maxNav.value=limit;
    minNav.value='1900/01';
  }
  else
  {
    maxNav.value='2100/01';
    minNav.value=limit;
  }
}
function saveStartingDate()
{
  SessionStorage.set('startingDate',date.value);
}


</script>
