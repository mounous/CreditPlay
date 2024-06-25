<template>

  <q-carousel ref="myPSForm" fullscreen animated :arrows="false" :navigation="false" v-model="currentSlide">
    <q-carousel-slide name="psType" class="bg-grey-9">
      <div class="oneInThreeRowH"></div>
      <div class="oneInThreeRow">
        <div class="column items-center">
          <div class="col myIndication q-ma-md">
            <p>{{transStr(stringsIDs.str_choose_op_type)}}</p>
          </div>
          <div class="row q-mb-md" style="display: flex;">
          <div style="flex:1"></div>
          <div style="flex:4">
          <q-select bg-color="blue-grey-8" style="font-size: x-large;" v-model="typeSavings"
            :options="[transoptSaveP(BANK_SAVE_TYPE_MONTHLY), transoptSaveP(BANK_SAVE_TYPE_YEARLY)]"></q-select>
          </div>
            <div style="flex:1"></div>
        </div>
        <div class="col">
          <q-btn class="q-ma-xs" color="blue-grey-8" :label=transStr(stringsIDs.str_cancel) size='xl' @click="emit('ps-aborted')"></q-btn>
          <q-btn class="q-ma-xs" color="blue-grey-8" :label=transStr(stringsIDs.str_next) size='xl' @click="currentSlide = 'psAmount'" :disable="typeSavings!=transoptSaveP(BANK_SAVE_TYPE_MONTHLY) && typeSavings!=transoptSaveP(BANK_SAVE_TYPE_YEARLY)"></q-btn>
        </div>
      </div>
      </div>
      <div class="oneInThreeRowB"></div>
    </q-carousel-slide>
    <q-carousel-slide name="psAmount" class="bg-grey-9">
      <div class="oneInThreeRowH"></div>
      <div class="oneInThreeRow">
        <div class="column items-center">
          <div class="col myIndication q-ma-md">
            <p>{{transStr(stringsIDs.str_choose_op_amount)}}</p>
          </div>
          <div class="row" style="display: flex;">
            <div style="flex:1"></div>
            <div style="display : flex ; flex:4;flex-direction: column;align-items: center;">
            <q-input ref="myAmount" class="q-mx-xs" style="font-size: x-large;" v-model="_savingP.amount"
              type="number" lazy-rules :rules="[(val) => (val >= 0.0) || 'Les retraits ne sont pas gérées']"
              bg-color="blue-grey-8" outlined clearable @keyup.enter="amount_nxt.click()"></q-input>
              <q-slider class="q-ma-md" v-model="_savingP.amount" :min="0.0"
                :max="typeSavings==transoptSaveP(BANK_SAVE_TYPE_MONTHLY) ? 1000:10000"
                :step="typeSavings==transoptSaveP(BANK_SAVE_TYPE_MONTHLY) ? 10:100" @change="myAmount.focus()"/>
            </div>

            <div style="flex:1"></div>
        </div>
        <div class="col">
          <q-btn class="q-ma-xs" color="blue-grey-8" :label=transStr(stringsIDs.str_prev) size='xl' @click="currentSlide = 'psType'"></q-btn>
          <q-btn class="q-ma-xs" color="blue-grey-8" :label=transStr(stringsIDs.str_next) size='xl' @click="currentSlide = 'psAccount'" ref="amount_nxt"></q-btn>
        </div>
      </div>
      </div>
      <div class="oneInThreeRowB"></div>
    </q-carousel-slide>

    <q-carousel-slide name="psAccount" class="bg-grey-9">
      <div class="oneInThreeRowH"></div>
      <div class="oneInThreeRow">
        <div class="column items-center">
          <div class="col myIndication q-ma-md">
            <p>{{transStr(stringsIDs.str_choose_op_account)}}</p>
          </div>
          <div class="row" style="display: flex;">
          <div style="flex:1"></div>
          <div style="flex:4">
          <q-select class="q-mb-md" v-model="_savingP.account" style="font-size: x-large;"
            :options="getAccOpt()" type="number" bg-color="blue-grey-8" outlined ></q-select>
          </div>
            <div style="flex:1"></div>
        </div>
        <div class="col">
          <q-btn class="q-ma-xs" :label=transStr(stringsIDs.str_prev) color="blue-grey-8" size='xl' @click="currentSlide = 'psAmount'"></q-btn>
          <q-btn class="q-ma-xs" :label=transStr(stringsIDs.str_next) color="blue-grey-8" size='xl' @click="currentSlide = 'psfromTo'"></q-btn>
        </div>
      </div>
      </div>
      <div class="oneInThreeRowB"></div>
    </q-carousel-slide>

    <q-carousel-slide name="psfromTo" class="bg-grey-9">
      <div class="oneInThreeRowH"></div>
      <div class="oneInThreeRow">
        <div class="column items-center">
          <div class="col myIndication q-ma-md">
            <p>{{transStr(stringsIDs.str_choose_op_strat_date)}}</p>
          </div>
          <div class="row" style="display: flex;">
          <div style="flex:1"></div>
          <div style="flex:4">
          <q-input class="q-mx-xs"  style="font-size: x-large;"  bg-color="blue-grey-8" filled
            v-model="_savingP.startingDate" @click="mustpopPsStart = true" readonly>
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale" v-model="mustpopPsStart" persistent>
                  <q-date dark v-model="savingPstartingDateUnformated" :locale=getTranslatedFormatedCalendar()
                    :navigation-min-year-month="periodicSaveMin" width="200px"
                    :navigation-max-year-month="periodicSaveMax"
                    @update:model-value="[_savingP.startingDate = formatDate(savingPstartingDateUnformated), mustpopPsStart = false,
                    periodicSaveMinEnd=addOneMonthToStringDate(savingPstartingDateUnformated.split('/')[0]+'/'+savingPstartingDateUnformated.split('/')[1]),
                    savingPendDateUnformated=periodicSaveMinEnd+'/'+savingPstartingDateUnformated.split('/')[2],
                    _savingP.endDate = ''
                    ]">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup :label=transStr(stringsIDs.str_close) color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
            <div style="flex:1">
            </div>
          </div>
          <div class="col myIndication q-ma-md">
            <p>{{transStr(stringsIDs.str_choose_op_end_date)}}</p>
          </div>
          <div class="row" style="display: flex">
          <div style="flex:1"></div>
          <div style="flex:4;align-items: center;">
          <q-input class="q-mb-md"  style="font-size: x-large;"  bg-color="blue-grey-8" filled
            v-model="_savingP.endDate" @click="mustpopPsEnd = true" readonly>
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale" v-model="mustpopPsEnd" persistent>
                  <q-date dark v-model="savingPendDateUnformated" :locale=getTranslatedFormatedCalendar()
                    :navigation-min-year-month="periodicSaveMinEnd" width="200px"
                    :default-year-month="periodicSaveMinEnd"
                    :navigation-max-year-month="periodicSaveMax"
                    @update:model-value="[_savingP.endDate = formatDate(savingPendDateUnformated), mustpopPsEnd = false]">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup :label=transStr(stringsIDs.str_close) color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div style="flex:1">
          <q-btn v-if="_savingP.endDate!=''"  color="grey-9" size='xl' class="q-ml-xs q-mt-xs" label="X" style="font-size: large ;" @click="[_savingP.endDate='']"></q-btn>
        </div>
        </div>
        <div class="q-mb-md">
          <q-btn class="q-ma-xs" :label=transStr(stringsIDs.str_prev) color="blue-grey-8" size='xl'  @click="currentSlide = 'psAccount'"></q-btn>
          <q-btn class="q-ma-xs" :label=transStr(stringsIDs.str_validate) color="blue-grey-8" size='xl' @click="addElementToSavingsP()"></q-btn>
        </div>
      </div>
      </div>
      <div class="oneInThreeRowB"></div>
    </q-carousel-slide>
  </q-carousel>

</template>

<script setup>
import { ref, defineEmits } from 'vue';
import { bank } from 'src/stores/store';
import { useQuasar } from 'quasar';
import { getAccId, getAccOpt,BANK_SEARCH_ERROR,BANK_SAVE_TYPE_MONTHLY,BANK_SAVE_TYPE_YEARLY } from 'src/utils/bank_utility';
import { formatDate ,addOneMonthToStringDate} from 'src/utils/date_utility';
import { getTranslatedFormatedCalendar } from '../stores/languages';
import {getOptSavePFromStr,transoptSaveP,stringsIDs, transStr} from '../stores/languages'
const $q = useQuasar();
var myAmount=ref();
var amount_nxt=ref();
var myPSForm = ref();
var currentSlide = ref('psType');
const _savingP = ref({ account: bank.value.accounts[0].title, amount: 0.0, startMonth: 0, startYear: 0, endMonth: 0, endYear: 0, type: BANK_SAVE_TYPE_MONTHLY, startingDate: '', endDate: '' });
var periodicSaveMax = ref('2100/01');
var mustpopPsStart = ref(false);
var mustpopPsEnd = ref(false);
const DEFAULT_DATE = '';
var savingPstartingDateUnformated = ref(DEFAULT_DATE);
var savingPendDateUnformated = ref(DEFAULT_DATE);
var limitYear = new Date().getFullYear().toString();
var limitMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');
var periodicSaveMin = ref(limitYear + '/' +limitMonth );
var periodicSaveMinEnd=ref('');
const emit = defineEmits(['ps-added', 'ps-aborted']);
var typeSavings=ref(transoptSaveP(BANK_SAVE_TYPE_MONTHLY));

const addElementToSavingsP = function () {
  var indexAcc = 0;
  var startY = Number(_savingP.value.startingDate.split('/')[2]);
  var endY = 0
  var startM = Number(_savingP.value.startingDate.split('/')[1]);
  var endM = 0;
  if (DEFAULT_DATE != _savingP.value.endDate) {
    endY = Number(_savingP.value.endDate.split('/')[2]);
    endM = Number(_savingP.value.endDate.split('/')[1]);
  }
  if (_savingP.value.startingDate == '') {
    $q.notify({ color: 'orange-4', textColor: 'black', icon: 'warning', message: transStr(stringsIDs.str_warn_start_date), });
    myPSForm.value.goTo('psfromTo');
  }
  else if (_savingP.value.amount == 0) {
    $q.notify({ color: 'orange-4', textColor: 'black', icon: 'warning', message: transStr(stringsIDs.str_warn_null_save), });
    myPSForm.value.goTo('psAmount');
  }
  else if (_savingP.value.amount < 0) {
    $q.notify({ color: 'orange-4', textColor: 'black', icon: 'warning', message: transStr(stringsIDs.str_warn_neg_save), });
    myPSForm.value.goTo('psAmount');
  }
  else {
    indexAcc = getAccId(_savingP.value.account);
    if (BANK_SEARCH_ERROR == indexAcc) {
      $q.notify({ color: 'orange-4', textColor: 'black', icon: 'warning', message: transStr(stringsIDs.str_acc_not_found), });
      myPSForm.value.goTo('psAccount');
      return;
    }
    if(BANK_SAVE_TYPE_MONTHLY==getOptSavePFromStr(typeSavings.value))
    {
      _savingP.value.type=BANK_SAVE_TYPE_MONTHLY;
    }
    else
    {
      _savingP.value.type=BANK_SAVE_TYPE_YEARLY;
    }
    bank.value.accounts[indexAcc].periodic_savings.push({ amount: Number(_savingP.value.amount), account: _savingP.value.account, type: _savingP.value.type, startMonth: startM, startYear: startY, endMonth: endM, endYear: endY });
    _savingP.value.amount = 0.0; _savingP.value.account = ''; _savingP.value.startMonth = 0; _savingP.value.startYear = 0; _savingP.value.endMonth = 0, _savingP.value.endYear = 0; _savingP.value.type = BANK_SAVE_TYPE_MONTHLY; _savingP.value.startingDate = DEFAULT_DATE; _savingP.value.endDate = DEFAULT_DATE;
    emit('ps-added');
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
