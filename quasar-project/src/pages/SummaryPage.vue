<template>
  <q-page>
    <div class="full-height column justify-arround content-center verticalFlex">
      <div class="col">
        <q-timeline  class="q-ma-lg text-white">
      <q-timeline-entry heading>Résumé de la simulation</q-timeline-entry>
      <q-timeline-entry  v-for="item in summaries.values()" :key="item.id" :title="item.title" :subtitle="item.subtitle" id="item.id">
        <div v-if="item.type!=optionsReBuyType[0]" >{{ item.text1 }}</div>
        <div>{{ item.text2 }}</div>
        <div>{{ item.text3 }}</div>
        <div v-if="item._text4!=''" :class="item.text4_color">{{ item.text4 }}</div>
        <div :class="item.text5_color">{{ item.text5 }}</div>
      </q-timeline-entry>
    </q-timeline>
  </div>
  </div>
  </q-page>
</template>

<script setup>
import {ref,onBeforeMount } from 'vue'
import { simu } from 'stores/store';
import {formatnumber} from './string_utils'
import { optionsReBuyType } from './bank_utility';
var summaries=ref([]);

const beforemount=function() {
  var amort_init=simu.value.credit.amort;
  var interests_paid =amort_init[amort_init.length-1][2];
  var EndDate = amort_init[amort_init.length-1][0];
  var _date_to_display = simu.value.credit.startingDate
  var _id=0
  var _text1 = ' Mensualité : '+simu.value.credit.mensuality.toString();
  var _text2 =' fin de l\'emprunt : ' +EndDate;
  var _text3 =' coût total : '+interests_paid.toString();
  var _text4='';
  var _text4_color='text-white';
  var _text5='';
  var _text5_color='text-white';
  var delta_abs=0;
  var delta_rel=0;
  summaries.value.push({title :  'Crédit initial',subtitle:_date_to_display,id:_id,text1:_text1,text2:_text2,text3:_text3,text4:_text4,text4_color:_text4_color});
  if(simu.value.events.length!=0)
  {
    for(var i=0;i<simu.value.events.length;i++)
    {
      _text5='';
      _text4='';
      _text1='';
      _id=i+1;
      if(simu.value.events[i].type!=optionsReBuyType[0])//rebuy with savings : no mensuality
      {
        _text1=' Mensualité : '+simu.value.events[i].new_mens.toString();
      }
      _text2=' fin de l\'emprunt : '+simu.value.events[i].amortEvt[simu.value.events[i].amortEvt.length-1][0].split('-').join(' ');
      _text3=' coût total : '+(Math.round(100*simu.value.events[i].amortEvt[simu.value.events[i].amortEvt.length-1][2])/100).toString();
      delta_abs=Math.round((simu.value.events[i].amortEvt[simu.value.events[i].amortEvt.length-1][2]-interests_paid)*100)/100;
      if(i!=0)
      {

        delta_rel=Math.round((simu.value.events[i].amortEvt[simu.value.events[i].amortEvt.length-1][2]-simu.value.events[i-1].amortEvt[simu.value.events[i-1].amortEvt.length-1][2])*100)/100;
        _text4='différence en interêts : (/'+simu.value.events[i-1].title+') : '+formatnumber(String(delta_rel))+' €';
      }
      if(delta_rel>0)
      {
        _text4_color='text-red';
      }
      else
      {
        _text4_color='text-green';
      }
      _text5='différence en interêts : (/Crédit initial) : '+formatnumber(String(delta_abs))+' €';
      if(delta_abs>0)
      {
        _text5_color='text-red';
      }
      else
      {
        _text5_color='text-green';
      }
      _date_to_display=simu.value.events[i].month.toString()+'/'+simu.value.events[i].year.toString();
      summaries.value.push({title :  simu.value.events[i].title,subtitle:_date_to_display,id:_id,text1:_text1,text2:_text2,text3:_text3,text4:_text4,text4_color:_text4_color,text5:_text5,text5_color:_text5_color});
    }
  }
}
onBeforeMount(beforemount);

</script>

<style lang="scss">
.verticalFlex {
  min-height: inherit;
  max-width: 100%;
}
</style>
