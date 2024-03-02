<template>
  <div class="full-height column justify-arround content-center verticalFlex">
    <q-card class="bg-grey-9 my-card q-ma-md">
      <div class="col q-ma-xs">
        <div class="row q-ma-xs">
          <q-input class="q-mx-xs" label="nom du placement" size=8 maxlength="20" v-model="_saving.title" type="text" lazy-rules
            :rules="[(val) => (val.length < 20) || 'choisir un nom plus court']" clearable
            bg-color="blue-grey-8" outlined dense></q-input>
          <q-input class="q-mx-xs" label="montant" style="width:110px" maxlength="8"  v-model="_saving.amount" type="number" lazy-rules
            :rules="[(val) => (val >= 0.0) || 'Les dettes ne sont pas gérées']" bg-color="blue-grey-8" outlined
            dense></q-input>
          <q-input class="q-mx-xs" label="rentabilité" style="width:100px"  maxlength="8" v-model="_saving.rate" type="number" bg-color="blue-grey-8" outlined
            dense></q-input>
          <q-btn class="q-mx-xs" dense style="height:38px" label="ajouter" color="blue-grey-8" @click="addElementToSavings"></q-btn>
        </div>

        <div>
          <q-markup-table class="my-table bg-grey-8"  flat bordered>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Somme</th>
                <th>Rentabilité</th>
                <th> </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="saving in bank.savings" :key="saving.id">
                <th>{{ saving.title }}</th>
                <th>{{ saving.amount }}</th>
                <th>{{ saving.rate }}</th>
                <th><q-btn  icon="delete" @click="removeSaving(saving)"></q-btn></th>
              </tr>
            </tbody>
          </q-markup-table>
        </div>
      </div>
    </q-card>
  </div>
</template>

<script setup>
import { bank } from 'stores/store';
import { ref } from 'vue'
const _saving = ref({ title: '', amount: 0.0, rate: 0.0 });
const addElementToSavings = function () {
  bank.value.savings.push({ title: _saving.value.title, amount: _saving.value.amount, rate: _saving.value.rate });
}

const removeSaving = function (saving) {
  for (var i = 0; i < bank.value.savings.length; i++) {
    if (bank.value.savings[i].title == saving.title && bank.value.savings[i].amount == saving.amount && bank.value.savings[i].rate == saving.rate) {
      bank.value.savings.splice(i, 1);
      return;
    }
  }
}
</script>


<style lang="scss">
.verticalFlex {
  min-height: inherit;
  max-width: 100%;
}

.my-table {
  /* height or max-height is important */
  min-height: 120px;
  max-height: 200px;

}

.my-card{
  width: 100%;
  max-width: 600px;
  min-height: 250px;
}
</style>
