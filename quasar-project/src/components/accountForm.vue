<template>

  <q-carousel ref="myAccountForm" fullscreen animated :arrows="false" :navigation="false" v-model="currentSlide">
    <q-carousel-slide name="acountName" class="bg-grey-9">
      <div class="oneInThreeRowH"></div>
      <div class="oneInThreeRow">
        <div class="column items-center">
          <div class="col myIndication q-ma-md">
            <p>Saisir un nom (facultatif, 'suivant' pour utiliser le nom par défaut)</p>
          </div>
          <div class="col">
            <q-input class="q-ma-md" label="nom du compte" style="max-width:300px; height:100px" maxlength="20"
              v-model="_account.title" type="text" lazy-rules
              :rules="[(val) => (val.length < 20) || 'choisir un nom plus court']" clearable bg-color="blue-grey-8"
              outlined></q-input>
          </div>
          <div class="col">
            <q-btn class="q-ma-xs" color="blue-grey-8" label="annuler" size="xl"
              @click="emit('account-aborted')"></q-btn>
            <q-btn class="q-ma-xs" color="blue-grey-8" label="suivant" size="xl"
              @click="currentSlide = 'AmountAccount'"></q-btn>
          </div>
        </div>
      </div>
      <div class="oneInThreeRowB"></div>
    </q-carousel-slide>
    <q-carousel-slide name="AmountAccount" class="bg-grey-9">
      <div class="oneInThreeRowH"></div>
      <div class="oneInThreeRow">
      <div class="column items-center">
        <div class="col myIndication q-ma-md">
            <p>Saisir le montant actuel sur le compte</p>
          </div>
        <div class="col">
          <q-input class="q-ma-md" label="Somme" maxlength="20" style="max-width:300px; height:100px" v-model="_account.amount"
            type="number" lazy-rules :rules="[(val) => (val >= 0.0) || 'Les dettes ne sont pas gérées']"
            bg-color="blue-grey-8" outlined></q-input>
        </div>
        <div class="col">
          <q-btn class="q-ma-xs" color="blue-grey-8" label="précédent" size="xl" @click="currentSlide = 'acountName'"></q-btn>
          <q-btn class="q-ma-xs" color="blue-grey-8" label="suivant" size="xl" @click="currentSlide = 'Profitability'"></q-btn>
        </div>
      </div>
    </div>
    <div class="oneInThreeRowB"></div>
    </q-carousel-slide>
    <q-carousel-slide name="Profitability" class="bg-grey-9">
      <div class="oneInThreeRowH"></div>
      <div class="oneInThreeRow">
      <div class="column items-center">
        <div class="col myIndication q-ma-md">
            <p>Renseignez la rentabilité annuelle du compte</p>
          </div>
        <div class="col">
          <q-input class="q-ma-md" label="rentabilité" maxlength="20"  style="max-width:300px; height:100px" v-model="_account.rate"
            type="number" bg-color="blue-grey-8" outlined></q-input>
        </div>
        <div class="col">
          <q-btn class="q-ma-xs" label="précédent" size="xl" color="blue-grey-8" @click="currentSlide = 'AmountAccount'"></q-btn>
          <q-btn class="q-ma-xs" label="valider" size="xl" color="blue-grey-8" @click="addElementToAccounts()"></q-btn>
        </div>
      </div>
      </div>
      <div class="oneInThreeRowB"></div>
    </q-carousel-slide>
  </q-carousel>

</template>

<script setup>
import { ref, defineEmits } from 'vue';
import { makeAccountNameUnique, } from '../utils/bank_utility';
import { bank } from 'src/stores/store';
import { useQuasar } from 'quasar';
const $q = useQuasar();
var myAccountForm = ref();
var currentSlide = ref('acountName');
const _account = ref({ title: '', amount: 0.0, rate: 0.0 });
const emit = defineEmits(['account-added', 'account-aborted']);
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
<style lang="scss">
.myIndication {
  font-size: 20px;
}
.oneInThreeRowH{
  width: 100%;
  height: 20%;
}
.oneInThreeRow{
  width: 100%;
  height: 50%;
}
.oneInThreeRowB{
  width: 100%;
  height: 30%;
}
</style>
