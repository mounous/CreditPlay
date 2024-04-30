<template>
  <div class="full-height column justify-arround content-center verticalFlex">
    <q-card class="bg-grey-9 my-card q-ma-md">
      <p>Comptes banquaires</p>
      <div class="col q-ma-xs">
        <div class="row flex rowNoWrap q-ma-xs">
          <q-input class="q-mx-xs" label="nom du compte" size=8 maxlength="20" v-model="_account.title" type="text"
            lazy-rules :rules="[(val) => (val.length < 20) || 'choisir un nom plus court']" clearable
            bg-color="blue-grey-8" outlined dense></q-input>
          <q-input class="q-mx-xs" label="Somme" style="max-width:110px" maxlength="8" v-model="_account.amount"
            type="number" lazy-rules :rules="[(val) => (val >= 0.0) || 'Les dettes ne sont pas gérées']"
            bg-color="blue-grey-8" outlined dense></q-input>
          <q-input class="q-mx-xs" label="rentabilité" style="max-width:100px" maxlength="8" v-model="_account.rate"
            type="number" bg-color="blue-grey-8" outlined dense></q-input>
          <q-btn class="q-mx-xs" dense style="height:38px" label="ajouter" color="blue-grey-8"
            @click="addElementToAccounts()"></q-btn>
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
              <tr v-for="account in bank.accounts" :key="account.id">
                <th>{{ account.title }}</th>
                <th>{{ account.amount }}</th>
                <th>{{ account.rate }}</th>
                <th><q-btn dense size="s" icon="delete_forever" @click="removeAccount(account)"></q-btn></th>
              </tr>
            </tbody>
          </q-markup-table>
        </div>
      </div>
    </q-card>


    <q-card class="bg-grey-9 my-card q-ma-md">
      <p>Capacité d'épargne</p>
      <div class="col q-ma-xs">
        <div class="row flex  q-ma-xs">
          <q-select bg-color="blue-grey-8" dense v-model="_savingP.type" label="type"
            :options="['mensuelle', 'annuelle']"></q-select>
          <q-input class="q-mx-xs" label="montant" style="max-width:110px" maxlength="8" v-model="_savingP.amount"
            type="number" lazy-rules :rules="[(val) => (val >= 0.0) || 'Les retraits ne sont pas gérées']"
            bg-color="blue-grey-8" outlined dense></q-input>
          <q-select class="q-mx-xs" label="compte" style="max-width:100px" maxlength="8" v-model="_savingP.account"
            :options="getAccOpt()" type="number" bg-color="blue-grey-8" outlined dense></q-select>

          <q-input class="q-mx-xs" dense style="max-width:100px" label="A partir de" bg-color="blue-grey-8" filled
            v-model="_savingP.startingDate" mask="date" @click="mustpopPsStart=true" readonly>
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale" v-model="mustpopPsStart">
                  <q-date dark v-model="_savingP.startingDate" :locale="formatCalendar"
                    :navigation-min-year-month="periodicSaveMin" width="200px"
                    :navigation-max-year-month="periodicSaveMax" @update:model-value="mustpopPsStart=false">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-input class="q-mx-xs" dense style="max-width: 100px;" label="jusqu'à  " bg-color="blue-grey-8" filled
            v-model="_savingP.endDate" mask="date" @click="mustpopPsEnd=true" readonly>
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale" v-model="mustpopPsEnd">
                  <q-date dark v-model="_savingP.endDate" :locale="formatCalendar"
                    :navigation-min-year-month="periodicSaveMin" width="200px"
                    :navigation-max-year-month="periodicSaveMax" @update:model-value="mustpopPsEnd=false">
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

                <th span="1" style="width: 15%">Somme</th>
                <th span="1" style="width: 15%">compte</th>
                <th span="1" style="width: 10%">type</th>
                <th span="1" style="width: 15%">à partir de</th>
                <th span="1" style="width: 15%">jusqu'à</th>
                <th span="1" style="width: 10%"> </th>
              </tr>
            </thead>
            <tbody v-for="account in bank.accounts" :key="account.name">
              <tr v-for="saving in account.periodic_savings" :key="saving.amount">

                <th>{{ saving.amount }}</th>
                <th>{{ account.title }}</th>
                <th>{{ saving.type == 'mensuelle' ? 'Mens.' : 'An.' }}</th>
                <th>{{ saving.startMonth + '/' + saving.startYear }}</th>
                <th>{{ saving.endMonth != 0 && saving.endYear != 0 ? saving.endMonth + '/' + saving.endYear : '--\--' }}
                </th>
                <th><q-btn dense size="s" icon="delete_forever" @click="removeSavingP(saving,account)"></q-btn></th>
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
          <q-select bg-color="blue-grey-8" dense v-model="_single_io.type" label="type"
            :options="['entrée', 'sortie']"></q-select>
          <q-input class="q-mx-xs" label="montant" style="max-width:110px;min-width:100px" maxlength="8"
            v-model="_single_io.amount" type="number" lazy-rules bg-color="blue-grey-8" outlined dense></q-input>
          <q-input class="q-mx-xs" label="nom" style="max-width:100px" maxlength="20" v-model="_single_io.title"
            type="text" bg-color="blue-grey-8" outlined dense></q-input>
          <q-select class="q-mx-xs" label="compte" style="max-width:100px" maxlength="8" v-model="_single_io.account"
            :options="getAccOpt()" bg-color="blue-grey-8" outlined dense></q-select>

          <q-input class="q-mx-xs" dense style="max-width:100px" label="date" bg-color="blue-grey-8" filled
            v-model="_single_io.date" mask="date" @click="mustpopSingleIO=true" readonly>
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale" v-model="mustpopSingleIO">
                  <q-date dark v-model="_single_io.date" :locale="formatCalendar"
                    :navigation-min-year-month="periodicSaveMin" width="200px"
                    @update:model-value="mustpopSingleIO=false">
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

                <th span="1" style="width: 20%">nom</th>
                <th span="1" style="width: 15%">type</th>
                <th span="1" style="width: 15%">montant</th>
                <th span="1" style="width: 20%">compte</th>
                <th span="1" style="width: 20%">date</th>
                <th span="1" style="width: 10"></th>
              </tr>
            </thead>
            <tbody v-for="account in bank.accounts" :key="account.name">
              <tr v-for="io in account.single_in_out" :key="io.amount">

                <th>{{ io.title }}</th>
                <th>{{ io.type }}</th>
                <th>{{ io.amount }}</th>
                <th>{{ account.title }}</th>
                <th>{{ io.month + '/' + io.year }}</th>

                <th><q-btn dense size="s" icon="delete_forever" @click="removeSingleIO(io,account)"></q-btn></th>
              </tr>
            </tbody>
          </q-markup-table>
        </div>
      </div>
    </q-card>
    <div class="col">
      <q-dialog v-model="mustPopDeleteAcc" cover transition-show="scale" transition-hide="scale">
        <q-card>
          <div class="col flex flex center justify-around">
            <div class="q-ma-md">
              Vous êtes sur le point de supprimer un compte utilisé pour racheter votre crédit.
              Cela supprimera également le rachat du crédit si vous confirmez.
            </div>
            <div class="row nowrap">
              <q-btn label="Annuler" @click="mustPopDeleteAcc = false"></q-btn>
              <q-btn label="Confirmer" @click="[mustPopDeleteAcc=false,removeAccount(accountToBeDeleted,true)]"></q-btn>
            </div>
          </div>
        </q-card>
      </q-dialog>
    </div>
    <div class="col">
      <q-dialog v-model="mustPopDeleteP" cover transition-show="scale" transition-hide="scale">
        <q-card>
          <div class="col flex flex center justify-around">
            <div class="q-ma-md">
              Vous êtes sur le point de supprimer une opération sur un compte contribuant au rachat votre crédit.
              Cela supprimera également le rachat du crédit si vous confirmez.
            </div>
            <div class="row nowrap">
              <q-btn label="Annuler" @click="mustPopDeleteP = false"></q-btn>
              <q-btn label="Confirmer" @click="[mustPopDeleteP=false,removeSavingP(savingPtoDelete,accountOfSavingPToDelete,true)]"></q-btn>
            </div>
          </div>
        </q-card>
      </q-dialog>
    </div>
    <div class="col">
      <q-dialog v-model="mustPopDeleteSIO" cover transition-show="scale" transition-hide="scale">
        <q-card>
          <div class="col flex flex center justify-around">
            <div class="q-ma-md">
              Vous êtes sur le point de supprimer une opération contribuant au rachat votre crédit.
              Cela supprimera également le rachat du crédit si vous confirmez.
            </div>
            <div class="row nowrap">
              <q-btn label="Annuler" @click="mustPopDeleteSIO = false"></q-btn>
              <q-btn label="Confirmer" @click="[mustPopDeleteSIO=false,removeSingleIO(SIOtoDelete,accountOfSIOToDelete,true)]"></q-btn>
            </div>
          </div>
        </q-card>
      </q-dialog>
    </div>
  </div>
</template>

<script setup>
import { bank, simu } from 'stores/store';
import { ref } from 'vue'
import { useQuasar } from 'quasar';
import { formatCalendar } from '../utils/calendar_utility';
import {BANK_SEARCH_ERROR,getAccId,getSavinPID,getSIOID,makeAccountNameUnique,isAccountInvolvedInRebuyWithSavings, deleteRebuySavingsEventAndAssociatedInOut} from '../utils/bank_utility'
const $q = useQuasar();
const _account = ref({ title: '', amount: 0.0, rate: 0.0 });
const _savingP = ref({  account :'',amount: 0.0, rate: 0.0, startMonth: 0, startYear: 0, endMonth: 0, endYear: 0, type: 'mensuelle',startingDate:'',endDate:'' });
const _single_io =ref({account:'',title: '', type:'entrée', amount:0,year:0,month:0,date:'',rate:0});
var limitMonth = new Date().getFullYear().toString();
var limitYear = (new Date().getMonth() + 1).toString().padStart(2, '0');
var periodicSaveMin = ref(limitMonth + '/' + limitYear);
var periodicSaveMax = ref('2100/01');
var mustpopPsStart=ref(false);
var mustpopPsEnd=ref(false);
var mustpopSingleIO=ref(false);
var mustPopDeleteAcc=ref(false);
var mustPopDeleteP=ref(false);
var accountToBeDeleted=ref();
var accountOfSavingPToDelete=ref();
var savingPtoDelete=ref();
var accountOfSIOToDelete=ref();
var SIOtoDelete=ref();
var mustPopDeleteSIO=ref(false);
const getAccOpt=function()
{
  var toreturn=[]
  for (var acc =0;acc< bank.value.accounts.length;acc++)
  {
    toreturn.push( bank.value.accounts[acc].title);
  }
  return toreturn;
}
const addElementToAccounts = function () {
  if(_account.value.amount==0)
  {
    $q.notify({    color: 'orange-4',    textColor: 'black',    icon: 'warning',    message: 'Une épargne de 0€ n\'est pas une épargne',  });
  }
  else if(_account.value.amount<0)
  {
    $q.notify({    color: 'orange-4',    textColor: 'black',    icon: 'warning',    message: 'Une dette n\'est pas une épargne',  });
  }
  else
  {
    bank.value.accounts.push({ title: makeAccountNameUnique(_account.value.title), amount: Number(_account.value.amount), rate: _account.value.rate,single_in_out:[],periodic_savings:[],computedOverTime:[] });
    _account.value.title='';
    _account.value.amount=0.0;
    _account.value.rate=0.0;
  }
}
const addElementToSavingsP = function () {
  var indexAcc=0;
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
  else if(_savingP.value.amount<0)
  {
    $q.notify({    color: 'orange-4',    textColor: 'black',    icon: 'warning',    message: 'Une épargne négative n\'est pas un épargne',  });
  }
  else
  {
    indexAcc=getAccId(_savingP.value.account);
    if(BANK_SEARCH_ERROR==indexAcc)
    {
      $q.notify({    color: 'orange-4',    textColor: 'black',    icon: 'warning',    message: 'compte de rattachement non trouvé',  });
      return;
    }
    bank.value.accounts[indexAcc].periodic_savings.push({ amount: Number(_savingP.value.amount), account: _savingP.value.account, type: _savingP.value.type, startMonth: startM, startYear: startY, endMonth: endM, endYear:endY });
    _savingP.value.amount=0.0; _savingP.value.account=''; _savingP.value.startMonth=0; _savingP.value.startYear=0; _savingP.value.endMonth=0, _savingP.value.endYear=0; _savingP.value.type='mensuelle'; _savingP.value.startingDate='';_savingP.value.endDate='';
  }

}
const addElementToSingleIO=function(){
  var Y=Number(_single_io.value.date.slice(0,4));
  var M=Number(_single_io.value.date.slice(5,7));
  var indexAcc=0;
  if(_single_io.value.date=='')
  {
    $q.notify({    color: 'orange-4',    textColor: 'black',    icon: 'warning',    message: 'Il faut renseigner une date ! Sinon remplir l\'épargne !',  });
  }
  else if(_single_io.value.amount==0)
  {
    $q.notify({    color: 'orange-4',    textColor: 'black',    icon: 'warning',    message: 'Une entrée ou sortie d\'argent nulle n\'a pas d\'effet',  });
  }
  else if(_single_io.value.title=='rachat avec économies' )
  {
    $q.notify({    color: 'orange-4',    textColor: 'black',    icon: 'warning',    message: 'Ce nom est réservé. Choisir un autre nom',  });
  }
  else
  {
    indexAcc=getAccId(_single_io.value.account);
    if(BANK_SEARCH_ERROR==indexAcc)
    {
      $q.notify({    color: 'orange-4',    textColor: 'black',    icon: 'warning',    message: 'compte de rattachement non trouvé',  });
      return;
    }
    bank.value.accounts[indexAcc].single_in_out.push({account:_single_io.value.account,title:_single_io.value.title,type:_single_io.value.type,amount:Number(_single_io.value.amount),date:_single_io.value.date,month:M,year:Y});
    _single_io.value.title='';_single_io.value.amount=0;_single_io.value.type='entrée';_single_io.value.date='';_single_io.value.account='';
  }

}

const removeAccount = function (account,force=false) {
  var i=getAccId(account.title)
  if(i!=BANK_SEARCH_ERROR)
  {
    accountToBeDeleted.value=account;
    if(simu.value.credit.has_been_rebougth && force==false)
    {
      if(isAccountInvolvedInRebuyWithSavings(i))
      {
        mustPopDeleteAcc.value=true;
        return;
      }
    }
    bank.value.accounts.splice(i, 1);
    if(force)//delete the rebuy with savings event, delete all single io linked to this event
    {
      deleteRebuySavingsEventAndAssociatedInOut();
    }
  }
  else
  {
      $q.notify({    color: 'orange-4',    textColor: 'black',    icon: 'warning',    message: 'compte de rattachement non trouvé',  });
      return;
  }
}
const removeSavingP = function (savingP,account,force=false) {
  var i=getAccId(account.title)
  if(i!=BANK_SEARCH_ERROR)
  {
    var psId=getSavinPID(i,savingP.title);
    if(psId!=BANK_SEARCH_ERROR)
    {
      if(simu.value.credit.has_been_rebougth && force==false)
      {
        if(isAccountInvolvedInRebuyWithSavings(i))
        {
          accountOfSavingPToDelete.value=account;
          savingPtoDelete.value=savingP;
          mustPopDeleteP.value=true;
          return;
        }
      }
      bank.value.accounts[i].periodic_savings.splice(psId, 1);
      if(force)
      {
        deleteRebuySavingsEventAndAssociatedInOut();
      }
      return;
    }
    else
    {
      $q.notify({    color: 'orange-4',    textColor: 'black',    icon: 'warning',    message: 'Epargne periodique non trouvé',  });
    }
  }
  else
  {
      $q.notify({    color: 'orange-4',    textColor: 'black',    icon: 'warning',    message: 'compte de rattachement non trouvé',  });
      return;
  }
}

const removeSingleIO = function (SIO,account,force=false) {
  var i=getAccId(account.title)
  if(i!=BANK_SEARCH_ERROR)
  {
    var ioID=getSIOID(i,SIO.title);
    if(ioID!=BANK_SEARCH_ERROR)
    {
      if(simu.value.credit.has_been_rebougth && force==false)
      {
        if(isAccountInvolvedInRebuyWithSavings(i))
        {
          accountOfSIOToDelete.value=account;
          SIOtoDelete.value=SIO;
          mustPopDeleteSIO.value=true;
          return;
        }
      }
      bank.value.accounts[i].single_in_out.splice(ioID, 1);
      if(force)
      {
        deleteRebuySavingsEventAndAssociatedInOut();
      }
      return;
    }
    else
    {
      $q.notify({    color: 'orange-4',    textColor: 'black',    icon: 'warning',    message: 'Epargne exceptionnelle non trouvé',  });
      return;
    }
  }
  else
  {
      $q.notify({    color: 'orange-4',    textColor: 'black',    icon: 'warning',    message: 'compte de rattachement non trouvé',  });
      return;
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
