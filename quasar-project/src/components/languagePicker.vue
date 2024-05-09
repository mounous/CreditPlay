<template>
  <q-card>
    <div class="column items-center q-ma-md">
      <div class="col myIndication q-ma-md">
        Select language :
      </div>
      <div class="col q-ma-md">
        <q-select v-model="myLang" :options="supportedLanguages" @update:model-value="saveLanguage" style="min-width:100px" ></q-select>
      </div>
    </div>
  </q-card>
</template>

<script setup>
import {supportedLanguages,is_sio_special_name,transMonthName,getMonthNbr} from '../stores/languages'
import { LocalStorage } from 'quasar';
import { bank, simu, startFormFilled } from 'src/stores/store';
import { apply_events_chain, computeCredit_init } from 'src/utils/credit_utility';
import { ref ,defineEmits} from 'vue';

var myLang=ref(LocalStorage.has('currentLanguage') ? LocalStorage.getItem('currentLanguage') : 'Français');
const emit=defineEmits(['language-picked']);
const saveLanguage=function()
{
  LocalStorage.set('currentLanguage',myLang.value);
  //translate events month names as they are displayed and used in computation of apply_events_chain
  for(let i=0;i<simu.value.events.length;i++)
  {
    simu.value.events[i].month_str=transMonthName(getMonthNbr(simu.value.events[i].month_str));
  }
  if(startFormFilled.value==true)
  {
    //apply language switching to the special sio : remove
    for(let i=0;i<bank.value.accounts.length;i++)
    {
      for(let sio=0;sio<bank.value.accounts[i].single_in_out.length;sio++)
      {
        if(is_sio_special_name(bank.value.accounts[i].single_in_out[sio].title))
        {
          //remove "rebuy with savings sio" as it will be re-created by apply_events_chain
          bank.value.accounts[i].single_in_out.splice(sio,1);
        }
      }
    }
    //recompute to have everything switched to desired language
    computeCredit_init();
    apply_events_chain();

  }
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
