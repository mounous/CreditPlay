<template>
  <div style="display: flex;flex-direction: column;align-items: center;align-content: center;justify-items: center;justify-content: center;width: 100%;height: 100%">
    <q-card style="background-color: black;">
        <div class="col q-ma-md" style="background-color: black;color: white;">
          <q-select bordered filled label-color="white"  ref="mySelect" :label="labelLang" v-model="myLang" :options="supportedLanguages" @update:model-value="saveLanguage" @popup-hide="saveLanguage" style="min-width:200px;"   bg-color="black" popup-content-style="background-color:black;" popup-content-class="mySelect">
            <template v-slot:prepend>
              <q-icon name="translate" color="white" @click.stop.prevent />
            </template>
        </q-select>
        </div>
    </q-card>
  </div>
</template>

<script setup>
import {supportedLanguages,getLangId,transStr,stringsIDs} from '../stores/languages'
import { LocalStorage } from 'quasar';
import { reapplyLanguageToData} from 'src/utils/credit_utility';
import { ref ,defineEmits,onMounted} from 'vue';

var labelLang=ref(LocalStorage.has('currentLanguage')?LocalStorage.getItem('currentLang'):transStr(stringsIDs.str_choose_lang2) );
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
  if(myLang.value!='' && myLang.value!=undefined)
  {
    LocalStorage.set('currentLanguage',myLang.value);
    reapplyLanguageToData();
    emit('language-picked');
  }
  else
  {
    setFocus();
  }
}
</script>



<style lang="scss">


.mySelect {

  color: white;
  font-size: larger;

}
</style>
