<template>
  <startForm v-if="displayStartForm == true" @credit-aborted="displayStartForm = false"
    @credit-done="[displayStartForm = false, onSubmit()]"></startForm>
  <q-page v-touch-swipe.mouse.left.right="handleSwipeExt">
    <q-dialog v-model="resetMustPop" cover transition-show="scale" transition-hide="scale">
      <q-card>
        <div class="col flex flex center justify-around">
          <div class="q-ma-md">
            {{ transSt(sentancesIDs.s_warning_overwriteSimu) }}
          </div>
          <div class="row nowrap">
            <q-btn :label=transStr(stringsIDs.str_cancel) @click="resetMustPop = false"></q-btn>
            <q-btn :label=transStr(stringsIDs.str_simulation) @click="onForceSubmmit"></q-btn>
          </div>
        </div>
      </q-card>
    </q-dialog>
    <div class="column content-cent items-center justify-around">
      <div class="oneInThreeRowH"></div>
      <div class="oneInThreeRow"><q-btn size=xl color="blue-grey-8" :label="transStr(stringsIDs.str_credit_fill)" @click="displayStartForm = true"> </q-btn></div>
      <div class="oneInThreeRowL"></div>
    </div>
  </q-page>
</template>

<script setup>
import startForm from 'src/components/startForm.vue';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { computeMensuality, computeCredit_init } from '../utils/credit_utility.js';
import { bank, setStartFormFilled, simu } from 'stores/store';
import { targetPage } from '../utils/swipe_utils.js'
import { transStr, stringsIDs, transSt, sentancesIDs, is_sio_special_name } from '../stores/languages.ts'

const router = useRouter();

var displayStartForm = ref(false);
var resetMustPop = ref(false);


const handleSwipeExt = function ({ evt, touch, mouse, direction, duration, distance }) {
  router.push(targetPage(direction, router.currentRoute.value.fullPath));
}




function onSubmit() {
  if (simu.value.events.length == 0) {
    computeMensuality();
    computeCredit_init();
    setStartFormFilled(true);
    router.push('/lineChart');
  }
  else {
    resetMustPop.value = true;
  }
};

function onForceSubmmit() {
  resetMustPop.value = false;
  simu.value.events = []
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
  computeMensuality();
  computeCredit_init();
  setStartFormFilled(true);
  router.push('/lineChart');
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
