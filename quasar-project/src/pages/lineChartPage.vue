<template>
  <creditChart></creditChart>
  <q-dialog v-model="mustPop">
    <q-card>
      <div class="q-ma-xl col flex flex-center">
        Aucun crédit n'a été renseigné, mais certaines économies oui. Les premières économies ont été renseignées pour le {{ graphMinDate }}. Sur combien d'anées afficher les économies ?
        <q-select v-model="nbYearDisplaySavings" dense bg-color="blue-grey-8" :options="optionYears" @update:model-value="sendSavingComputationOrder"></q-select>
        </div>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { bank, startFormFilled } from 'stores/store'
import creditChart from 'src/components/creditChart.vue'
import { onBeforeMount, ref } from 'vue';
import {getSavingsEarlier,computeDisplaySavings} from './bank_utility'
var mustPop = ref(false)
var optionYears=ref([]);
var nbYearDisplaySavings=ref('0');
var graphMinDate = ref('1900/01');
const sendSavingComputationOrder=function()
{
  mustPop.value=false;
  computeDisplaySavings(getSavingsEarlier()[1],getSavingsEarlier()[0],Number(nbYearDisplaySavings.value));
}
const getoptionSavingGraphDisplayY=function()
{
  var toreturn=[];
  for(var i=0;i<100;i++)
  {
    toreturn.push(i.toString());
  }
  return toreturn;
}
const getPopObligation = function () {
  if ((bank.value.savings.length != 0 || bank.value.periodic_savings.length != 0 || bank.value.single_in_out.length != 0) && (startFormFilled != true)) {
    mustPop.value = true;
    graphMinDate.value=getSavingsEarlier()[1].toString()+'/'+getSavingsEarlier()[0].toString();
    optionYears.value=getoptionSavingGraphDisplayY();
  }
  else {
    mustPop.value = false;
  }
}
onBeforeMount(getPopObligation);
</script>
