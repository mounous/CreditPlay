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
          <q-item-label>{{ event.year + '-' + event.title +' - '+ event.type + ' nouvelle mensualité : '+ event.new_mens}}</q-item-label>
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
    />

    <q-btn
      class="glossy"
      rounded
      color="primary"
      label="supprimer"
      @click="deleteEvents"
    />
    <q-dialog v-model="addeventactive">
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
import { simu } from 'stores/store';
const router = useRouter();
const $q = useQuasar();
var refresh=ref(0);
var addeventactive = ref(false);

const movetocharts = function () {
  router.push('/lineChart');
};

const deleteEvents=function(){
  for(var i=0;i<simu.value.events.length;i++)
  {
    if(simu.value.events[i].selected==true)//all following events will be deleted because they rely on this event
    {
      simu.value.events=simu.value.events.slice(0,i);
      refresh.value++;
      return;
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
