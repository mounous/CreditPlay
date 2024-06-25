<template>

  <q-carousel ref="mySioForm" fullscreen animated :arrows="false" :navigation="false" v-model="currentSlide">
    <q-carousel-slide name="sioType" class="bg-grey-9">
      <div class="oneInThreeRowH"></div>
      <div class="oneInThreeRow">
        <div class="column items-center">
          <div class="col myIndication q-ma-md">
            <p>{{ transStr(stringsIDs.str_sio_type) }}</p>
          </div>
          <div class="row q-mb-md" style="display: flex;">
          <div style="flex:1"></div>
          <div style="flex:2">
            <q-select bg-color="blue-grey-8" style="font-size: x-large;"   v-model="single_io_type"
            :options="[transoptSIO(BANK_SIO_TYPE_IN), transoptSIO(BANK_SIO_TYPE_OUT)]"
            @update:model-value="single_io_type==transoptSIO(BANK_SIO_TYPE_IN) ? _single_io.type=BANK_SIO_TYPE_IN : _single_io.type=BANK_SIO_TYPE_OUT  "></q-select>
          </div>
            <div style="flex:1"></div>
          </div>
          <div class="col">
            <q-btn class="q-ma-xs" color="blue-grey-8" size="xl" :label=transStr(stringsIDs.str_cancel) @click="emit('sio-aborted')"></q-btn>
            <q-btn class="q-ma-xs" color="blue-grey-8" size="xl" :label=transStr(stringsIDs.str_next) @click="currentSlide = 'sioName'"></q-btn>
          </div>
      </div>
      </div>
      <div class="oneInThreeRowB"></div>
    </q-carousel-slide>
    <q-carousel-slide name="sioName" class="bg-grey-9">
      <div class="oneInThreeRowH"></div>
      <div class="oneInThreeRow">
        <div class="column items-center">
          <div class="col myIndication q-ma-md">
            <p>{{ transStr(stringsIDs.str_sio_name) }}</p>
          </div>
          <div class="row" style="display: flex;">
          <div style="flex:1"></div>
          <div style="flex:2">
          <q-input class="q-mb-md" clearable  style="font-size: x-large;"   v-model="_single_io.title"
            type="text" bg-color="blue-grey-8" outlined  @keyup.enter="sio_name_nxt.click()"></q-input>
          </div>
            <div style="flex:1"></div>
      </div>
      <div class="col">
      <q-btn class="q-ma-xs" color="blue-grey-8" size="xl" :label=transStr(stringsIDs.str_prev) @click="currentSlide = 'sioType'"></q-btn>
      <q-btn  class="q-ma-xs" color="blue-grey-8" size="xl" :label=transStr(stringsIDs.str_next) @click="currentSlide = 'sioAmount'" ref="sio_name_nxt"></q-btn>
    </div>
      </div>
      </div>
      <div class="oneInThreeRowB"></div>
    </q-carousel-slide>


    <q-carousel-slide name="sioAmount" class="bg-grey-9">
      <div class="oneInThreeRowH"></div>
      <div class="oneInThreeRow">
        <div class="column items-center">
          <div class="col myIndication q-ma-md">
            <p>{{ transStr(stringsIDs.str_sio_amount) }}</p>
          </div>
        <div class="row q-mb-md" style="display: flex;">
          <div style="flex:1"></div>
          <div style="display:flex; flex:2;flex-direction: column;align-items: center;">
          <q-input ref="myAmount" class="q-mb-md" clearable style="font-size: x-large;"  size="10" maxlength="10"
            v-model="_single_io.amount" type="number" lazy-rules bg-color="blue-grey-8" outlined @keyup.enter="amount_nxt.click()" :suffix="getCurrencySymbol()"></q-input>
            <q-slider class="q-ma-md" v-model="_single_io.amount" :min="0.0" :max="50000" :step="100" @change="myAmount.focus()"/>
            </div>
            <div style="flex:1"></div>
      </div>
      <div class="col">
      <q-btn  class="q-ma-xs" :label=transStr(stringsIDs.str_prev) size="xl" color="blue-grey-8" @click="currentSlide = 'sioName'"></q-btn>
      <q-btn class="q-ma-xs" :label=transStr(stringsIDs.str_next) size="xl" color="blue-grey-8" @click="currentSlide = 'sioAccount'" ref="amount_nxt"></q-btn>
    </div>
      </div>
      </div>
      <div class="oneInThreeRowB"></div>
    </q-carousel-slide>
    <q-carousel-slide name="sioAccount" class="bg-grey-9">
      <div class="oneInThreeRowH"></div>
      <div class="oneInThreeRow">
        <div class="column items-center">
          <div class="col myIndication q-ma-md">
            <p>{{ transStr(stringsIDs.str_sio_account) }}</p>
          </div>
          <div class="row" style="display: flex;">
          <div style="flex:1"></div>
          <div style="flex:2">
          <q-select class="q-mb-md" style="font-size: x-large;" v-model="_single_io.account"
            :options="getAccOpt()" bg-color="blue-grey-8" outlined ></q-select>
          </div>
            <div style="flex:1"></div>
      </div>
      <div class="col">
      <q-btn  class="q-ma-xs" :label=transStr(stringsIDs.str_prev) size="xl" color="blue-grey-8" @click="currentSlide = 'sioAmount'"></q-btn>
      <q-btn class="q-ma-xs" :label=transStr(stringsIDs.str_next) size="xl" color="blue-grey-8" @click="currentSlide = 'sioDate'"></q-btn>
    </div>
      </div>
      </div>
      <div class="oneInThreeRowB"></div>
    </q-carousel-slide>
    <q-carousel-slide name="sioDate" class="bg-grey-9">
      <div class="oneInThreeRowH"></div>
      <div class="oneInThreeRow">
        <div class="column items-center">
          <div class="col myIndication q-ma-md">
            <p>{{ transStr(stringsIDs.str_sio_date) }}</p>
          </div>
          <div class="row" style="display: flex;">
          <div style="flex:1"></div>
          <div style="flex:4">
          <q-input class="q-ma-md"  style="font-size: x-large;"  bg-color="blue-grey-8" filled
            v-model="_single_io.date"  @click="mustpopSingleIO=true" readonly>
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale" v-model="mustpopSingleIO" persistent>
                  <q-date dark v-model="singleIODateUnformated" :locale=getTranslatedFormatedCalendar()
                    :navigation-min-year-month="periodicSaveMin" width="200px"
                    @update:model-value="[_single_io.date=formatDate(singleIODateUnformated), mustpopSingleIO=false]">
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
      <div class="col">
      <q-btn  class="q-ma-xs" :label=transStr(stringsIDs.str_prev) size="xl" color="blue-grey-8" @click="currentSlide = 'sioAccount'"></q-btn>
      <q-btn class="q-ma-xs" :label=transStr(stringsIDs.str_validate) size="xl" color="blue-grey-8" @click="addElementToSingleIO()"></q-btn>
    </div>
      </div>
      </div>
      <div class="oneInThreeRowB"></div>
    </q-carousel-slide>
  </q-carousel>
  <div class="col">
      <q-dialog v-model="mustPopaddSIO" cover transition-show="scale" transition-hide="scale">
        <q-card>
          <div class="col flex flex center justify-around">
            <div class="q-ma-md">
              {{ transSt(sentancesIDs.s_warning_out_sio_rebuy_del) }}
            </div>
            <div class="row nowrap">
              <q-btn :label=transStr(stringsIDs.str_cancel) @click="mustPopaddSIO = false"></q-btn>
              <q-btn :label=transStr(stringsIDs.str_confirm) @click="[mustPopaddSIO=false,addElementToSingleIO(true)]"></q-btn>
            </div>
          </div>
        </q-card>
      </q-dialog>
    </div>
</template>

<script setup>
import {getCurrencySymbol} from '../stores/currencies.ts'
import { ref, defineEmits } from 'vue';
import { getAccId ,getAccOpt,isAccountInvolvedInRebuyWithSavings,deleteRebuySavingsEventAndAssociatedInOut, BANK_SEARCH_ERROR,BANK_SIO_TYPE_IN,BANK_SIO_TYPE_OUT} from '../utils/bank_utility';
import { compareDates ,formatDate} from 'src/utils/date_utility';
import { bank,simu } from 'src/stores/store';
import { useQuasar } from 'quasar';
import { getTranslatedFormatedCalendar } from '../stores/languages';
import {transoptSIO,transSIOspecial,transStr,stringsIDs,sentancesIDs,transSt} from '../stores/languages'
var myAmount=ref();
var sio_name_nxt=ref();
var amount_nxt=ref();
var single_io_type=ref(transoptSIO(BANK_SIO_TYPE_IN));
const DEFAULT_DATE='';
var singleIODateUnformated=ref(DEFAULT_DATE);
var mustpopSingleIO=ref(false);
var mustPopaddSIO=ref(false);
const $q=useQuasar();
var mySioForm = ref();
var currentSlide = ref('sioType');
const _single_io =ref({account:'',title: '', type:BANK_SIO_TYPE_IN, amount:0,year:0,month:0,date:''});
const emit = defineEmits(['sio-added','sio-aborted']);
const addElementToSingleIO=function(force=false){
  var Y=Number(_single_io.value.date.split('/')[2]);
  var M=Number(_single_io.value.date.split('/')[1]);
  var indexAcc=0;
  if(_single_io.value.date=='')
  {
    $q.notify({    color: 'orange-4',    textColor: 'black',    icon: 'warning',    message: transStr(stringsIDs.str_sio_warn_date),  });
    mySioForm.value.goTo('sioDate');
  }
  else if(_single_io.value.amount==0)
  {
    $q.notify({    color: 'orange-4',    textColor: 'black',    icon: 'warning',    message: transStr(stringsIDs.str_sio_warn_null_op),  });
    mySioForm.value.goTo('sioAmount');
  }
  else if(_single_io.value.title==transSIOspecial() )
  {
    $q.notify({    color: 'orange-4',    textColor: 'black',    icon: 'warning',    message: transStr(stringsIDs.str_sio_warn_reserved),  });
    mySioForm.value.goTo('sioName');
  }
  else
  {
    indexAcc=getAccId(_single_io.value.account);
    if(BANK_SEARCH_ERROR==indexAcc)
    {
      $q.notify({    color: 'orange-4',    textColor: 'black',    icon: 'warning',    message: transStr(stringsIDs.str_acc_not_found),  });
      mySioForm.value.goTo('sioAccount');
      return;
    }
    if(!force && simu.value.events.length!=0  )
    {
      var indexOfrebuy=simu.value.events.length-1;
      var y_rebuy =simu.value.events[indexOfrebuy].year;
      var m_rebuy =simu.value.events[indexOfrebuy].month;
      //warn user in case of removing some money of an account involved in savings if the withdrawal is anterior to rebuy date
      if(isAccountInvolvedInRebuyWithSavings(indexAcc) && _single_io.value.type==transoptSIO(BANK_SIO_TYPE_OUT) && compareDates(y_rebuy,m_rebuy,Y,M)>=0)
      {
        mustPopaddSIO.value=true;
        return;
      }
    }
    if(force)//delete the rebuy with savings event, delete all single io linked to this event
    {
      deleteRebuySavingsEventAndAssociatedInOut();
    }
    bank.value.accounts[indexAcc].single_in_out.push({account:_single_io.value.account,title:_single_io.value.title,type:_single_io.value.type,amount:Number(_single_io.value.amount),date:_single_io.value.date,month:M,year:Y});
    _single_io.value.title='';_single_io.value.amount=0;_single_io.value.type=BANK_SIO_TYPE_IN;_single_io.value.date='';_single_io.value.account='';
    emit('sio-added');
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
