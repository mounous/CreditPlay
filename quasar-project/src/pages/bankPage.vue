<template>
  <accountForm v-if="displayAccountForm==true"  @account-added="[displayAccountForm=false,mustAlertChart=true]" @account-aborted="displayAccountForm=false"></accountForm>
  <periodicSavingsForm v-if="displayPSForm==true" @ps-added="[displayPSForm=false,mustAlertChart=true]" @ps-aborted="displayPSForm=false"></periodicSavingsForm>
  <singleIOFrom v-if="displaySIOForm==true" @sio-added="[displaySIOForm=false,mustAlertChart=true]" @sio-aborted="displaySIOForm=false"></singleIOFrom>
  <q-page>
  <div class="full-height column justify-arround content-center" style="display: flex; width: 100%; height: 100%;" v-touch-swipe.mouse.left.right="handleSwipeExt">
    <q-card class="bg-grey-9 my-card q-mt-md" style="display: flex;width: 100%;align-items:flex-start;justify-content: center;align-content: center">
      <div style="display: flex;flex-direction: column;width: 100%;">
        <div style="display: flex;flex-direction: row;align-items: center;justify-content: center;align-content: center;width: 100%;">
          <p class="myTitle">{{transStr(stringsIDs.str_title_accounts)}}</p>
        </div>
        <div style="display: flex;flex-direction: row;align-items: center;justify-content: center;align-content: center;width: 100%;">
          <q-btn :label=transStr(stringsIDs.str_btn_add) class="q-mb-xs" color="blue-grey-8" style="height:40px" @click="displayAccountForm=true"></q-btn>
        </div>
        <div style="display: flex;flex-direction: row;align-items: center;justify-content: center;align-content: center;width: 100%;">
          <q-scroll-area ref="scrollAreaAccRef" style="display:flex;width: 100%;height: 200px;">
          <q-markup-table class="my-table bg-grey-8" separator="cell" flat bordered @touchstart.stop>
            <thead>
              <tr>
                <th span="1" style="width: 40%;font-weight: bold;font-size: larger;">{{transStr(stringsIDs.str_head_name)}}</th>
                <th span="1" style="width: 30%;font-weight: bold;font-size: larger;">{{transStr(stringsIDs.str_head_amount)}}</th>
                <th span="1" style="width: 20%;font-weight: bold;font-size: larger;">{{transStr(stringsIDs.str_head_profit)}}</th>
                <th span="1" style="width: 10%"> </th>
              </tr>
            </thead>
            <tbody>
                <tr style="font-size: larger" v-for="account in bank.accounts" :key="account.id">
                <th style="font-size: larger">{{ account.title }}</th>
                <th style="font-size: larger">{{ formatnumber(account.amount.toString())+' '+getCurrencySymbol() }}</th>
                <th style="font-size: larger">{{ account.rate }}</th>
                <th ><q-btn dense size="s" icon="delete_forever" @click="[removeAccount(account),mustAlertChart=true]"></q-btn></th>
              </tr>
            </tbody>
          </q-markup-table>
        </q-scroll-area>
        </div>
      </div >
    </q-card>

    <q-card class="bg-grey-9 my-card q-mt-md" style="display: flex;width: 100%;align-items:flex-start;justify-content: center;align-content: center">
      <div style="display: flex;flex-direction: column;width: 100%;">
        <div style="display: flex;flex-direction: row;align-items: center;justify-content: center;align-content: center;width: 100%;">
          <p class="myTitle">{{transStr(stringsIDs.str_save_capability)}}</p>
        </div>
        <div style="display: flex;flex-direction: row;align-items: center;justify-content: center;align-content: center;width: 100%;">
          <q-btn :disable="bank.accounts.length==0" class="q-mb-xs" color="blue-grey-8" style="height:40px" :label=transStr(stringsIDs.str_btn_add)
            @click="displayPSForm=true"></q-btn>
        </div>
        <div style="display: flex;flex-direction: row;align-items: center;justify-content: center;align-content: center;width: 100%;">
          <q-scroll-area ref="scrollAreaPSRef" style="display:flex;width: 100%;height: 200px;">
          <q-markup-table class="my-table bg-grey-8" separator="cell" flat bordered @touchstart.stop>
            <thead>
              <tr>

                <th span="1" style="width: 20%;font-weight: bold;font-size: larger;">{{transStr(stringsIDs.str_head_amount)}}</th>
                <th span="1" style="width: 15%;font-weight: bold;font-size: larger;">{{transStr(stringsIDs.str_account)}}</th>
                <th span="1" style="width: 15%;font-weight: bold;font-size: larger;">{{transStr(stringsIDs.str_save_type)}}</th>
                <th span="1" style="width: 20%;font-weight: bold;font-size: larger;">{{transStr(stringsIDs.str_ps_period)}}</th>

                <th span="1" style="width: 10%"> </th>
              </tr>
            </thead>
            <tbody v-for="account in bank.accounts" :key="account.name">
              <tr v-for="saving in account.periodic_savings" :key="saving.amount">
                <th  style="font-size: larger">{{ formatnumber(saving.amount.toString())+' '+getCurrencySymbol() }}</th>
                <th  style="font-size: larger">{{ account.title }}</th>
                <th  style="font-size: larger">{{ transoptSaveP(saving.type) }}</th>
                <th  style="font-size: larger">{{ saving.startMonth + '/' + saving.startYear + ' - '+(saving.endMonth != 0 && saving.endYear != 0 ? saving.endMonth + '/' + saving.endYear : '?/?')}}</th>
                <th><q-btn dense size="s" icon="delete_forever" @click="[removeSavingP(saving,account),mustAlertChart=true]"></q-btn></th>
              </tr>
            </tbody>
          </q-markup-table>
        </q-scroll-area>
        </div>
      </div >
    </q-card>

    <q-card class="bg-grey-9 my-card q-mt-md" style="display: flex;width: 100%;align-items:flex-start;justify-content: center;align-content: center">

      <div style="display: flex;flex-direction: column;width: 100%;">
        <div style="display: flex;flex-direction: row;align-items: center;justify-content: center;align-content: center;width: 100%;">
          <p class="myTitle">{{ transStr(stringsIDs.str_title_sio) }}</p>
        </div>
        <div style="display: flex;flex-direction: row;align-items: center;justify-content: center;align-content: center;width: 100%;">
          <q-btn :disable="bank.accounts.length==0" class="q-mb-xs" color="blue-grey-8" style="height:40px" :label=transStr(stringsIDs.str_btn_add)
            @click="displaySIOForm=true"></q-btn>
        </div>
        <div style="display: flex;flex-direction: row;align-items: center;justify-content: center;align-content: center;width: 100%;">
          <q-scroll-area ref="scrollAreaIORef" style="display:flex;width: 100%;height: 200px;">
          <q-markup-table class="my-table bg-grey-8" separator="cell" flat bordered @touchstart.stop>
            <thead>
              <tr>
                <th span="1" style="width: 20%;font-weight: bold;font-size: larger;">{{ transStr(stringsIDs.str_head_name) }}</th>
                <th span="1" style="width: 20%;font-weight: bold;font-size: larger;">{{ transStr(stringsIDs.str_head_amount) }}</th>
                <th span="1" style="width: 25%;font-weight: bold;font-size: larger;">{{ transStr(stringsIDs.str_account) }}</th>
                <th span="1" style="width: 25%;font-weight: bold;font-size: larger;">{{ transStr(stringsIDs.str_head_date) }}</th>
                <th span="1" style="width: 10"></th>
              </tr>
            </thead>
            <tbody v-for="account in bank.accounts" :key="account.name">
              <tr v-for="io in account.single_in_out" :key="io.amount">
                <th style="font-size: larger">{{ io.title }}</th>
                <th v-if="io.type==BANK_SIO_TYPE_OUT" style="font-size: larger"  class="text-red">{{ '- '+formatnumber(io.amount.toString())+' '+getCurrencySymbol() }}</th>
                <th v-if="io.type==BANK_SIO_TYPE_IN" style="font-size: larger"  class="text-green">{{'+ '+formatnumber(io.amount.toString())+' '+getCurrencySymbol() }}</th>
                <th style="font-size: larger">{{ account.title }}</th>
                <th style="font-size: larger">{{ io.month + '/' + io.year }}</th>
                <th><q-btn dense size="s" icon="delete_forever" @click="[removeSingleIO(io,account),mustAlertChart=true]"></q-btn></th>
              </tr>
            </tbody>
          </q-markup-table>
      </q-scroll-area>
        </div>
      </div >
    </q-card>
  </div>


    <div class="col">
      <q-dialog v-model="mustPopDeleteAcc" cover transition-show="scale" transition-hide="scale">
        <q-card>
          <div class="col flex flex center justify-around">
            <div class="q-ma-md">
              {{transSt(sentancesIDs.s_warning_acc_delete_rebuy_op)}}
            </div>
            <div class="row nowrap">
              <q-btn :label=transStr(stringsIDs.str_cancel) @click="mustPopDeleteAcc = false"></q-btn>
              <q-btn :label=transStr(stringsIDs.str_btn_valid) @click="[mustPopDeleteAcc=false,removeAccount(accountToBeDeleted,true)]"></q-btn>
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
              {{ transSt(sentancesIDs.s_warning_acc_rebuy_op) }}
            </div>
            <div class="row nowrap">
              <q-btn :label=transStr(stringsIDs.str_cancel) @click="mustPopDeleteP = false"></q-btn>
              <q-btn :label=transStr(stringsIDs.str_btn_valid) @click="[mustPopDeleteP=false,removeSavingP(savingPtoDelete,accountOfSavingPToDelete,true)]"></q-btn>
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
              {{ transSt(sentancesIDs.s_warning_op_rebuy_delete) }}
            </div>
            <div class="row nowrap">
              <q-btn :label=transStr(stringsIDs.str_cancel) @click="mustPopDeleteSIO = false"></q-btn>
              <q-btn :label=transStr(stringsIDs.str_btn_valid) @click="[mustPopDeleteSIO=false,removeSingleIO(SIOtoDelete,accountOfSIOToDelete,true)]"></q-btn>
            </div>
          </div>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script setup>
import { bank, simu } from 'stores/store';
import { onMounted, ref,nextTick } from 'vue'
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import {BANK_SEARCH_ERROR,getAccId,getSavinPID,getSIOID,isAccountInvolvedInRebuyWithSavings, deleteRebuySavingsEventAndAssociatedInOut,BANK_SIO_TYPE_IN,BANK_SIO_TYPE_OUT} from '../utils/bank_utility'
import { compareDates } from 'src/utils/date_utility';
import accountForm from 'src/components/accountForm.vue';
import periodicSavingsForm from 'src/components/periodicSavingsForm.vue';
import singleIOFrom from 'src/components/singleIOFrom.vue';
import {targetPage} from '../utils/swipe_utils.js'
import {transStr,stringsIDs,transoptSaveP,transSt,sentancesIDs,transSIOspecial} from '../stores/languages.ts'
import { formatnumber } from 'src/utils/string_utils';
import { getCurrencySymbol } from 'src/stores/currencies';
import {mustAlertChart} from '../stores/store'
const $q = useQuasar();

const router = useRouter();

var displayAccountForm=ref(false);
var displayPSForm=ref(false);
var displaySIOForm=ref(false);


var mustPopDeleteAcc=ref(false);
var mustPopDeleteP=ref(false);
var accountToBeDeleted=ref();
var accountOfSavingPToDelete=ref();
var savingPtoDelete=ref();
var accountOfSIOToDelete=ref();
var SIOtoDelete=ref();
var mustPopDeleteSIO=ref(false);
var scrollAreaPSRef = ref();
var scrollAreaIORef = ref();
var scrollAreaAccRef = ref();

const scrollAreas=async()=>
{

  scrollAreaAccRef.value.setScrollPercentage('horizontal',1.0,0);
  scrollAreaIORef.value.setScrollPercentage('horizontal',1.0,0);
  scrollAreaPSRef.value.setScrollPercentage('horizontal',1.0,0);
  await nextTick();

  setTimeout(function() {
    scrollAreaAccRef.value.setScrollPercentage('horizontal',0.0,600);
    scrollAreaIORef.value.setScrollPercentage('horizontal',0.0,600);
    scrollAreaPSRef.value.setScrollPercentage('horizontal',0.0,600);},
    900);
}
onMounted(scrollAreas);

const handleSwipeExt=function ({ evt, touch, mouse, direction, duration, distance })
{
  router.push(targetPage(direction,router.currentRoute.value.fullPath));
}

const removeAccount = function (account,force=false)
{
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
      $q.notify({    color: 'orange-4',    textColor: 'black',    icon: 'warning',    message: transStr(stringsIDs.str_acc_not_found),  });
      return;
  }
}
const removeSavingP = function (savingP,account,force=false) {
  var i=getAccId(account.title)
  if(i!=BANK_SEARCH_ERROR)
  {
    var psId=getSavinPID(i,savingP);
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
      $q.notify({    color: 'orange-4',    textColor: 'black',    icon: 'warning',    message: transStr(stringsIDs.str_saving_p_not_found),  });
    }
  }
  else
  {
      $q.notify({    color: 'orange-4',    textColor: 'black',    icon: 'warning',    message: transStr(stringsIDs.str_acc_not_found),  });
      return;
  }
}

const removeSingleIO = function (SIO,account,force=false) {
  var i=getAccId(account.title)
  if(i!=BANK_SEARCH_ERROR)
  {
    var ioID=getSIOID(i,SIO);
    if(ioID!=BANK_SEARCH_ERROR)
    {
      if(simu.value.credit.has_been_rebougth && force==false)
      {
        var indexOfrebuy=simu.value.events.length-1;
        var y_rebuy =simu.value.events[indexOfrebuy].year;
        var m_rebuy =simu.value.events[indexOfrebuy].month;
        var sioType = bank.value.accounts[i].single_in_out[ioID].type;
        if(isAccountInvolvedInRebuyWithSavings(i) && compareDates(y_rebuy,m_rebuy,SIO.year,SIO.month)>0 && sioType==BANK_SIO_TYPE_IN|| SIO.title==transSIOspecial())
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
      $q.notify({    color: 'orange-4',    textColor: 'black',    icon: 'warning',    message: transStr(stringsIDs.str_sio_not_found),  });
      return;
    }
  }
  else
  {
      $q.notify({    color: 'orange-4',    textColor: 'black',    icon: 'warning',    message: transStr(stringsIDs.str_acc_not_found),  });
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

.myTitle{
  font-size:20px;
}
</style>
