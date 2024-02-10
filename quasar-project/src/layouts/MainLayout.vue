<template>
    <q-layout view="hhh lpr fFf" class="bg-image">
      <q-footer class="gutter">
        <q-tabs
        v-model="tab"
        class="footer-bg text-white shadow-2 gutter"
      >
        <q-route-tab name="start" label="crédit" nocaps icon="feed" to="/" />
        <q-route-tab name="events" label="Modulation" icon="toc" to="/events" :disable="initFormDone==false"/>
        <q-route-tab name="summary" label="résumé" icon="money" to="/summary" :disable="initFormDone==false"/>
        <q-route-tab name="chart" label="graphique" icon="bar_chart" to="/lineChart" :disable="initFormDone==false"/>
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

</template>

<script setup lang="ts">



import { ref,watch } from 'vue';
import {startFormFilled} from 'stores/store'
import { simu } from 'stores/store';
var tab=ref('start');
var  initFormDone =ref(false);
const setInitDone=function(b_in:boolean){
  initFormDone.value=b_in};
watch(startFormFilled,setInitDone);
if (simu.value.credit.amount==0) {
  simu.value.credit.amount= 176000;
}
if (simu.value.credit.rate==0) {
  simu.value.credit.rate= 3.25;
}
if (simu.value.credit.year==0) {
  simu.value.credit.year= 20;
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
