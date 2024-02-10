<template>
  <q-page>
    <VueApexCharts
      type="line"
      height=100%
      width=100%
      :options="chartOptions"
      :series="series"
    ></VueApexCharts>
  </q-page>

</template>

<script setup>

import VueApexCharts from 'vue3-apexcharts'
import { onBeforeMount } from 'vue';
import {getChartXAxis} from '../pages/credit_utility'
import{ getFormatedCategories} from '../pages/chart_utility'
import { simu } from 'stores/store';
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
}
onBeforeMount(getEvents);
const getTime = function () {
  const amort_arr = getChartXAxis();
  var xAxisUp2Date = [];
  for (var i = 0; i < amort_arr.length; i++) {
    xAxisUp2Date.push(amort_arr[i][0]);
  }
  return xAxisUp2Date;
};
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

</script>
