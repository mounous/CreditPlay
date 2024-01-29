<template>
  <q-page>
    <div class="full-height column justify-arround content-center verticalFlex">

  <div class="col">
    <q-list class="bg-primary" separator bordered>
      <q-item
        v-for="event in events"
        :key="event.title"
        clickable
        @click="event.selected = !event.selected"
        v-ripple
      >
        <q-item-section avatar>
          <q-checkbox v-model="event.selected" color="primary"> </q-checkbox>
        </q-item-section>
        <q-item-section>
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
        @save-event="[(addeventactive = false), UpdateEvents($event)]"
      />
    </q-dialog>
    </div>
  </div>
  </div>
  </q-page>
</template>

<script setup>
import {  SessionStorage } from 'quasar';
import { ref } from 'vue';
import SingleEventHandler from '../components/SingleEventHandler.vue';
import { useRouter } from 'vue-router';
const router = useRouter();
var events = [

  ];
if (SessionStorage.has('events')) {
  var events = SessionStorage.getItem('events');
}

var addeventactive = ref(false);

const UpdateEvents = function (events_in) {
  events = events_in;
  router.push('/lineChart');
};

const deleteEvents=function(){
  for(var i=0;i<events.length;i++)
  {
    if(events[i].selected==true)
    {
      events=events.slice(0,i);
      SessionStorage.set('events',events);
      if(i==0)
      {
        SessionStorage.clear('events');
      }
      this.$forceUpdate();
    }
  }
}
</script>
<style lang="scss">
.verticalFlex {
  min-height: inherit;
  min-width: 400px;
}
</style>
