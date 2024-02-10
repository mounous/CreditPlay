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
import { simu } from 'stores/store';
const mount=function() {
  var amort_init=simu.value.credit.amort;
  var interests_paid =amort_init[amort_init.length-1][2];
  var EndDate = amort_init[amort_init.length-1][0];
  var _id=0
  var _text='Situation initiale : Mensualité : '+simu.value.credit.mensuality.toString()+' fin de l\'emprunt : ' +EndDate+ ' coût total : '+interests_paid.toString();
  summaries.value.push({id:_id,text:_text});
  if(simu.value.events.length!=0)
  {
    for(var i=0;i<simu.value.events.length;i++)
    {
      _id=i+1;
      _text='Evènement : ' + simu.value.events[i].title+'à compter de : '+simu.value.events[i].month.toString()+'/'+simu.value.events[i].year.toString()+' Mensualité : '+simu.value.events[i].new_mens.toString()+' fin de l\'emprunt : '+simu.value.events[i].end_month.toString()+'/'+simu.value.events[i].end_year.toString()+' coût total : '+simu.value.events[i].amortEvt[simu.value.events[i].amortEvt.length-1].toString();
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
