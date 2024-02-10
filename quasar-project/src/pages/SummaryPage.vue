<template>
  <q-page>
    <div class="full-height column justify-arround content-center verticalFlex">
      <div class="col" v-for="item in summaries.values()" :key="item.id">
    <q-card
      class="q-ma-lg my-card text-white"
      style="background: radial-gradient(circle, #35a2ff 0%, #014a88 100%)"
    >
      <q-card-section class="q-pt-none">
        {{ item.text }}
      </q-card-section>
    </q-card>
  </div>
  </div>
  </q-page>
</template>

<script setup>
import {ref,onBeforeMount } from 'vue'
import { SessionStorage } from 'quasar';
const mount=function() {
  var amort_init=SessionStorage.getItem('amort_monthly');
  var interests_paid =amort_init[amort_init.length-1][2];
  var EndDate = amort_init[amort_init.length-1][0];
  var _id=0
  var _text='Situation initiale : Mensualité : '+SessionStorage.getItem('mensuality').toString()+' fin de l\'emprunt : ' +EndDate+ ' coût total : '+interests_paid.toString();
  summaries.value.push({id:_id,text:_text});
  if(SessionStorage.has('events'))
  {
    var events=SessionStorage.getItem('events');
    for(var i=0;i<events.length;i++)
    {
      _id=i+1;
      _text='Evènement : ' + events[i].title+'à compter de : '+events[i].month.toString()+'/'+events[i].year.toString()+' Mensualité : '+events[i].new_mens.toString()+' fin de l\'emprunt : '+events[i].end_month.toString()+'/'+events[i].end_year.toString()+' coût total : '+events[i].amortEvt[events[i].amortEvt.length-1].toString();
      summaries.value.push({id:_id,text:_text});
    }
  }
}
onBeforeMount(mount);
var summaries=ref([]);
</script>

<style lang="scss">
.verticalFlex {
  min-height: inherit;
  max-width: 100%;
}
</style>
