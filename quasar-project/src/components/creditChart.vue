<template>
  <q-page>
    <VueApexCharts
      type="line"
      height=100%
      width=100%
      :options="chartOptions"
      :series="series"
      :key="mustPop"
    ></VueApexCharts>
    <q-dialog v-model="mustPop">
      <q-card>
        <div class="q-ma-xl col flex flex-center">
          Aucun crédit n'a été renseigné, mais certaines économies oui. Les premières économies ont été renseignées pour
          le {{ graphMinDate }}. Sur combien d'anées afficher les économies ?
          <q-select v-model="nbYearDisplaySavings" dense bg-color="blue-grey-8" :options="optionYears"
            @update:model-value="sendSavingComputationOrder"></q-select>
        </div>
      </q-card>
    </q-dialog>
  </q-page>

</template>

<script setup>

import VueApexCharts from 'vue3-apexcharts'
import { onBeforeMount,ref } from 'vue';
import {getChartXAxis,getLatestMensuality} from '../pages/credit_utility'
import{ getFormatedCategories} from '../pages/chart_utility'
import { simu,bank, startFormFilled } from 'stores/store';
import {getSavingsEarlier,computeDisplaySavings} from '../pages/bank_utility'
var mustPop = ref(false)
const getEvents=function(){
  if(simu.value.events.length!=0)
  {
    for(var i=0;i<simu.value.events.length;i++)
    {
      var extractData_capital=[];
      var extractData_interests=[];
      for(var j=0;j<simu.value.events[i].amortEvt.length;j++)
      {
        extractData_capital.push(Math.round(simu.value.events[i].amortEvt[j][1]*100)/100);
        extractData_interests.push(Math.round(simu.value.events[i].amortEvt[j][2]*100)/100);
      }
      series.push({name:simu.value.events[i].title,data:extractData_capital});
      series.push({name:'interets ('+simu.value.events[i].title+')',data:extractData_interests});

    }
  }
  if(bank.value.periodic_savings.length!=0 || bank.value.savings.length!=0 || bank.value.single_in_out.length!=0)//if some banking data exist, compute banking from credit start to the latest mensuality, potentially after a modulation
  {
    if(nbYearDisplaySavings.value==0)//there was no popup to ask for the display of saving duration
    {
      var bank_compute_start_y=Number(simu.value.credit.startingDate.split('/')[0]);
      var bank_compute_start_m=Number(simu.value.credit.startingDate.split('/')[1]);
      var Number_of_years_to_compute=getLatestMensuality().l_y-bank_compute_start_y;
      computeDisplaySavings(bank_compute_start_y,bank_compute_start_m,Number_of_years_to_compute);
      getBanking();
    }

  }
}
const getBanking=function(){
  if(bank.value.monthly_sum.length!=0)
  {
    var exctractedSavings=[];
    for(var i=0;i<bank.value.monthly_sum.length;i++)
    {
      exctractedSavings.push(Math.round(bank.value.monthly_sum[i][1]*100)/100);
    }
    series.push({name:'savings',data:exctractedSavings});
  }
}
onBeforeMount(getEvents);
const getTime = function () {
  const amort_arr = getChartXAxis();
  var xAxisUp2Date = [];
  if(simu.value.credit.amort.length!=0)//credit scale even if savings entries starting after credit ends
  {
    const amort_arr = getChartXAxis();

    for (var i = 0; i < amort_arr.length; i++) {
      xAxisUp2Date.push(amort_arr[i][0]);
    }
    return xAxisUp2Date;
  }
  //return new Date();
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
  chartOptions.xaxis.categories=xAxisUp2Date;
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
    name: 'Capital restant',
    data: getAmount(),
  },
  {
    name: 'interets payés',
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
  },
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
    text: 'Capital et interêts',
    align: 'center',
  },

  xaxis: {
    categories: getTime(),
    hideOverlappingLabels: true,
    style: {
      fontSize: '75px',
    },
    //stepSize:40,
    overwriteCategories:getFormatedCategories(getTime(),10),
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
    labels:{
      formatter:function(val,index)
      {
        return Math.round(val);
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

var nbYearDisplaySavings=ref('0');
var graphMinDate = ref('1900/01');
const sendSavingComputationOrder=function()
{
  computeDisplaySavings(getSavingsEarlier()[1],getSavingsEarlier()[0],Number(nbYearDisplaySavings.value));
  getBanking();
  getBankTime();
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
  if ((bank.value.savings.length != 0 || bank.value.periodic_savings.length != 0 || bank.value.single_in_out.length != 0) && (startFormFilled.value != true)) {
    mustPop.value = true;
    graphMinDate.value=getSavingsEarlier()[1].toString()+'/'+getSavingsEarlier()[0].toString();
  }
  else {
    mustPop.value = false;
  }
}
onBeforeMount(getPopObligation);
</script>
