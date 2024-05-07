<template>

  <q-carousel ref="myPSForm" fullscreen animated :arrows="false" :navigation="false" v-model="currentSlide">
    <q-carousel-slide name="psType" class="bg-grey-9">
      <div class="oneInThreeRowH"></div>
      <div class="oneInThreeRow">
        <div class="column items-center">
          <div class="col myIndication q-ma-md">
            <p>Choisir le type d'opération</p>
          </div>
        <div class="col">
          <q-select bg-color="blue-grey-8" style="width:150px; height:100px" v-model="typeSavings" label="type"
            :options="[transoptSaveP(BANK_SAVE_TYPE_MONTHLY), transoptSaveP(BANK_SAVE_TYPE_YEARLY)]"></q-select>
        </div>
        <div class="col">
          <q-btn class="q-ma-xs" color="blue-grey-8" label="annuler" size='xl' @click="emit('ps-aborted')"></q-btn>
          <q-btn class="q-ma-xs" color="blue-grey-8" label="suivant" size='xl' @click="currentSlide = 'psAmount'"></q-btn>
        </div>
      </div>
      </div>
      <div class="oneInThreeRowB"></div>
    </q-carousel-slide>
    <q-carousel-slide name="psAmount" class="bg-grey-9">
      <div class="oneInThreeRowH"></div>
      <div class="oneInThreeRow">
        <div class="column items-center">
          <div class="col myIndication q-ma-md">
            <p>Saisir le montant de l'opération</p>
          </div>
        <div class="col">
          <q-input class="q-mx-xs" label="montant" style="max-width:300px; height:100px" maxlength="8" v-model="_savingP.amount"
            type="number" lazy-rules :rules="[(val) => (val >= 0.0) || 'Les retraits ne sont pas gérées']"
            bg-color="blue-grey-8" outlined ></q-input>
        </div>
        <div class="col">
          <q-btn class="q-ma-xs" color="blue-grey-8" label="précédent" size='xl' @click="currentSlide = 'psType'"></q-btn>
          <q-btn class="q-ma-xs" color="blue-grey-8" label="suivant" size='xl' @click="currentSlide = 'psAccount'"></q-btn>
        </div>
      </div>
      </div>
      <div class="oneInThreeRowB"></div>
    </q-carousel-slide>
    <q-carousel-slide name="psAccount" class="bg-grey-9">
      <div class="oneInThreeRowH"></div>
      <div class="oneInThreeRow">
        <div class="column items-center">
          <div class="col myIndication q-ma-md">
            <p>Saisir le compte impacté par l'opération</p>
          </div>
        <div class="col">
          <q-select class="q-mx-xs" label="compte"  style="width:150px; height:100px" maxlength="8" v-model="_savingP.account"
            :options="getAccOpt()" type="number" bg-color="blue-grey-8" outlined ></q-select>
        </div>
        <div class="col">
          <q-btn class="q-ma-xs" label="précédent" color="blue-grey-8" size='xl' @click="currentSlide = 'psAmount'"></q-btn>
          <q-btn class="q-ma-xs" label="suivant" color="blue-grey-8" size='xl' @click="currentSlide = 'psfromTo'"></q-btn>
        </div>
      </div>
      </div>
      <div class="oneInThreeRowB"></div>
    </q-carousel-slide>

    <q-carousel-slide name="psfromTo" class="bg-grey-9">
      <div class="oneInThreeRowH"></div>
      <div class="oneInThreeRow">
        <div class="column items-center">
          <div class="col myIndication q-ma-md">
            <p>Saisir la date de la première opération periodique</p>
          </div>
        <div class="col">
          <q-input class="q-mx-xs"  style="width:150px; height:100px" label="A partir de" bg-color="blue-grey-8" filled
            v-model="_savingP.startingDate" @click="mustpopPsStart = true" readonly>
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale" v-model="mustpopPsStart">
                  <q-date dark v-model="savingPstartingDateUnformated" :locale="formatCalendar"
                    :navigation-min-year-month="periodicSaveMin" width="200px"
                    :navigation-max-year-month="periodicSaveMax"
                    @update:model-value="[_savingP.startingDate = formatDate(savingPstartingDateUnformated), mustpopPsStart = false]">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Fermer" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          </div>
          <div class="col myIndication q-ma-md">
            <p>(Facultatif) Saisir la date de la dernière opération periodique. L'opération sera considérée infinite si non saisie.</p>
          </div>
        <div class="col">
          <q-input class="q-mx-xs"  style="width:150px; height:100px" label="jusqu'à  " bg-color="blue-grey-8" filled
            v-model="_savingP.endDate" @click="mustpopPsEnd = true" readonly>
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale" v-model="mustpopPsEnd">
                  <q-date dark v-model="savingPendDateUnformated" :locale="formatCalendar"
                    :navigation-min-year-month="periodicSaveMin" width="200px"
                    :navigation-max-year-month="periodicSaveMax"
                    @update:model-value="[_savingP.endDate = formatDate(savingPendDateUnformated), mustpopPsEnd = false]">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Fermer" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div class="col">
          <q-btn class="q-ma-xs" label="précédent" color="blue-grey-8" size='xl'  @click="currentSlide = 'psAccount'"></q-btn>
          <q-btn class="q-ma-xs" label="valider" color="blue-grey-8" size='xl' @click="addElementToSavingsP()"></q-btn>
        </div>
      </div>
      </div>
      <div class="oneInThreeRowB"></div>
    </q-carousel-slide>
  </q-carousel>

</template>

<script setup>
import { ref, defineEmits } from 'vue';
import { bank } from 'src/stores/store';
import { useQuasar } from 'quasar';
import { getAccId, getAccOpt,BANK_SEARCH_ERROR,BANK_SAVE_TYPE_MONTHLY,BANK_SAVE_TYPE_YEARLY } from 'src/utils/bank_utility';
import { formatDate } from 'src/utils/date_utility';
import { formatCalendar } from 'src/utils/calendar_utility';
import {getOptSavePFromStr,transoptSaveP} from '../stores/languages'
const $q = useQuasar();
var myPSForm = ref();
var currentSlide = ref('psType');
const _savingP = ref({ account: '', amount: 0.0, rate: 0.0, startMonth: 0, startYear: 0, endMonth: 0, endYear: 0, type: BANK_SAVE_TYPE_MONTHLY, startingDate: '', endDate: '' });
var periodicSaveMax = ref('2100/01');
var mustpopPsStart = ref(false);
var mustpopPsEnd = ref(false);
const DEFAULT_DATE = '';
var savingPstartingDateUnformated = ref(DEFAULT_DATE);
var savingPendDateUnformated = ref(DEFAULT_DATE);
var limitMonth = new Date().getFullYear().toString();
var limitYear = (new Date().getMonth() + 1).toString().padStart(2, '0');
var periodicSaveMin = ref(limitMonth + '/' + limitYear);
const emit = defineEmits(['ps-added', 'ps-aborted']);
var typeSavings=ref();

const addElementToSavingsP = function () {
  var indexAcc = 0;
  var startY = Number(_savingP.value.startingDate.split('/')[2]);
  var endY = 0
  var startM = Number(_savingP.value.startingDate.split('/')[1]);
  var endM = 0;
  if (DEFAULT_DATE != _savingP.value.endDate) {
    endY = Number(_savingP.value.endDate.split('/')[2]);
    endM = Number(_savingP.value.endDate.split('/')[1]);
  }
  if (_savingP.value.startingDate == '') {
    $q.notify({ color: 'orange-4', textColor: 'black', icon: 'warning', message: 'Il faut renseigner une date de départ', });
    myPSForm.value.goTo('psfromTo');
  }
  else if (_savingP.value.amount == 0) {
    $q.notify({ color: 'orange-4', textColor: 'black', icon: 'warning', message: 'Une épargne périodique de 0€ ne va rien rapporter', });
    myPSForm.value.goTo('psAmount');
  }
  else if (_savingP.value.amount < 0) {
    $q.notify({ color: 'orange-4', textColor: 'black', icon: 'warning', message: 'Une épargne négative n\'est pas un épargne', });
    myPSForm.value.goTo('psAmount');
  }
  else {
    indexAcc = getAccId(_savingP.value.account);
    if (BANK_SEARCH_ERROR == indexAcc) {
      $q.notify({ color: 'orange-4', textColor: 'black', icon: 'warning', message: 'compte de rattachement non trouvé', });
      myPSForm.value.goTo('psAccount');
      return;
    }
    if(BANK_SAVE_TYPE_MONTHLY==getOptSavePFromStr(typeSavings.value))
    {
      _savingP.value.type=BANK_SAVE_TYPE_MONTHLY;
    }
    else
    {
      _savingP.value.type=BANK_SAVE_TYPE_YEARLY;
    }
    bank.value.accounts[indexAcc].periodic_savings.push({ amount: Number(_savingP.value.amount), account: _savingP.value.account, type: _savingP.value.type, startMonth: startM, startYear: startY, endMonth: endM, endYear: endY });
    _savingP.value.amount = 0.0; _savingP.value.account = ''; _savingP.value.startMonth = 0; _savingP.value.startYear = 0; _savingP.value.endMonth = 0, _savingP.value.endYear = 0; _savingP.value.type = BANK_SAVE_TYPE_MONTHLY; _savingP.value.startingDate = DEFAULT_DATE; _savingP.value.endDate = DEFAULT_DATE;
    emit('ps-added');
  }

}
</script>


<style lang="scss">
.myIndication {
  font-size: 20px;
}
.oneInThreeRowH{
  width: 100%;
  height: 20%;
}
.oneInThreeRow{
  width: 100%;
  height: 50%;
}
.oneInThreeRowB{
  width: 100%;
  height: 30%;
}
</style>
