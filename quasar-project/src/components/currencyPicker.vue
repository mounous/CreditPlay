<template>
    <q-card style="background-color: black;">
      <div class="col q-ma-md" style="background-color: black;color: white;">
        <q-select ref="mySelect" v-model="myCurrency" :options="supportedCurrencies" @update:model-value="saveCurrency" @popup-hide="saveCurrency" style="min-width:200px;"   bg-color="black" popup-content-style="background-color:black;" popup-content-class="mySelect"></q-select>
      </div>
  </q-card>
</template>

<script setup>
import { LocalStorage } from 'quasar';
import { ref ,defineEmits,onMounted} from 'vue';
import {supportedCurrencies} from '../stores/currencies'
var mySelect=ref();
const setFocus=function()
{
  mySelect.value.showPopup();
}
onMounted(setFocus);

var myCurrency=ref('');
const emit=defineEmits(['currency-picked']);
const saveCurrency=function()
{
  LocalStorage.set('currentCurrency',myCurrency.value);
  emit('currency-picked');
}

</script>
<style lang="scss">


.mySelect {

  color: white;
  font-size: larger;

}
</style>
