<template>

  <q-carousel ref="mySioForm" fullscreen animated :arrows="false" :navigation="false" v-model="currentSlide">
    <q-carousel-slide name="sioType" class="bg-grey-9">
      <div class="oneInThreeRowH"></div>
      <div class="oneInThreeRow">
        <div class="column items-center">
          <div class="col myIndication q-ma-md">
            <p>Renseignez le type d'opération expectionelle</p>
          </div>
          <div class="col">
            <q-select bg-color="blue-grey-8" style="width:150px; height:100px"   v-model="_single_io.type" label="type"
            :options="['entrée', 'sortie']"></q-select>
          </div>
          <div class="col">
            <q-btn class="q-ma-xs" color="blue-grey-8" size="xl" label="annuler" @click="emit('sio-aborted')"></q-btn>
            <q-btn class="q-ma-xs" color="blue-grey-8" size="xl" label="suivant" @click="currentSlide = 'sioName'"></q-btn>
          </div>
      </div>
      </div>
      <div class="oneInThreeRowB"></div>
    </q-carousel-slide>
    <q-carousel-slide name="sioName" class="bg-grey-9">
      <div class="oneInThreeRowH"></div>
      <div class="oneInThreeRow">
        <div class="column items-center">
          <div class="col myIndication q-ma-md">
            <p>Renseignez le nom d'opération expectionelle (facultatif)</p>
          </div>
        <div class="col">
          <q-input class="q-mx-xs" label="nom" style="width:150px; height:100px"  maxlength="20" v-model="_single_io.title"
            type="text" bg-color="blue-grey-8" outlined ></q-input>
      </div>
      <div class="col">
      <q-btn class="q-ma-xs" color="blue-grey-8" size="xl" label="précédent" @click="currentSlide = 'sioType'"></q-btn>
      <q-btn  class="q-ma-xs" color="blue-grey-8" size="xl" label="suivant" @click="currentSlide = 'sioAmount'"></q-btn>
    </div>
      </div>
      </div>
      <div class="oneInThreeRowB"></div>
    </q-carousel-slide>
    <q-carousel-slide name="sioAmount" class="bg-grey-9">
      <div class="oneInThreeRowH"></div>
      <div class="oneInThreeRow">
        <div class="column items-center">
          <div class="col myIndication q-ma-md">
            <p>Renseignez le montant de l'opération</p>
          </div>
        <div class="col">
          <q-input class="q-mx-xs" label="montant" style="width:150px; height:100px"  maxlength="8"
            v-model="_single_io.amount" type="number" lazy-rules bg-color="blue-grey-8" outlined ></q-input>
      </div>
      <div class="col">
      <q-btn  class="q-ma-xs" label="précédent" size="xl" color="blue-grey-8" @click="currentSlide = 'sioName'"></q-btn>
      <q-btn class="q-ma-xs" label="valider" size="xl" color="blue-grey-8" @click="currentSlide = 'sioAccount'"></q-btn>
    </div>
      </div>
      </div>
      <div class="oneInThreeRowB"></div>
    </q-carousel-slide>
    <q-carousel-slide name="sioAccount" class="bg-grey-9">
      <div class="oneInThreeRowH"></div>
      <div class="oneInThreeRow">
        <div class="column items-center">
          <div class="col myIndication q-ma-md">
            <p>Renseignez le compte impacté par l'opération</p>
          </div>
        <div class="col">
          <q-select class="q-mx-xs" label="compte" style="width:150px; height:100px"  maxlength="8" v-model="_single_io.account"
            :options="getAccOpt()" bg-color="blue-grey-8" outlined ></q-select>
      </div>
      <div class="col">
      <q-btn  class="q-ma-xs" label="précédent" size="xl" color="blue-grey-8" @click="currentSlide = 'sioAmount'"></q-btn>
      <q-btn class="q-ma-xs" label="valider" size="xl" color="blue-grey-8" @click="currentSlide = 'sioDate'"></q-btn>
    </div>
      </div>
      </div>
      <div class="oneInThreeRowB"></div>
    </q-carousel-slide>
    <q-carousel-slide name="sioDate" class="bg-grey-9">
      <div class="oneInThreeRowH"></div>
      <div class="oneInThreeRow">
        <div class="column items-center">
          <div class="col myIndication q-ma-md">
            <p>Renseignez le compte impacté par l'opération</p>
          </div>
        <div class="col">
          <q-input class="q-ma-md"  style="width:150px; height:100px"  label="date" bg-color="blue-grey-8" filled
            v-model="_single_io.date"  @click="mustpopSingleIO=true" readonly>
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale" v-model="mustpopSingleIO">
                  <q-date dark v-model="singleIODateUnformated" :locale="formatCalendar"
                    :navigation-min-year-month="periodicSaveMin" width="200px"
                    @update:model-value="[_single_io.date=formatDate(singleIODateUnformated), mustpopSingleIO=false]">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
      </div>
      <div class="col">
      <q-btn  class="q-ma-xs" label="précédent" size="xl" color="blue-grey-8" @click="currentSlide = 'sioAccount'"></q-btn>
      <q-btn class="q-ma-xs" label="valider" size="xl" color="blue-grey-8" @click="addElementToSingleIO()"></q-btn>
    </div>
      </div>
      </div>
      <div class="oneInThreeRowB"></div>
    </q-carousel-slide>
  </q-carousel>
  <div class="col">
      <q-dialog v-model="mustPopaddSIO" cover transition-show="scale" transition-hide="scale">
        <q-card>
          <div class="col flex flex center justify-around">
            <div class="q-ma-md">
              Vous êtes sur le point de retirer de l'argent d'un compte impliqué dans le rachart de votre crédit à une date antérieure au Rachat
              Cela supprimera le rachat du crédit si vous confirmez.
            </div>
            <div class="row nowrap">
              <q-btn label="Annuler" @click="mustPopaddSIO = false"></q-btn>
              <q-btn label="Confirmer" @click="[mustPopaddSIO=false,addElementToSingleIO(true)]"></q-btn>
            </div>
          </div>
        </q-card>
      </q-dialog>
    </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue';
import { getAccId ,getAccOpt,isAccountInvolvedInRebuyWithSavings,deleteRebuySavingsEventAndAssociatedInOut, BANK_SEARCH_ERROR} from '../utils/bank_utility';
import { compareDates ,formatDate} from 'src/utils/date_utility';
import { bank,simu } from 'src/stores/store';
import { useQuasar } from 'quasar';
import { formatCalendar } from '../utils/calendar_utility';
const DEFAULT_DATE='';
var singleIODateUnformated=ref(DEFAULT_DATE);
var mustpopSingleIO=ref(false);
var mustPopaddSIO=ref(false);
const $q=useQuasar();
var mySioForm = ref();
var currentSlide = ref('sioType');
const _single_io =ref({account:'',title: '', type:'entrée', amount:0,year:0,month:0,date:'',rate:0});
const emit = defineEmits(['sio-added','sio-aborted']);
const addElementToSingleIO=function(force=false){
  var Y=Number(_single_io.value.date.split('/')[2]);
  var M=Number(_single_io.value.date.split('/')[1]);
  var indexAcc=0;
  if(_single_io.value.date=='')
  {
    $q.notify({    color: 'orange-4',    textColor: 'black',    icon: 'warning',    message: 'Il faut renseigner une date ! Sinon remplir l\'épargne !',  });
    mySioForm.value.goTo('sioDate');
  }
  else if(_single_io.value.amount==0)
  {
    $q.notify({    color: 'orange-4',    textColor: 'black',    icon: 'warning',    message: 'Une entrée ou sortie d\'argent nulle n\'a pas d\'effet',  });
    mySioForm.value.goTo('sioAmount');
  }
  else if(_single_io.value.title=='rachat avec économies' )
  {
    $q.notify({    color: 'orange-4',    textColor: 'black',    icon: 'warning',    message: 'Ce nom est réservé. Choisir un autre nom',  });
    mySioForm.value.goTo('sioName');
  }
  else
  {
    indexAcc=getAccId(_single_io.value.account);
    if(BANK_SEARCH_ERROR==indexAcc)
    {
      $q.notify({    color: 'orange-4',    textColor: 'black',    icon: 'warning',    message: 'compte de rattachement non trouvé',  });
      mySioForm.value.goTo('sioAccount');
      return;
    }
    if(!force)
    {
      var indexOfrebuy=simu.value.events.length-1;
      var y_rebuy =simu.value.events[indexOfrebuy].year;
      var m_rebuy =simu.value.events[indexOfrebuy].month;
      //warn user in case of removing some money of an account involved in savings if the withdrawal is anterior to rebuy date
      if(isAccountInvolvedInRebuyWithSavings(indexAcc) && _single_io.value.type=='sortie' && compareDates(y_rebuy,m_rebuy,Y,M)>=0)
      {
        mustPopaddSIO.value=true;
        return;
      }
    }
    if(force)//delete the rebuy with savings event, delete all single io linked to this event
    {
      deleteRebuySavingsEventAndAssociatedInOut();
    }
    bank.value.accounts[indexAcc].single_in_out.push({account:_single_io.value.account,title:_single_io.value.title,type:_single_io.value.type,amount:Number(_single_io.value.amount),date:_single_io.value.date,month:M,year:Y});
    _single_io.value.title='';_single_io.value.amount=0;_single_io.value.type='entrée';_single_io.value.date='';_single_io.value.account='';
    emit('sio-added');
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
