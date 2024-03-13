<template>
  <creditChart></creditChart>
  <q-dialog v-model="mustPop">
    <q-card>
      <div class="col flex flex-center">
        Aucun crédit n'a été renseigné, mais certaines économies oui. Sélectionnez les dates d'affichage des économies.
        <q-input class="q-mx-xs" dense style="max-width:100px" label="A partir de" bg-color="blue-grey-8" filled
          v-model="startGraphDate" mask="date">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date dark v-model="startGraphDate" :locale="formatCalendar" :navigation-min-year-month="graphMinDate"
                  width="200px" :navigation-max-year-month="graphMaxDate">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <q-input class="q-mx-xs" dense style="max-width: 100px;" label="jusqu'à  " bg-color="blue-grey-8" filled
          v-model="endGraphDate" mask="date">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date dark v-model="endGraphDate" :locale="formatCalendar" :navigation-min-year-month="graphMinDate"
                  width="200px" :navigation-max-year-month="graphMaxDate">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      <q-btn label="valider" dense @click="sendSavingComputationOrder,(mustPop=false)"></q-btn>
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { bank, startFormFilled } from 'stores/store'
import creditChart from 'src/components/creditChart.vue'
import { formatCalendar } from './calendar_utility';
import { onBeforeMount, ref } from 'vue';
var mustPop = ref(false)
var startGraphDate = ref('');
var endGraphDate = ref('');
var graphMinDate = ref('1900/01');
var graphMaxDate = ref('2100/01');
const sendSavingComputationOrder=function()
{
  var startY=Number(startGraphDate.value.split('/')[0]);
  var startM=Number(startGraphDate.value.split('/')[1]);
  var endY=Number(startGraphDate.value.split('/')[0]);
  var endM=Number(startGraphDate.value.split('/')[1]);
}
const getPopObligation = function () {
  if ((bank.value.savings.length != 0 || bank.value.periodic_savings.length != 0 || bank.value.single_in_out.length != 0) && (startFormFilled != true)) {
    mustPop.value = true;
  }
  else {
    mustPop.value = false;
  }
}
onBeforeMount(getPopObligation);
</script>
