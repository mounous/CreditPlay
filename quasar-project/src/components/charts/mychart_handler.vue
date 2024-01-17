<template>
  <div class="q-pa-md q-gutter-sm">
    <q-card
      class="my-card text-white"
      style="background: radial-gradient(circle, #35a2ff 0%, #014a88 100%)"
    >
      <q-card-section class="q-pt-none">
        {{ mensVal }}
      </q-card-section>
    </q-card>
    <apexchart
      ref="realtimeChart"
      type="line"
      height="350"
      :options="chartOptions"
      :series="series"
    ></apexchart>
  </div>
</template>

<script>
import { data } from "autoprefixer";
import { useQuasar } from "quasar";

export default {
  setup() {
    var toreturn = useQuasar()
      .sessionStorage.getItem("mensuality_str")
      .toString();
    return {
      mensVal: toreturn,
    };
  },

  name: "graphique1",
  data() {
    return {
      series: [
        {
          name: "Capital restant",
          data: this.getAmount(),
        },
        {
          name: "interets payés",
          data: this.getIntests(),
        },
      ],
      chartOptions: {
        chart: {
          height: 350,
          type: "line",
          zoom: {
            enabled: true,
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: "straight",
        },
        title: {
          text: "Simulation",
          align: "left",
        },
        grid: {
          row: {
            colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
            opacity: 0.5,
          },
        },
        xaxis: {
          categories: this.getTime(),
          hideOverlappingLabels: true,
          style: {
            fontSize: "75px",
          },
        },
      },
    };
  },
  mounted() {},
  methods: {
    getTime() {
      const $q = useQuasar();
      const amort_arr = this.$q.sessionStorage.getItem("amort_monthly");
      var xAxisUp2Date = [];
      for (var i = 0; i < amort_arr.length; i++) {
        xAxisUp2Date.push(amort_arr[i][0]);
      }
      return xAxisUp2Date;
    },
    getAmount() {
      const $q = useQuasar();
      const amort_arr = this.$q.sessionStorage.getItem("amort_monthly");
      var seriesUp2Date = [];
      for (var i = 0; i < amort_arr.length; i++) {
        seriesUp2Date.push(amort_arr[i][1]);
      }
      return seriesUp2Date;
    },
    getIntests() {
      const $q = useQuasar();
      const amort_arr = this.$q.sessionStorage.getItem("amort_monthly");
      var seriesInterests = [];
      for (var i = 0; i < amort_arr.length; i++) {
        seriesInterests.push(amort_arr[i][2]);
      }
      return seriesInterests;
    },
  },
};
</script>
