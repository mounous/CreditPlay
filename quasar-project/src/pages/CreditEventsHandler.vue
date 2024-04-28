<template>
  <q-page>
    <div class="full-height column justify-arround content-center verticalFlex">

  <div class="col" :key="refresh">
    <q-list class="bg-primary" separator bordered>
      <q-item
        v-for="event in simu.events"
        :key="event.title"
        clickable
        @click="[event.selected = !event.selected,refresh++,propagateSelection(event)]"
        v-ripple
      >
        <q-item-section avatar>
          <q-checkbox v-model="event.selected" color="primary"  @click="[refresh++,propagateSelection(event)]"> </q-checkbox>
        </q-item-section>
        <q-item-section :key="refresh">
          <q-item-label v-if="event.metaType=='Modulation' && event.type==optionsEvtType[1]">{{ event.month+'/'+event.year + ' - ' +event.title  +' (Augmentation de la mensualité : '+ event.new_mens+'€)'}}</q-item-label>
          <q-item-label v-if="event.metaType=='Modulation' && event.type==optionsEvtType[0]">{{ event.month+'/'+event.year + ' - ' +event.title  +' (Réduction de la mensualité : '+ event.new_mens+'€)'}}</q-item-label>
          <q-item-label v-if="event.metaType=='Rachat' && event.type==optionsReBuyType[0]">{{ event.month+'/'+event.year + ' - Rachat du capital restant dû avec épargne'}}</q-item-label>
          <q-item-label v-if="event.metaType=='Rachat' && event.type==optionsReBuyType[1]">{{ event.month+'/'+event.year + ' - Rachat du capital restant dû à crédit (taux : '+event.reloanRate+'%)'}}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
    </div>
    <div class ="col column content-center">
      <div class="col">
    <q-btn
      class="glossy"
      rounded
      color="primary"
      label="Ajouter"
      @click="addeventactive = true"
      :disable="hasBeenRebougthSavings()"
    />

    <q-btn
      class="glossy"
      rounded
      color="primary"
      label="supprimer"
      @click="deleteEvents"
      :disable="simu.events.length==0"
    />
    <q-dialog full-width v-model="addeventactive">

      <!--https://v0-14.quasar-framework.org/components/building-reusable-components.html-->
      <SingleEventHandler
        @save-event="[(addeventactive = false), movetocharts()]"
      />
    </q-dialog>
    </div>
  </div>
  </div>
  </q-page>
</template>

<script setup>
import {   useQuasar } from 'quasar';
import { ref } from 'vue';
import SingleEventHandler from '../components/SingleEventHandler.vue';
import { useRouter } from 'vue-router';
import { bank, simu } from 'stores/store';
import {hasBeenRebougthSavings,optionsEvtType} from '../utils/credit_utility'
import { optionsReBuyType } from '../utils/bank_utility';
const router = useRouter();
const $q = useQuasar();
var refresh=ref(0);
var addeventactive = ref(false);

const movetocharts = function () {
  router.push('/lineChart');
};

const deleteEvents=function(){
  for(var i=simu.value.events.length-1;i>=0;i--)
  {
    if(simu.value.events[i].selected==true)//all following events will be deleted because they rely on this event
    {
      //delete fake single_io if rebought credit with savings
      if(simu.value.events[i].type==optionsReBuyType[0])
      {
        for(var j=0;j<bank.value.single_in_out.length;j++)
        {
          if(bank.value.single_in_out[j].title=='rachat avec économies')
          {
            bank.value.single_in_out.splice(j,1);
            simu.value.credit.has_been_rebougth=false;
            break;
          }
        }
      }
      simu.value.events.splice(i,1);
      refresh.value++;
      //if an event has been deleted, the last event has been deleted. if the credit was rebougth with savings, it was the last event
      simu.value.credit.has_been_rebougth=false;
    }
  }
}
//we don't want users to select base event for delete if subsequent events are not select
const propagateSelection=function (event_in){
  var i=0;var hasToNotify=false;
  //find current event
  while(i<simu.value.events.length)
  {
    if(simu.value.events[i]==event_in) {break; }
    i++;
  }
  if(i==simu.value.events.length) { return; }
  i++;//go to next element
  if(event_in.selected==false)//protection
  {
    for(var j=0;j<i;j++)
    {
      if(simu.value.events[j].selected==true)
      {
        $q.notify({    color: 'orange-4',    textColor: 'black',    icon: 'warning',    message: 'impossible de déselectionner des évènements dépendant d\'évènements sélectionés',  });
        simu.value.events[i-1].selected=true;
        refresh.value++;
        return;
      }
    }
  }
  while(i<simu.value.events.length) { simu.value.events[i].selected=event_in.selected; i++;hasToNotify=true; }

  if(hasToNotify && event_in.selected)  {   $q.notify({    color: 'green-4',    textColor: 'black',    icon: 'cloud_done',    message: 'évènements dépendants aussi sélectionnés',  });  }
  if(hasToNotify && !event_in.selected)  {   $q.notify({    color: 'green-4',    textColor: 'black',    icon: 'cloud_done',    message: 'évènements dépendants aussi désélectionnés',  });  }
  refresh.value++;
}
</script>
<style lang="scss">
.verticalFlex {
  min-height: inherit;
  min-width: 400px;
}
</style>
