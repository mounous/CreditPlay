<template>
  <q-page class="flex flex center">
    <graphique1> </graphique1>
  </q-page>
</template>

<script>
import { defineComponent, defineAsyncComponent } from "vue";

const graphique1 = defineAsyncComponent(() =>
  import("components/charts/mychart_handler.vue")
);
export default defineComponent({
  name: "SummaryPage",
  components: {
    graphique1,
  },
});
</script>
