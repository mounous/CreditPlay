<template>
  <q-page  v-touch-swipe.mouse.left.right="handleSwipeExt">
    <div class="full-height column justify-arround content-center verticalFlex">
      <div class="col">
        <q-timeline  class="q-ma-lg text-white">
      <q-timeline-entry heading>{{transStr(stringsIDs.str_simu_summary)}}</q-timeline-entry>
      <q-timeline-entry  v-for="item in summaries.values()" :key="item.id" :title="item.title" :subtitle="item.subtitle" id="item.id">
        <div v-if="!(item.type==EVT_TYPE_REBUY_SAVINGS && item.metaType==EVT_META_TYPE_REBUY)" >{{ item.text1 }}</div>
        <div>{{ item.text2 }}</div>
        <div>{{ item.text3 }}</div>
        <div v-if="item._text4!=''" :class="item.text4_color">{{ item.text4 }}</div>
        <div :class="item.text5_color">{{ item.text5 }}</div>
        <div v-if="item.text6!=''">{{ item.text6 }}</div>
        <div v-if="item.text7!=''">{{ item.text7 }}</div>
      </q-timeline-entry>
    </q-timeline>
  </div>
  </div>
  </q-page>
</template>

<script setup>
import {ref,onBeforeMount } from 'vue'
import { simu } from 'stores/store';
import {formatnumber} from '../utils/string_utils'
import { useRouter } from 'vue-router';
import {targetPage} from '../utils/swipe_utils.js'
import { returnBaseData,EVT_TYPE_REBUY_SAVINGS,  EVT_META_TYPE_REBUY } from 'src/utils/credit_utility';
import { transStr,stringsIDs } from 'src/stores/languages';
import {getCurrencySymbol} from '../stores/currencies'
const router = useRouter();
var summaries=ref([]);
const handleSwipeExt=function ({ evt, touch, mouse, direction, duration, distance })
{
  router.push(targetPage(direction,router.currentRoute.value.fullPath));
}
const beforemount=function() {
  var amort_init=simu.value.credit.amort;
  var interests_paid =amort_init[amort_init.length-1][2];
  var EndDate = amort_init[amort_init.length-1][0];
  var _date_to_display = simu.value.credit.startingDate
  var _id=0
  var _text1 = transStr(stringsIDs.str_mens)+formatnumber(simu.value.credit.mensuality.toString())+' '+getCurrencySymbol();
  var _text2 =transStr(stringsIDs.str_loan_end) +EndDate;
  var _text3 =transStr(stringsIDs.str_total_cost)+formatnumber(interests_paid.toString())+' '+getCurrencySymbol();
  var _text4='';
  var _text4_color='text-white';
  var _text5='';
  var _text5_color='text-white';
  var _text6='';
  var _text7='';
  var delta_abs=0;
  var delta_rel=0;
  summaries.value.push({title :  transStr(stringsIDs.str_init_loan),subtitle:_date_to_display,id:_id,text1:_text1,text2:_text2,text3:_text3,text4:_text4,text4_color:_text4_color});
  if(simu.value.events.length!=0)
  {
    for(var i=0;i<simu.value.events.length;i++)
    {
      _text5='';
      _text4='';
      _text1='';
      _text6='';
      _text7='';
      _id=i+1;
      if(!(simu.value.events[i].metaType==EVT_META_TYPE_REBUY && simu.value.events[i].type==EVT_TYPE_REBUY_SAVINGS))//rebuy with savings : no mensuality
      {
        _text1=formatnumber(transStr(stringsIDs.str_mens)+simu.value.events[i].new_mens.toString());
      }
      _text2=transStr(stringsIDs.str_loan_end)+simu.value.events[i].amortEvt[simu.value.events[i].amortEvt.length-1][0].split('-').join(' ');
      _text3=transStr(stringsIDs.str_total_cost)+formatnumber((Math.round(100*simu.value.events[i].amortEvt[simu.value.events[i].amortEvt.length-1][2])/100).toString());
      delta_abs=Math.round((simu.value.events[i].amortEvt[simu.value.events[i].amortEvt.length-1][2]-interests_paid)*100)/100;
      if(i!=0)
      {

        delta_rel=Math.round((simu.value.events[i].amortEvt[simu.value.events[i].amortEvt.length-1][2]-simu.value.events[i-1].amortEvt[simu.value.events[i-1].amortEvt.length-1][2])*100)/100;
        _text4=transStr(stringsIDs.str_cost_diff_rel)+simu.value.events[i-1].title+') : '+formatnumber(String(delta_rel))+' '+getCurrencySymbol();
      }
      if(delta_rel>0)
      {
        _text4_color='text-red';
      }
      else
      {
        _text4_color='text-green';
      }
      _text5=transStr(stringsIDs.str_cost_diff_abs)+formatnumber(String(delta_abs))+' '+getCurrencySymbol();
      if(delta_abs>0)
      {
        _text5_color='text-red';
      }
      else
      {
        _text5_color='text-green';
      }
      if(simu.value.events[i].metaType==EVT_META_TYPE_REBUY )
      {
        _text6=transStr(stringsIDs.str_capital_rebought)+formatnumber(returnBaseData(simu.value.events[i].year, simu.value.events[i].month).capital_left.toString())+' '+getCurrencySymbol();
        if(simu.value.events[i].type==EVT_TYPE_REBUY_SAVINGS)
        {
          _text7=transStr(stringsIDs.str_savings_left)+formatnumber(simu.value.events[i].savingsLeft)+' '+getCurrencySymbol();
        }
        else
        {
          _text7=transStr(stringsIDs.str_new_rate)+simu.value.events[i].reloanRate+' %';
        }
      }

      _date_to_display=simu.value.events[i].month.toString()+'/'+simu.value.events[i].year.toString();
      summaries.value.push({title :  simu.value.events[i].title,subtitle:_date_to_display,id:_id,text1:_text1,text2:_text2,text3:_text3,text4:_text4,text4_color:_text4_color,text5:_text5,text5_color:_text5_color,text6:_text6,text7:_text7});
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
