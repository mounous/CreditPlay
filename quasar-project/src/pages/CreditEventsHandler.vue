<template>
  <q-page v-touch-swipe.mouse.left.right="handleSwipeExt" style="display:flex;" :key="refresh">
    <q-page-sticky position="top-right" :offset="[0, 0]" style="z-index:3">
      <q-icon name="help" size="x-large" color="white" class="q-mt-md q-mr-md"  v-if="show_tuto==false" @click="saveState()"></q-icon>
   </q-page-sticky>
    <div class="column justify-arround content-center q-mt-xl" style=" flex-direction: column;width:100%">
      <div class="column" style="min-height: 5%;width: 100%;"></div>
      <div class="column" style="max-height:80%; min-height: 70%;width: 100%;" :key="refresh">
        <q-scroll-area style="height:100%;">
        <q-list dark v-if="simu.events.length>0" class="q-ma-md"  style="background-color:darkslategrey;" separator bordered :key="simu.events.length">
          <q-item v-for="event in simu.events" :key="event.title" clickable
            @click="[event.selected = !event.selected, refresh++, propagateSelection(event)]" v-ripple>
            <q-item-section avatar>
              <q-checkbox v-model="event.selected" color="primary" @click="[refresh++, propagateSelection(event)]">
              </q-checkbox>
            </q-item-section>
            <q-item-section :key="refresh">
              <q-item-label style="font-weight: bold;font-size: large;" no-wrap="false">{{ event.month + '/' + event.year + ' - '
                +event.title }}</q-item-label>
              <q-item-label no-wrap="false" style="font-size: large;"
                v-if="event.metaType == EVT_META_TYPE_MOD && event.type == EVT_TYPE_MOD_MENS_UP">{{
                  transStr(stringsIDs.str_mens_increase) + event.new_mens +getCurrencySymbol()}}</q-item-label>
              <q-item-label no-wrap="false" style="font-size: large;"
                v-if="event.metaType == EVT_META_TYPE_MOD && event.type == EVT_TYPE_MOD_MENS_DOWN">{{
                  transStr(stringsIDs.str_mens_decrease) + event.new_mens +getCurrencySymbol()}}</q-item-label>
              <q-item-label no-wrap="false" style="font-size: large;"
                v-if="event.metaType == EVT_META_TYPE_REBUY && event.type == EVT_TYPE_REBUY_SAVINGS">{{
                  transStr(stringsIDs.str_rebuy_savings)}}</q-item-label>
              <q-item-label no-wrap="false" style="font-size: large;"
                v-if="event.metaType == EVT_META_TYPE_REBUY && event.type == EVT_TYPE_REBUY_CREDIT">{{
                  transStr(stringsIDs.str_rebuy_loan) + event.reloanRate+'%)'}}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
        <div class="col q-ma-md">
          <tutoDisplayer :key="tutoPhase">
            <tutoTxt :txt=feedTextTutoOps(tutoPhase)></tutoTxt>
            <OpsCapabilities v-if="show_tuto==true&&tutoPhase==0" ></OpsCapabilities>
            <shakeBtn v-if="show_tuto==true &&tutoPhase<3" class="q-ma-md" btn-label=">>"  @click="handleCLick()"></shakeBtn>
            <shakeBtn v-if="show_tuto==true &&tutoPhase>=3" class="q-ma-md" :btn-label=transStr(stringsIDs.str_tuto_close_tuto)  @click="restoreState"></shakeBtn>
          </tutoDisplayer>
          <div ref="phamtomDivToScrollTo"></div>
        </div>
      </q-scroll-area>
      </div>
      <div class="column content-center justify-center" style="height: 20%;">
        <div style="display: flex;flex-direction: row;align-items: center;align-content: center;justify-content: center;justify-items: center;">
            <div class="q-ma-md" style="display: flex;flex-direction: column;align-items: center;">
              <q-btn class="glossy" size="xl" color="blue-grey-8" :label=transStr(stringsIDs.str_btn_add)
                @click="addeventactiveNew = true" :disable="hasBeenRebougthSavings() || show_tuto==true" />
            </div>
            <div class="q-ma-md" style="display: flex;flex-direction: column;align-items: center;">
              <q-btn class="glossy" size="xl" color="blue-grey-8" :label=transStr(stringsIDs.str_btn_del) @click="deleteEvents"
              :disable="simu.events.length == 0" />
          </div>
          <eventForm v-if="addeventactiveNew == true" @event-done="[addeventactiveNew = false, movetoSummary()]"
            @event-abort="addeventactiveNew = false"></eventForm>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import tutoDisplayer from 'src/components/tutoDisplayer.vue';
import tutoTxt from 'src/components/tutoTxt.vue';
import OpsCapabilities from 'src/components/OpsCapabilities.vue';
import shakeBtn from 'src/components/shakeBtn.vue'
import {   useQuasar } from 'quasar';
import {  onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { bank, simu } from 'stores/store';
import { hasBeenRebougthSavings} from '../utils/credit_utility'
import {targetPage} from '../utils/swipe_utils.js'
import{transStr,stringsIDs,is_sio_special_name} from '../stores/languages'
import {EVT_META_TYPE_MOD, EVT_META_TYPE_REBUY, EVT_TYPE_MOD_MENS_UP, EVT_TYPE_MOD_MENS_DOWN, EVT_TYPE_REBUY_CREDIT, EVT_TYPE_REBUY_SAVINGS} from '../utils/credit_utility'
import {getCurrencySymbol} from '../stores/currencies'
import eventForm from 'src/components/eventForm.vue';
import {mustAlertChangeChart,mustAlertChangeMem} from '../stores/store'
import { show_tuto,tutoPhase } from 'stores/store';
import {feedTextTutoOps} from '../utils/tutorail_utils'
import  {scroll} from 'quasar'
import { nextTick } from 'vue';
import {saveTutoData,restoreTutoData,populateEventsTuto} from '../utils/tutorail_utils'
var phamtomDivToScrollTo=ref();
var refresh=ref(0);
const { getScrollTarget, setVerticalScrollPosition } = scroll
const router = useRouter();
const $q = useQuasar();
var refresh=ref(0);
const handleCLick=function()
{
  tutoPhase.value++;
  if(tutoPhase.value==3)
  {
    populateEventsTuto();
    refresh.value++;
    scrollTuto_delayed();
  }
  scrollTuto_delayed();
}
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
  refresh.value++;
}


const scrollTuto=function()
{
  const target = getScrollTarget(phamtomDivToScrollTo.value);
  const offset = phamtomDivToScrollTo.value.offsetTop
  const duration = 1000
  setVerticalScrollPosition(target, offset, duration)
}
const scrollTuto_delayed=function()
{
  nextTick(scrollTuto);
}

var addeventactiveNew=ref(false);
const handleSwipeExt=function ({ evt, touch, mouse, direction, duration, distance })
{
  if(show_tuto.value==true)
  {
    return;
  }
  router.push(targetPage(direction,router.currentRoute.value.fullPath));
}

const movetoSummary = function () {
  mustAlertChangeChart.value=true;
  mustAlertChangeMem.value=true;
  router.push('/summary');
};

const deleteEvents=function(){
  for(var i=simu.value.events.length-1;i>=0;i--)
  {
    if(simu.value.events[i].selected==true)//all following events will be deleted because they rely on this event
    {
      //delete fake single_io if rebought credit with savings
      if(simu.value.events[i].metaType==EVT_META_TYPE_REBUY&& simu.value.events[i].type==EVT_TYPE_REBUY_SAVINGS)
      {
        for(var acc=0;acc<bank.value.accounts.length;acc++)
        {
          for(var io=0;io<bank.value.accounts[acc].single_in_out.length;io++)
          {
            if(is_sio_special_name(bank.value.accounts[acc].single_in_out[io].title))
            {
              bank.value.accounts[acc].single_in_out.splice(io,1);
              simu.value.credit.has_been_rebougth=false;
              //do not break as the credit can be rebought on multiple accounts;
            }
          }
        }

      }
      simu.value.events.splice(i,1);
      refresh.value++;
      //if an event has been deleted, the last event has been deleted. if the credit was rebougth with savings, it was the last event
      simu.value.credit.has_been_rebougth=false;
      mustAlertChangeChart.value=true;
      mustAlertChangeMem.value=true;
    }
  }
  if(show_tuto.value)
  {
    if(simu.value.events.length==0)
    {
      restoreState();
    }
  }
}
//we don't want users to select base event for delete if subsequent events are not select
const propagateSelection=function (event_in){
  var i=0;var hasToNotify=false;
  //find current event
  while(i<simu.value.events.length)
  {
    if(simu.value.events[i]==event_in) {break; }
    i++;
  }
  if(i==simu.value.events.length) { return; }
  i++;//go to next element
  if(event_in.selected==false)//protection
  {
    for(var j=0;j<i;j++)
    {
      if(simu.value.events[j].selected==true)
      {
        $q.notify({    color: 'orange-4',    textColor: 'black',    icon: 'warning',    message: transStr(stringsIDs.str_warn_unselect),  });
        simu.value.events[i-1].selected=true;
        refresh.value++;
        return;
      }
    }
  }
  while(i<simu.value.events.length) { simu.value.events[i].selected=event_in.selected; i++;hasToNotify=true; }

  if(hasToNotify && event_in.selected)  {   $q.notify({    color: 'green-4',    textColor: 'black',        message: transStr(stringsIDs.str_info_select_too),  });  }
  if(hasToNotify && !event_in.selected)  {   $q.notify({    color: 'green-4',    textColor: 'black',       message: transStr(stringsIDs.str_info_unselect_too),  });  }
  refresh.value++;
}

import {
  AdMob,
} from '@capacitor-community/admob';
import{interstitialOptions} from '../stores/fireB'

const ads_show=async()=>{
  //const interstitialOptions = {
  //adId: 'ca-app-pub-7825247187857323/2803363241',//My real ad id
  //  adId:'ca-app-pub-3940256099942544/1033173712'//Testing Id
  //};
  if(show_tuto.value==true)
  {
    return;
  }
await AdMob.prepareInterstitial(interstitialOptions.value.adId);
await AdMob.showInterstitial().catch(e => console.log(e));

}
onMounted(ads_show);


</script>
<style lang="scss">
.verticalFlex {
  min-height: inherit;
  min-width: 400px;
}
</style>
