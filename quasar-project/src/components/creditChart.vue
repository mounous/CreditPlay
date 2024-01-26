<template>
  <div>
    <q-card
      class="my-card text-white"
      style="background: radial-gradient(circle, #35a2ff 0%, #014a88 100%)"
    >
      <q-card-section class="q-pt-none">
        {{ init_credit_String }}
      </q-card-section>
    </q-card>
    <VueApexCharts
      type="line"
      height="100%"
      width="100%"
      :options="chartOptions"
      :series="series"
    ></VueApexCharts>
  </div>
</template>

<script setup>
import {  SessionStorage } from 'quasar';
import VueApexCharts from 'vue3-apexcharts'
import {ref} from 'vue'
import { onBeforeMount } from 'vue';
import {getChartXAxis} from '../pages/credit_utility'
var mensVal = SessionStorage.getItem('mensuality_str').toString();
var total_cost_init=SessionStorage.getItem('total_cost_init');
var init_credit_String = ref('Sans modulation : '+mensVal+' coût total : '+total_cost_init.toString());
const getEvents=function(){
  if(SessionStorage.has('events'))
  {
    var events=SessionStorage.getItem('events');
    for(var i=0;i<events.length;i++)
    {
      var extractData_capital=[];
      var extractData_interests=[];
      for(var j=0;j<events[i].amortEvt.length;j++)
      {
        extractData_capital.push(Math.round(events[i].amortEvt[j][1]*100)/100);
        extractData_interests.push(Math.round(events[i].amortEvt[j][2]*100)/100);
      }
      series.push({name:events[i].title,data:extractData_capital});
      series.push({name:'interets ('+events[i].title+')',data:extractData_interests});

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
  const amort_arr = SessionStorage.getItem('amort_monthly');
  var seriesUp2Date = [];
  for (var i = 0; i < amort_arr.length; i++) {
    seriesUp2Date.push(amort_arr[i][1]);
  }
  return seriesUp2Date;
};
const getIntests = function () {
  const amort_arr = SessionStorage.getItem('amort_monthly');
  var seriesInterests = [];
  for (var i = 0; i < amort_arr.length; i++) {
    seriesInterests.push(amort_arr[i][2]);
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
    text: 'Simulation',
    align: 'left',
  },
  grid: {
    row: {
      colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
      opacity: 0.5,
    },
  },
  xaxis: {
    categories: getTime(),
    hideOverlappingLabels: true,
    style: {
      fontSize: '75px',
    },
  },
};

</script>
