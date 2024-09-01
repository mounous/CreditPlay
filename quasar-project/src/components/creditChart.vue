<template>
  <q-page  @click="handleClick"  v-touch-swipe.mouse.left.right="handleSwipeExt" :key="mustPop">
    <q-page-sticky position="top-right" :offset="[0, 0]" style="z-index:3">
      <div style="display: flex;flex-direction: row;">
        <q-btn icon="play_arrow" size="large" color="green" style="background-color:grey;" v-if="simu.events.length>0&&is_playing==false" class="q-ml-xl" @click="relaunchAnimation"></q-btn>
        <q-icon name="help" size="x-large" color="white" class="q-ma-md" v-if="show_tuto==false" @click="initTuto()"></q-icon>
    </div>
    </q-page-sticky>



    <q-card v-if="show_tuto==true &&(tutoPhase==2||tutoPhase==3 ||tutoPhase==4)" style="background-color: black;">
      <th ref="myspan" class="q-ma-md" style="color: white;font-size:25px;text-align: center;">{{transStr(stringsIDs.str_tuto_chart_3+tutoPhase-2)}}</th>
    </q-card>

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

  <q-dialog v-if="show_tuto==true && tutoPhase==0" v-model="MustPopTutorial"   cover transition-show="scale" transition-hide="scale" maximized full-width  auto-close  v-on:before-hide="[tutoPhase=1,forceRender(),MustPopTutorial=true]"
    style="background-color: black;"   >
      <th class="q-ma-md" style="color: white;font-size:20px;">{{transStr(stringsIDs.str_tuto_chart_1)}}</th>
  </q-dialog>
  <q-dialog v-if="show_tuto==true && tutoPhase==1" v-model="MustPopTutorial"   cover transition-show="scale" transition-hide="scale" maximized full-width  auto-close v-on:before-hide="[show_tuto=false]"
    style="background-color: black;"   >
      <th class="q-ma-md" style="color: white;font-size:20px;">{{transStr(stringsIDs.str_tuto_chart_2)}}</th>
  </q-dialog>

</template>

<script setup>

import VueApexCharts from 'vue3-apexcharts'
import { onBeforeMount,ref, nextTick, onBeforeUnmount} from 'vue';
import {getChartXAxis,getLatestMensuality} from '../utils/credit_utility'
import { GetColor,TYPE_CAPITAL,TYPE_INTERESTS,TYPE_SAVINGS } from 'src/utils/chart_utility';
import { simu,bank, startFormFilled } from 'stores/store';
import {getSavingsEarlier,computeDisplaySavings,hasSavings} from '../utils/bank_utility'
import { stringsIDs,transStr, transMonthName } from 'src/stores/languages';
import { show_tuto,tutoPhase } from 'stores/store';
import { useRouter } from 'vue-router';
import {targetPage} from '../utils/swipe_utils.js'
var is_playing=ref(false);
const router=useRouter();
var MustPopTutorial=ref(false);
var mustPop = ref(false)
var carrouselPhase=ref(0);
var myspan=ref();
var tickCount=ref(0);
var leftAnno=ref(false);
const forceRender=async()=>{
  mustPop.value=true;
  await nextTick();
  mustPop.value=false;
  await nextTick();
}

const initTuto=function()
{
  show_tuto.value=true;
  MustPopTutorial.value=true;
  destroy_periodic();
  saveState();
  simu.value.events=[];
  bank.value.accounts=[];
  injectCreditInTuto();
  populateBankTuto();
  computeDisplaySavings(simu.value.credit.y,simu.value.credit.m,simu.value.credit.duration_m/12);
  populateEventsTuto();
  apply_events_chain();
  display_init_credit();
  forceRender();
}


const relaunchAnimation=function()
{
  leftAnno.value=false;
  carrouselPhase.value=0;
  tickCount.value=0;
  chartOptions.annotations.xaxis=[];
  chartOptions.annotations.yaxis=[];
  chartOptions.annotations.points=[];
  series.splice(2,series.length-2);
  chartOptions.colors.splice(2,chartOptions.colors.length-2);//remove savings
  Id_destroy.value=setInterval(switchDataDisplay,100);
  is_playing.value=true;
}

var Id_destroy=ref();

const display_init_credit=function()
{
  chartOptions.colors=[];
  series = [ {  name: transStr(stringsIDs.str_cap_left), data: getAmount(), }, {name: transStr(stringsIDs.str_interests_paid), data: getIntests(), }];
  chartOptions.colors.push('#e2001a');
  chartOptions.colors.push('#e2001a');
}

const switchDataDisplay=function()
{
  if(simu.value.events.length<1)
  {
    return;
  }
  if(tickCount.value<=50)//every 0.5s switch the display
  {
    tickCount.value+=10;
    return;
  }
  tickCount.value=0;
  if(carrouselPhase.value!=0 && carrouselPhase.value!=simu.value.events.length+1)//if not displayed all events , remove the event just displayed (2series)
  {
    series.splice(2,series.length-2);
    chartOptions.colors.splice(2,chartOptions.colors.length-2);
    getSingleEvent(carrouselPhase.value-1);
  }
  else if(carrouselPhase.value==simu.value.events.length+1)//when we displayed last event, do not remove, add savings
  {
    if(hasSavings())
    {
      getAdjustedBanking(carrouselPhase.value-2);
    }
    clearInterval(Id_destroy.value);
    is_playing.value=false;
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
      extractData_capital.push(Math.round(simu.value.events[index].amortEvt[j][1]*100)/100);
      extractData_interests.push(Math.round(simu.value.events[index].amortEvt[j][2]*100)/100);
      if(simu.value.events[index].amortEvt[j][0]==transMonthName(simu.value.events[index].month)+'-'+simu.value.events[index].year.toString())
      {
        evt_y=extractData_capital[extractData_capital.length-1];//store the capital to set a point on graph
        if(evt_y==0)//case of a rebuy,
        {
          evt_y=extractData_capital[extractData_capital.length-2];
        }
      }
    }
    series.push({name:simu.value.events[index].title,data:extractData_capital});
    series.push({name:transStr(stringsIDs.str_interests_parenth)+simu.value.events[index].title+')',data:extractData_interests});
    chartOptions.colors.push('#147280');
    chartOptions.colors.push('#085a67');
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
  if( startFormFilled.value==true && hasSavings())//if some banking data exist, compute banking from credit start to the latest mensuality, potentially after a modulation
  {
    if(nbYearDisplaySavings.value==0)//there was no popup to ask for the display of saving duration
    {
      var credit_init_y=Number(simu.value.credit.startingDate.split('/')[2]);
      var credit_init_m=Number(simu.value.credit.startingDate.split('/')[1]);
      var min_y=Math.min(credit_init_y,getSavingsEarlier()[1]) ;
      var Number_of_years_to_compute=getLatestMensuality(specific_event).l_y-min_y;
      computeDisplaySavings(min_y,getSavingsEarlier()[0],Number_of_years_to_compute);
      getBanking(min_y,credit_init_m,Number_of_years_to_compute);
    }
  }
  //otherwise, the user will be aked in popup on how many years the savings have to be displayed
}
const getBanking=function(){
  //assume : the banking is already computed
  while(bank.value.monthly_sum[0][0]!=simu.value.credit.amort[0][0] && 0!=bank.value.monthly_sum.length)
  {
    bank.value.monthly_sum.shift();
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
  if(getPopObligation()==false)//there is more than just banking to display : do not pop user and proceed computations
  {
    display_init_credit();//in all cases, display initial credit and banking if any
    if(simu.value.events.length>0)//there are some events to display, the periodic function must be started tuto or not (code inhibited in case tuto is active)
    {
      is_playing.value=true;
      Id_destroy.value=setInterval(switchDataDisplay,100);
    }
  }
}

onBeforeMount(setupChart);



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
//https://apexcharts.com/docs/annotations/
//https://apexcharts.com/docs/annotations/
//https://apexcharts.com/docs/annotations/
//https://apexcharts.com/docs/annotations/
var onlydisplaySavings=ref(false);
var nbYearDisplaySavings=ref('0');
var graphMinDate = ref('1900/01');
const sendSavingComputationOrder=function()
{
  series=[];
  onlydisplaySavings.value=true;
  var earlierY=getSavingsEarlier()[1];
  var earlierM=getSavingsEarlier()[0];
  computeDisplaySavings(earlierY,earlierM,Number(nbYearDisplaySavings.value));
  getBanking();
  chartOptions.xaxis.categories=getBankTime();
  //chartOptions.xaxis.categories=getBankTime();
  mustPop.value=false;
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


const getPopObligation = function () {
  if (hasSavings() && (startFormFilled.value != true)) {
    mustPop.value = true;
    graphMinDate.value=getSavingsEarlier()[1].toString()+'/'+getSavingsEarlier()[0].toString();
    return true;
  }
  else {
    mustPop.value = false;
    return false;
  }
}


const destroy_periodic=function(){
  clearInterval(Id_destroy.value);
}
onBeforeUnmount(destroy_periodic);

const handleSwipeExt=function ({ evt, touch, mouse, direction, duration, distance })
{
  destroy_periodic();
  router.push(targetPage(direction,router.currentRoute.value.fullPath));
}


</script>
