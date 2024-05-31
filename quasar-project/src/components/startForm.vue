<template>

  <q-carousel ref="myCreditForm" fullscreen animated :arrows="false" :navigation="false" v-model="currentSlide">
    <q-carousel-slide name="creditDate" class="bg-grey-9" style="display: flex;">
      <div style="display: flex; flex-direction: column;width: 100%;height: 100%;">
        <div style="flex: 1;"></div>
        <div style="display:flex;flex: 3;flex-direction: column;justify-content: space-evenly;align-items: center;justify-content: center;">
          <div class=" myIndication q-ma-md" style="flex: 1;">
            <p>{{ transStr(stringsIDs.str_signature_date) }}</p>
          </div>
          <div style="flex: 1;">
            <q-input bg-color="blue-grey-8" filled v-model="simu.credit.startingDate" @click="mustpop = true" readonly size="10" style="font-size: x-large;">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy v-model="mustpop" cover transition-show="scale" transition-hide="scale" persistent>
                    <q-date dark v-model="unformated" :locale=getTranslatedFormatedCalendar()
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

    <q-carousel-slide name="creditAmount" class="bg-grey-9"  style="display: flex;">
      <div style="display: flex; flex-direction: column;width: 100%;height: 100%;">
        <div style="flex: 1;"></div>
        <div style="display:flex;flex: 3;flex-direction: column;justify-content: space-evenly;align-items: center;justify-content: center;">
          <div class=" myIndication q-ma-md" style="flex: 1;">
            <p>{{ transStr(stringsIDs.str_amount_borrowed) }}</p>
          </div>
          <div style="flex: 1;">
            <q-input filled size="10" style="font-size: x-large;" clearable type="number" bg-color="blue-grey-8" v-model="simu.credit.amount" lazy-rules :rules="[
              (val) => val > 0 || transStr(stringsIDs.str_neg_amount),
            ]" @update:model-value="simu.credit.amount = Number(simu.credit.amount)" />
          </div>
        </div>
        <div style="flex: 2;display: flex;">
          <div style="display: flex; flex-direction : row;width:100% ;justify-content: space-evenly;align-items: center;justify-content: center; flex-wrap: wrap;">
            <q-btn class="q-ma-xs" color="blue-grey-8" :label=transStr(stringsIDs.str_prev) size="xl"
              @click="currentSlide = 'creditDate'"></q-btn>
            <q-btn class="q-ma-xs" color="blue-grey-8" :label=transStr(stringsIDs.str_next) size="xl"
              @click="simu.credit.amount==0 ?
              $q.notify({ color: 'orange-4', textColor: 'black', icon: 'warning', message: transStr(stringsIDs.str_notif_warn_amount), }):
              currentSlide = 'creditRate'"></q-btn>
          </div>
        </div>
      </div>
    </q-carousel-slide>

    <q-carousel-slide name="creditRate" class="bg-grey-9"  style="display: flex;">
      <div style="display: flex; flex-direction: column;width: 100%;height: 100%;">
        <div style="flex: 1;"></div>
        <div style="display:flex;flex: 3;flex-direction: column;justify-content: space-evenly;align-items: center;justify-content: center;">
          <div class=" myIndication q-ma-md" style="flex: 1;">
            <p>{{ transStr(stringsIDs.str_rate) }}</p>
          </div>
          <div style="flex: 1;">
            <q-input filled size="10" style="font-size: x-large;" bg-color="blue-grey-8" type="number" step="any" v-model="simu.credit.rate" lazy-rules
              :rules="[(val) => (val > 0) || transStr(stringsIDs.str_rate_impossible)]"
              @update:model-value="simu.credit.rate = Number(simu.credit.rate)" clearable />
          </div>
        </div>
        <div style="flex: 2;display: flex;">
          <div style="display: flex; flex-direction : row;width:100% ;justify-content: space-evenly;align-items: center;justify-content: center; flex-wrap: wrap;">
            <q-btn class="q-ma-xs" color="blue-grey-8" :label=transStr(stringsIDs.str_prev) size="xl"
              @click="currentSlide = 'creditAmount'"></q-btn>
            <q-btn class="q-ma-xs" color="blue-grey-8" :label=transStr(stringsIDs.str_next) size="xl"
              @click="simu.credit.rate==0 ?
              $q.notify({ color: 'orange-4', textColor: 'black', icon: 'warning', message: transStr(stringsIDs.str_notif_warn_rate), }):
              currentSlide = 'creditDuration'"></q-btn>
          </div>
        </div>
      </div>
    </q-carousel-slide>

    <q-carousel-slide name="creditDuration" class="bg-grey-9"  style="display: flex;">
      <div style="display: flex; flex-direction: column;width: 100%;height: 100%;">
        <div style="flex: 1;"></div>
        <div style="display:flex;flex: 3;flex-direction: column;justify-content: space-evenly;align-items: center;justify-content: center;">
          <div class=" myIndication q-ma-md" style="flex: 1;">
            <p>{{ transStr(stringsIDs.str_duration) }}</p>
          </div>
          <div style="flex: 1;display:flex ;flex-direction: column;justify-content: space-evenly;align-items: center;justify-content: center;">
            <q-input size="10" style="font-size: x-large;" filled type="number" bg-color="blue-grey-8" v-model="duration_no_unit"
              lazy-rules :rules="[(val) => (val > 0) || transStr(stringsIDs.str_durationPos)]"
              @update:model-value="[duration_units == transStr(stringsIDs.str_unit_y) ?
              simu.credit.duration_m = Number(Math.round(duration_no_unit) * 12) :
              simu.credit.duration_m = Number(Math.round(duration_no_unit))]" clearable/>
            <q-btn-toggle class="q-ma-md" name="durationUnits" v-model="duration_units" unelevated size="20px" glossy
              color=black :options="[
                { label: transStr(stringsIDs.str_unit_y), value: transStr(stringsIDs.str_unit_y) },
                { label: transStr(stringsIDs.str_unit_m), value: transStr(stringsIDs.str_unit_m) }
              ]"
              @update:model-value="duration_units == transStr(stringsIDs.str_unit_y) ?
              duration_no_unit = Math.round(duration_no_unit / 12) :
              duration_no_unit = duration_no_unit * 12" />
          </div>
        </div>
        <div style="flex: 2;display: flex;">
          <div style="display: flex; flex-direction : row;width:100% ;justify-content: space-evenly;align-items: center;justify-content: center; flex-wrap: wrap;">
            <q-btn class="q-ma-xs" color="blue-grey-8" :label=transStr(stringsIDs.str_prev) size="xl"
              @click="currentSlide = 'creditRate'"></q-btn>
            <q-btn class="q-ma-xs" color="blue-grey-8" :label=transStr(stringsIDs.str_validate) size="xl"
              @click="simu.credit.duration_m==0 ?
              $q.notify({ color: 'orange-4', textColor: 'black', icon: 'warning', message: transStr(stringsIDs.str_notif_warn_rate), }):
              emit('credit-done')"></q-btn>
          </div>
        </div>
      </div>
    </q-carousel-slide>

  </q-carousel>

</template>

<script setup>
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

var duration_units = ref(transStr(stringsIDs.str_unit_y));
var duration_no_unit = ref('0');

const parseCreditDate = function () {
  simu.value.credit.y = Number(simu.value.credit.startingDate.split('/')[2]);
  simu.value.credit.m = Number(simu.value.credit.startingDate.split('/')[1]);
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
