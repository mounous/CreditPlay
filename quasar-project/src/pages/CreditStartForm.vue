<template>
  <q-page>
    <div class="full-height column justify-arround content-center verticalFlex">
      <div class="col">
        <q-btn-toggle class="q-ma-md"  name="has_started_button" v-model="has_started" unelevated rounded dense size="14px"
          @click="switchNavConstraint" glossy color=black :options="[
            { label: 'Crédit en cours', value: 'yes' },
            { label: 'Simulation', value: 'no' }
          ]" />
      </div>
      <div class="col">
        <q-input label="Date de signature" bg-color="blue-grey-8" filled v-model="date" mask="date" :rules="['date']">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date dark v-model="date" :locale="formatCalendar" :navigation-min-year-month="minNav" width="200px"
                  :navigation-max-year-month="maxNav" :disable="has_started != 'yes' && has_started != 'no'"
                  @update:model-value="saveStartingDate">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
      <div class="col">
        <q-input filled type="number" bg-color="blue-grey-8" v-model="amount_l" label="Somme empruntée" hint="pas d'unité, pas de virgule"
          lazy-rules :rules="[
            (val) => validateAmount(val) || 'Merci de renseigner la somme',
          ]" />
      </div>
      <div class="col">
        <q-input filled label="TAEG" bg-color="blue-grey-8" type="number" step="any" v-model="taeg_l" lazy-rules
          :rules="[(val) => validateTAEG(val) || 'Ce TAEG semble irréel']" />
      </div>
      <div class="col">
        <q-input filled type="number" bg-color="blue-grey-8" v-model="years_l" label="Durée d'emprunt" lazy-rules :rules="[
          (val) =>
            validateYears(val) || 'Merci de renseigner la durée en année',
        ]" />
      </div>
      <div class="col column content-center">
        <div>
          <q-btn label="Valider" type="submit" color="black" rounded @click="onSubmit" />
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
import { SessionStorage } from 'quasar';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { computeMensuality, computeCredit_init } from './credit_utility.js';
import { setStartFormFilled } from 'stores/store'
const router = useRouter();
var amount_l = ref(SessionStorage.getItem('amount'));
var years_l = ref(SessionStorage.getItem('years'));
var taeg_l = ref(SessionStorage.getItem('taeg'));
var has_started = ref('CHOOSE');
var minNav = ref('0000/01');
var maxNav = ref('0000/01');
var date = ref(new Date().toISOString().slice(0, 10).split('-').join('/'));

function validateTAEG(taeg) {
  if (taeg < 0) {
    return false;
  }
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
  computeCredit_init();
  setStartFormFilled(true);
  router.push('/lineChart');
};

var formatCalendar = {
  /* starting with Sunday */
  days: 'Dimanche_lundi_Mardi_Mercredi_Jeudi_Vendredi_Samedi'.split('_'),
  daysShort: 'Dim_Lun_Mar_Mer_Jeu_Ven_Sam'.split('_'),
  months: 'Janvier_Fevrier_Mars_Avril_mai_Juin_Juillet_Aout_Septembre_Octobre_Novembre_Decembre'.split('_'),
  monthsShort: 'jan_Fev_Mar_Avr_Mai_Jui_Jui_Aou_Sep_Oct_Nov_Dec'.split('_'),
  firstDayOfWeek: 1, // 0-6, 0 - Sunday, 1 Monday, ...
  format24h: true,
  pluralDay: 'jours'
};
function switchNavConstraint() {
  var currentY = new Date().getFullYear().toString();
  var currentM = (new Date().getMonth() + 1).toString().padStart(2, '0');
  var limit = currentY + '/' + currentM;
  if (has_started.value == 'yes') {
    maxNav.value = limit;
    minNav.value = '1900/01';
  }
  else {
    maxNav.value = '2100/01';
    minNav.value = limit;
  }
}
function saveStartingDate() {
  SessionStorage.set('startingDate', date.value);
}


</script>
