<template>
  <q-page class="bg-white column">
    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
      <q-input
        filled
        type="number"
        v-model="amount_l"
        label="Somme empruntée"
        hint="pas d'unité, pas de virgule"
        lazy-rules
        :rules="[
          (val) => validateAmount(val) || 'Merci de renseigner la somme',
        ]"
      />

      <q-input
        filled
        label="TAEG"
        type="number"
        step="any"
        v-model="taeg_l"
        lazy-rules
        :rules="[(val) => validateTAEG(val) || 'Ce TAEG semble irréel']"
      />

      <q-input
        filled
        type="number"
        v-model="years_l"
        label="Durée d'emprunt"
        lazy-rules
        :rules="[
          (val) =>
            validateYears(val) || 'Merci de renseigner la durée en année',
        ]"
      />

      <div>
        <q-btn label="Submit" type="submit" color="primary" />
        <q-btn
          label="Reset"
          type="reset"
          color="primary"
          flat
          class="q-ml-sm"
        />
      </div>
    </q-form>
  </q-page>
</template>

<script setup>
import { SessionStorage,useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { computeMensuality, computeCredit } from './credit_utility.js';
import {setStartFormFilled} from 'stores/example-store'
const router=useRouter();
var amount_l = ref(SessionStorage.getItem('amount'));
var years_l = ref(SessionStorage.getItem('years'));
var taeg_l = ref(SessionStorage.getItem('taeg'));
const $q=useQuasar();
function validateTAEG  (taeg) {
  SessionStorage.set('taeg', taeg);
  const taeg_lu = SessionStorage.getItem('taeg');
  return taeg_lu == taeg;
};
function validateYears(years) {
  SessionStorage.set('years', years);
  const years_lu = SessionStorage.getItem('years');
  return years_lu == years;
};
function validateAmount  (amount) {
  SessionStorage.set('amount', amount);
  const amount_lu = SessionStorage.getItem('amount');
  return amount_lu == amount;
};
function onSubmit  () {
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
function onReset  () {
  years_l.value = 0;
  taeg_l.value = 0;
  amount_l.value = 0;
  accept.value = false;
};
</script>
