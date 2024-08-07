<template>
  <q-page v-touch-hold.mouse="handleHold" :key="mustPop">
    <VueApexCharts
      v-if="mustPop==false"
      type="line"
      height=100%
      width=100%
      :options="chartOptions"
      :series="series"
      :key="mustPop"
    ></VueApexCharts>
    <q-dialog v-model="mustPop" persistent>
      <q-card>
        <div class="q-ma-xl col flex flex-center">
           {{transSt(sentancesIDs.s_info_savings_only_p1)+ graphMinDate+transSt(sentancesIDs.s_info_savings_only_p2) }}
          <q-select v-model="nbYearDisplaySavings" dense bg-color="blue-grey-8" :options="optionYears"
            @update:model-value="sendSavingComputationOrder"></q-select>
        </div>
      </q-card>
    </q-dialog>
  </q-page>

</template>

<script setup>

import VueApexCharts from 'vue3-apexcharts'
import { onBeforeMount,ref, nextTick } from 'vue';
import {getChartXAxis,getLatestMensuality} from '../utils/credit_utility'
import { GetColor,TYPE_CAPITAL,TYPE_INTERESTS,TYPE_SAVINGS } from 'src/utils/chart_utility';
import { simu,bank, startFormFilled } from 'stores/store';
import {getSavingsEarlier,computeDisplaySavings,hasSavings} from '../utils/bank_utility'
import { transSt,sentancesIDs,stringsIDs,transStr } from 'src/stores/languages';
import { useQuasar } from 'quasar';

var $q=useQuasar();
var mustPop = ref(false)
var DataDisplayFull=ref(false);
const forceRender=async()=>{
  mustPop.value=true;
  await nextTick();
  mustPop.value=false;
  await nextTick();
}
const handleHold=function(){
  //switch display mode only if more than one event is set, otherwize no effect
  if(simu.value.events.length>1)
  {
    switchDataDisplay();
    forceRender();
  }
}

const switchDataDisplay=function()
{
  chartOptions.colors=[];
  series = [ {  name: transStr(stringsIDs.str_cap_left), data: getAmount(), }, {name: transStr(stringsIDs.str_interests_paid), data: getIntests(), }];
  chartOptions.colors.push(GetColor(TYPE_CAPITAL,0,true));
  chartOptions.colors.push(GetColor(TYPE_INTERESTS,0,true));
  getEvents(DataDisplayFull.value);
  DataDisplayFull.value=!DataDisplayFull.value;
}
const getSingleEvent=function(index)
{
  if(index <simu.value.events.length )
  {
    var extractData_capital=[];
    var extractData_interests=[];
    for(var j=0;j<simu.value.events[index].amortEvt.length;j++)
    {
      extractData_capital.push(Math.round(simu.value.events[index].amortEvt[j][1]*100)/100);
      extractData_interests.push(Math.round(simu.value.events[index].amortEvt[j][2]*100)/100);
    }
    series.push({name:simu.value.events[index].title,data:extractData_capital});
    series.push({name:transStr(stringsIDs.str_interests_parenth)+simu.value.events[index].title+')',data:extractData_interests});
    chartOptions.colors.push(GetColor(TYPE_CAPITAL,index,false));
    chartOptions.colors.push(GetColor(TYPE_INTERESTS,index,false));
  }
}
const getEvents=function(full=true){
  //if some events were entered, then process them
  if(simu.value.events.length!=0)
  {
    if(full)
    {
      for(var i=0;i<simu.value.events.length;i++)
      {
        getSingleEvent(i);
      }
    }
    else
    {
      getSingleEvent(simu.value.events.length-1);
    }
  }
  //if a credit has already been computed, then display potential savings on the interval [credit start...Credit longest duration]
  if( startFormFilled.value==true && hasSavings() && full==true)//if some banking data exist, compute banking from credit start to the latest mensuality, potentially after a modulation
  {
    if(nbYearDisplaySavings.value==0)//there was no popup to ask for the display of saving duration
    {
      var credit_init_y=Number(simu.value.credit.startingDate.split('/')[2]);
      var credit_init_m=Number(simu.value.credit.startingDate.split('/')[1]);
      var min_y=Math.min(credit_init_y,getSavingsEarlier()[1]) ;
      var Number_of_years_to_compute=getLatestMensuality().l_y-min_y;
      computeDisplaySavings(min_y,getSavingsEarlier()[0],Number_of_years_to_compute);
      getBanking(min_y,credit_init_m,Number_of_years_to_compute);
    }
  }
  //otherwise, the user will be aked in popup on how many years the savings have to be displayed
}
const getBanking=function(bank_compute_start_y,bank_compute_start_m,Number_of_years_computed){
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
onBeforeMount(getEvents);

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
      enabled: true,
    },
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
  title: {
    style:{
      color:'#b4c8d6',
    },
    text: transStr(stringsIDs.str_graph_title),
    align: 'center',
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
  }
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
  }
  else {
    mustPop.value = false;
  }
}
onBeforeMount(getPopObligation);
const displayHelp=function(){
  if(simu.value.events.length>1)
  {
    $q.notify({    color: 'green-4',    textColor: 'black',position:'top', message: transStr(stringsIDs.str_graph_indication), actions: [
      { icon: 'close', color: 'white', round: true }
    ] });
  }
}
onBeforeMount(displayHelp);
</script>
