<template>
    <q-layout view="hhh lpr fFf" class="bg-image" :key="rerenderMainlayout">
      <q-footer class="gutter">
        <q-tabs
        v-model="tab"
        class="footer-bg text-white shadow-2 gutter"
      >
        <q-route-tab name="start" :label=transStr(stringsIDs.str_tab_credit) nocaps icon="feed" to="/" />
        <q-route-tab name="events" :label=transStr(stringsIDs.str_tab_ops) icon="toc" to="/events" :disable="initFormDone==false"/>
        <q-route-tab name="summary" :label=transStr(stringsIDs.str_tab_sum) icon="money" to="/summary" :disable="initFormDone==false"/>
        <q-route-tab name="chart" :label=transStr(stringsIDs.str_tab_chart) icon="bar_chart" to="/lineChart" :disable="initFormDone==false&&bankDone==false">
          <q-badge v-if="initFormDone==true && mustAlertChart==true" color="blue" floating>!</q-badge>
        </q-route-tab>
        <q-route-tab name="save" :label=transStr(stringsIDs.str_tab_savings) icon="account_balance" to="/bank"/>
        <q-route-tab name="memory" :label=transStr(stringsIDs.str_tab_mem) icon="import_export" to="/memory"/>
        <q-route-tab name="help" :label=transStr(stringsIDs.str_tab_help) icon="help" to="/help"/>

      </q-tabs>
      </q-footer>
      <q-page-container>
        <KeepAlive>
          <router-view />
        </KeepAlive>
      </q-page-container>
    </q-layout>

    <div class="col" v-if="MustPopTutorial==false && show_tuto==false" :key="rerenderMainlayout">
      <q-dialog v-model="mustPopRestore" cover transition-show="scale" transition-hide="scale" :key="rerenderMainlayout">
        <q-card>
          <div class="col flex flex center justify-around">
            <div class="q-ma-md">
              {{ transStr(stringsIDs.str_restore_last) }}
            </div>
            <div class="row nowrap">
              <q-btn :label=transStr(stringsIDs.str_no) @click="mustPopRestore = false"></q-btn>
              <q-btn :label=transStr(stringsIDs.str_yes) @click="[mustPopRestore=false,restoreLastSaving()]"></q-btn>
            </div>
          </div>
        </q-card>
      </q-dialog>
    </div>

    <div class="col" :key="rerenderMainlayout">
      <q-dialog v-model="mustPopLanguage" cover transition-show="scale" transition-hide="scale">
        <languagePicker @language-picked="[mustPopLanguage=false,rerenderMainlayout++]"></languagePicker>
      </q-dialog>
    </div>
    <div class="col">
      <q-dialog v-model="mustPopCurrency" cover transition-show="scale" transition-hide="scale">
        <CurrencyPicker @currency-picked="[mustPopCurrency=false]"></CurrencyPicker>
      </q-dialog>
    </div>


    <div v-if="MustPopTutorial==true" >
      <q-dialog v-model="MustPopTutorial" cover transition-show="scale" transition-hide="scale" persistent maximized full-width
      style="background-color: black;">
      <div style="display: flex;flex-direction: column;" class="q-ma-md">
        <div style="flex: 2;"></div>
        <div style="flex: 4;">
          <th class="q-ma-md" style="color: white;font-size:25px;">{{transStr(stringsIDs.str_tuto_welcome)}}</th>
        </div>
        <div style="display:flex ; flex: 3;flex-direction: column; align-items: center;align-content: center;justify-content: center;" class="q-ma-md">
          <q-btn class="q-ma-md" size="large" :label="transStr(stringsIDs.str_tuto_play)" color='blue-grey-8' @click="[LocalStorage.set('show_tuto',true),MustPopTutorial=false,show_tuto=true,rerenderMainlayout++,prepareTutoData()]"></q-btn>
          <q-btn class="q-ma-md" size="large" :label="transStr(stringsIDs.str_tuto_giveUp)" color='blue-grey-8' @click="[LocalStorage.set('show_tuto',false),MustPopTutorial=false,show_tuto=false,rerenderMainlayout++]"></q-btn>
        </div>
      </div>
      </q-dialog>
    </div>
</template>

<script setup lang="ts">


import { onBeforeMount, ref, watch } from 'vue';
import languagePicker from 'src/components/languagePicker.vue';
import {mustAlertChart,show_tuto} from '../stores/store'
import { simu,bank,startFormFilled } from 'stores/store';
import { LocalStorage } from 'quasar';
import { useRouter } from 'vue-router';
import { stringsIDs, transStr ,rerenderMainlayout} from 'src/stores/languages';
import { reapplyLanguageToData} from 'src/utils/credit_utility';
import CurrencyPicker from 'src/components/currencyPicker.vue';
import {prepareTutoData} from '../utils/tutorail_utils'
var MustPopTutorial = ref(LocalStorage.has('MustPopTutorial') ? LocalStorage.getItem('MustPopTutorial') : true);
var mustPopRestore=ref(false);
var mustPopCurrency=ref(LocalStorage.has('currentCurrency')?false:true);
var mustPopLanguage=ref(LocalStorage.has('currentLanguage')?false:true);
var tab=ref('start');
var  initFormDone =ref(false);
var bankDone=ref(false);
const router = useRouter();
const setInitDone=function(b_in:boolean){
  initFormDone.value=b_in};
const setbankdone=function()
{
  if(bank.value.accounts.length!=0)
  {
    bankDone.value=true;
  }
  else
  {
    bankDone.value=false;
  }
}
watch(startFormFilled,setInitDone);
watch(bank.value,setbankdone);
if (simu.value.credit.amount==0) {
  simu.value.credit.amount= 150000;
}
if (simu.value.credit.rate==0) {
  simu.value.credit.rate= 2.5;
}
if ( simu.value.credit.duration_m==0) {
  simu.value.credit.duration_m=240;
}
const MustPopObligation=function()
{
  if(LocalStorage.has('listSave'))
  {
    var list=ref();
    list.value=LocalStorage.getItem('listSave');
    if(list.value.length>0)
    {
      mustPopRestore.value=true;
    }
    else
    {
      mustPopRestore.value=false;
    }
  }
  if(LocalStorage.has('currentLanguage'))
  {
    mustPopLanguage.value=false;
  }
  else
  {
    mustPopLanguage.value=true;
  }
}
onBeforeMount(MustPopObligation);
const restoreLastSaving=function()
{
  var listmem=ref();
  if(LocalStorage.has('listSave'))
  {
    listmem.value=LocalStorage.getItem('listSave');
    var lastSave=listmem.value.slice(-1);
    simu.value=lastSave[0].simu;
    bank.value=lastSave[0].bank;
    startFormFilled.value = lastSave[0].startFormFilled;
    // in case events and simu have been saved in a different language, recompute the whole simu
    reapplyLanguageToData();
    router.push('/summary');
  }
}
</script>

<style lang="scss">
.bg-image {
  //background: linear-gradient(#1D1D1D, #6b6445);
  background: #000000;
  //background: #6b6445 ;
}
.footer-bg{
  background: secondary;
}
</style>
