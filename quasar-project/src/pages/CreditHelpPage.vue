<template>
  <q-page class="q-pa-lg">
    <h5 class="q-mt-none">Help</h5>
    <p>
      First click on the "Situation initiale" button and fill all required
      fields. Once completed, click the "Compute" button.\nThis will trigger the
      computation algorithm providing all data relative to your loan. This data
      is provided along with a graph in the "Summary" page.
    </p>
    <p>
      Then you can add events and track their effect on the loan Data, in the
      summary page
    </p>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "HelpPage",
});
</script>
