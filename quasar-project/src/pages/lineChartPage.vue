<template  >
  <creditChart v-touch-swipe.mouse.left.right="handleSwipeExt"></creditChart>

</template>

<script setup>
import creditChart from 'src/components/creditChart.vue'
import { useRouter } from 'vue-router';
import {targetPage} from '../utils/swipe_utils.js'
import {mustAlertChart} from '../stores/store'

mustAlertChart.value=false;
const router = useRouter();

const handleSwipeExt=function ({ evt, touch, mouse, direction, duration, distance })
{
  router.push(targetPage(direction,router.currentRoute.value.fullPath));
}
</script>
