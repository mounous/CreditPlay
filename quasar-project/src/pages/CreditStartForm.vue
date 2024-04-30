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
        <q-input label="Date de signature" bg-color="blue-grey-8" filled v-model="simu.credit.startingDate" mask="date" @click="mustpop=true">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer" >
              <q-popup-proxy v-model="mustpop" cover transition-show="scale" transition-hide="scale">
                <q-date dark v-model="simu.credit.startingDate" :locale="formatCalendar" :navigation-min-year-month="minNav" width="200px"
                  :navigation-max-year-month="maxNav" :disable="has_started != 'yes' && has_started != 'no'" @update:model-value="mustpop=false" >
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Fermer" color="primary" flat />
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
                  Vous êtes sur le point de simuler un nouveau crédit, cela supprimera la simulation en cours si vous ne l'avez pas sauvegardée.
                  Vous pouvez sauvegarder la simulation dans l'onglet "mémoire". Pour écraser la simulation en cours, choisir "Simuler". Sinon, choisir "Annuler".
                </div>
                <div class="row nowrap">
                <q-btn label="Annuler" @click="resetMustPop=false"></q-btn>
                <q-btn label="Simuler" @click="onForceSubmmit"></q-btn>
              </div>
            </div>
              </q-card>
              </q-dialog>
      </div>
      <div class="col">
        <q-input filled type="number" bg-color="blue-grey-8" v-model="simu.credit.amount" label="Somme empruntée"
                  lazy-rules :rules="[
            (val) => val>0 || 'Merci de renseigner la somme',
          ]" />
      </div>
      <div class="col">
        <q-input filled label="TAEG" bg-color="blue-grey-8" type="number" step="any" v-model="simu.credit.rate" lazy-rules
          :rules="[(val) => (val>0) || 'Ce TAEG semble irréel']" />
      </div>
      <div class="col">
        <q-input filled type="number" bg-color="blue-grey-8" v-model="simu.credit.year" label="Durée d'emprunt" lazy-rules
        :rules="[(val)=>(val>0)||'Renseigner une durée positive']" @update:model-value="[simu.credit.year=Math.round(simu.credit.year)]" />
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

import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { computeMensuality, computeCredit_init } from '../utils/credit_utility.js';
import { setStartFormFilled,simu } from 'stores/store';
import { formatCalendar } from './calendar_utility';
const router = useRouter();

var has_started = ref('CHOOSE');
var minNav = ref('0000/01');
var maxNav = ref('0000/01');
var mustpop=ref(false)
var resetMustPop=ref(false);


function onSubmit() {
  if(simu.value.events.length==0)
  {
    computeMensuality();
    computeCredit_init();
    setStartFormFilled(true);
    router.push('/lineChart');
  }
  else
  {
    resetMustPop.value=true;
  }
};

function onForceSubmmit(){
  resetMustPop.value=false;
  simu.value.events=[]
  simu.value.credit.has_been_rebougth=false;
  computeMensuality();
  computeCredit_init();
  setStartFormFilled(true);
  router.push('/lineChart');
}

function switchNavConstraint() {
  var currentY = new Date().getFullYear().toString();
  var currentM = (new Date().getMonth() + 1).toString().padStart(2, '0');
  var limit = currentY + '/' + currentM;
  if (has_started.value == 'yes') {
    maxNav.value = limit;
    minNav.value = '1900/01';
    simu.value.credit.startingDate='2023/07/10';
  }
  else {
    maxNav.value = '2100/01';
    minNav.value = limit;
  }
}

</script>
