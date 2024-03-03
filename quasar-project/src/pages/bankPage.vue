<template>
  <div class="full-height column justify-arround content-center verticalFlex">
    <q-card class="bg-grey-9 my-card q-ma-md">
      <p>Economies Actuelles</p>
      <div class="col q-ma-xs">
        <div class="row flex rowNoWrap q-ma-xs">
          <q-input class="q-mx-xs" label="nom du placement" size=8 maxlength="20" v-model="_saving.title" type="text"
            lazy-rules :rules="[(val) => (val.length < 20) || 'choisir un nom plus court']" clearable
            bg-color="blue-grey-8" outlined dense></q-input>
          <q-input class="q-mx-xs" label="montant" style="max-width:110px" maxlength="8" v-model="_saving.amount"
            type="number" lazy-rules :rules="[(val) => (val >= 0.0) || 'Les dettes ne sont pas gérées']"
            bg-color="blue-grey-8" outlined dense></q-input>
          <q-input class="q-mx-xs" label="rentabilité" style="max-width:100px" maxlength="8" v-model="_saving.rate"
            type="number" bg-color="blue-grey-8" outlined dense></q-input>
          <q-btn class="q-mx-xs" dense style="height:38px" label="ajouter" color="blue-grey-8"
            @click="addElementToSavings"></q-btn>
        </div>

        <div>
          <q-markup-table class="my-table bg-grey-8" separator="cell" flat bordered>
            <thead>
              <tr>
                <th span="1" style="width: 40%">Nom</th>
                <th span="1" style="width: 30%">Somme</th>
                <th span="1" style="width: 20%">Rentabilité</th>
                <th span="1" style="width: 10%"> </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="saving in bank.savings" :key="saving.id">
                <th>{{ saving.title }}</th>
                <th>{{ saving.amount }}</th>
                <th>{{ saving.rate }}</th>
                <th><q-btn dense size="s" icon="delete_forever" @click="removeSaving(saving)"></q-btn></th>
              </tr>
            </tbody>
          </q-markup-table>
          <!--q-table class="my-table bg-grey-8" :hide-bottom=true :wrap-cells=true :hide-no-data=true separator="cell" flat bordered :rows="bank.savings" :columns="columns_savings" row-key="bank.savings.title" /!-->
        </div>
      </div>
    </q-card>
    <q-card class="bg-grey-9 my-card q-ma-md">
      <p>Capacité d'épargne</p>
      <div class="col q-ma-xs">
        <div class="row flex  q-ma-xs">
          <q-select bg-color="blue-grey-8" dense v-model="_savingP.type" label="type" :options="['mensuelle', 'annuelle']"></q-select>
          <q-input class="q-mx-xs" label="montant" style="max-width:110px" maxlength="8" v-model="_savingP.amount"
            type="number" lazy-rules :rules="[(val) => (val >= 0.0) || 'Les dettes ne sont pas gérées']"
            bg-color="blue-grey-8" outlined dense></q-input>
          <q-input class="q-mx-xs" label="rentabilité" style="max-width:100px" maxlength="8" v-model="_savingP.rate"
            type="number" bg-color="blue-grey-8" outlined dense></q-input>

          <q-input  class="q-mx-xs" dense style="max-width:100px" label="A partir de" bg-color="blue-grey-8" filled v-model="_savingP.startingDate" mask="date">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date dark v-model="_savingP.startingDate" :locale="formatCalendar"
                    :navigation-min-year-month="periodicSaveMin" width="200px"
                    :navigation-max-year-month="periodicSaveMax">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-input  dense class="q-mx-xs" style="max-width: 100px;" label="jusqu'à" bg-color="blue-grey-8" filled v-model="_savingP.startingDate" mask="date">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date dark v-model="_savingP.startingDate" :locale="formatCalendar"
                    :navigation-min-year-month="periodicSaveMin" width="200px"
                    :navigation-max-year-month="periodicSaveMax">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-btn class="q-mx-xs" dense style="height:38px" label="ajouter" color="blue-grey-8"
            @click="addElementToSavingsP"></q-btn>
        </div>

        <div>
          <q-markup-table class="my-table bg-grey-8" separator="cell" flat bordered>
            <thead>
              <tr>

                <th span="1" style="width: 20%">Somme</th>
                <th span="1" style="width: 10%">Rentabilité</th>
                <th span="1" style="width: 10%">type</th>
                <th span="1" style="width: 15%">à partir de</th>
                <th span="1" style="width: 15%">jusqu'à</th>
                <th span="1" style="width: 10%"> </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="saving in bank.periodic_savings" :key="saving.id">

                <th>{{ saving.amount }}</th>
                <th>{{ saving.rate }}</th>
                <th>{{ saving.type == 'mensuelle' ? 'Mens.' : 'An.' }}</th>
                <th>{{ saving.startMonth + '/' + saving.startYear }}</th>
                <th>{{ saving.endMonth != 0 && saving.endYear != 0 ? saving.endMonth + '/' + saving.endYear : '--\--' }}
                </th>
                <th><q-btn dense size="s" icon="delete_forever" @click="removeSavingP(saving)"></q-btn></th>
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
const _savingP = ref({  amount: 0.0, rate: 0.0, startMonth: 0, startYear: 0, endMonth: 0, endYear: 0, type: 'mensuelle', rate: 0,startingDate:'',endDate:'' });

var limitMonth = new Date().getFullYear().toString();
var limitYear = (new Date().getMonth() + 1).toString().padStart(2, '0');
var periodicSaveMin = ref(limitMonth + '/' + limitYear);
var periodicSaveMax = ref('2100/01');

const addElementToSavings = function () {
  bank.value.savings.push({ title: _saving.value.title, amount: _saving.value.amount, rate: _saving.value.rate });
}
const addElementToSavingsP = function () {
  bank.value.periodic_savings.push({ amount: _savingP.value.amount, rate: _savingP.value.rate, type: _savingP.value.type, startMonth: _savingP.value.startMonth, startYear: _savingP.value.startYear, endMonth: _savingP.value.endMonth, endYear: _savingP.value.endYear });
}

const removeSaving = function (saving) {
  for (var i = 0; i < bank.value.savings.length; i++) {
    if (bank.value.savings[i].title == saving.title && bank.value.savings[i].amount == saving.amount && bank.value.savings[i].rate == saving.rate) {
      bank.value.savings.splice(i, 1);
      return;
    }
  }
}
const removeSavingP = function (saving) {
  for (var i = 0; i < bank.value.savings.length; i++) {
    if ( bank.value.periodic_savings[i].amount == saving.amount && bank.value.periodic_savings[i].rate == saving.rate && bank.value.periodic_savings.startMonth == saving.startMonth && bank.value.periodic_savings.startYear == saving.startYear) {
      bank.value.periodic_savings.splice(i, 1);
      return;
    }
  }
}
/*
const columns_savings=[
  {name:'name1',align:'center',label:'nom',field:row=>row.title,required:true,style:'width: 100px',sortable:false},
  {name:'name2',align:'center',label:'montant',field:row=>row.amount,required:true,style:'width: 80px',sortable:false},
  {name:'name3',align:'center',label:'rentabilité',field:row=>row.rate,required:true,style:'width: 50px',sortable:false},
  {name:'name4',align:'center',label:'X',field:row=>row.title,required:true,style:'width: 20px',sortable:false},
];*/
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
</script>


<style lang="scss">
.verticalFlex {
  min-height: inherit;
  max-width: 100%;
}

.my-table {
  /* height or max-height is important */

  max-height: 200px;

}

.my-card {
  width: 100%;
  max-width: 600px;
  min-height: 250px;
}

.rowNoWrap {
  flex-wrap: nowrap;
}
</style>
