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
          <q-item-label>{{ event.year + "-" + event.title }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script>
import { useQuasar } from "quasar";
import { ref } from "vue";
import SingleEventHandler from "../components/SingleEventHandler.vue";
import { useRouter } from "vue-router";
export default {
  components: {
    SingleEventHandler,
  },
  mounted() {
    const $q = useQuasar();
    this.events = $q.sessionStorage.getItem("events");
  },
  setup() {
    return {
      addeventactive: ref(false),
    };
  },

  data() {
    return {
      events: [
        {
          title: "",
          type: "",
          year: "",
          month: "",
          id: 1,
          selected: false,
        },
      ],
      UpdateEvents(events_in) {
        this.events = events_in;
        const router = useRouter();
        //router.push("/summary");
      },
    };
  },
};
</script>
