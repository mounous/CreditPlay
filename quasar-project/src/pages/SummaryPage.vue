<template>
  <q-page  v-touch-swipe.mouse.left.right="handleSwipeExt" >
    <q-page-sticky position="top-right" :offset="[10, 10]" style="z-index:3">
      <q-icon name="help" size="x-large" color="white" class="q-ma-md" v-if="show_tuto==false" @click="initTuto()"></q-icon>
    </q-page-sticky>
    <div class="full-height column justify-arround content-center" style="display:flex; width: 100%; height: 100%;">
      <div class="col q-ma-xs">
        <q-timeline  class="q-mb-xs q-mt-xl q-ml-xs q-mr-xs text-white">
          <q-timeline-entry heading style="text-align: center;">{{transStr(stringsIDs.str_simu_summary)}}</q-timeline-entry>
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
      <tutoDisplayer>
        <tutoTxt :txt=spantxt ></tutoTxt>
        <shakeBtn v-if="show_tuto==true&&tutoPhase<4" class="q-ma-md" btn-label=">>"  @click="nextTutoPhase()"></shakeBtn>
        <shakeBtn v-if="show_tuto==true &&tutoPhase==4" class="q-ma-md" :btn-label=transStr(stringsIDs.str_tuto_close_tuto) @click="restoreState"></shakeBtn>
      </tutoDisplayer>
    <div ref="phamTomdivToScrollTo"></div>
  </div>
  </div>

  <q-dialog v-model="MustPopTutorial"   cover transition-show="scale" transition-hide="scale" maximized full-width auto-close v-on:before-hide="[tutoPhase=1,nextTutoPhase(),MustPopTutorial=false]"
  style="background-color: black;"   >
  <div class="q-ma-md" style="display: flex;flex-direction: column;justify-content:center;align-content: center;">
    <tutoDisplayer class="q-mt-xl q-mb-xl q-mr-xs q-ml-xs">
      <tutoTxt :txt=transStr(stringsIDs.str_tuto_Sum) :xl="true"></tutoTxt>
    </tutoDisplayer>
  </div>
  </q-dialog>
  </q-page>
</template>

<script setup>
import tutoDisplayer from 'src/components/tutoDisplayer.vue';
import tutoTxt from 'src/components/tutoTxt.vue';
import shakeBtn from 'src/components/shakeBtn.vue';
import {ref,onBeforeMount, onMounted } from 'vue'
import { simu,bank } from 'stores/store';
import {formatnumber} from '../utils/string_utils'
import { useRouter } from 'vue-router';
import {targetPage} from '../utils/swipe_utils.js'
import { returnBaseData,EVT_TYPE_REBUY_SAVINGS,  EVT_META_TYPE_REBUY, computeCredit_init,apply_events_chain,computeMensuality, TIME,INTERESTS } from 'src/utils/credit_utility';
import { transStr,stringsIDs,transMonthName } from 'src/stores/languages';
import {getCurrencySymbol} from '../stores/currencies'
import { subOneMonth } from 'src/utils/date_utility';
import { show_tuto,tutoPhase } from 'stores/store';
import { feedSpanSummary } from 'src/utils/tutorail_utils';
import  {scroll} from 'quasar'
import { computeDisplaySavings } from 'src/utils/bank_utility';
import {populateBankTuto, populateEventsTuto,saveTutoData,restoreTutoData,injectCreditInTuto} from '../utils/tutorail_utils'
const { getScrollTarget, setVerticalScrollPosition } = scroll
var MustPopTutorial=ref(false);
var phamTomdivToScrollTo=ref();
var spantxt=ref('');
const router = useRouter();
var summaries=ref([]);


const scrollDown=function(duration=1000)
{
  const target = getScrollTarget(phamTomdivToScrollTo.value);
  const offset = phamTomdivToScrollTo.value.offsetTop;
  setVerticalScrollPosition(target, offset, duration);
}

const scrollDownDelayed=function()
{
  setTimeout(scrollDown(3000),200);
}

onMounted(scrollDownDelayed);

const nextTutoPhase=function()
{
  if(show_tuto.value==false)
  {
    return;
  }
  if(tutoPhase.value==5)
  {
    return;
  }
  spantxt.value=feedSpanSummary();
  setDisplay();
  tutoPhase.value++;
  scrollDown();
}
const handleSwipeExt=function ({ evt, touch, mouse, direction, duration, distance })
{
  router.push(targetPage(direction,router.currentRoute.value.fullPath));
}

const initTuto=function()
{
  show_tuto.value=true;
  MustPopTutorial.value=true;
  saveState();
  simu.value.events=[];
  bank.value.accounts=[];
  injectCreditInTuto();
  populateBankTuto();
  computeDisplaySavings(simu.value.credit.y,simu.value.credit.m,simu.value.credit.duration_m/12);
  populateEventsTuto();
  apply_events_chain();
}


const setDisplay=function() {
  summaries.value=[];
  var capital_rebuy_s_end_month=ref(0);
  var capital_rebuy_s_end_year=ref(0);
  var amort_init=simu.value.credit.amort;
  var interests_paid =amort_init[INTERESTS][amort_init[INTERESTS].length-1];
  var EndDate =transMonthName(amort_init[TIME][amort_init[TIME].length-1].m)+' '+ amort_init[TIME][amort_init[TIME].length-1].y.toString();
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
    for(var i=0;i<simu.value.events.length ;i++)
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
      var end_date=simu.value.events[i].amortEvt[TIME][simu.value.events[i].amortEvt[TIME].length-1];
      _text2=transStr(stringsIDs.str_loan_end)+transMonthName(end_date.m)+' '+end_date.y.toString();
      _text3=transStr(stringsIDs.str_total_cost)+formatnumber((Math.round(100*simu.value.events[i].amortEvt[INTERESTS][simu.value.events[i].amortEvt[INTERESTS].length-1])/100).toString());
      delta_abs=Math.round((simu.value.events[i].amortEvt[INTERESTS][simu.value.events[i].amortEvt[INTERESTS].length-1]-interests_paid)*100)/100;
      if(i!=0)
      {
        delta_rel=Math.round((simu.value.events[i].amortEvt[INTERESTS][simu.value.events[i].amortEvt[INTERESTS].length-1]-simu.value.events[i-1].amortEvt[INTERESTS][simu.value.events[i-1].amortEvt[INTERESTS].length-1])*100)/100;
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
        if(simu.value.events[i].type==EVT_TYPE_REBUY_SAVINGS)
        {
          //in case of a rebuy with savings the capital end month and capital end year date must be substracted of one month because at event's date capital is null
          capital_rebuy_s_end_month.value=simu.value.events[i].month;
          capital_rebuy_s_end_year.value=simu.value.events[i].year;
          subOneMonth(capital_rebuy_s_end_month,capital_rebuy_s_end_year);
          _text6=transStr(stringsIDs.str_capital_rebought)+formatnumber(returnBaseData(capital_rebuy_s_end_year.value, capital_rebuy_s_end_month.value).capital_left.toString())+' '+getCurrencySymbol();
          _text7=transStr(stringsIDs.str_savings_left)+formatnumber(simu.value.events[i].savingsLeft)+' '+getCurrencySymbol();
        }
        else
        {
          _text6=transStr(stringsIDs.str_capital_rebought)+formatnumber(returnBaseData(simu.value.events[i].year, simu.value.events[i].month).capital_left.toString())+' '+getCurrencySymbol();
          _text7=transStr(stringsIDs.str_new_rate)+simu.value.events[i].reloanRate+' %';
        }
      }
      _date_to_display=simu.value.events[i].month.toString()+'/'+simu.value.events[i].year.toString();
      summaries.value.push({title :  simu.value.events[i].title,subtitle:_date_to_display,id:_id,text1:_text1,text2:_text2,text3:_text3,text4:_text4,text4_color:_text4_color,text5:_text5,text5_color:_text5_color,text6:_text6,text7:_text7});
    }
  }
  if(show_tuto.value==true)
  {
    summaries.value.splice(tutoPhase.value+1,summaries.value.length-tutoPhase.value-1);
  }
}
onBeforeMount(setDisplay);


const saveState=function()
{
  show_tuto.value=true;
  tutoPhase.value=0;
  saveTutoData();
  simu.value.events=[];
}


const restoreState=function()
{
  show_tuto.value=false;
  restoreTutoData();
  computeMensuality();
  computeCredit_init();
  setDisplay();
}
</script>

<style lang="scss">
.verticalFlex {
  min-height: inherit;
  max-width: 100%;
}
</style>
