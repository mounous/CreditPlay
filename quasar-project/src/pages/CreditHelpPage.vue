<template>
  <q-page class="q-pa-lg"  v-touch-swipe.mouse.left.right="handleSwipeExt" :key="reRender">
    <div style="display: flex;flex-direction:column; justify-items:center;justify-content:center;align-items: center;align-content: center;">
      <q-card class="bg-primary q-mb-md" style="width: 100%;">
        <div style="display: flex;flex-direction:column; justify-items:center;justify-content:center;align-items: center;align-content: center;">
          <div style="display: flex;justify-items:center;justify-content:center;align-items: center;align-content: center;font-size: x-large;">
            {{ transStr(stringsIDs.str_settings) }}
          </div>
          <div style="display: flex;justify-items:center;justify-content:center;align-items: center;align-content: center;">
            <q-btn class="q-ma-md" :label=transStr(stringsIDs.str_choose_lang) @click="mustPopLanguage=true" color='blue-grey-8'></q-btn>
            <q-btn class="q-ma-md" :label=transStr(stringsIDs.str_choose_currency) @click="mustPopCurrency=true" color='blue-grey-8'></q-btn>
          </div>
        </div>
      </q-card>
      <q-card class="bg-primary q-mb-md" style="width: 100%;">
        <div style="display: flex;flex-direction:column; justify-items:center;justify-content:center;align-items: center;align-content: center;">
          <div style="display: flex;justify-items:center;justify-content:center;align-items: center;align-content: center;font-size: x-large;">
            {{ transStr(stringsIDs.str_simulate_credit) }}
          </div>
          <div style="display: flex;justify-items:center;justify-content:center;align-items: center;align-content: center;">
            <q-video src="https://www.youtube.com/embed/e2sg0ZxO55g?si=Bjd9LRIQCRgNFT8v" />
          </div>
        </div>
      </q-card>
      <q-card class="bg-primary q-mb-md" style="width: 100%;">
        <div style="display: flex;flex-direction:column; justify-items:center;justify-content:center;align-items: center;align-content: center;">
          <div style="display: flex;justify-items:center;justify-content:center;align-items: center;align-content: center;font-size: x-large;">
            {{ transStr(stringsIDs.str_simulate_credit) }}
          </div>
          <div style="display: flex;justify-items:center;justify-content:center;align-items: center;align-content: center;">
            <q-video src="https://www.youtube.com/embed/k3_tw44QsZQ?rel=0" />
          </div>
        </div>
      </q-card>
      <q-card class="bg-primary q-mb-md" style="width: 100%;">
        <div style="display: flex;flex-direction:column; justify-items:center;justify-content:center;align-items: center;align-content: center;">
          <div style="display: flex;justify-items:center;justify-content:center;align-items: center;align-content: center;font-size: x-large;">
            {{ transStr(stringsIDs.str_modulate_credit) }}
          </div>
          <div style="display: flex;justify-items:center;justify-content:center;align-items: center;align-content: center;">
            <q-video src="https://www.youtube.com/embed/k3_tw44QsZQ?rel=0" />
          </div>
        </div>
      </q-card>
      <q-card class="bg-primary q-mb-md" style="width: 100%;">
        <div style="display: flex;flex-direction:column; justify-items:center;justify-content:center;align-items: center;align-content: center;">
          <div style="display: flex;justify-items:center;justify-content:center;align-items: center;align-content: center;font-size: x-large;">
            {{ transStr(stringsIDs.str_reloan_credit) }}
          </div>
          <div style="display: flex;justify-items:center;justify-content:center;align-items: center;align-content: center;">
            <q-video src="https://www.youtube.com/embed/k3_tw44QsZQ?rel=0" />
          </div>
        </div>
      </q-card>
      <q-card class="bg-primary q-mb-md" style="width: 100%;">
        <div style="display: flex;flex-direction:column; justify-items:center;justify-content:center;align-items: center;align-content: center;">
          <div style="display: flex;justify-items:center;justify-content:center;align-items: center;align-content: center;font-size: x-large;">
            {{ transStr(stringsIDs.str_savings_help) }}
          </div>
          <div style="display: flex;justify-items:center;justify-content:center;align-items: center;align-content: center;">
            <q-video src="https://www.youtube.com/embed/k3_tw44QsZQ?rel=0" />
          </div>
        </div>
      </q-card>
      <q-card class="bg-primary q-mb-md" style="width: 100%;">
        <div style="display: flex;flex-direction:column; justify-items:center;justify-content:center;align-items: center;align-content: center;">
          <div style="display: flex;justify-items:center;justify-content:center;align-items: center;align-content: center;font-size: x-large;">
            {{ transStr(stringsIDs.str_rebuy_savings_help) }}
          </div>
          <div style="display: flex;justify-items:center;justify-content:center;align-items: center;align-content: center;">
            <q-video src="https://www.youtube.com/embed/k3_tw44QsZQ?rel=0" />
          </div>
        </div>
      </q-card>
    </div>

    <div class="col">
      <q-dialog v-model="mustPopLanguage" cover transition-show="scale" transition-hide="scale">
        <languagePicker @language-picked="[mustPopLanguage=false,reRender++,rerenderMainlayout++]"></languagePicker>
      </q-dialog>
      <q-dialog v-model="mustPopCurrency" cover transition-show="scale" transition-hide="scale">
        <currencyPicker @language-picked="[mustPopCurrency=false]"></currencyPicker>
      </q-dialog>
    </div>
  </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router';
import {targetPage} from '../utils/swipe_utils.js'
import languagePicker from 'src/components/languagePicker.vue';
import currencyPicker from 'src/components/currencyPicker.vue';
import { transStr,stringsIDs,rerenderMainlayout } from 'src/stores/languages';
import { ref } from 'vue';
var reRender=ref(1);
var mustPopLanguage=ref(false);
var mustPopCurrency=ref(false);
const router = useRouter();
const handleSwipeExt=function ({ evt, touch, mouse, direction, duration, distance })
{
  router.push(targetPage(direction,router.currentRoute.value.fullPath));
}
</script>
