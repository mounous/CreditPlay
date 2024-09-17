<template>
  <q-card style="background-color: black;">
    <div class="column items-center q-ma-md">
      <div class="col myIndication q-ma-md">
        <th color="white" style="font-size: larger;">Select language :</th>
      </div>
      <div class="col q-ma-md" style="background-color: black;color: white;">
        <q-select ref="mySelect" v-model="myLang" :options="supportedLanguages" @update:model-value="saveLanguage" @popup-hide="saveLanguage" style="min-width:100px;"   bg-color="black" popup-content-style="background-color:black;" popup-content-class="mySelect"></q-select>
      </div>
    </div>
  </q-card>
</template>

<script setup>
import {supportedLanguages,getLangId} from '../stores/languages'
import { LocalStorage } from 'quasar';

import { reapplyLanguageToData} from 'src/utils/credit_utility';
import { ref ,defineEmits,onMounted} from 'vue';
var mySelect=ref();
const setFocus=function()
{
  mySelect.value.showPopup();
}
onMounted(setFocus);
var myLang=ref(supportedLanguages[getLangId()]);
const emit=defineEmits(['language-picked']);
const saveLanguage=function()
{
  LocalStorage.set('currentLanguage',myLang.value);
  reapplyLanguageToData();
  emit('language-picked');
}
</script>



<style lang="scss">


.mySelect {

  color: white;

}
</style>
