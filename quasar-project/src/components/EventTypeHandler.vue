<template>
  <q-select
    rounded
    outlined
    v-model="Evttype"
    :options="options"
    label="choisir une action"
  />
  <div class="row">
    <div class="q-ma-md">
      <q-select
        class="evtTypeVal"
        rounded
        outlined
        v-model="new_mens"
        :options="options_mens"
        label="choisir une mensualité"
        :disable="
          Evttype != 'Augmenter mensualité' && Evttype != 'Réduire mensualité'
        "
        ref="evtTypeValMens"
      ></q-select>
    </div>

    <div class="q-ma-md">
      <q-select
        class="evtTypeVal"
        rounded
        outlined
        v-model="new_dur"
        :options="options_years"
        label="choisir une année de fin"
        :disable="
          Evttype != 'Augmenter la durée' && Evttype != 'Réduire la durée'
        "
        ref="evtTypeValYears"
      ></q-select>
    </div>
  </div>
  <div class="row">
    <div class="q-ma-md">
      <q-btn label="retour" @click="moveToPrevSlide" color="primary"></q-btn>
    </div>

    <div class="q-ma-md">
      <q-btn
        label="Valider"
        @click="
          moveToNextSlide(validateEvtDur(event_) || validateEvtMens(event_))
        "
        color="primary"
      ></q-btn>
    </div>
  </div>
</template>

<script>
import { useQuasar } from "quasar";

export default {
  name: "EventTypeHandler",
  mounted() {
    //init
  },
  setup() {
    const $q = useQuasar();
    return {
      options_mens: ["900", "1000", "2000"],
      options_years: ["1", "2", "3", "4"],
      options: [
        "Augmenter mensualité",
        "Réduire mensualité",
        "Augmenter la durée",
        "Réduire la durée",
      ],
    };
  },

  data() {
    return {
      validateEvtName(nom) {
        this.slide = "EvtTypeSlide";
        if (nom.length == 0) {
          this.event_["title"] = "Modulation";
        } else {
          this.event_["title"] = nom;
        }
        return true;
      },

      validateEvtMens(event_in) {
        if (
          (event_in.type == "Augmenter mensualité" ||
            event_in.type == "Réduire mensualité") &&
          event_in.new_mens != -1.0
        ) {
          return true;
        }
        return false;
      },
      validateEvtDur(event_in) {
        if (
          (event_in.type == "Augmenter la durée" ||
            event_in.type == "Réduire la durée") &&
          event_in.new_dur != "undefined"
        ) {
          return true;
        }
        return false;
      },

      saveEventTypesubmit($q) {
        console.log("saveEventsubmit");
        //const $q = useQuasar();
        if (!$q.sessionStorage.has("events")) {
          //first event registered
          var events = [this.event_];
        } else {
          var events = $q.sessionStorage.getItem("events");
          events.push(this.event_);
        }
        $q.sessionStorage.set("events", sortEvents(events));
        console.log("saveEventsubmitEnd");
        return events;
      },
    };
  },
  methods: {
    sendFinish($q) {
      this.$emit("save-event", this.saveEventsubmit($q));
    },
  },
};
</script>
<style>
.evtTypeVal {
  min-width: 180px;
}
</style>
