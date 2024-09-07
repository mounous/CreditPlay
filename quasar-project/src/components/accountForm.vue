<template>

  <q-carousel ref="myAccountForm" fullscreen animated :arrows="false" :navigation="false" v-model="currentSlide">
    <q-carousel-slide name="acountName" class="bg-grey-9">
      <div class="oneInThreeRowH"></div>
      <div class="oneInThreeRow">
        <div class="column items-center">
          <div class="col myIndication q-ma-md">
            <p>{{ transStr(stringsIDs.str_acc_name_opt) }}</p>
          </div>
          <div class="row" style="display: flex;">
          <div style="flex:1"></div>
          <div style="flex:4">
            <q-input class="q-ma-md" clearable style="font-size: x-large;" maxlength="20"
              v-model="_account.title" type="text" lazy-rules
              :rules="[(val) => (val.length < 20) || transStr(stringsIDs.str_shorter_acc_name)]" bg-color="blue-grey-8"
              outlined @keyup.enter="title_nxt.click()"></q-input>
            </div>
            <div style="flex:1"></div>
          </div>
          <div class="col">
            <q-btn class="q-ma-xs" color="blue-grey-8" :label=transStr(stringsIDs.str_cancel) size="xl"
              @click="emit('account-aborted')"></q-btn>
            <q-btn class="q-ma-xs" color="blue-grey-8" :label=transStr(stringsIDs.str_next) size="xl"
              @click="currentSlide = 'AmountAccount'" ref="title_nxt"></q-btn>
          </div>
        </div>
      </div>
      <div class="oneInThreeRowB"></div>
    </q-carousel-slide>
    <q-carousel-slide name="AmountAccount" class="bg-grey-9">
      <div class="oneInThreeRowH"></div>
      <div class="oneInThreeRow">
      <div class="column items-center">
        <div class="col myIndication q-ma-md">
            <p>{{ transStr(stringsIDs.str_current_amount_acc) }}</p>
          </div>
          <div class="row" style="display: flex;">
            <div style="flex:1"></div>
            <div style="display: flex; flex-direction: column; flex:4;align-items: center;">
            <q-input ref="myAmount" class="q-ma-md" style="font-size: x-large;" v-model="_account.amount"
              type="number" lazy-rules :rules="[(val) => (val >= 0.0) || transStr(stringsIDs.str_debts_not_handled)]"
              bg-color="blue-grey-8" outlined
              @keyup.enter="amount_nxt.click()" :suffix="getCurrencySymbol()"></q-input>
              <q-slider class="q-ma-md" v-model="_account.amount" :min="0" :max="30000" :step="1000" @change="myAmount.focus()"/>
            </div>
            <div style="flex:1"></div>
        </div>
        <div class="col">
          <q-btn class="q-ma-xs" color="blue-grey-8" :label=transStr(stringsIDs.str_prev) size="xl" @click="currentSlide = 'acountName'"></q-btn>
          <q-btn class="q-ma-xs" color="blue-grey-8" :label=transStr(stringsIDs.str_next) size="xl" @click="currentSlide = 'Profitability'" ref="amount_nxt"></q-btn>
        </div>
      </div>
    </div>
    <div class="oneInThreeRowB"></div>
    </q-carousel-slide>
    <q-carousel-slide name="Profitability" class="bg-grey-9">
      <div class="oneInThreeRowH"></div>
      <div class="oneInThreeRow">
      <div class="column items-center">
        <div class="col myIndication q-ma-md">
            <p>{{ transStr(stringsIDs.str_profitability_st) }}</p>
          </div>
          <div class="row" style="display: flex;">
            <div style="flex:1"></div>
            <div style="display: flex; flex-direction: column; flex:4;align-items: center;">
            <q-input ref="myProfit" class="q-ma-md"   style="font-size: x-large;" clearable v-model="_account.rate"
              type="number" bg-color="blue-grey-8" outlined @keyup.enter="profit_nxt.click()" suffix="%"></q-input>
              <q-slider class="q-ma-md" v-model="_account.rate" :min="0.0" :max="4.0" :step="0.1" @change="myProfit.focus()"/>
            </div>
            <div style="flex:1"></div>
        </div>
        <div class="col">
          <q-btn class="q-ma-xs" :label=transStr(stringsIDs.str_prev) size="xl" color="blue-grey-8" @click="currentSlide = 'AmountAccount'"></q-btn>
          <q-btn class="q-ma-xs" :label=transStr(stringsIDs.str_validate) size="xl" color="blue-grey-8" @click="addElementToAccounts()" ref="profit_nxt"></q-btn>
        </div>
      </div>
      </div>
      <div class="oneInThreeRowB"></div>
    </q-carousel-slide>
  </q-carousel>

</template>

<script setup>
import { ref, defineEmits } from 'vue';
import { makeAccountNameUnique, } from '../utils/bank_utility';
import { bank } from 'src/stores/store';
import { useQuasar } from 'quasar';
import { transStr,stringsIDs } from 'src/stores/languages';
import {getCurrencySymbol} from '../stores/currencies.ts'
const $q = useQuasar();
var title_nxt=ref();
var myAmount=ref();
var amount_nxt=ref();
var myProfit=ref();
var profit_nxt=ref();
var myAccountForm = ref();
var currentSlide = ref('acountName');
const _account = ref({ title: '', amount: 100.0, rate: 3.0 });
const emit = defineEmits(['account-added', 'account-aborted']);
const addElementToAccounts = function () {
  if (_account.value.amount < 0) {
    $q.notify({ color: 'orange-4', textColor: 'black', icon: 'warning', message: transStr(stringsIDs.str_neg_save), });
    myAccountForm.value.goTo('AmountAccount');
  }
  else {
    bank.value.accounts.push({ title: makeAccountNameUnique(_account.value.title), amount: Number(_account.value.amount), rate: _account.value.rate, single_in_out: [], periodic_savings: [], computedOverTime: [] });
    _account.value.title = '';
    _account.value.amount = 0.0;
    _account.value.rate = 0.0;
    emit('account-added');
  }
}

</script>
<style lang="scss">
.myIndication {
  font-size: 20px;
}
.oneInThreeRowH{
  width: 100%;
  height: 20%;
}
.oneInThreeRow{
  width: 100%;
  height: 50%;
}
.oneInThreeRowB{
  width: 100%;
  height: 30%;
}
</style>
