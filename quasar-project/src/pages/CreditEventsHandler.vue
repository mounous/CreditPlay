<template>
  <q-page>
    <q-btn
      class="glossy"
      rounded
      color="blue"
      label="Ajouter"
      @click="addeventactive = true"
    />
    <q-dialog v-model="addeventactive">
      <!--https://v0-14.quasar-framework.org/components/building-reusable-components.html-->
      <SingleEventHandler
        @save-event="[(addeventactive = false), UpdateEvents($event)]"
      />
    </q-dialog>
    <q-list class="bg-white" separator bordered>
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
          <q-item-label>{{ event.year + '-' + event.title }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
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
  router.push('/summary');
};
</script>
