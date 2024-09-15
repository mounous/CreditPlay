<template>
  <startForm v-if="displayStartForm == true" @credit-aborted="displayStartForm = false"
    @credit-done="[displayStartForm = false, onSubmit()]" :disable="show_tuto"></startForm>
  <q-page style="display: flex;flex-direction: column; height:100%;width: 100%;align-items:center; justify-content: center;" v-touch-swipe.mouse.left.right="handleSwipeExt">
    <q-page-sticky position="top-right" :offset="[0, 0]" style="z-index:3">
      <q-icon name="help" size="x-large" color="white" class="q-mt-md q-mr-md" v-if="show_tuto==false" @click="show_tuto=true"></q-icon>
   </q-page-sticky>
    <q-dialog v-model="resetMustPop" cover transition-show="scale" transition-hide="scale" persistent>
      <q-card>
        <div class="col flex flex center justify-around">
          <div class="q-ma-md">
            {{ transSt(sentancesIDs.s_warning_overwriteSimu) }}
          </div>
          <div class="row nowrap">
            <q-btn :label=transStr(stringsIDs.str_cancel) @click="resetMustPop = false"></q-btn>
            <q-btn :label=transStr(stringsIDs.str_simulation) @click="[eraseCredit(),displayStartForm=true]"></q-btn>
          </div>
        </div>
      </q-card>
    </q-dialog>
    <div style="display: flex;flex-direction: column;align-items: center;align-content: center;justify-content: center;justify-items: center;">
      <div v-if="startFormFilled==true && show_tuto==false">
        <q-card class="q-ma-md bg-blue-grey-8">
          <div style="display: flex;flex-direction: column;flex-direction: column;align-items: center;align-content: center;justify-content: center;justify-items: center;">
            <div class="q-mt-md q-ml-md q-mr-md" style="font-size: x-large;"> {{ simu.credit.amount.toString()+' '+getCurrencySymbol()  }} </div>
            <div class="q-mt-md q-ml-md q-mr-md" style="font-size: x-large;"> {{ simu.credit.rate.toString()+ ' %' }} </div>
            <div class="q-mt-md q-ml-md q-mr-md" style="font-size: x-large;"> {{ simu.credit.duration_m.toString()+' '+transStr(stringsIDs.str_mens_only) }} </div>
            <div class="q-ma-md " style="font-size: x-large;"> {{ transMonthName(simu.credit.m)+' '+simu.credit.y }} </div>
          </div>
        </q-card>
      </div>
      <div style="display: flex;flex-direction: column;align-items: center;" class="q-mt-xs q-mr-md q-ml-md">
        <p v-if="show_tuto" style="color:white;font-size: 20px;text-align: center;">{{transStr(stringsIDs.str_tuto_credit)}}</p>
        <videoPlayer v-if="show_tuto"  :name="stringsIDs.str_simulate_credit"></videoPlayer>
        <ShakeBtn v-if="show_tuto" class="q-ma-md" :label=transStr(stringsIDs.str_tuto_close_tuto) @click="show_tuto=false"></ShakeBtn>
        <span v-if="show_tuto"  style='color: white; font-size:50px;'>&#8595;</span>
        <q-btn :disable="show_tuto"  size=xl color="blue-grey-8" :label="startFormFilled==false ? transStr(stringsIDs.str_credit_fill) : transStr(stringsIDs.str_credit_fill_again)" @click="startFormFilled==false ?displayStartForm = true :resetMustPop=true"> </q-btn>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import startForm from 'src/components/startForm.vue';
import {getCurrencySymbol} from '../stores/currencies'
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { computeMensuality, computeCredit_init } from '../utils/credit_utility.js';
import { bank, setStartFormFilled, simu ,startFormFilled} from 'stores/store';
import { targetPage } from '../utils/swipe_utils.js'
import { transStr, stringsIDs, transSt, sentancesIDs, is_sio_special_name,transMonthName } from '../stores/languages.ts'
import {mustAlertChart} from '../stores/store'
import { show_tuto } from 'stores/store';
import videoPlayer from 'src/components/videoPlayer.vue'
import ShakeBtn from 'src/components/shakeBtn.vue';
const router = useRouter();

var displayStartForm = ref(false);
var resetMustPop = ref(false);


const handleSwipeExt = function ({ evt, touch, mouse, direction, duration, distance }) {
  router.push(targetPage(direction, router.currentRoute.value.fullPath));
}




const onSubmit=function() {
  resetMustPop.value = false;
  computeMensuality();
  computeCredit_init();
  setStartFormFilled(true);
  mustAlertChart.value=true;
  router.push('/summary');
  };

const eraseCredit=function() {
  resetMustPop.value = false;
  simu.value.credit.amort=[];
  simu.value.credit.amount=0;
  simu.value.credit.duration_m=0;
  simu.value.credit.m=0;
  simu.value.credit.mensuality=0.0;
  simu.value.credit.rate=0.0;
  simu.value.credit.startingDate='';
  simu.value.credit.total_cost=0.0;
  simu.value.credit.y=0;
  setStartFormFilled(false);
  simu.value.events = [];
  simu.value.credit.has_been_rebougth = false;
  //remove rebuy with credit single io if any existing
  for (let i = 0; i < bank.value.accounts.length; i++) {
    for (let sio = 0; sio < bank.value.accounts[i].single_in_out.length; sio++) {
      if (is_sio_special_name(bank.value.accounts[i].single_in_out[sio].title)) {
        //remove "rebuy with savings sio" as it will be re-created by apply_events_chain
        bank.value.accounts[i].single_in_out.splice(sio, 1);
      }
    }
  }
}

</script>

<style lang="scss">
.myIndication {
  font-size: 20px;
}

.oneInThreeRowH {
  width: 100%;
  height: 20%;
}

.oneInThreeRow {
  width: 100%;
  height: 50%;
}

.oneInThreeRowB {
  width: 100%;
  height: 30%;
}
</style>
