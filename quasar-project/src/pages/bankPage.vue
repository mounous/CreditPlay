<template>
  <div class="full-height column justify-arround content-center verticalFlex">
    <div div class="col q-ma-md" border:1px solid secondary>
      <div>
        <q-input label="nom du placement" v-model="_saving.title" type="text" lazy-rules
          :rules="[(val) => (val.length < 20) || 'choisir un nom plus court']" clearable maxlength="20"
          bg-color="blue-grey-8" outlined dense></q-input>
        <q-input label="montant" v-model="_saving.amount" type="number" lazy-rules
          :rules="[(val) => (val >= 0.0) || 'Les dettes ne sont pas gérées']" bg-color="blue-grey-8" outlined
          dense></q-input>
        <q-input label="rentabilité" v-model="_saving.rate" type="number" bg-color="blue-grey-8" outlined dense></q-input>
        <q-btn label="ajouter" color="" @click="addElementToSavings"></q-btn>
      </div>
      <div class=row>

        <q-markup-table bg-color="blue-grey-8">
      <thead>
        <tr>
          <th>Nom</th>
          <th>Somme</th>
          <th>Rentabilité</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="saving in bank.savings" :key="saving.id">
              <th >{{ saving.title }}</th>
              <th>{{ saving.amount }}</th>
              <th>{{ saving.rate}}</th>
            </tr>
      </tbody>
    </q-markup-table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { bank } from 'stores/store';
import { ref } from 'vue'
const _saving = ref({ title: '', amount: 0.0, rate: 0.0 });
const addElementToSavings = function () {
  bank.value.savings.push({ title: _saving.value.title, amount: _saving.value.amount, rate: _saving.value.rate});
}
</script>


<style lang="scss">
.verticalFlex {
  min-height: inherit;
  max-width: 100%;
}
</style>
