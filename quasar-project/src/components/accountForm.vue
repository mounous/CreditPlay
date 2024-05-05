<template>

  <q-carousel ref="myAccountForm" fullscreen animated :arrows="false" :navigation="false" v-model="currentSlide">
    <q-carousel-slide name="amountName" class="bg-grey-9">
      <div class="col">

          <div>
            <p>Saisir un nom (facultatif, 'suivant' pour utiliser le nom par défaut)</p>
          </div>
          <div>
            <q-input class="q-ma-md" label="nom du compte" style="max-width:300px" maxlength="20"
              v-model="_account.title" type="text" lazy-rules
              :rules="[(val) => (val.length < 20) || 'choisir un nom plus court']" clearable bg-color="blue-grey-8"
              outlined></q-input>
          </div>
          <div>
            <q-btn color="blue-grey-8" label="suivant" @click="currentSlide = 'AmountAccount'"></q-btn>
          </div>

      </div>
    </q-carousel-slide>
    <q-carousel-slide name="AmountAccount" class="bg-grey-9">
      <q-input class="q-ma-md" label="Somme" maxlength="8" v-model="_account.amount" type="number" lazy-rules
        :rules="[(val) => (val >= 0.0) || 'Les dettes ne sont pas gérées']" bg-color="blue-grey-8" outlined
        dense></q-input>
      <q-btn label="précédent" @click="currentSlide = 'amountName'"></q-btn>
      <q-btn label="suivant" @click="currentSlide = 'Profitability'"></q-btn>
    </q-carousel-slide>
    <q-carousel-slide name="Profitability" class="bg-grey-9">
      <q-input class="q-ma-md" label="rentabilité" maxlength="8" v-model="_account.rate" type="number"
        bg-color="blue-grey-8" outlined></q-input>
      <q-btn label="précédent" @click="currentSlide = 'AmountAccount'"></q-btn>
      <q-btn class="q-mx-xs" label="valider" color="blue-grey-8" @click="addElementToAccounts()"></q-btn>
    </q-carousel-slide>
  </q-carousel>

</template>

<script setup>
import { ref, defineEmits } from 'vue';
import { makeAccountNameUnique, } from '../utils/bank_utility';
import { bank } from 'src/stores/store';
//import { emit } from 'process';
var myAccountForm = ref();
var currentSlide = ref('amountName');
const _account = ref({ title: '', amount: 0.0, rate: 0.0 });
const emit = defineEmits(['account-added']);
const addElementToAccounts = function () {
  if (_account.value.amount == 0) {
    $q.notify({ color: 'orange-4', textColor: 'black', icon: 'warning', message: 'Une épargne de 0€ n\'est pas une épargne', });
    myAccountForm.value.goTo('AmountAccount');
  }
  else if (_account.value.amount < 0) {
    $q.notify({ color: 'orange-4', textColor: 'black', icon: 'warning', message: 'Une dette n\'est pas une épargne', });
    myAccountForm.value.goTo('AmountAccount');
  }
  else {
    bank.value.accounts.push({ title: makeAccountNameUnique(_account.value.title), amount: Number(_account.value.amount), rate: _account.value.rate, single_in_out: [], periodic_savings: [], computedOverTime: [] });
    _account.value.title = '';
    _account.value.amount = 0.0;
    _account.value.rate = 0.0;
    emit('account-added');
  }
}

</script>
