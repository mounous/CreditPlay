<template>

  <q-carousel ref="myEventForm" fullscreen animated :arrows="false" :navigation="false" v-model="currentSlide">
    <q-carousel-slide name="metatype" class="bg-black">
      <div class="oneInThreeRowH"></div>
      <div class="oneInThreeRow">
        <div class="column items-center">
          <div class="col myIndication q-ma-md" style="font-size: x-large;text-align: center;color: white;">
            <p>{{ transStr(stringsIDs.str_choose_evt_type) }}</p>
          </div>
          <div class="row"
            style="display: flex;justify-content: space-evenly;align-items: center;justify-content: center;">
            <q-btn class="q-ma-xs" size='xl' color="blue-grey-8" :label=transevtmetaType(EVT_META_TYPE_MOD)
              @click="[event_.metaType = EVT_META_TYPE_MOD, currentSlide = 'modulationDate']"></q-btn>
            <q-btn class="q-ma-xs" size='xl' color="blue-grey-8" :label=transevtmetaType(EVT_META_TYPE_REBUY)
              @click="[event_.metaType = EVT_META_TYPE_REBUY, currentSlide = 'rebuypenalties']"></q-btn>
          </div>
        </div>
      </div>
      <div class="oneInThreeRowB">
        <div class="column items-center">
          <q-btn class="q-ma-xl" color="blue-grey-8" :label=transStr(stringsIDs.str_cancel) size="xl"
            @click="emit('event-abort')"></q-btn>
        </div>
      </div>
    </q-carousel-slide>

    <q-carousel-slide name="modulationDate" class="bg-black">
      <div class="oneInThreeRowH"></div>
      <div class="oneInThreeRow">
        <div class="column items-center">
          <div class="col myIndication q-ma-md" style="font-size: x-large;text-align: center;color: white;">
            <p>{{ transStr(stringsIDs.str_mod_date) }}</p>
          </div>
          <div class="row" style="display: flex;">
            <div style="flex:1"></div>
            <div style="flex:4" >
              <q-input dark outlined class="q-ma-md" style="font-size: x-large;border-radius: 2px;border-color: white;" bg-color="blue-grey-10" filled
                @click="mustpopDateMod = true" readonly v-model="date_mod">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy v-model="mustpopDateMod" cover transition-show="scale" transition-hide="scale"
                      persistent>
                      <q-date dark  color=black v-model="date_modunformated" :locale=getTranslatedFormatedCalendar()
                        :navigation-min-year-month="mod_min_date" width="200px"
                        :navigation-max-year-month="mod_max_date" :default-year-month="mod_min_date"
                        @update:model-value="date_mod = formatDate(date_modunformated), [validateModDate(), mustpopDateMod = false, event_.type = DEFAULT_EVENT_TYPE, modVal = DEFAULT_MODVAL]">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup :label=transStr(stringsIDs.str_close) color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <div style="flex:1"></div>
          </div>
          <div class="col myIndication" v-if="event_.year != 0 && event_.month != 0 != 0">
            <p> {{ transStr(stringsIDs.str_capital_left) + situationAtDate }}</p>
          </div>
          <div class="row q-mt-md"
            style="display: flex;justify-content: space-evenly;align-items: center;justify-content: center;">
            <q-btn class="q-ma-xs" color="blue-grey-8" :label=transStr(stringsIDs.str_prev) size="xl"
              @click="[currentSlide = 'metatype', event_.metaType = DEFAULT_EVENT_META_TYPE, situationAtDate = '', event_.month = 0, event_.year = 0, date_mod = mod_min_date, event_.year_str = '', event_.month_str = '']"></q-btn>
            <q-btn class="q-ma-xs" color="blue-grey-8" :label=transStr(stringsIDs.str_next) size="xl"
              @click="currentSlide = 'modulationval'" :disable="event_.month == 0 || event_.year == 0"></q-btn>
          </div>
        </div>
      </div>
      <div class="oneInThreeRowB"></div>
    </q-carousel-slide>

    <q-carousel-slide name="modulationval" class="bg-black">
      <div class="oneInThreeRowH"></div>
      <div class="oneInThreeRow">
        <div class="column items-center">
          <div v-if="situationAtDate != '' && event_.year != 0 && event_.month != 0" class="col myIndication q-ma-md" style="font-size: x-large;text-align: center;color: white;">
            <p>{{ transStr(stringsIDs.str_choose_mod) }}</p>
          </div>
          <div class="col q-ma-md">
            <div class="row q-mb-md" style="display: flex;">
              <div style="flex:1"></div>
              <div style="flex:4">
                <q-select dark dense rounded outlined v-model="event_type_str" :options=transevtmodType()
                  style="font-size: large"
                  @update:model-value="[event_.type = getModTypeFromStr(event_type_str), getopt(), modVal = DEFAULT_MODVAL]"
                  bg-color="black" />
              </div>
              <div style="flex:1"></div>
            </div>
            <div v-if="event_.type!=DEFAULT_MODVAL && event_.type!=DEFAULT_EVENT_TYPE" style="display: flex;flex-direction: row; align-items: center;align-content: center;" class="q-mb-md">
              <q-icon v-if="event_.type==EVT_TYPE_MOD_MENS_DOWN" color="orange" name="warning" class="q-mr-md"> </q-icon>
              <th v-if="event_.type==EVT_TYPE_MOD_MENS_DOWN" style="font-size: medium;color: white;" > {{ transStr(stringsIDs.str_mod_down_consequence) }}</th>
              <q-icon v-if="event_.type==EVT_TYPE_MOD_MENS_UP" color="green" name="check"  class="q-mr-md"> </q-icon>
              <th v-if="event_.type==EVT_TYPE_MOD_MENS_UP" style="font-size: medium;color: white" > {{ transStr(stringsIDs.str_mod_up_consequence) }}</th>
              </div>
            <div class="row" style="display: flex;">
              <div style="flex:1"></div>
              <div style="flex:4">
                <q-select dark class="evtTypeVal" style="font-size:large" rounded outlined v-model="modVal"
                  :options="options_mod" :disable="event_.type == DEFAULT_EVENT_TYPE"
                  @update:model-value="validateMod()" bg-color="black"></q-select>
              </div>
              <div style="flex:1"></div>
            </div>
          </div>
          <div class="row q-mt-md"
            style="display: flex;justify-content: space-evenly;align-items: center;justify-content: center;">
            <q-btn class="q-ma-xs" color="blue-grey-8" :label=transStr(stringsIDs.str_prev) size="xl"
              @click="[currentSlide = 'modulationDate', event_.type = DEFAULT_EVENT_TYPE, event_type_str = DEFAULT_EVENT_TYPE_STR, event_.new_mens = 0, event_.modVal = '', event_.mensDiff = 0]"></q-btn>
            <q-btn class="q-ma-xs" color="blue-grey-8" :label=transStr(stringsIDs.str_validate) size="xl"
              @click="finishEvt()" :disable="modVal == DEFAULT_MODVAL || event_.type == DEFAULT_EVENT_TYPE"></q-btn>
          </div>
        </div>
      </div>
      <div class="oneInThreeRowB"></div>
    </q-carousel-slide>

    <q-carousel-slide name="rebuypenalties" class="bg-black">
      <div class="oneInThreeRowH"></div>
      <div class="oneInThreeRow">
        <div class="column items-center">
          <div class="col myIndication q-ma-md" style="font-size: x-large;text-align: center;color: white;">
            <p>{{ transStr(stringsIDs.str_indic_penalties) }}</p>
          </div>
          <div class="row" style="display: flex;align-content: center;">

            <div style="flex:4;align-items: center;align-content: center;">
              <q-input ref="myPenalties" outlined clearable bg-color="black" dark class="q-ma-md" style="font-size: x-large;" v-model="penalties_no_unit"
                type="number" lazy-rules :suffix="event_.rebuyPenaltiesType == getCurrencySymbol() ?getCurrencySymbol():'%'"
                @update:model-value="event_.rebuyPenaltiesType == getCurrencySymbol() ? event_.rebuyPenalties_abs = Number(penalties_no_unit) : event_.rebuyPenalties = Number(penalties_no_unit)"
                :rules="[(val) => (val >= 0.0) || transStr(stringsIDs.str_penalties_rule)]"
                 @keyup.enter="penatlies_nxt.click()"></q-input>
            </div>
            <div style="flex: 2;align-items: center;align-content: center;;">
              <q-btn-toggle style="font-size: xx-large;" class="q-ma-md" name="durationUnits"
                v-model="event_.rebuyPenaltiesType" unelevated size="20px" glossy color="blue-grey-20" toggle-color="blue" :options="[
                  { label: getCurrencySymbol(), value: getCurrencySymbol() },
                  { label: '%', value: '%' }
                ]" @update:model-value="[penalties_no_unit = 0, event_.rebuyPenalties = 0, event_.rebuyPenalties_abs = 0]" />
            </div>

          </div>
        </div>
        <div class="q-ma-md" style="display:flex; width: 95%;">
          <q-slider dark inner-track-color="blue-grey-8" class="q-ma-md" v-model="penalties_no_unit" :min="0"
            :max="event_.rebuyPenaltiesType == '%' ? 5 : simu.credit.amount / 30"
            :step="event_.rebuyPenaltiesType == '%' ? 0.01 : 10" @change="myPenalties.focus()"
            @update:model-value="event_.rebuyPenaltiesType == getCurrencySymbol() ? event_.rebuyPenalties_abs = Number(penalties_no_unit) : event_.rebuyPenalties = Number(penalties_no_unit)" />
        </div>
        <div class="row q-mt-md"
          style="display: flex;justify-content: space-evenly;align-items: center;justify-content: center;">
          <q-btn class="q-ma-xs" color="blue-grey-8" :label=transStr(stringsIDs.str_prev) size="xl"
            @click="[currentSlide = 'metatype', event_.metaType = '', situationAtDate = '', event_.month = 0, event_.year = 0, event_.rebuyPenalties = DEFAULT_PENALTIES]"></q-btn>
          <q-btn ref="penatlies_nxt" class="q-ma-xs" color="blue-grey-8" :label=transStr(stringsIDs.str_next) size="xl"
            @click="[currentSlide = 'rebuyType', event_.rebuyPenalties == DEFAULT_PENALTIES ? event_.rebuyPenalties = 0 : event_.rebuyPenalties = event_.rebuyPenalties]"
            :disable="event_.rebuyPenalties < 0 || event_.rebuyPenalties_abs < 0"></q-btn>
        </div>
      </div>

      <div class="oneInThreeRowB"></div>
    </q-carousel-slide>

    <q-carousel-slide name="rebuyType" class="bg-black">
      <div class="oneInThreeRowH">

      </div>
      <div class="oneInThreeRow">
        <div class="column items-center">
          <div class="col myIndication q-ma-md" style="font-size: x-large;text-align: center;color: white;">
            <p>{{ transStr(stringsIDs.str_indic_rebuy_type) }}</p>
          </div>
          <div class="col q-ma-md" style="background-color: black;color: white;">
            <q-select dark label-color="white" rounded outlined v-model="event_type_str" :options="options_rebuy" bg-color="black"
              style="font-size: x-large;" @update:model-value="[event_.type = getrebuyTypeFromStr(event_type_str), event_.reloanRate = 0, event_.reloanDuration_m = 0, event_.savingsLeft = 0,
              rebuy_saving_capital_to_pay = '', rachatVal = DEFAULT_RACHAT_VAL_VALUE, getoptRebuy()]"></q-select>
          </div>

          <div class="row q-mt-md"
            style="display: flex;justify-content: space-evenly;align-items: center;justify-content: center;">
            <q-btn class="q-ma-xs" color="blue-grey-8" :label=transStr(stringsIDs.str_prev) size="xl"
              @click="[currentSlide = 'rebuypenalties', event_.type = DEFAULT_EVENT_TYPE, event_type_str = DEFAULT_EVENT_TYPE_STR]"></q-btn>
            <q-btn class="q-ma-xs" color="blue-grey-8" :label=transStr(stringsIDs.str_next) size="xl"
              @click="event_.type == EVT_TYPE_REBUY_SAVINGS ? currentSlide = 'rebuySave' : currentSlide = 'rebuyReloanDate'"
              :disable="event_.type == DEFAULT_EVENT_TYPE ? true : false"></q-btn>
          </div>
        </div>
      </div>
      <div class="oneInThreeRowB"></div>
    </q-carousel-slide>

    <q-carousel-slide name="rebuySave" class="bg-black">
      <div class="oneInThreeRowH">
      </div>
      <div class="oneInThreeRow">
        <div class="column items-center">
          <div class="col q-ma-md" style="background-color: black;color: white;">
            <q-select dark label-color="white" v-if="event_.type == EVT_TYPE_REBUY_SAVINGS" class="evtTypeVal" rounded outlined
              v-model="rachatVal" bg-color="black" style="font-size: x-large;" :options="options_rebuy_val"
              @update:model-value="extractDataFromRebuySavings()"></q-select>
          </div>
          <div style="font-size: x-large; color: white;" class="col q-ma-md"
            v-if="event_.type == EVT_TYPE_REBUY_SAVINGS && event_.savingsLeft != 0 && rebuy_saving_capital_to_pay != ''">
            {{ transStr(stringsIDs.str_savings_left) + event_.savingsLeft.toString() + getCurrencySymbol() }}
          </div>
          <div style="font-size: x-large;" class="col q-ma-md"
            v-if="event_.type == EVT_TYPE_REBUY_SAVINGS && event_.savingsLeft != 0 && rebuy_saving_capital_to_pay != ''">
            {{ transStr(stringsIDs.str_capital_rebought) + rebuy_saving_capital_to_pay }}
          </div>
          <div class="row q-mt-md"
            style="display: flex;justify-content: space-evenly;align-items: center;justify-content: center;">
            <q-btn class="q-ma-xs" color="blue-grey-8" :label=transStr(stringsIDs.str_prev) size="xl"
              @click="[currentSlide = 'rebuyType', event_.type = DEFAULT_EVENT_TYPE, event_type_str = DEFAULT_EVENT_TYPE_STR,rachatVal = DEFAULT_RACHAT_VAL_VALUE]"></q-btn>
            <q-btn class="q-ma-xs" color="blue-grey-8" :label=transStr(stringsIDs.str_next) size="xl" :disable="rachatVal == DEFAULT_RACHAT_VAL_VALUE"
              @click="RebuyPicked()" ></q-btn>
          </div>
        </div>
      </div>
      <div class="oneInThreeRowB"></div>
    </q-carousel-slide>

    <q-carousel-slide name="rebuyReloanDate" class="bg-black">
      <div class="oneInThreeRowH">
      </div>
      <div class="oneInThreeRow">
        <div class="column items-center">
          <div class="q-ma-md" style="display: flex;flex-direction : column ;align-items:  center; align-content: center; justify-items: center;">
            <div style="display:flex ;font-size: large;color: white;">
              <p>{{ transStr(stringsIDs.str_rebuy_date) }}</p>
            </div>
            <div class="row" style="display: flex;align-content: center;">
            <div style="flex:1"></div>
            <div style="flex:4;align-items: center;align-content: center;">
              <q-input dark v-if="event_.type == EVT_TYPE_REBUY_CREDIT" class="q-mt-md" style="font-size: x-large;"
                bg-color="black" filled v-model="event_.reLoanDate" @click="mustpop = true" readonly>
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy v-model="mustpop" cover transition-show="scale" transition-hide="scale" persistent>
                      <q-date color="black" dark v-model="unformatedrebuydate" :locale=getTranslatedFormatedCalendar()
                        :navigation-min-year-month="reloanMin" width="200px" :navigation-max-year-month="reloanMax"
                        :default-year-month="reloanMin"
                        @update:model-value="[mustpop = false, formatAndExtracteventdateFrom()]">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Fermer" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <div style="flex:1"></div>
          </div>
          </div>
          <div class="row q-mt-md"
            style="display: flex;justify-content: space-evenly;align-items: center;justify-content: center;">
            <q-btn class="q-ma-xs" color="blue-grey-8" :label=transStr(stringsIDs.str_prev) size="xl"
              @click="[currentSlide = 'rebuyType', event_.type = DEFAULT_EVENT_TYPE, event_type_str = DEFAULT_EVENT_TYPE_STR,
                unformatedrebuydate = reloanMin, event_.year = 0, event_.month = 0, event_.month_str = '', event_.year_str = '',
                 event_.savingsLeft = 0, rebuy_saving_capital_to_pay = '', event_.reLoanDate = ''
              ]"></q-btn>
            <q-btn class="q-ma-xs" color="blue-grey-8" :label=transStr(stringsIDs.str_next) size="xl"
              @click="currentSlide = 'rebuyReloanRate'" :disable=" event_.year == 0 || event_.month == 0"></q-btn>
          </div>
        </div>
      </div>
      <div class="oneInThreeRowB"></div>
    </q-carousel-slide>

    <q-carousel-slide name="rebuyReloanRate" class="bg-black">
      <div class="oneInThreeRowH">
      </div>
      <div class="oneInThreeRow">
        <div class="column items-center">
          <div class="col q-ma-md">
            <div class="col q-mt-md" style="font-size: large; text-align: center;">
              <p style="color: white;">{{ transStr(stringsIDs.str_rate) }}</p>
            </div>
            <div class="row" style="display: flex;align-content: center;">
            <div style="flex:1"></div>
            <div style="flex:4;align-items: center;align-content: center;">
              <q-input dark ref="myreloanrate" clearable class="q-ma-xs" style="font-size: x-large;"
                v-model="event_.reloanRate" type="number" lazy-rules
                :rules="[(val) => (val >= 0.0) || transStr(stringsIDs.str_rate_impossible)]" bg-color="blue-grey-8"
                outlined @update:model-value="event_.reloanRate = Number(event_.reloanRate)"
                @keyup.enter="rebutreloanrate_nxt.click()"></q-input>
            </div>
            <div style="flex:1"></div>
          </div>
          <div class="q-ma-md" style="display:flex; width: 95%;">
            <q-slider class="q-ma-md" v-model="event_.reloanRate" :min="0" :max="5" :step="0.01"
              @change="myreloanrate.focus()" />
          </div>
          </div>
          <div class="row q-mt-md"
            style="display: flex;justify-content: space-evenly;align-items: center;justify-content: center;">
            <q-btn class="q-ma-xs" color="blue-grey-8" :label=transStr(stringsIDs.str_prev) size="xl"
              @click="[currentSlide = 'rebuyReloanDate', event_.reloanRate=0.0]"></q-btn>
            <q-btn class="q-ma-xs" color="blue-grey-8" :label=transStr(stringsIDs.str_next) size="xl" ref="rebutreloanrate_nxt"
              @click="currentSlide = 'rebuyReloanDur'" :disable="event_.reloanRate <= 0 || event_.reloanRate == ''"></q-btn>
          </div>
        </div>
      </div>
      <div class="oneInThreeRowB"></div>
    </q-carousel-slide>



    <q-carousel-slide name="rebuyReloanDur" class="bg-black">
      <div class="oneInThreeRowH">
      </div>
      <div class="oneInThreeRow">
        <div class="column items-center">
          <div class="q-ma-md" style="display: flex;flex-direction : column ;align-items:  center; align-content: center; justify-items: center;">
            <div class="col q-mt-md" style="font-size: large;color: white;">
            <p>{{ transStr(stringsIDs.str_duration) }}</p>
          </div>

            <div style="flex:1;align-items: center;align-content: center;">
              <q-input dark ref="myreloandur" clearable class="q-ma-xs" style="font-size: x-large;"
                v-model="duration_no_unit" type="number" lazy-rules
                :rules="[(val) => (val > 0) || transStr(stringsIDs.str_durationPos)]" bg-color="blue-grey-8" outlined
                @update:model-value="duration_units == transStr(stringsIDs.str_unit_y) ? event_.reloanDuration_m = Number(duration_no_unit) * 12 : event_.reloanDuration_m = Number(duration_no_unit)"
                @keyup.enter="rebuyReloanDur_nxt.click()" :suffix="duration_units"></q-input>
            </div>
            <div style="flex: 1;align-items: center;justify-items: center;">
              <q-btn-toggle v-if="event_.type == EVT_TYPE_REBUY_CREDIT" class="q-ma-md" name="durationUnits"
                v-model="duration_units" unelevated size="14px" glossy color=black toggle-color="blue" :options="[
                  { label: transStr(stringsIDs.str_unit_y), value: transStr(stringsIDs.str_unit_y) },
                  { label: transStr(stringsIDs.str_unit_m), value: transStr(stringsIDs.str_unit_m) }
                ]" @update:model-value="duration_units == transStr(stringsIDs.str_unit_y) ? duration_no_unit = Math.round(duration_no_unit / 12) : duration_no_unit = duration_no_unit * 12" />
            </div>
            <div class="q-ma-md" style="display:flex; width: 95%;">
              <q-slider dark inner-track-color="blue-grey-10" class="q-ma-md" v-model="duration_no_unit" :min="0"
                :max="duration_units == transStr(stringsIDs.str_unit_y) ? 30 : 30 * 12" :step="1"
                @change="myreloandur.focus()"
                @update:model-value="duration_units == transStr(stringsIDs.str_unit_y) ? event_.reloanDuration_m = Number(duration_no_unit) * 12 : event_.reloanDuration_m = Number(duration_no_unit)" />
            </div>

          </div>
          <div class="row q-mt-md"
            style="display: flex;justify-content: space-evenly;align-items: center;justify-content: center;">
            <q-btn class="q-ma-xs" color="blue-grey-8" :label=transStr(stringsIDs.str_prev) size="xl"
              @click="[currentSlide = 'rebuyReloanRate', event_.reloanDuration_m = 0]"></q-btn>
            <q-btn class="q-ma-xs" color="blue-grey-8" :label=transStr(stringsIDs.str_next) size="xl" ref="rebuyReloanDur_nxt"
            @click="RebuyPicked()" :disable="event_.reloanDuration_m <= 0" ></q-btn>
          </div>
        </div>
      </div>
      <div class="oneInThreeRowB"></div>
    </q-carousel-slide>
  </q-carousel>

  <div>
    <q-dialog v-model="mustPopWarning" v-if="event_.type == EVT_TYPE_REBUY_SAVINGS" cover persistent>
      <div class="q-mt-md)">
        <warningDisplayer class="q-mt-md">
          <div class="flex flex center justify-around" style="display: flex;flex-direction: column;">
            <div class="q-ma-md">
              <th style="color: white;font-size: 18px;font-family:'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif ;">{{ transSt(sentancesIDs.s_warning_post_rebuy_ops) }}</th>
            </div>
            <div class="col q-ma-md" style="display: flex;flex-direction: column;justify-content: center;justify-items: center;align-items: center;align-content: center;" v-for="elmnt in listToDisplay" :key="elmnt.id">
              <th style="text-align: center; color: white;font-size: 18px;font-family:'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif ;">{{ elmnt.title }}</th>
            </div>
            <div class="row nowrap" style="justify-content: center;justify-items: center;align-items: center;align-content: center;">
              <q-btn class="q-ma-md" style="background-color: black;color: white;" outilne :label=transStr(stringsIDs.str_validate) @click="[mustPopWarning = false, RebuyPicked(force = true)]"></q-btn>
              <q-btn class="q-ma-md" style="background-color: black;color: white;" outilne :label=transStr(stringsIDs.str_cancel)   @click="[mustPopWarning = false, rachatVal = DEFAULT_RACHAT_VAL_VALUE, listToDisplay = []]"></q-btn>
            </div>
          </div>
        </warningDisplayer>
      </div>
    </q-dialog>
  </div>
</template>

<script setup>
//------------------------------------//
//  notifications handling            //
//------------------------------------//
import { useQuasar } from 'quasar';
import warningDisplayer from './warningDisplayer.vue';
//------------------------------------//
//  inter components communication    //
//------------------------------------//
import { ref, defineEmits } from 'vue';
const emit = defineEmits(['event-done', 'event-abort']);
//------------------------------------//
// Language handling                  //
//------------------------------------//
import {
  transStr, stringsIDs, transevtmetaType, transMonthName, getTranslatedFormatedCalendar, transevtmodType,
  getModTypeFromStr, transRebuymodType, getrebuyTypeFromStr, getMonthNbr, transSt, sentancesIDs,
} from 'src/stores/languages';
var duration_units = ref(transStr(stringsIDs.str_unit_y));
var duration_no_unit = ref('0');
//------------------------------------//
// events computation handling        //
//------------------------------------//
import { apply_events_chain, build_event_name } from '../utils/credit_utility.js';
import { provideRebuyOptions } from '../utils/bank_utility'
import { simu } from 'stores/store';
import {
  getLastMensuality, getEarliestNewEventDate, EVT_TYPE_REBUY_SAVINGS, EVT_META_TYPE_MOD, EVT_META_TYPE_REBUY,EVT_TYPE_MOD_MENS_DOWN,EVT_TYPE_MOD_MENS_UP,
  provideModOptions, returnBaseData, EVT_TYPE_REBUY_CREDIT
} from '../utils/credit_utility'
const default_month_str = transStr(stringsIDs.str_sel_month);
const default_year_str = transStr(stringsIDs.str_sel_year);
const DEFAULT_EVENT_TYPE = -1;
const DEFAULT_EVENT_META_TYPE = -1;
const DEFAULT_PENALTIES = 0.0;
var penalties_no_unit = ref(0);
var event_ = ref({
  title: '',
  metaType: DEFAULT_EVENT_META_TYPE,
  type: DEFAULT_EVENT_TYPE,
  year_str: default_year_str,
  month_str: default_month_str,
  year: 0,
  month: 0,
  id: 1,
  selected: false,
  new_mens: -1.0,
  mensDiff: 0,
  modVal: '',
  amortEvt: [[],[],[],[],[]],
  rebuyVal: '',
  reLoanDate: '',
  reloanRate: 0,
  rebuyPenaltiesType: '%',
  rebuyPenalties: DEFAULT_PENALTIES,
  rebuyPenalties_abs: DEFAULT_PENALTIES,
  reloanDuration_m: 0,
  savingsLeft: 0,
});
//------------------------------------//
//    date handling                   //
//------------------------------------//
import { subTwoMonthToStringDate, addOneMonthToStringDate, formatDate } from '../utils/date_utility'
//------------------------------------//
//      DOM handling                  //
//------------------------------------//
var myPenalties = ref();
var myEventForm = ref();
var penatlies_nxt = ref();
var myreloanrate = ref();
var myreloandur = ref();
var rebutreloanrate_nxt=ref();
var rebuyReloanDur_nxt=ref();
var currentSlide = ref('metatype');
var situationAtDate = ref('');
import { getCurrencySymbol } from '../stores/currencies'
import { formatnumber } from '../utils/string_utils'
//************************* */
// Modulation date handling //
//************************* */
var mod_max_date = ref(subTwoMonthToStringDate(getLastMensuality().l_y.toString() + '/' + getLastMensuality().l_m.toString().padStart(2, '0')));
var mod_min_date = ref(addOneMonthToStringDate(getEarliestNewEventDate().l_y.toString() + '/' + getEarliestNewEventDate().l_m.toString().padStart(2, '0')));
var reloanMax = ref(subTwoMonthToStringDate(getLastMensuality().l_y.toString() + '/' + getLastMensuality().l_m.toString().padStart(2, '0')));
var reloanMin = ref(addOneMonthToStringDate(getEarliestNewEventDate().l_y.toString() + '/' + getEarliestNewEventDate().l_m.toString().padStart(2, '0')));
var date_mod = ref(mod_min_date.value);
var date_modunformated = ref(date_mod.value);
var unformatedrebuydate = ref(reloanMin.value);
var mustpopDateMod = ref(false);
var mustpop = ref(false);
const validateModDate = function () {
  event_.value.year = Number(date_mod.value.split('/')[2]);
  event_.value.month = Number(date_mod.value.split('/')[1]);
  event_.value.year_str = event_.value.year.toString();
  event_.value.month_str = transMonthName(event_.value.month);
  situationAtDate.value = formatnumber(returnBaseData(event_.value.year, event_.value.month).capital_left.toString()) + ' ' + getCurrencySymbol();
}
//----------------------------------//
//  Modulation options handling     //
//----------------------------------//
const DEFAULT_EVENT_TYPE_STR = transStr(stringsIDs.str_select_action);
var event_type_str = ref(DEFAULT_EVENT_TYPE_STR);
const DEFAULT_MODVAL = transStr(stringsIDs.str_choose_opt);
var modVal = ref(DEFAULT_MODVAL);
var options_mod = ref([]);
const getopt = function () {
  options_mod.value = provideModOptions(event_.value.type, event_.value.year, event_.value.month);
  if (options_mod.value.length == 1 && options_mod.value[0] == transStr(stringsIDs.str_mod_impossible)) {
    const $q = useQuasar();
    $q.notify({ color: 'orange-4', textColor: 'black', icon: 'warning', message: options_mod.value[0], });
    options_mod.value = ['undefined'];
  }
};
//--------------------------------------//
//       Modulation value handling      //
//--------------------------------------//
const canAddMod = ref(false);
const validateMod = function () {
  if (
    (event_.value.type != DEFAULT_EVENT_TYPE) &&
    modVal.value != DEFAULT_MODVAL
  ) {
    event_.value.mensDiff = Number(modVal.value.split('(')[1].split(transStr(stringsIDs.str_unit_m))[0]);
    event_.value.new_mens = Number(modVal.value.split(getCurrencySymbol())[0])
    canAddMod.value = true;
  }
  canAddMod.value = false;
};
//--------------------------//
//      COMMON END          //
//--------------------------//
const finishEvt = function () {
  event_.value.title = build_event_name(event_.value.metaType);
  simu.value.events.push(event_.value);
  if (event_.value.metaType == EVT_META_TYPE_REBUY && event_.value.type == EVT_TYPE_REBUY_SAVINGS) {
    simu.value.credit.has_been_rebougth = true;
  }
  apply_events_chain();
  emit('event-done');
};

//------------------------//
//  Rebuy options         //
//------------------------//
import { hasSavings } from '../utils/bank_utility.js'
import { compareDates } from '../utils/date_utility.js'

const safeRebuyOptions = function () {
  if (hasSavings()) {
    return transRebuymodType();
  }
  else {
    return [transRebuymodType()[EVT_TYPE_REBUY_CREDIT]];
  }
};
var options_rebuy = ref(safeRebuyOptions());
var event_type_str = ref(transStr(stringsIDs.str_select_action));

var rebuy_saving_capital_to_pay = ref('');
var options_rebuy_val = ref([]);
var Display_rebuy_savings = ref([]);
const getoptRebuy = function () {
  if (event_.value.type == EVT_TYPE_REBUY_SAVINGS) {
    var result = provideRebuyOptions(event_.value.type, Number(event_.value.rebuyPenalties), Number(event_.value.rebuyPenalties_abs), event_.value.rebuyPenaltiesType);
    options_rebuy_val.value = result[0];
    Display_rebuy_savings.value = result[1];
  }
};
const DEFAULT_RACHAT_VAL_VALUE = transStr(stringsIDs.str_choose_opt);
var rachatVal = ref(DEFAULT_RACHAT_VAL_VALUE);
const extractDataFromRebuySavings = function () {
  event_.value.year_str = rachatVal.value.split(' ')[1];
  event_.value.month_str = rachatVal.value.split(' ')[0];
  event_.value.month = getMonthNbr(event_.value.month_str);
  event_.value.year = Number(event_.value.year_str);
  var found = false;
  var j = 0;
  //find rebuy with savings option selected by user
  while (j < options_rebuy_val.value.length && found != true) {
    if (options_rebuy_val.value[j] == rachatVal.value) {
      found = true;
    }
    j++;
  }
  if (found == true) {
    event_.value.savingsLeft = Display_rebuy_savings.value[j - 1].eco_left;
    rebuy_saving_capital_to_pay.value = Display_rebuy_savings.value[j - 1].value_paid;
  }
  else {
    event_.value.savingsLeft = 0;
    rebuy_saving_capital_to_pay.value = '';
  }
}

const formatAndExtracteventdateFrom = function () {
  event_.value.reLoanDate = formatDate(unformatedrebuydate.value);
  event_.value.year_str = event_.value.reLoanDate.split('/')[2];
  event_.value.month = Number(event_.value.reLoanDate.split('/')[1]);
  event_.value.year = Number(event_.value.year_str);
  event_.value.month_str = transMonthName(event_.value.month);
}
var listToDisplay = ref([]);
var mustPopWarning = ref(false);
const RebuyPicked = function (force = false) {
  //compute event attributes based on the event value

  if (force) {
    for (var i = simu.value.events.length - 1; i >= 0; i--) {
      if (compareDates(simu.value.events[i].year, simu.value.events[i].month, event_.value.year, event_.value.month) > 0) {
        simu.value.events.pop();
      }
    }
    mustPopWarning.value = false;
    finishEvt();
  }
  else {
    //prevent to rebuy with savings before the last event : warn the user and delete all events after rebuy with the user agreeement
    if (event_.value.type === EVT_TYPE_REBUY_SAVINGS) {
      for (var i = 0; i < simu.value.events.length; i++) {
        if (compareDates(simu.value.events[i].year, simu.value.events[i].month, event_.value.year, event_.value.month) >= 0) {
          listToDisplay.value.push({ id: 0, title: simu.value.events[i].title });
          listToDisplay.value.at(-1).id = listToDisplay.value.length;
          mustPopWarning.value = true;
        }
      }
      if (mustPopWarning.value == true) {
        return;
      }
      finishEvt();
    }
    else {
      mustPopWarning.value = false;
      finishEvt();
    }
  }
};
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

.mySelect {

  color: white;
  font-size:large;

}
</style>
