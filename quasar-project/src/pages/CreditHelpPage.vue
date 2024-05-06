<template>
  <q-page class="q-pa-lg"  v-touch-swipe.mouse="handleSwipeExt">
    <h5 class="q-mt-none">Help</h5>
    <p v-touch-swipe.mouse="handleSwipeExt">
      First click on the "Situation initiale" button and fill all required
      fields. Once completed, click the "Compute" button.\nThis will trigger the
      computation algorithm providing all data relative to your loan. This data
      is provided along with a graph in the Summary page.
    </p>
    <p>
      Then you can add events and track their effect on the loan Data, in the
      summary page
    </p>
  </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router';
import {targetPage} from '../utils/swipe_utils.js'
const router = useRouter();
const handleSwipeExt=function ({ evt, touch, mouse, direction, duration, distance })
{
  router.push(targetPage(direction,router.currentRoute.value.fullPath));
}
</script>
