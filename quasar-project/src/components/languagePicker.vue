<template>
  <q-card>
    <div class="column items-center q-ma-md">
      <div class="col myIndication q-ma-md">
        Select language :
      </div>
      <div class="col q-ma-md">
        <q-select :model-value="myLang" :options="supportedLanguages" @update:model-value="saveLanguage" style="min-width:100px" ></q-select>
      </div>
    </div>
  </q-card>
</template>

<script setup>
import {supportedLanguages} from '../stores/languages'
import { LocalStorage } from 'quasar';
import { ref ,defineEmits} from 'vue';
var myLang=ref('');
const emit=defineEmits(['language-picked']);
const saveLanguage=function()
{
  LocalStorage.set('currentLanguage',myLang.value);
  emit('language-picked');
}
</script>



<style lang="scss">
.myIndication {
  font-size: 20px;
}

.oneInThreeRowH {
  width: 100%;
  height: 20%;
}

.oneInThreeRow {
  width: 100%;
  height: 50%;
}

.oneInThreeRowB {
  width: 100%;
  height: 30%;
}
</style>
