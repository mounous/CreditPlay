<template>

  <q-carousel ref="myCreditForm" fullscreen animated :arrows="false" :navigation="false" v-model="currentSlide">
    <q-carousel-slide name="creditDate" class="bg-black" style="display: flex;">
      <div style="display: flex; flex-direction: column;width: 100%;height: 100%;">
        <div style="flex: 1;"></div>
        <div style="display:flex;flex: 3;flex-direction: column;justify-content: space-evenly;align-items: center;justify-content: center;color: white;text-align: center;">
          <div class=" myIndication q-ma-md" style="flex: 1;">
            <p>{{ transStr(stringsIDs.str_signature_date) }}</p>
          </div>
          <div style="flex: 1;">
            <q-input dark bg-color="blue-grey-10" filled v-model="simu.credit.startingDate" @click="mustpop = true" readonly size="10" style="font-size: x-large;">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy v-model="mustpop" cover transition-show="scale" transition-hide="scale" persistent>
                    <q-date color="black" dark v-model="unformated" :locale=getTranslatedFormatedCalendar()
                      @update:model-value="[mustpop = false, simu.credit.startingDate = formatDate(unformated), parseCreditDate()]">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup :label=transStr(stringsIDs.str_close) color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
        </div>
        <div style="flex: 2;display: flex;">
          <div style="display: flex; flex-direction : row;width:100% ;justify-content: space-evenly;align-items: center;justify-content: center; flex-wrap: wrap;">
            <q-btn class="q-ma-xs" color="blue-grey-8" :label=transStr(stringsIDs.str_cancel) size="xl" style="max-height: 50px;"
              @click="emit('credit-aborted')"></q-btn>
            <q-btn class="q-ma-xs" color="blue-grey-8" :label=transStr(stringsIDs.str_next) size="xl" style="max-height: 50px;"
              @click="simu.credit.startingDate==''?
              $q.notify({ color: 'orange-4', textColor: 'black', icon: 'warning', message: transStr(stringsIDs.str_notif_warn_date), }) :
              currentSlide = 'creditAmount'"></q-btn>
          </div>
        </div>

      </div>
    </q-carousel-slide>

    <q-carousel-slide name="creditAmount" class="bg-black"  style="display: flex;">
      <div style="display: flex; flex-direction: column;width: 100%;height: 100%;">
        <div style="flex: 1;"></div>
        <div style="display:flex;flex: 3;flex-direction: column;justify-content: space-evenly;align-items: center;justify-content: center;color: white">
          <div class=" myIndication q-ma-md" style="flex: 1;">
            <p>{{ transStr(stringsIDs.str_amount_borrowed) }}</p>
          </div>
          <div style="flex: 1;">
            <q-input dark ref="myAmount" filled size="10" style="font-size: x-large;" clearable type="number" bg-color="blue-grey-10" v-model="simu.credit.amount" lazy-rules :rules="[
              (val) => val > 0 || transStr(stringsIDs.str_neg_amount),
            ]" @update:model-value="simu.credit.amount = Number(simu.credit.amount)"
            @keyup.enter="credit_amount_nxt.click()"
            :suffix="getCurrencySymbol()"/>
          </div>
          <div style="flex: 1;width: 100%;">
          <q-slider dark inner-track-color="blue-grey-8" v-model="simu.credit.amount" :min="0" :max="500000" :step="1000" @change="myAmount.focus()"/>
          </div>
        </div>
        <div style="flex: 2;display: flex;">
          <div style="display: flex; flex-direction : row;width:100% ;justify-content: space-evenly;align-items: center;justify-content: center; flex-wrap: wrap;">
            <q-btn class="q-ma-xs" color="blue-grey-8" :label=transStr(stringsIDs.str_prev) size="xl"
              @click="currentSlide = 'creditDate'"></q-btn>
            <q-btn ref="credit_amount_nxt" class="q-ma-xs" color="blue-grey-8" :label=transStr(stringsIDs.str_next) size="xl"
              @click="simu.credit.amount==0 ?
              $q.notify({ color: 'orange-4', textColor: 'black', icon: 'warning', message: transStr(stringsIDs.str_notif_warn_amount), }):
              currentSlide = 'creditRate'"></q-btn>
          </div>
        </div>
      </div>
    </q-carousel-slide>

    <q-carousel-slide name="creditRate" class="bg-black"  style="display: flex;">
      <div style="display: flex; flex-direction: column;width: 100%;height: 100%;">
        <div style="flex: 1;"></div>
        <div style="display:flex;flex: 3;flex-direction: column;justify-content: space-evenly;align-items: center;justify-content: center;text-align: center;color: white;">
          <div class=" myIndication q-ma-md" style="flex: 1;">
            <p>{{ transStr(stringsIDs.str_rate) }}</p>
          </div>
          <div style="flex: 1;">
            <q-input dark ref="myRate" filled size="10" style="font-size: x-large;" bg-color="blue-grey-10" type="number" step="any" v-model="simu.credit.rate" lazy-rules
              :rules="[(val) => (val > 0 || val >10) || transStr(stringsIDs.str_rate_impossible)]"
              @update:model-value="simu.credit.rate = Number(simu.credit.rate)" clearable
              suffix="%"
              @keyup.enter="credit_rate_nxt.click()"/>
          </div>
          <div style="flex: 1;width: 100%;">
          <q-slider dark inner-track-color="blue-grey-8" v-model="simu.credit.rate" :min="0" :max="10" :step="0.01" @change="myRate.focus()"/>
          </div>
        </div>
        <div style="flex: 2;display: flex;">
          <div style="display: flex; flex-direction : row;width:100% ;justify-content: space-evenly;align-items: center;justify-content: center; flex-wrap: wrap;">
            <q-btn class="q-ma-xs" color="blue-grey-8" :label=transStr(stringsIDs.str_prev) size="xl"
              @click="currentSlide = 'creditAmount'"></q-btn>
            <q-btn ref="credit_rate_nxt" class="q-ma-xs" color="blue-grey-8" :label=transStr(stringsIDs.str_next) size="xl"
              @click="simu.credit.rate==0 ?
              $q.notify({ color: 'orange-4', textColor: 'black', icon: 'warning', message: transStr(stringsIDs.str_notif_warn_rate), }):
              currentSlide = 'creditDuration'"></q-btn>
          </div>
        </div>
      </div>
    </q-carousel-slide>

    <q-carousel-slide name="creditDuration" class="bg-black"  style="display: flex;">
      <div style="display: flex; flex-direction: column;width: 100%;height: 100%;">
        <div style="flex: 1;"></div>
        <div style="display:flex;flex: 3;flex-direction: column;justify-content: space-evenly;align-items: center;justify-content: center;color: white;">
          <div class=" myIndication q-ma-md" style="flex: 1;">
            <p>{{ transStr(stringsIDs.str_duration) }}</p>
          </div>
          <div style="flex: 1;display:flex ;flex-direction: column;justify-content: space-evenly;align-items: center;justify-content: center;" @click="myDur.focus()">
            <q-input dark class="q-ma-md" ref="myDur" size="10" style="font-size: x-large;" filled type="number" bg-color="blue-grey-10" v-model="duration_no_unit"
              lazy-rules :rules="[(val) => (val > 0 ||( duration_units == transStr(stringsIDs.str_unit_y) && val< 50) ||( duration_units == transStr(stringsIDs.str_unit_m) && val< 600)) || transStr(stringsIDs.str_durationPos)]"
              @update:model-value="[duration_units == transStr(stringsIDs.str_unit_y) ?
              simu.credit.duration_m = Number(Math.round(duration_no_unit) * 12) :
              simu.credit.duration_m = Number(Math.round(duration_no_unit))]"
              @keyup.enter="credit_dur_next.click()"
              @focus="[myDur.focus()]"

              />
            <q-btn-toggle class="q-ma-md" name="durationUnits" v-model="duration_units" unelevated size="20px" glossy toggle-color="indigo-10"
              color=black :options="[
                { label: transStr(stringsIDs.str_unit_y), value: transStr(stringsIDs.str_unit_y) },
                { label: transStr(stringsIDs.str_unit_m), value: transStr(stringsIDs.str_unit_m) }
              ]"
              @update:model-value="duration_units == transStr(stringsIDs.str_unit_y) ?
              duration_no_unit = Math.round(duration_no_unit / 12) :
              duration_no_unit = duration_no_unit * 12" />
          </div>
          <div style="display:flex;width: 95%;">
          <q-slider dark inner-track-color="blue-grey-8" class="q-ma-md" v-model="duration_no_unit" :min="0" :max="duration_units == transStr(stringsIDs.str_unit_y)?30:360" :step="1" @change="myDur.focus()"/>
          </div>
        </div>
        <div style="flex: 2;display: flex;">
          <div style="display: flex; flex-direction : row;width:100% ;justify-content: space-evenly;align-items: center;justify-content: center; flex-wrap: wrap;">
            <q-btn class="q-ma-xs" color="blue-grey-8" :label=transStr(stringsIDs.str_prev) size="xl"
              @click="currentSlide = 'creditRate'"></q-btn>
            <q-btn ref="credit_dur_next" class="q-ma-xs" color="blue-grey-8" :label=transStr(stringsIDs.str_validate) size="xl"
              @click="[duration_units == transStr(stringsIDs.str_unit_y) ?
              simu.credit.duration_m = Number(Math.round(duration_no_unit) * 12) :
              simu.credit.duration_m = Number(Math.round(duration_no_unit)),
              checkdata() && emit('credit-done')]
              "></q-btn>
          </div>
        </div>
      </div>
    </q-carousel-slide>

  </q-carousel>

</template>

<script setup>
import {getCurrencySymbol} from '../stores/currencies.ts'
import { ref, defineEmits } from 'vue';
import { simu } from 'src/stores/store';
import { useQuasar } from 'quasar';
import { getTranslatedFormatedCalendar } from '../stores/languages';
import { formatDate } from '../utils/date_utility.js'
import { transStr, stringsIDs } from '../stores/languages.ts'
const $q = useQuasar();
var myCreditForm = ref();
var currentSlide = ref('creditDate');
const emit = defineEmits(['credit-done', 'credit-aborted']);
var mustpop = ref(false);
var unformated = ref('00/00/0000');
var duration_units = ref(transStr(stringsIDs.str_unit_y));
var duration_no_unit = ref('0');
var myAmount=ref();
var credit_amount_nxt=ref();
var myRate=ref();
var credit_rate_nxt=ref();
var myDur=ref();
var credit_dur_next=ref();
var duration_units = ref(transStr(stringsIDs.str_unit_y));
var duration_no_unit = ref('0');


const parseCreditDate = function () {
  simu.value.credit.y = Number(simu.value.credit.startingDate.split('/')[2]);
  simu.value.credit.m = Number(simu.value.credit.startingDate.split('/')[1]);
}



const checkdata=function()
{
  //date is constraint by picker and cannot be changed
  if(simu.value.credit.amount<=0)
  {
    $q.notify({ color: 'orange-4', textColor: 'black', icon: 'warning', message: transStr(stringsIDs.str_neg_amount), });
    currentSlide.value='creditAmount';
    return false;
  }
  else if(simu.value.credit.rate<0 || simu.value.credit.rate>10)
  {
    $q.notify({ color: 'orange-4', textColor: 'black', icon: 'warning', message: transStr(stringsIDs.str_rate_impossible), });
    currentSlide.value='creditRate';
    return false;
  }
  else if(simu.value.credit.duration_m<=0)
  {
    $q.notify({ color: 'orange-4', textColor: 'black', icon: 'warning', message: transStr(stringsIDs.str_durationPos), });
    currentSlide.value='creditDuration';
    return false;
  }
  return true;
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
