<template>
  <accountForm v-if="displayAccountForm==true"  @account-added="[displayAccountForm=false,mustAlertChangeChart=true,mustAlertChangeMem=true]" @account-aborted="displayAccountForm=false"></accountForm>
  <periodicSavingsForm v-if="displayPSForm==true" @ps-added="[displayPSForm=false,mustAlertChangeChart=true,mustAlertChangeMem=true]" @ps-aborted="displayPSForm=false"></periodicSavingsForm>
  <singleIOFrom v-if="displaySIOForm==true" @sio-added="[displaySIOForm=false,mustAlertChangeChart=true,mustAlertChangeMem=true]" @sio-aborted="displaySIOForm=false"></singleIOFrom>
  <q-page >
    <q-page-sticky position="top-right" :offset="[0, 0]" style="z-index:3">
      <q-icon name="help" size="x-large" color="white" class="q-mt-md q-mr-md" v-if="show_tuto==false" @click="[MustPopTutorial=true,show_tuto=true,tutoPhase=0]"></q-icon>
   </q-page-sticky>
  <div class="full-height column justify-arround content-center" style="display: flex; width: 100%; height: 100%;" v-touch-swipe.mouse.left.right="handleSwipeExt">
    <q-card  v-if="(show_tuto==true && tutoPhase>=3)||show_tuto==false" class="bg-grey-9 my-card q-mt-md" style="display: flex;width: 100%;align-items:flex-start;justify-content: center;align-content: center">
      <div style="display: flex;flex-direction: column;width: 100%;">
        <div style="display: flex;flex-direction: row;align-items: center;justify-content: center;align-content: center;width: 100%;">
          <p class="myTitle">{{transStr(stringsIDs.str_title_accounts)}}</p>
        </div>
        <div style="display: flex;flex-direction: row;align-items: center;justify-content: center;align-content: center;width: 100%;">
          <q-btn :label=transStr(stringsIDs.str_btn_add) class="q-mb-xs" color="blue-grey-8" style="height:40px" @click="displayAccountForm=true" :disable="show_tuto==true"></q-btn>
        </div>
        <div style="display: flex;flex-direction: row;align-items: center;justify-content: center;align-content: center;width: 100%;">
          <q-scroll-area ref="scrollAreaAccRef" style="display:flex;width: 100%;height: 200px;">
          <q-markup-table class="my-table bg-grey-8" separator="cell" flat bordered @touchstart.stop>
            <thead>
              <tr>
                <th span="1" style="width: 30%;font-weight: bold;font-size: larger;">{{transStr(stringsIDs.str_head_name)}}</th>
                <th span="1" style="width: 30%;font-weight: bold;font-size: larger;">{{transStr(stringsIDs.str_head_amount)}}</th>
                <th span="1" style="width: 20%;font-weight: bold;font-size: larger;">{{transStr(stringsIDs.str_head_profit)}}</th>
                <th span="1" style="width: 10%;font-weight: bold;font-size: larger;">{{transStr(stringsIDs.str_bank_display_creation)}}</th>
                <th span="1" style="width: 10%"> </th>
              </tr>
            </thead>
            <tbody>
                <tr style="font-size: larger" v-for="account in bank.accounts" :key="account.id">
                <th style="font-size: larger">{{ account.title }}</th>
                <th style="font-size: larger">{{ formatnumber(account.amount.toString())+' '+getCurrencySymbol()}}</th>
                <th style="font-size: larger">{{ account.rate }}</th>
                <th style="font-size: larger">{{ account.open_m+'/'+account.open_y}}</th>
                <th ><q-btn dense size="s" icon="delete_forever" @click="[removeAccount(account),mustAlertChangeChart=true,mustAlertChangeMem=true]"></q-btn></th>
              </tr>
            </tbody>
          </q-markup-table>
        </q-scroll-area>
        </div>
      </div >
    </q-card>


    <q-card v-if="(show_tuto==true && tutoPhase>=4)||show_tuto==false" class="bg-grey-9 my-card q-mt-md" style="display: flex;width: 100%;align-items:flex-start;justify-content: center;align-content: center">
      <div style="display: flex;flex-direction: column;width: 100%;">
        <div style="display: flex;flex-direction: row;align-items: center;justify-content: center;align-content: center;width: 100%;">
          <p class="myTitle">{{transStr(stringsIDs.str_save_capability)}}</p>
        </div>
        <div style="display: flex;flex-direction: row;align-items: center;justify-content: center;align-content: center;width: 100%;">
          <q-btn :disable="bank.accounts.length==0 || show_tuto==true" class="q-mb-xs" color="blue-grey-8" style="height:40px" :label=transStr(stringsIDs.str_btn_add)
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
                <th><q-btn dense size="s" icon="delete_forever" @click="[removeSavingP(saving,account),mustAlertChangeChart=true,mustAlertChangeMem=true]"></q-btn></th>
              </tr>
            </tbody>
          </q-markup-table>
        </q-scroll-area>
        </div>
      </div >
    </q-card>

    <q-card v-if="(show_tuto==true && tutoPhase>=5)||show_tuto==false" class="bg-grey-9 my-card q-mt-md" style="display: flex;width: 100%;align-items:flex-start;justify-content: center;align-content: center">

      <div style="display: flex;flex-direction: column;width: 100%;">
        <div style="display: flex;flex-direction: row;align-items: center;justify-content: center;align-content: center;width: 100%;">
          <p class="myTitle">{{ transStr(stringsIDs.str_title_sio) }}</p>
        </div>
        <div style="display: flex;flex-direction: row;align-items: center;justify-content: center;align-content: center;width: 100%;">
          <q-btn :disable="bank.accounts.length==0 || show_tuto==true" class="q-mb-xs" color="blue-grey-8" style="height:40px" :label=transStr(stringsIDs.str_btn_add)
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
                <th><q-btn dense size="s" icon="delete_forever" @click="[removeSingleIO(io,account),mustAlertChangeChart=true,mustAlertChangeMem=true]"></q-btn></th>
              </tr>
            </tbody>
          </q-markup-table>
      </q-scroll-area>
        </div>
      </div >
    </q-card>
    <div class="q-ma-md" style="display: flex;flex-direction: column;justify-content:center;align-content: center;">
      <tutoDisplayer>
        <th  v-if="show_tuto==true && tutoPhase==5" class="q-ma-md" style="color: white;font-size:20px;">{{transStr(stringsIDs.str_tuto_bank_6)}}</th>
        <th  v-if="show_tuto==true && tutoPhase==4" class="q-ma-md" style="color: white;font-size:20px;">{{transStr(stringsIDs.str_tuto_bank_5)}}</th>
        <th  v-if="show_tuto==true && tutoPhase==3" class="q-ma-md" style="color: white;font-size:20px;">{{transStr(stringsIDs.str_tuto_bank_4)}}</th>
        <shakeBtn v-if="show_tuto==true && tutoPhase>=2 && tutoPhase<=4" @click="[tutoPhase==0 ?tutoPhase=0:tutoPhase<5 ?tutoPhase++: tutoPhase=5,ScrollDown()]" btn-label=">>" ></shakeBtn>
        <videoPlayer v-if="show_tuto==true &&(tutoPhase==5)" class="q-ma-md" color="blue-grey-8" :name="stringsIDs.str_savings_help"></videoPlayer>
        <q-btn v-if="show_tuto==true &&(tutoPhase==5)" class="q-ma-md" color="blue-grey-8" :label=transStr(stringsIDs.str_tuto_close_tuto) @click="[show_tuto=false,tutoPhase=0]"></q-btn>
      </tutoDisplayer>
    </div>
    <div  v-if="show_tuto==true" ref="MyTutoSentance" ></div>
  </div>


    <div class="col">
      <q-dialog v-model="mustPopDeleteAcc" cover persistent transition-show="scale" transition-hide="scale">
        <div class="q-mt-md" >
          <warningDisplayer class="q-mt-md">
            <div class="col flex flex center justify-around">
              <div class="q-ma-md">
                <th style="color: white;font-size: 18px;font-family:'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif ;">{{transSt(sentancesIDs.s_warning_acc_delete_rebuy_op)}}</th>
              </div>
              <div class="row nowrap">
                <q-btn class="q-ma-md" style="background-color: black;color: white;" outilne  :label=transStr(stringsIDs.str_cancel) @click="mustPopDeleteAcc = false"></q-btn>
                <q-btn class="q-ma-md" style="background-color: black;color: white;" outilne  :label=transStr(stringsIDs.str_btn_valid) @click="[mustPopDeleteAcc=false,removeAccount(accountToBeDeleted,true)]"></q-btn>
              </div>
            </div>
          </warningDisplayer>
        </div>
      </q-dialog>
    </div>

    <div class="col">
      <q-dialog v-model="mustPopDeleteP" cover transition-show="scale" transition-hide="scale">
        <div class="q-mt-md" >
          <warningDisplayer class="q-mt-md">
            <div class="col flex flex center justify-around">
              <div class="q-ma-md">
                <th style="color: white;font-size: 18px;font-family:'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif ;">{{ transSt(sentancesIDs.s_warning_acc_rebuy_op) }}</th>
              </div>
              <div class="row nowrap">
                <q-btn class="q-ma-md" style="background-color: black;color: white;"  outilne :label=transStr(stringsIDs.str_cancel) @click="mustPopDeleteP = false"></q-btn>
                <q-btn class="q-ma-md" style="background-color: black;color: white;"  outilne :label=transStr(stringsIDs.str_btn_valid) @click="[mustPopDeleteP=false,removeSavingP(savingPtoDelete,accountOfSavingPToDelete,true)]"></q-btn>
              </div>
            </div>
          </warningDisplayer>
        </div>
      </q-dialog>
    </div>

    <div class="col">
      <q-dialog v-model="mustPopDeleteSIO" cover transition-show="scale" transition-hide="scale">
        <div class="q-mt-md" >
          <warningDisplayer class="q-mt-md">
            <div class="col flex flex center justify-around">
              <div class="q-ma-md">
                <th style="color: white;font-size: 18px;font-family:'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif ;">{{ transSt(sentancesIDs.s_warning_op_rebuy_delete) }}</th>
              </div>
              <div class="row nowrap">
                <q-btn class="q-ma-md" style="background-color: black;color: white;" outilne :label=transStr(stringsIDs.str_cancel) @click="mustPopDeleteSIO = false"></q-btn>
                <q-btn class="q-ma-md" style="background-color: black;color: white;" outilne :label=transStr(stringsIDs.str_btn_valid) @click="[mustPopDeleteSIO=false,removeSingleIO(SIOtoDelete,accountOfSIOToDelete,true)]"></q-btn>
              </div>
            </div>
          </warningDisplayer>
        </div>
      </q-dialog>
    </div>
  </q-page>
  <q-dialog v-if="show_tuto==true && tutoPhase==0" v-model="MustPopTutorial"   cover transition-show="scale" transition-hide="scale" maximized full-width  auto-close  v-on:before-hide="[tutoPhase=1,MustPopTutorial=true]"
    style="background-color: black;"   >
    <div class="q-ma-md" style="display: flex;flex-direction: column;justify-content:center;align-content: center;">
      <tutoDisplayer>
        <BankPurpose></BankPurpose>
      </tutoDisplayer>
    </div>
  </q-dialog>

  <q-dialog v-if="show_tuto==true && tutoPhase==1" v-model="MustPopTutorial"   cover transition-show="scale" transition-hide="scale" maximized full-width  auto-close  v-on:before-hide="[tutoPhase=3,MustPopTutorial=true,ScrollDown()]"
    style="background-color: black;"   >
    <div class="q-ma-md" style="display: flex;flex-direction: column;justify-content:center;align-content: center;">
      <tutoDisplayer>
        <BankExplainer></BankExplainer>
      </tutoDisplayer>
    </div>
  </q-dialog>
</template>

<script setup>
import tutoDisplayer from 'src/components/tutoDisplayer.vue';
import warningDisplayer from 'src/components/warningDisplayer.vue';
import shakeBtn from 'src/components/shakeBtn.vue';
import { bank, simu, tutoPhase,show_tuto, mustAlertChangeMem } from 'stores/store';
import { onMounted, ref,nextTick, onBeforeMount } from 'vue'
import { useQuasar,scroll } from 'quasar';
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
import {mustAlertChangeChart} from '../stores/store'
import videoPlayer from '../components/videoPlayer.vue';
import BankExplainer from 'src/components/BankExplainer.vue';
import BankPurpose from 'src/components/BankPurpose.vue';
const { getScrollTarget, setVerticalScrollPosition } = scroll
var MustPopTutorial=ref(show_tuto.value==true?true:false);


var MyTutoSentance=ref();

const ScrollDown=function(){
  if(show_tuto.value==false)
  {
    return ;
  }
  const target =getScrollTarget(MyTutoSentance.value);
  const offset=MyTutoSentance.value.offsetTop;
  const duration = 1000;
  setTimeout(setVerticalScrollPosition(target, offset, duration),150);
}
const $q = useQuasar();
var MustPopTutorial=ref(false);
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
  if(show_tuto.value==false)
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
  else
  {
    tutoPhase.value=0;
  }
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

const setupTuto=function()
{
  if(show_tuto.value==true)
  {
    tutoPhase.value=0;
    MustPopTutorial.value=true;
  }
}
onBeforeMount(setupTuto);
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
