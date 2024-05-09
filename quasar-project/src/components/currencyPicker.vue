<template>
  <q-card>
    <div class="column items-center q-ma-md">
      <div class="col myIndication q-ma-md">
        Select Currency :
      </div>
      <div class="col q-ma-md">
        <q-select v-model="myCurrency" :options="supportedCurrencies" @update:model-value="saveCurrency" style="min-width:100px" ></q-select>
      </div>
    </div>
  </q-card>
</template>

<script setup>
import { LocalStorage } from 'quasar';
import { ref ,defineEmits} from 'vue';
import {getCurrencySymbol,supportedCurrencies} from '../stores/currencies'
var myCurrency=ref(getCurrencySymbol());
const emit=defineEmits(['currency-picked']);
const saveCurrency=function()
{
  LocalStorage.set('currentCurrency',myCurrency.value);
  emit('language-picked');
}
</script>
