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
          <q-input  class="q-mx-xs" dense style="max-width: 100px;" label="jusqu'à  " bg-color="blue-grey-8" filled v-model="_savingP.endDate" mask="date">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date dark v-model="_savingP.endDate" :locale="formatCalendar"
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

    <q-card class="bg-grey-9 my-card q-ma-md">
      <p>Entrées sorties exceptionnelles</p>
      <div class="col q-ma-xs">
        <div class="row flex  q-ma-xs">
          <q-select bg-color="blue-grey-8" dense v-model="_single_io.type" label="type" :options="['entrée', 'sortie']"></q-select>
          <q-input class="q-mx-xs" label="montant" style="max-width:110px;min-width:100px" maxlength="8" v-model="_single_io.amount"
            type="number" lazy-rules
            bg-color="blue-grey-8" outlined dense></q-input>
          <q-input class="q-mx-xs" label="nom" style="max-width:100px" maxlength="20" v-model="_single_io.title"
            type="text" bg-color="blue-grey-8" outlined dense></q-input>
            <q-input class="q-mx-xs" label="rentabilité" style="max-width:100px" maxlength="8" v-model="_single_io.rate"
            type="number" bg-color="blue-grey-8" outlined dense></q-input>

          <q-input  class="q-mx-xs" dense style="max-width:100px" label="date" bg-color="blue-grey-8" filled v-model="_single_io.startingDate" mask="date">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date dark v-model="_single_io.date" :locale="formatCalendar"
                    :navigation-min-year-month="periodicSaveMin" width="200px"
                    >
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-btn class="q-mx-xs" dense style="height:38px" label="ajouter" color="blue-grey-8"
            @click="addElementToSingleIO"></q-btn>
        </div>

        <div>
          <q-markup-table class="my-table bg-grey-8" separator="cell" flat bordered>
            <thead>
              <tr>

                <th span="1" style="width: 25%">nom</th>
                <th span="1" style="width: 12%">type</th>
                <th span="1" style="width: 25%">montant</th>
                <th span="1" style="width: 13%">rentabilité</th>
                <th span="1" style="width: 25%">date</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="io in bank.single_in_out" :key="io.id">

                <th>{{ io.title }}</th>
                <th>{{ io.type }}</th>
                <th>{{ io.amount }}</th>
                <th>{{ io.month + '/' + io.year }}</th>

                <th><q-btn dense size="s" icon="delete_forever" @click="removeSingleIO(io)"></q-btn></th>
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
import { useQuasar } from 'quasar';
const $q = useQuasar();
const _saving = ref({ title: '', amount: 0.0, rate: 0.0 });
const _savingP = ref({  amount: 0.0, rate: 0.0, startMonth: 0, startYear: 0, endMonth: 0, endYear: 0, type: 'mensuelle',startingDate:'',endDate:'' });
const _single_io =ref({title: '', type:'entrée', amount:0,year:0,month:0,date:'',rate:0});
var limitMonth = new Date().getFullYear().toString();
var limitYear = (new Date().getMonth() + 1).toString().padStart(2, '0');
var periodicSaveMin = ref(limitMonth + '/' + limitYear);
var periodicSaveMax = ref('2100/01');

const addElementToSavings = function () {
  if(_saving.value.amount==0)
  {
    $q.notify({    color: 'orange-4',    textColor: 'black',    icon: 'warning',    message: 'Une épargne de 0€ n\'est pas une épargne',  });
  }
  else
  {
    bank.value.savings.push({ title: _saving.value.title, amount: _saving.value.amount, rate: _saving.value.rate });
    _saving.value.title='';
    _saving.value.amount=0.0;
    _saving.value.rate=0.0;
  }
}
const addElementToSavingsP = function () {
  var startY=Number(_savingP.value.startingDate.slice(0,4));
  var endY=Number(_savingP.value.endDate.slice(0,4));
  var startM=Number(_savingP.value.startingDate.slice(5,7));
  var endM=Number(_savingP.value.endDate.slice(5,7));
  if(_savingP.value.startingDate=='')
  {
    $q.notify({    color: 'orange-4',    textColor: 'black',    icon: 'warning',    message: 'Il faut renseigner une date de départ',  });
  }
  else if(_savingP.value.amount==0)
  {
    $q.notify({    color: 'orange-4',    textColor: 'black',    icon: 'warning',    message: 'Une épargne périodique de 0€ ne va rien rapporter',  });
  }
  else
  {
    bank.value.periodic_savings.push({ amount: _savingP.value.amount, rate: _savingP.value.rate, type: _savingP.value.type, startMonth: startM, startYear: startY, endMonth: endM, endYear:endY });
    _savingP.value.amount=0.0; _savingP.value.rate=0.0; _savingP.value.startMonth=0; _savingP.value.startYear=0; _savingP.value.endMonth=0, _savingP.value.endYear=0; _savingP.value.type='mensuelle'; _savingP.value.startingDate='';_savingP.value.endDate='';
  }

}
const addElementToSingleIO=function(){
  var Y=Number(_single_io.value.date.slice(0,4));
  var M=Number(_single_io.value.date.slice(5,7));
  if(_single_io.value.date=='')
  {
    $q.notify({    color: 'orange-4',    textColor: 'black',    icon: 'warning',    message: 'Il faut renseigner une date ! Sinon remplir l\'épargne !',  });
  }
  else if(_single_io.value.amount==0)
  {
    $q.notify({    color: 'orange-4',    textColor: 'black',    icon: 'warning',    message: 'Une entrée ou sortie d\'argent nulle n\'a pas d\'effet',  });
  }
  else
  {
    bank.value.single_in_out.push({title:_single_io.value.title,type:_single_io.value.type,amount:_single_io.value.amount,date:_single_io.value.date,month:M,year:Y,rate:_single_io.value.rate});
    _single_io.value.title='';_single_io.value.amount=0;_single_io.value.type='entrée';_single_io.value.date='';_single_io.value.rate=0;
  }

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
  for (var i = 0; i < bank.value.periodic_savings.length; i++) {
    if ( bank.value.periodic_savings[i].amount == saving.amount && bank.value.periodic_savings[i].rate == saving.rate && bank.value.periodic_savings[i].startMonth == saving.startMonth && bank.value.periodic_savings[i].startYear == saving.startYear) {
      bank.value.periodic_savings.splice(i, 1);
      return;
    }
  }
}

const removeSingleIO = function (saving) {
  for (var i = 0; i < bank.value.single_in_out.length; i++) {
    if ( bank.value.single_in_out[i].amount == saving.amount &&  bank.value.single_in_out[i].month == saving.month && bank.value.single_in_out[i].year == saving.year && bank.value.single_in_out[i].type == saving.type && bank.value.single_in_out[i].title == saving.title) {
      bank.value.single_in_out.splice(i, 1);
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
