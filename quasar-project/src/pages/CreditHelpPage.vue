<template>
  <q-page class="q-pa-lg"  v-touch-swipe.mouse="handleSwipeExt" :key="reRender">
    <h5 class="q-mt-none">{{ transStr(stringsIDs.str_tab_help) }}</h5>
    <div class="column">
    <div class="col">
      <q-dialog v-model="mustPopLanguage" cover transition-show="scale" transition-hide="scale">
        <languagePicker @language-picked="[mustPopLanguage=false,reRender++,rerenderMainlayout++]"></languagePicker>
      </q-dialog>
    </div>
    <div class="col">
      <q-btn :label=transStr(stringsIDs.str_choose_lang) @click="mustPopLanguage=true" color='blue-grey-8'>

      </q-btn>
    </div>
  </div>

  </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router';
import {targetPage} from '../utils/swipe_utils.js'
import languagePicker from 'src/components/languagePicker.vue';
import { transStr,stringsIDs,rerenderMainlayout } from 'src/stores/languages';
import { ref } from 'vue';
var reRender=ref(1);
var mustPopLanguage=ref(false);
const router = useRouter();
const handleSwipeExt=function ({ evt, touch, mouse, direction, duration, distance })
{
  router.push(targetPage(direction,router.currentRoute.value.fullPath));
}
</script>
