<template>
  <div style="display: flex;flex-direction: column;align-items: center;align-content: center;justify-items: center;justify-content: center;width: 100;height: 100%;">
    <q-card style="background-color: black;">
      <div class="col q-ma-md" style="background-color: black;color: white;">
        <q-select bordered  filled label-color="white" :label="labelCur" ref="mySelect" v-model="myCurrency" :options="completeCurrencies" @update:model-value="saveCurrency" @popup-hide="saveCurrency" style="min-width:200px;"   bg-color="black" popup-content-style="background-color:black;" popup-content-class="mySelect">
          <template v-slot:prepend>
            <q-icon name="payments" color="white" @click.stop.prevent />
          </template>
        </q-select>
      </div>
    </q-card>
  </div>
</template>

<script setup>
import { LocalStorage } from 'quasar';
import { ref ,defineEmits,onMounted} from 'vue';
import {supportedCurrencies,currencyNames} from '../stores/currencies'
import {transStr,stringsIDs} from '../stores/languages'
var labelCur=ref(LocalStorage.has('currentCurrency')?LocalStorage.getItem('currentCurrency'):transStr(stringsIDs.str_choose_curr) );
var completeCurrencies=ref([]);
const formatOptions=function()
{
  for(var i=0;i<supportedCurrencies.length;i++)
  {
    completeCurrencies.value[i]=supportedCurrencies[i]+' - '+currencyNames[i];
  }
}
var mySelect=ref();
const init=function()
{
  formatOptions();
  mySelect.value.showPopup();
}

onMounted(init);

var myCurrency=ref('');
const emit=defineEmits(['currency-picked']);
const saveCurrency=function()
{
  if(myCurrency.value!='')
  {
    LocalStorage.set('currentCurrency',myCurrency.value);
    emit('currency-picked');
  }
}

</script>
<style lang="scss">


.mySelect {

  color: white;
  font-size: larger;

}
</style>
