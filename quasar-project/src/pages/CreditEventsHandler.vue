<template>
  <q-page  v-touch-swipe.mouse="handleSwipeExt">
    <div class="full-height column justify-arround content-center verticalFlex">

  <div class="col" :key="refresh">
    <q-list class="bg-primary" separator bordered>
      <q-item
        v-for="event in simu.events"
        :key="event.title"
        clickable
        @click="[event.selected = !event.selected,refresh++,propagateSelection(event)]"
        v-ripple
      >
        <q-item-section avatar>
          <q-checkbox v-model="event.selected" color="primary"  @click="[refresh++,propagateSelection(event)]"> </q-checkbox>
        </q-item-section>
        <q-item-section :key="refresh">
          <q-item-label v-if="event.metaType==EVT_META_TYPE_MOD && event.type==EVT_TYPE_MOD_MENS_UP">{{ event.month+'/'+event.year + ' - ' +event.title  +transStr(stringsIDs.str_mens_increase)+ event.new_mens+getCurrencySymbol()+')'}}</q-item-label>
          <q-item-label v-if="event.metaType==EVT_META_TYPE_MOD && event.type==EVT_TYPE_MOD_MENS_DOWN">{{ event.month+'/'+event.year + ' - ' +event.title  +transStr(stringsIDs.str_mens_decrease)+ event.new_mens+getCurrencySymbol()+')'}}</q-item-label>
          <q-item-label v-if="event.metaType==EVT_META_TYPE_REBUY && event.type==EVT_TYPE_REBUY_SAVINGS">{{ event.month+'/'+event.year + transStr(stringsIDs.str_rebuy_savings)}}</q-item-label>
          <q-item-label v-if="event.metaType==EVT_META_TYPE_REBUY && event.type==EVT_TYPE_REBUY_CREDIT">{{ event.month+'/'+event.year + transStr(stringsIDs.str_rebuy_loan)+event.reloanRate+'%)'}}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
    </div>
    <div class ="col column content-center">
      <div class="col">
    <q-btn
      class="glossy"
      rounded
      color="primary"
      :label=transStr(stringsIDs.str_btn_add)
      @click="addeventactive = true"
      :disable="hasBeenRebougthSavings()"
    />

    <q-btn
      class="glossy"
      rounded
      color="primary"
      :label=transStr(stringsIDs.str_btn_del)
      @click="deleteEvents"
      :disable="simu.events.length==0"
    />
    <q-dialog full-width v-model="addeventactive">

      <!--https://v0-14.quasar-framework.org/components/building-reusable-components.html-->
      <SingleEventHandler
        @save-event="[(addeventactive = false), movetocharts()]"
      />
    </q-dialog>
    </div>
  </div>
  </div>
  </q-page>
</template>

<script setup>
import {   useQuasar } from 'quasar';
import { ref } from 'vue';
import SingleEventHandler from '../components/SingleEventHandler.vue';
import { useRouter } from 'vue-router';
import { bank, simu } from 'stores/store';
import {hasBeenRebougthSavings} from '../utils/credit_utility'
import {targetPage} from '../utils/swipe_utils.js'
import{transStr,stringsIDs,is_sio_special_name} from '../stores/languages'
import {EVT_META_TYPE_MOD, EVT_META_TYPE_REBUY, EVT_TYPE_MOD_MENS_UP, EVT_TYPE_MOD_MENS_DOWN, EVT_TYPE_REBUY_CREDIT, EVT_TYPE_REBUY_SAVINGS} from '../utils/credit_utility'
import {getCurrencySymbol} from '../stores/currencies'
const router = useRouter();
const $q = useQuasar();
var refresh=ref(0);
var addeventactive = ref(false);

const handleSwipeExt=function ({ evt, touch, mouse, direction, duration, distance })
{
  router.push(targetPage(direction,router.currentRoute.value.fullPath));
}

const movetocharts = function () {
  router.push('/lineChart');
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

  if(hasToNotify && event_in.selected)  {   $q.notify({    color: 'green-4',    textColor: 'black',    icon: 'cloud_done',    message: transStr(stringsIDs.str_info_select_too),  });  }
  if(hasToNotify && !event_in.selected)  {   $q.notify({    color: 'green-4',    textColor: 'black',    icon: 'cloud_done',    message: transStr(stringsIDs.str_info_unselect_too),  });  }
  refresh.value++;
}
</script>
<style lang="scss">
.verticalFlex {
  min-height: inherit;
  min-width: 400px;
}
</style>
