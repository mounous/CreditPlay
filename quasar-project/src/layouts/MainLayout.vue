<template>
    <q-layout view="hhh lpr fFf">
      <q-footer class="gutter">
        <q-tabs
        v-model="tab"
        class="bg-primary text-white shadow-2 gutter"
      >
        <q-route-tab name="start" icon="feed" to="/" />
        <q-route-tab name="events" icon="toc" to="/events" :disable="initFormDone==false"/>
        <q-route-tab name="summary" icon="money" to="/summary" :disable="initFormDone==false"/>
        <q-route-tab name="chart" icon="bar_chart" to="/summary" :disable="initFormDone==false"/>
        <q-route-tab name="help" icon="help" to="/help"/>

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


import { SessionStorage } from 'quasar';
import { ref,watch } from 'vue';
import {startFormFilled} from 'stores/example-store'
var tab=ref('start');
var  initFormDone =ref(false);
const setInitDone=function(b_in:boolean){
  initFormDone.value=b_in};
watch(startFormFilled,setInitDone);
if (!SessionStorage.has('amount')) {
  SessionStorage.set('amount', 176000);
}
if (!SessionStorage.has('taeg')) {
  SessionStorage.set('taeg', 3.25);
}
if (!SessionStorage.has('years')) {
  SessionStorage.set('years', 20);
}
if (!SessionStorage.has('event_nbr')) {
  SessionStorage.set('event_nbr', 0);
}
</script>

<style lang="scss">
.bg-image {
  background: linear-gradient(#cfdce1, #b2b7ee);
}
</style>
