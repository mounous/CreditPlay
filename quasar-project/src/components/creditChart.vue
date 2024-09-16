<template>
  <q-page   v-touch-swipe.mouse.left.right="handleSwipeExt" >
    <q-page-sticky position="top-right" :offset="[0, 0]" style="z-index:3">
      <div style="display: flex;flex-direction: row;">
        <q-card v-if="show_tuto==true &&(tutoPhase==2)" style="background-color: black;">
          <th v-if="is_playing==true" style="color: white;font-size:15px;text-align: center;">{{transStr(stringsIDs.str_tuto_chart_3)}}</th>
          <th v-if="is_playing==false" style="color: white;font-size:15px;text-align: center;">{{transStr(stringsIDs.str_tuto_chart_4)}}</th>
        </q-card>
        <q-btn icon="play_arrow"  size="large" color="black" class="q-mr-md"  v-if="(simu.events.length>0 || ((display_capital==true||display_interests==true) && display_savings==true))&&is_playing==false"  @click="relaunchAnimation"></q-btn>
        <q-btn icon="settings" fab size="large" color="black"  v-if="is_playing==false"  @click="mustPop=true"></q-btn>

        <shakeBtn v-if="show_tuto==true &&(tutoPhase==2)"  :btn-label=transStr(stringsIDs.str_tuto_close_tuto) @click="[show_tuto=false,tutoPhase=0,restoreState()]"></shakeBtn>
        <q-icon name="help" size="x-large" color="white" class="q-mt-md q-mb-md q-ml-md q-mr-xl" v-if="show_tuto==false" @click="[MustPopTutorial=true,show_tuto=true,tutoPhase=0,destroy_periodic()]"></q-icon>
    </div>
    </q-page-sticky>





    <VueApexCharts
      v-if="mustPop==false"
      type="line"
      height=100%
      width=100%
      :options="chartOptions"
      :series="series"
      :key="mustPop"
    ></VueApexCharts>


  </q-page>

  <q-dialog style="background-color: black;" fullscreen v-model="mustPop"  cover transition-show="scale" transition-hide="scale" maximized >
    <div style="flex-direction: column;">
    <div style="display: flex;flex-direction: row;justify-content: right;justify-items: right; height: 7%;">
        <q-btn v-if="show_tuto==false" color="blue-grey-8" label="X" @click="moveToPrevious()" ></q-btn>
    </div>

    <div style="display: flex;flex-direction: column;align-items: center;align-content: center;justify-content: center;justify-items: center;height: 93%;">

      <div style="display: flex;flex-direction: column;align-items: center;align-content: center;justify-content: center;justify-items: center;">
        <th  style=" color: white;font-size: 17px;text-align: center;">{{ transStr(stringsIDs.str_chart_choice) }}</th>
        <q-list bordered>
          <q-item v-if="hasSavings() && startFormFilled==true">
            <q-item-section avatar> <q-checkbox v-model="display_all" color="green" keep-color @update:model-value="display_all==true ? [display_capital=true,display_interests=true,display_savings=true]: [display_capital=false,display_interests=false,display_savings=false]"> </q-checkbox> </q-item-section>
            <q-item-section @click="[display_all=!display_all,display_all==true ? [display_capital=true,display_interests=true,display_savings=true]: [display_capital=false,display_interests=false,display_savings=false]]">  <th   style=" color: white;font-size: 15px;text-align: left;">{{  transStr(stringsIDs.str_all) }}</th></q-item-section>
          </q-item>
          <q-item  v-if="startFormFilled == true" >
            <q-item-section avatar> <q-checkbox v-model="display_capital" color="green" keep-color @update:model-value="display_capital==false?display_all=false:null"> </q-checkbox> </q-item-section>
            <q-item-section @click="[display_capital=!display_capital,display_capital==false?display_all=false:null]">  <th   style=" color: white;font-size: 15px;text-align: left;">{{  transStr(stringsIDs.str_chart_display_capital) }}</th></q-item-section>
          </q-item>
          <q-item v-if="startFormFilled == true">
            <q-item-section avatar> <q-checkbox v-model="display_interests" color="green" keep-color @update:model-value="display_interests==false?display_all=false:null"> </q-checkbox> </q-item-section>
            <q-item-section> <th @click="display_interests=!display_interests" style=" color: white;font-size: 15px;text-align: left;">{{ transStr(stringsIDs.str_chart_display_interests) }}</th></q-item-section>
          </q-item>
          <q-item v-if="hasSavings()">
            <q-item-section avatar> <q-checkbox v-model="display_savings" color="green" keep-color @update:model-value="display_savings==false?display_all=false:null"> </q-checkbox> </q-item-section>
            <q-item-section> <th @click="display_savings=!display_savings" style=" color: white;font-size: 15px;text-align: left;">{{ transStr(stringsIDs.str_chart_display_savings) }}</th></q-item-section>
            <q-item-section v-if="display_capital==false && display_interests==false && display_savings==true"> <th  class="q-mr-md q-ml-md" style=" color: white;font-size: 15px;text-align: left;">{{ transStr(stringsIDs.str_chart_display_for) }}</th></q-item-section>
            <q-item-section v-if="display_capital==false && display_interests==false && display_savings==true">  <q-select  v-model="nbYearDisplaySavings" style="background-color: cadetblue;" :options="optionYears"></q-select></q-item-section>
            <q-item-section v-if="display_capital==false && display_interests==false && display_savings==true"> <th  class="q-mr-md q-ml-md" style=" color: white;font-size: 15px;text-align: left;">{{ transStr(stringsIDs.str_chart_display_year) }}</th></q-item-section>
          </q-item>
        </q-list>
        <q-btn label="OK" @click="[mustPop=false,setupChart()]" :disable="display_capital==false && display_interests==false && display_savings==false || (display_savings==true && nbYearDisplaySavings==0 && (display_capital==false && display_interests==false)) || (display_savings==false && nbYearDisplaySavings!=0 && (display_capital==false && display_interests==false)) " color="blue-grey-8"></q-btn>
      </div>
    </div>
  </div>
    </q-dialog>

  <q-dialog v-if="show_tuto==true && tutoPhase==0" v-model="MustPopTutorial"   cover transition-show="scale" transition-hide="scale" maximized full-width  auto-close  v-on:before-hide="[tutoPhase=1,forceRender(),MustPopTutorial=true]"
    style="background-color: black;"   >
    <div class="q-mt-md q-mb-md q-mr-md q-ml-md" style="display: flex;flex-direction: column;justify-content:center;align-content: center;">
      <tutoDisplayer>
        <div style="display: flex;flex: 1;">
          <tutoTxt :xl="true" :txt=transStr(stringsIDs.str_tuto_chart_1)></tutoTxt>
        </div>
        <div style="display: flex;flex: 4;">
          <q-list>
            <q-item v-for="elmnt in listDisplayTuto" :key="elmnt.id">
              <q-item-section avatar>
                <q-icon v-if="elmnt.id!=stringsIDs.str_tuto_chart_cpmlnt_4" :color=elmnt.color name="radio_button_checked" />
                <q-icon v-if="elmnt.id==stringsIDs.str_tuto_chart_cpmlnt_4" :color=elmnt.color name="horizontal_rule" />
              </q-item-section>
              <q-item-section>
                <tutoTxt :txt=transStr(elmnt.id)></tutoTxt>
              </q-item-section>
            </q-item>
          </q-list>
        </div>
        <div style="display: flex;flex: 1;">
          <tutoTxt :txt=transStr(stringsIDs.str_tuto_chart_cpmlnt_5) :xl="true"></tutoTxt>
        </div>
      </tutoDisplayer>
    </div>
  </q-dialog>
  <q-dialog v-if="show_tuto==true && tutoPhase==1" v-model="MustPopTutorial"   cover transition-show="scale" transition-hide="scale" maximized full-width  auto-close v-on:before-hide="[tutoPhase=2,initTutoData()]"
    style="background-color: black;"   >
    <div class="q-mt-md q-md-xl q-mr-md q-ml-md" style="display: flex;flex-direction: column;justify-content:center;align-content: center;">
      <tutoDisplayer>
        <div style="display: flex;flex: 1;"></div>
        <div style="display: flex;flex: 1;">
          <tutoTxt :txt=transStr(stringsIDs.str_tuto_chart_cpmlnt_6)></tutoTxt>
        </div>
        <div style="display: flex;flex: 1;align-items: center;justify-content: center;">
          <q-btn icon="play_arrow" size="large" color="black" style="background-color:grey;" class="q-ma-xs"></q-btn>
        </div>
        <div style="display: flex;flex: 1;">
          <tutoTxt :txt=transStr(stringsIDs.str_tuto_chart_settings)></tutoTxt>
        </div>
        <div style="display: flex;flex: 1;align-items: center;justify-content: center;">
          <q-btn icon="settings" size="large" color="black" style="background-color:grey;" class="q-ma-xs"></q-btn>
        </div>
        <div style="display: flex;flex: 1;">
          <tutoTxt :txt=transStr(stringsIDs.str_tuto_chart_cpmlnt_7)></tutoTxt>
        </div>
        <div style="display: flex;flex: 1;"></div>
      </tutoDisplayer>
    </div>
  </q-dialog>

</template>

<script setup>
import tutoDisplayer from './tutoDisplayer.vue';
import tutoTxt from './tutoTxt.vue';
import shakeBtn from './shakeBtn.vue';
import VueApexCharts from 'vue3-apexcharts'
import { ref, nextTick, onBeforeUnmount, onMounted} from 'vue';
import {apply_events_chain, computeMensuality, getChartXAxis,getLatestMensuality,computeCredit_init} from '../utils/credit_utility'
import { GetColor,TYPE_CAPITAL,TYPE_INTERESTS,TYPE_SAVINGS } from 'src/utils/chart_utility';
import { simu,bank, startFormFilled } from 'stores/store';
import {getSavingsEarlier,computeDisplaySavings,hasSavings} from '../utils/bank_utility'
import { stringsIDs,transStr, transMonthName } from 'src/stores/languages';
import { show_tuto,tutoPhase } from 'stores/store';
import { useRouter } from 'vue-router';
import {targetPage} from '../utils/swipe_utils.js'
import {saveTutoData,populateBankTuto ,restoreTutoData,populateEventsTuto,injectCreditInTuto} from '../utils/tutorail_utils'
var listDisplayTuto=ref([ {color:'red',id:stringsIDs.str_tuto_chart_cpmlnt_1},
                          {color:'grey',id:stringsIDs.str_tuto_chart_cpmlnt_2},
                          {color:'green',id:stringsIDs.str_tuto_chart_cpmlnt_3},
                          {color:'purple',id:stringsIDs.str_tuto_chart_cpmlnt_4}] );

var is_playing=ref(false);
const router=useRouter();
var MustPopTutorial=ref(false);
var mustPop = ref(false);
var carrouselPhase=ref(0);
var display_capital=ref(false);
var display_interests=ref(false);
var display_savings=ref(false);
var display_all=ref(false)
var display_capital_save=ref(false);
var display_interests_save=ref(false);
var display_savings_save=ref(false);
var tickCount=ref(0);
var leftAnno=ref(false);
const popselector=function()
{
  mustPop.value=true;
}
onMounted(popselector);
const forceRender=async()=>{
  mustPop.value=true;
  await nextTick();
  mustPop.value=false;
  await nextTick();
}
const clearChart=function()
{
  destroy_periodic();
  series=[];
  chartOptions.annotations.points=[];
  chartOptions.annotations.xaxis=[];
  chartOptions.annotations.yaxis=[];
}
const initChart=function(recompute_events=true)
{
  computeDisplaySavings(simu.value.credit.y,simu.value.credit.m,simu.value.credit.duration_m/12);
  if(recompute_events)
  {
    apply_events_chain();
  }
  chartOptions.xaxis.categories= getTime();
  display_init_credit();
  forceRender();
  relaunchAnimation();
}
const restoreState=function()
{
  display_capital.value= display_capital_save.value;
  display_interests.value=display_interests_save.value;
  display_savings.value=display_savings_save.value;
  show_tuto.value=false;
  clearChart();
  restoreTutoData();
  computeMensuality();
  computeCredit_init();
  initChart(false);
}
const initTutoData=function()
{
  display_capital_save.value=display_capital.value;
  display_interests_save.value=display_interests.value;
  display_savings_save.value=display_savings.value;
  display_capital.value=true;
  display_interests.value=true;
  display_savings.value=true;
  clearChart(),
  saveTutoData();
  simu.value.events=[];
  bank.value.accounts=[];
  injectCreditInTuto();
  populateBankTuto();
  populateEventsTuto();
  initChart();
}


const relaunchAnimation=function()
{
  leftAnno.value=false;
  carrouselPhase.value=0;
  tickCount.value=0;
  chartOptions.annotations.xaxis=[];
  chartOptions.annotations.yaxis=[];
  chartOptions.annotations.points=[];
  if(display_capital.value!=display_interests.value)
  {
    series.splice(1,series.length-1);
    chartOptions.colors.splice(1,chartOptions.colors.length-1);//remove savings
  }
  else
  {
    series.splice(2,series.length-2);
    chartOptions.colors.splice(2,chartOptions.colors.length-2);//remove savings
  }

  Id_destroy.value=setInterval(switchDataDisplay,100);
  is_playing.value=true;
}

var Id_destroy=ref();

const display_init_credit=function()
{
  chartOptions.colors=[];
  series = [];
  if(display_capital.value==true)
  {
    series.push( {  name: transStr(stringsIDs.str_cap_left), data: getAmount(), });
    chartOptions.colors.push('#e2001a');
  }
  if(display_interests.value==true)
  {
    series.push( {name: transStr(stringsIDs.str_interests_paid), data: getIntests(), });
    chartOptions.colors.push('#e2001a');
  }
  carrouselPhase.value=1;
}

const switchDataDisplay=function()
{
  if(simu.value.events.length<1 && display_savings.value==false)
  {
    return;
  }
  if(tickCount.value<=50)//every 0.5s switch the display
  {
    tickCount.value+=10;
    return;
  }
  tickCount.value=0;
  if(display_capital.value==true||display_interests.value==true)
  {
    if(carrouselPhase.value!=0 && carrouselPhase.value!=simu.value.events.length+1)//if not displayed all events , remove the event just displayed (2series)
    {
      var nbBaseSeriesDiplay=display_capital.value==display_interests.value ? 2:1;
      series.splice(nbBaseSeriesDiplay,series.length-nbBaseSeriesDiplay);
      chartOptions.colors.splice(nbBaseSeriesDiplay,chartOptions.colors.length-nbBaseSeriesDiplay);
      getSingleEvent(carrouselPhase.value-1);
      if(display_savings.value==false && carrouselPhase.value==simu.value.events.length)
      {
        destroy_periodic();
      }
    }
  }
  if(carrouselPhase.value==simu.value.events.length+1)//when we displayed last event, do not remove, add savings
  {
    if(display_savings.value==true)
    {
      getAdjustedBanking(carrouselPhase.value-2);
    }
    destroy_periodic();
  }
  forceRender();
  carrouselPhase.value+=1;
}

const getSingleEvent=function(index)
{
  var evt_y=-1;
  if(index <simu.value.events.length )
  {
    var extractData_capital=[];
    var extractData_interests=[];
    for(var j=0;j<simu.value.events[index].amortEvt.length;j++)
    {
      if(display_capital.value==true)
      {
        extractData_capital.push(Math.round(simu.value.events[index].amortEvt[j][1]*100)/100);
      }
      if(display_interests.value==true)
      {
        extractData_interests.push(Math.round(simu.value.events[index].amortEvt[j][2]*100)/100);
      }
      if(display_capital.value==true &&simu.value.events[index].amortEvt[j][0]==transMonthName(simu.value.events[index].month)+'-'+simu.value.events[index].year.toString())
      {
        evt_y=extractData_capital[extractData_capital.length-1];//store the capital to set a point on graph
        if(evt_y==0)//case of a rebuy,
        {
          evt_y=extractData_capital[extractData_capital.length-2];
        }
      }
      if(display_capital.value==false &&display_interests.value==true &&simu.value.events[index].amortEvt[j][0]==transMonthName(simu.value.events[index].month)+'-'+simu.value.events[index].year.toString())
      {
        evt_y=extractData_interests[extractData_interests.length-1];//store the interests to set a point on graph
        if(evt_y==0)//case of a rebuy,
        {
          evt_y=extractData_interests[extractData_interests.length-2];
        }
      }
    }
    if(display_capital.value==true)
    {
      series.push({name:simu.value.events[index].title,data:extractData_capital});
      chartOptions.colors.push('#147280');
    }
    if(display_interests.value==true)
    {
      series.push({name:transStr(stringsIDs.str_interests_parenth)+simu.value.events[index].title+')',data:extractData_interests});
      chartOptions.colors.push('#085a67');
    }
    chartOptions.annotations.xaxis.push({x:transMonthName(simu.value.events[index].month)+'-'+simu.value.events[index].year.toString(),
                                         strokeDashArray: 0,
                                         borderColor: '#775DD0',
                                         label: {
                                           borderColor: '#775DD0',
                                           style: {
                                             color: '#fff',
                                             background: '#775DD0',
                                           },
                                           text: '',}});
    chartOptions.annotations.points.push({x: transMonthName(simu.value.events[index].month)+'-'+simu.value.events[index].year.toString(),
                                          y: evt_y,  marker: {size: 6,  fillColor: '#fff',strokeColor: 'purple',radius: 1, cssClass: 'apexcharts-custom-class'},
                                          label: { borderColor: 'black', offsetY: 16, offsetX:leftAnno.value==false ? 45:-45, style: {color: '#fff',background: 'black', },text: simu.value.events[index].title,} } );
    leftAnno.value=!leftAnno.value;
  }
}
const getAdjustedBanking=function(specific_event=-1){
  //if a credit has already been computed, then display potential savings on the interval [credit start...Credit longest duration]
  if( display_savings.value==true && hasSavings())//if some banking data exist, compute banking from credit start to the latest mensuality, potentially after a modulation
  {
    if(display_capital.value==true||display_interests.value==true)
    {
      var credit_init_y=Number(simu.value.credit.startingDate.split('/')[2]);
      var credit_init_m=Number(simu.value.credit.startingDate.split('/')[1]);
      //var min_y=Math.min(credit_init_y,getSavingsEarlier()[1]) ;
      var Number_of_years_to_compute=getLatestMensuality(specific_event).l_y-credit_init_y;
      computeDisplaySavings(credit_init_y,credit_init_m,Number_of_years_to_compute);
      getBanking(credit_init_y,credit_init_m,Number_of_years_to_compute);
    }
    else
    {
      var earlierY=getSavingsEarlier()[1];
      var earlierM=getSavingsEarlier()[0];
      computeDisplaySavings(earlierY,earlierM,Number(nbYearDisplaySavings.value));
      getBanking();
      chartOptions.xaxis.categories=getBankTime();
    }
  }
}
const getBanking=function(){
  //assume : the banking is already computed
  if(display_capital.value==true || display_interests.value==true)
  {
    while(bank.value.monthly_sum[0][0]!=simu.value.credit.amort[0][0] && 0!=bank.value.monthly_sum.length)
    {
      bank.value.monthly_sum.shift();
    }
  }
  if(bank.value.monthly_sum.length!=0)
  {
    var exctractedSavings=[];
    for(var i=0;i<bank.value.monthly_sum.length;i++)
    {
      exctractedSavings.push(Math.round(bank.value.monthly_sum[i][1]*100)/100);
    }
    series.push({name:transStr(stringsIDs.str_savings),data:exctractedSavings});
    chartOptions.colors.push(GetColor(TYPE_SAVINGS,0,false));
  }
}


const setupChart=function()
{
  chartOptions.annotations.points=[];
  chartOptions.annotations.xaxis=[];
  chartOptions.annotations.yaxis=[];
  if(display_savings.value==true && display_capital.value==false && display_interests.value==false)
  {
    displaySavingsOnly();
  }
  else
  {
    carrouselPhase.value=0;
    display_init_credit();//in all cases, display initial credit and banking if any
    if(simu.value.events.length>0 || display_savings.value==true)//there are some events to display, the periodic function must be started tuto or not (code inhibited in case tuto is active)
    {

      is_playing.value=true;
      Id_destroy.value=setInterval(switchDataDisplay,100);
    }
  }

}





const getTime = function () {
  var xAxisUp2Date = [];
  if(simu.value.credit.amort.length!=0)//credit scale even if savings entries starting after credit ends
  {
    const amort_arr = getChartXAxis();

    for (var i = 0; i < amort_arr.length; i++) {
      xAxisUp2Date.push(amort_arr[i][0]);
    }
    return xAxisUp2Date;
  }
  return xAxisUp2Date;
}


const getBankTime=function(){
  var xAxisUp2Date=[];
  if(bank.value.monthly_sum.length!=0)
  {
    for(var i=0;i<bank.value.monthly_sum.length;i++)
    {
      xAxisUp2Date.push(bank.value.monthly_sum[i][0]);
    }
  }
  //chartOptions.xaxis.categories=xAxisUp2Date;
  return xAxisUp2Date;
}


//onUpdated(getBankTime);

const getAmount = function () {
  var seriesUp2Date = [];
  for (var i = 0; i < simu.value.credit.amort.length; i++) {
    seriesUp2Date.push(simu.value.credit.amort[i][1]);
  }
  return seriesUp2Date;
};
const getIntests = function () {
  var seriesInterests = [];
  for (var i = 0; i < simu.value.credit.amort.length; i++) {
    seriesInterests.push(simu.value.credit.amort[i][2]);
  }
  return seriesInterests;
};

var series = [
  {
    name: transStr(stringsIDs.str_cap_left),
    data: getAmount(),
  },
  {
    name: transStr(stringsIDs.str_interests_paid),
    data: getIntests(),
  },
];
var chartOptions = {
  chart: {
    height: '100%',
    width: '100%',
    type: 'line',
    zoom: {
      enabled: false,
    },
    toolbar:{show:false},
    animations: {
        enabled: false,
        easing: 'easeinout',
        speed: 200,
        animateGradually: {
            enabled: true,
            delay: 20
        },
        dynamicAnimation: {
            enabled: false,
            speed: 100
        }
    }
  },
  colors:[GetColor(TYPE_CAPITAL,0,true),GetColor(TYPE_INTERESTS,0,true)],
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: 'straight',
  },

  xaxis: {
    categories: getTime(),
    hideOverlappingLabels: true,
    style: {
      fontSize: '75px',
    },
    tickAmount:10,
    labels:{
      style:{
        fontSize:'13px',
        //colors :'white',
        colors:'#b4c8d6',
        fontWeight:350,
      },
      offsetY:20,
    },
    axisTicks: {
          show: false,
      },
  },
  yaxis:{
    tickAmount:6,
    labels:{
      formatter:function(val)
      {
        if(onlydisplaySavings.value)
        {
          return  val.toFixed(2);
        }
        else
        {
          return Math.round(val);
        }

      },
        style: {
              colors: '#b4c8d6',
              fontSize: '13px',
              fontWeight: 350,
          },
    },
  },
  annotations:{yaxis:[],xaxis:[],points:[]},
  legend:{show:false}
};

var onlydisplaySavings=ref(false);
var nbYearDisplaySavings=ref('0');
var graphMinDate = ref('1900/01');
const displaySavingsOnly=function()
{
  series=[];
  onlydisplaySavings.value=true;
  var earlierY=getSavingsEarlier()[1];
  var earlierM=getSavingsEarlier()[0];
  computeDisplaySavings(earlierY,earlierM,Number(nbYearDisplaySavings.value));
  getBanking();
  chartOptions.xaxis.categories=getBankTime();
}






const destroy_periodic=function(){
  is_playing.value=false;
  clearInterval(Id_destroy.value);
}
onBeforeUnmount(destroy_periodic);

const moveToPrevious=function()
{
  router.back();
}
const handleSwipeExt=function ({ evt, touch, mouse, direction, duration, distance })
{
  destroy_periodic();
  router.push(targetPage(direction,router.currentRoute.value.fullPath));
}

const getoptionSavingGraphDisplayY=function()
{
  var toreturn=[];
  for(var i=0;i<100;i++)
  {
    toreturn.push(i.toString());
  }
  return toreturn;
}
var optionYears=ref(getoptionSavingGraphDisplayY());
</script>
