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
            {{ transStr(stringsIDs.str_tuto) }}
          </div>
          <div style="display: flex;justify-items:center;justify-content:center;align-items: center;align-content: center;">
            <q-btn class="q-ma-md" :label=transStr(stringsIDs.str_tuto_tuto) @click="launchTuto()" color='blue-grey-8'></q-btn>
          </div>
        </div>
      </q-card>

      <div  v-if="show_tuto==true && (tutoPhase==0||tutoPhase==1) " class="q-ma-md" @click="handleCLick()">
        <th  v-if="show_tuto==true && tutoPhase==0" class="q-ma-md" style="color: white;font-size:17px;">{{transStr(stringsIDs.str_tuto_helpP_1)}}</th>
        <th  v-if="show_tuto==true && tutoPhase==1" class="q-ma-md" style="color: white;font-size:17px;">{{transStr(stringsIDs.str_tuto_helpP_2)}}</th>
        <div ref="phamtomDivToScrollTo"></div>
      </div>

      <q-card class="bg-primary q-mb-md" style="width: 100%;">
        <div style="display: flex;flex-direction:column; justify-items:center;justify-content:center;align-items: center;align-content: center;">
          <div style="display: flex;justify-items:center;justify-content:center;align-items: center;align-content: center;font-size: x-large;">
            {{ transStr(stringsIDs.str_simulate_credit) }}
          </div>
          <div style="display: flex;justify-items:center;justify-content:center;align-items: center;align-content: center;">
            <q-video v-if="getLangId()==FRENCH_ID" src="https://www.youtube.com/embed/sixo83vrOF8" />
            <q-video v-if="getLangId()==ENGLISH_ID" src="https://www.youtube.com/embed/yFX_QoSTmC0?si=Ph-hl7ZKy09QN4mW"/>
          </div>
        </div>
      </q-card>
      <q-card class="bg-primary q-mb-md" style="width: 100%;">
        <div style="display: flex;flex-direction:column; justify-items:center;justify-content:center;align-items: center;align-content: center;">
          <div style="display: flex;justify-items:center;justify-content:center;align-items: center;align-content: center;font-size: x-large;">
            {{ transStr(stringsIDs.str_modulate_credit) }}
          </div>
          <div style="display: flex;justify-items:center;justify-content:center;align-items: center;align-content: center;">
            <q-video  v-if="getLangId()==FRENCH_ID" src="https://www.youtube.com/embed/FwObaGbUlSs?si=dU0xatI78_kkjNNa" />
            <q-video  v-if="getLangId()==ENGLISH_ID" src="https://www.youtube.com/embed/EIoL0ZnZjFY?si=gpBlRTapczyg97Gu" />
          </div>
        </div>
      </q-card>
      <q-card class="bg-primary q-mb-md" style="width: 100%;">
        <div style="display: flex;flex-direction:column; justify-items:center;justify-content:center;align-items: center;align-content: center;">
          <div style="display: flex;justify-items:center;justify-content:center;align-items: center;align-content: center;font-size: x-large;">
            {{ transStr(stringsIDs.str_reloan_credit) }}
          </div>
          <div style="display: flex;justify-items:center;justify-content:center;align-items: center;align-content: center;">
            <q-video  v-if="getLangId()==FRENCH_ID"  src="https://www.youtube.com/embed/DtbNvEapgKU?si=PMxZfforMl1jjTES" />
            <q-video  v-if="getLangId()==ENGLISH_ID" src="https://youtube.com/embed/VcbevJl37M8?si=1GKY8L4mY44FRFdE" />
          </div>
        </div>
      </q-card>
      <q-card class="bg-primary q-mb-md" style="width: 100%;">
        <div style="display: flex;flex-direction:column; justify-items:center;justify-content:center;align-items: center;align-content: center;">
          <div style="display: flex;justify-items:center;justify-content:center;align-items: center;align-content: center;font-size: x-large;">
            {{ transStr(stringsIDs.str_savings_help) }}
          </div>
          <div style="display: flex;justify-items:center;justify-content:center;align-items: center;align-content: center;">
            <q-video  v-if="getLangId()==FRENCH_ID" src="https://www.youtube.com/embed/CsJbUS5z_XU?si=9bPWDA1TeqLkdQ1n" />
            <q-video  v-if="getLangId()==ENGLISH_ID" src="https://www.youtube.com/embed/CfWYyYQlg4g?si=kmWkliEMQzvepdY9" />
          </div>
        </div>
      </q-card>
      <q-card class="bg-primary q-mb-md" style="width: 100%;">
        <div style="display: flex;flex-direction:column; justify-items:center;justify-content:center;align-items: center;align-content: center;">
          <div style="display: flex;justify-items:center;justify-content:center;align-items: center;align-content: center;font-size: x-large;">
            {{ transStr(stringsIDs.str_rebuy_savings_help) }}
          </div>
          <div style="display: flex;justify-items:center;justify-content:center;align-items: center;align-content: center;">
            <q-video  v-if="getLangId()==FRENCH_ID"  src="https://www.youtube.com/embed/BQwLXegnkTs?si=8TSc_CfHg-LyHAt9" />
            <q-video  v-if="getLangId()==ENGLISH_ID" src="https://www.youtube.com/embed/x1PNnoaFNVM?si=ORMybfS7mPNxuh5o" />
          </div>
        </div>
      </q-card>
    </div>

    <div  v-if="show_tuto==true && tutoPhase==2" class="q-ma-md" @click="handleCLick()">
      <th  v-if="show_tuto==true"  class="q-ma-md" style="color: white;font-size:17px;">{{transStr(stringsIDs.str_tuto_helpP_3)}}</th>
      <div ref="phamtomDivToScrollTo2"></div>
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
import { transStr,stringsIDs,rerenderMainlayout,FRENCH_ID,ENGLISH_ID,getLangId } from 'src/stores/languages';
import { onBeforeMount, ref } from 'vue';
import { show_tuto,tutoPhase } from 'src/stores/store';


var reRender=ref(1);
var mustPopLanguage=ref(false);
var mustPopCurrency=ref(false);
const router = useRouter();
var phamtomDivToScrollTo=ref();
var phamtomDivToScrollTo2=ref();

const handleSwipeExt=function ({ evt, touch, mouse, direction, duration, distance })
{
  router.push(targetPage(direction,router.currentRoute.value.fullPath));
}
const startup=function()
{
  if(show_tuto.value==true)
  {
    tutoPhase.value=0;
  }
}
onBeforeMount(startup);

const launchTuto=function()
{
  if(show_tuto.value==false)
  {
    show_tuto.value=true;
    tutoPhase.value=0;
    router.push('/');
  }
}

</script>
