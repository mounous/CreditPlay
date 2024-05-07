<template>
    <q-layout view="hhh lpr fFf" class="bg-image">
      <q-footer class="gutter">
        <q-tabs
        v-model="tab"
        class="footer-bg text-white shadow-2 gutter"
      >
        <q-route-tab name="start" label="crédit" nocaps icon="feed" to="/" />
        <q-route-tab name="events" label="Opérations" icon="toc" to="/events" :disable="initFormDone==false"/>
        <q-route-tab name="summary" label="résumé" icon="money" to="/summary" :disable="initFormDone==false"/>
        <q-route-tab name="chart" label="graphique" icon="bar_chart" to="/lineChart" :disable="initFormDone==false&&bankDone==false" />
        <q-route-tab name="save" label="épargne" icon="account_balance" to="/bank"/>
        <q-route-tab name="memory" label="Mémoire" icon="import_export" to="/memory"/>
        <q-route-tab name="help" label="aide" icon="help" to="/help"/>

      </q-tabs>
      </q-footer>
      <q-page-container>
        <KeepAlive>
          <router-view />
        </KeepAlive>
      </q-page-container>
    </q-layout>

    <div class="col">
      <q-dialog v-model="mustPopRestore" cover transition-show="scale" transition-hide="scale">
        <q-card>
          <div class="col flex flex center justify-around">
            <div class="q-ma-md">
              Reprendre la dernière simulation sauvegardée ?
            </div>
            <div class="row nowrap">
              <q-btn label="Non" @click="mustPopRestore = false"></q-btn>
              <q-btn label="Oui" @click="[mustPopRestore=false,restoreLastSaving()]"></q-btn>
            </div>
          </div>
        </q-card>
      </q-dialog>
    </div>

    <div class="col">
      <q-dialog v-model="mustPopLanguage" cover transition-show="scale" transition-hide="scale">
        <languagePicker @language-picked="mustPopLanguage=false"></languagePicker>
      </q-dialog>
    </div>
</template>

<script setup lang="ts">


import { onBeforeMount, ref, watch } from 'vue';
import languagePicker from 'src/components/languagePicker.vue';
import { simu,bank,startFormFilled } from 'stores/store';
import { LocalStorage } from 'quasar';
import { useRouter } from 'vue-router';
var mustPopRestore=ref(false);
var mustPopLanguage=ref(false);
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
  simu.value.credit.amount= 176000;
}
if (simu.value.credit.rate==0) {
  simu.value.credit.rate= 3.25;
}
if (simu.value.credit.duration_y==0) {
  simu.value.credit.duration_y= 20;
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
  /*if(LocalStorage.has('currentLanguage'))
  {
    mustPopLanguage.value=false;
  }
  else
  {
    mustPopLanguage.value=true;
  }*/
  mustPopLanguage.value=true;
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
    router.push('/lineChart');
  }
}
</script>

<style lang="scss">
.bg-image {
  //background: linear-gradient(#1D1D1D, #6b6445);
  background: #1D1D1D;
  //background: #6b6445 ;
}
.footer-bg{
  background: secondary;
}
</style>
