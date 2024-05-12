<template>

  <q-carousel ref="myEventForm" fullscreen animated :arrows="false" :navigation="false" v-model="currentSlide">
    <q-carousel-slide name="metatype" class="bg-grey-9">
      <div class="oneInThreeRowH"></div>
      <div class="oneInThreeRow">
        <div class="column items-center">
          <div class="col myIndication q-ma-md">
            <p>{{ transStr(stringsIDs.str_choose_evt_type) }}</p>
          </div>
          <div class="col">
            <q-btn class="q-ma-md" size='xl' color="blue-grey-8" :label=transevtmetaType(EVT_META_TYPE_MOD)
              @click="[event_.metaType = EVT_META_TYPE_MOD,currentSlide='modulationDate']"></q-btn>
            <q-btn class="q-ma-md" size='xl' color="blue-grey-8" :label=transevtmetaType(EVT_META_TYPE_REBUY)
              @click="[event_.metaType = EVT_META_TYPE_REBUY, currentSlide='rebuy']" ></q-btn>
          </div>

        </div>
      </div>
      <div class="oneInThreeRowB">
        <div class="column items-center">
            <q-btn class="q-ma-xl" color="blue-grey-8" :label=transStr(stringsIDs.str_cancel) size="xl"
              @click="emi('event-abort')"></q-btn>
          </div>
      </div>
    </q-carousel-slide>

    <q-carousel-slide name="modulationDate" class="bg-grey-9">
      <div class="oneInThreeRowH"></div>
      <div class="oneInThreeRow">
        <div class="column items-center">
          <div class="col myIndication q-ma-md">
            <p>{{ transStr(stringsIDs.str_mod_date) }}</p>
          </div>
          <div class="col">
            <q-input class="q-ma-md" dense style="width: 200px;" :label=transStr(stringsIDs.str_mod_date) bg-color="blue-grey-8" filled v-model="date_mod" @click="mustpopDateMod=true" readonly>
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy v-model="mustpopDateMod" cover transition-show="scale" transition-hide="scale">
                    <q-date dark v-model="date_modunformated" :locale=getTranslatedFormatedCalendar() :navigation-min-year-month="mod_min_date"
                      width="200px" :navigation-max-year-month="mod_max_date" :default-year-month="mod_min_date" @update:model-value="date_mod=formatDate(date_modunformated),[validateModDate(),mustpopDateMod=false,event_type =DEFAULT_EVENT_TYPE,modVal=DEFAULT_MODVAL]">
                      <div class="row items-center justify-end" >
                        <q-btn v-close-popup :label=transStr(stringsIDs.str_close) color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div class="col myIndication" v-if="event_.year != 0 && event_.month!=0 != 0">
             <p> {{transStr(stringsIDs.str_capital_left)+ situationAtDate }}</p>
          </div>
          <div class="col">
            <q-btn class="q-ma-xs" color="blue-grey-8" :label=transStr(stringsIDs.str_prev) size="xl"
              @click="[currentSlide='metatype',event_.metaType='',situationAtDate='']"></q-btn>
            <q-btn class="q-ma-xs" color="blue-grey-8" :label=transStr(stringsIDs.str_next) size="xl"
              @click="currentSlide = 'modulationval'"></q-btn>
          </div>
        </div>
      </div>
      <div class="oneInThreeRowB"></div>
    </q-carousel-slide>

    <q-carousel-slide name="modulationval" class="bg-grey-9">
      <div class="oneInThreeRowH"></div>
      <div class="oneInThreeRow">
        <div class="column items-center">
          <div v-if="situationAtDate!='' && event_.year!=0 && event_.month!=0" class="col myIndication q-ma-md" >
            <p>{{ transStr(stringsIDs.str_choose_mod) }}</p>
          </div>
          <div class="col q-ma-md">
            <q-select rounded outlined v-model="event_type_str" :options=transevtmodType() :label=transStr(stringsIDs.str_choose_mod)
            @update:model-value="[event_.type=getModTypeFromStr(event_type_str) ,getopt(),modVal=DEFAULT_MODVAL]"  bg-color="blue-grey-8"/>
          </div>
          <div class="col q-ma-md">
            <q-select class="evtTypeVal" rounded outlined v-model="modVal" :options="options_mod"
            :label=transStr(stringsIDs.str_choose_mensuality) :disable="event_.type == DEFAULT_EVENT_TYPE"
            @update:model-value="validateMod()" bg-color="blue-grey-8"></q-select>
          </div>
          <div class="col">
            <q-btn class="q-ma-xs" color="blue-grey-8" :label=transStr(stringsIDs.str_prev) size="xl"
              @click="[currentSlide='modulationDate', event_.type=DEFAULT_EVENT_TYPE,event_type_str=DEFAULT_EVENT_TYPE_STR,event_.new_mens=0,event_.modVal='',event_.mensDiff=0]"></q-btn>
            <q-btn class="q-ma-xs" color="blue-grey-8" :label=transStr(stringsIDs.str_validate) size="xl"
              @click="finishEvt()"></q-btn>
          </div>
        </div>
      </div>
      <div class="oneInThreeRowB"></div>
    </q-carousel-slide>
  </q-carousel>

</template>

<script setup>
//------------------------------------//
//  notifications handling            //
//------------------------------------//
import { useQuasar } from 'quasar';
//------------------------------------//
//  inter components communication    //
//------------------------------------//
import { ref, defineEmits } from 'vue';
const emit=defineEmits(['event-done','event-abort']);
//------------------------------------//
// Language handling                  //
//------------------------------------//
import { transStr, stringsIDs,transevtmetaType, transMonthName,getTranslatedFormatedCalendar,transevtmodType,
        getModTypeFromStr,
 } from 'src/stores/languages';
//------------------------------------//
// events computation handling        //
//------------------------------------//
import { apply_events_chain, build_event_name } from '../utils/credit_utility.js';
import { simu ,bank} from 'stores/store';
import { getLatestMensuality,getEarliestNewEventDate,EVT_TYPE_REBUY_SAVINGS,EVT_META_TYPE_MOD, EVT_META_TYPE_REBUY ,
  provideModOptions,returnBaseData} from '../utils/credit_utility'
const default_month_str = transStr(stringsIDs.str_sel_month);
const default_year_str = transStr(stringsIDs.str_sel_year);
const DEFAULT_EVENT_TYPE=-1;
var event_ = ref({
  title: '',
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
  amortEvt: [],
  metaType: '',
  rebuyVal: '',
  reLoanDate: '',
  reLoanRate: 0,
  reLoanPenalties: 0,
  reloanDuration: 0,
  savingsLeft: 0,
});
//------------------------------------//
//    date handling                   //
//------------------------------------//
import {subOneMonthToStringDate,addOneMonthToStringDate,formatDate} from '../utils/date_utility'
//------------------------------------//
//      DOM handling                  //
//------------------------------------//
var myEventForm = ref();
var currentSlide = ref('metatype');
var situationAtDate = ref('');
import {getCurrencySymbol} from '../stores/currencies'
import {formatnumber} from '../utils/string_utils'
//************************* */
// Modulation date handling //
//************************* */
var mod_max_date=ref(subOneMonthToStringDate(getLatestMensuality().l_y.toString()+'/'+getLatestMensuality().l_m.toString().padStart(2,'0')));
var mod_min_date=ref(addOneMonthToStringDate(getEarliestNewEventDate().l_y.toString()+'/'+getEarliestNewEventDate().l_m.toString().padStart(2,'0')));
var date_mod=ref(mod_min_date.value);
var date_modunformated=ref(date_mod.value);
var mustpopDateMod=ref(false);
const validateModDate=function(){
  event_.value.year=Number(date_mod.value.split('/')[2]);
  event_.value.month=Number(date_mod.value.split('/')[1]);
  event_.value.year_str= event_.value.year.toString();
  event_.value.month_str=transMonthName(event_.value.month);
  situationAtDate.value=formatnumber(returnBaseData(event_.value.year, event_.value.month).capital_left.toString())+' '+getCurrencySymbol();
}
//----------------------------------//
//  Modulation options handling     //
//----------------------------------//
const DEFAULT_EVENT_TYPE_STR=transStr(stringsIDs.str_select_action);
var event_type_str = ref(DEFAULT_EVENT_TYPE_STR);
const DEFAULT_MODVAL=transStr(stringsIDs.str_choose_opt);
var modVal = ref(DEFAULT_MODVAL);
var options_mod = ref([]);
const getopt = function () {
  options_mod.value = provideModOptions(event_.value.type,event_.value.year,event_.value.month);
  if(options_mod.value.length==1 && options_mod.value[0]==transStr(stringsIDs.str_mod_impossible))
  {
    const $q=useQuasar();
    $q.notify({  color: 'orange-4', textColor: 'black',  icon: 'warning',  message: options_mod.value[0],  });
    options_mod.value=['undefined'];
  }
};
//--------------------------------------//
//       Modulation value handling      //
//--------------------------------------//
const canAddMod=ref(false);
const validateMod = function () {
  if (
    (event_.value.type !=DEFAULT_EVENT_TYPE) &&
    modVal.value != DEFAULT_MODVAL
  ) {
    event_.value.mensDiff = Number(modVal.value.split('(')[1].split('mois')[0]);
    event_.value.new_mens = Number(modVal.value.split(getCurrencySymbol())[0])
    canAddMod.value=true;
  }
  canAddMod.value= false;
};
const finishEvt=function () {
  event_.value.title=build_event_name(event_.value.metaType);
  simu.value.events.push(event_.value);
  apply_events_chain();
  emit('event-done');
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
</style>
