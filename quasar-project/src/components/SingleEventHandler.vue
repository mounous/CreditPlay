<template>
  <q-card style="width: 500px">
    <div>
      <q-carousel
        v-model="slide"
        transition-prev="scale"
        transition-next="scale"
        animated
        swipeable
        control-color="primary"
        class="rounded-borders"
        ref="carouselElement"
      >
        <q-carousel-slide
          name="EvtNameSlide"
          class="column no-wrap flex-center"
        >
          <q-input
            filled
            v-model="event_.title"
            label="Nom de l'évènement"
            hint="exemple : Modulation 1"
            lazy-rules
            :rules="[(val) => validateEvtName(val) || 'Nom par défaut choisi']"
          />
          <div class="q-ma-md">
            <q-btn
              label="Valider"
              @click="[moveToNextSlide(), validateEvtName(event_.title)]"
              color="primary"
            ></q-btn>
          </div>
        </q-carousel-slide>
        <q-carousel-slide
          name="EvtTypeSlide"
          class="column no-wrap flex-center"
        >
          <q-select
            rounded
            outlined
            v-model="event_.type"
            :options="options"
            label="choisir une action"
          />
          <div class="row">
            <div class="q-ma-md">
              <q-select
                class="evtTypeVal"
                rounded
                outlined
                v-model="event_.new_mens"
                :options="options_mens"
                label="choisir une mensualité"
                :disable="
                  event_.type != 'Augmenter mensualité' &&
                  event_.type != 'Réduire mensualité'
                "
                ref="evtTypeValMens"
              ></q-select>
            </div>

            <div class="q-ma-md">
              <q-select
                class="evtTypeVal"
                rounded
                outlined
                v-model="event_.new_dur"
                :options="options_years"
                label="choisir une année de fin"
                :disable="
                  event_.type != 'Augmenter la durée' &&
                  event_.type != 'Réduire la durée'
                "
                ref="evtTypeValYears"
              ></q-select>
            </div>
          </div>
          <div class="row">
            <div class="q-ma-md">
              <q-btn
                label="retour"
                @click="moveToPrevSlide"
                color="primary"
              ></q-btn>
            </div>

            <div class="q-ma-md">
              <q-btn
                label="Valider"
                @click="
                  moveToNextSlide(
                    validateEvtDur(event_) || validateEvtMens(event_)
                  )
                "
                color="primary"
              ></q-btn>
            </div>
          </div>
        </q-carousel-slide>
        <q-carousel-slide
          name="EvtDateSlide"
          class="column no-wrap flex-center"
        >
          <q-select
            class="dateselector"
            rounded
            outlined
            v-model="event_.year"
            :options="years_t"
            label="Année de l'évènement"
            :rules="[(val) => validateEvtYear(val) || 'année invalide']"
          />
          <q-select
            class="dateselector"
            rounded
            outlined
            v-model="event_.month"
            :options="month_t"
            label="Mois de l'évènement"
            :rules="[(val) => validateEvtMonth(val) || 'mois invalide']"
          />
          <div class="row">
            <div class="q-ma-md">
              <q-btn
                label="retour"
                @click="moveToPrevSlide"
                color="primary"
              ></q-btn>
            </div>
            <div class="q-ma-md">
              <q-btn
                label="Valider"
                @click="
                  moveToNextSlide(
                    validateEvtYear(event_.year) &&
                      validateEvtMonth(event_.month)
                  )
                "
                color="primary"
              ></q-btn>
            </div>
          </div>
        </q-carousel-slide>
        <q-carousel-slide
          name="EvtSaveSlide"
          class="column no-wrap flex-center"
        >
          <q-btn label="Valider" @click="sendFinish($q)" color="primary" />
        </q-carousel-slide>
      </q-carousel>
    </div>
  </q-card>
</template>

<script>
import { useQuasar } from "quasar";
import { ref } from "vue";
import { month_names, sortEvents } from "../pages/credit_utility.js";
const default_month_str = "choisir un mois ";
const default_year_str = "choisir une année";
export default {
  name: "SingleEventHandler",
  mounted() {
    this.yearoption();
    this.monthoption();
  },
  setup() {
    const $q = useQuasar();
    return {
      slide: ref("EvtNameSlide"),
      addeventactive: ref(false),
      options_mens: ["900", "1000", "2000"],
      options_years: ["1", "2", "3", "4"],
      options: [
        "Augmenter mensualité",
        "Réduire mensualité",
        "Augmenter la durée",
        "Réduire la durée",
      ],
      month_t: ref(["Janvier"]),
      years_t: ref(["2030"]),
      yearoption() {
        var credit_length = $q.sessionStorage.getItem("years");
        var currentY = new Date().getFullYear();
        this.years_t = [];
        for (let year = currentY + 1; year < currentY + credit_length; year++) {
          this.years_t.push(year.toString());
        }
      },
      monthoption() {
        this.month_t = [];
        for (let m = 0; m < month_names.length; m++) {
          this.month_t.push(month_names[m]);
        }
      },
    };
  },

  data() {
    return {
      event_: {
        title: "",
        type: "Augmenter mensualité",
        year: default_year_str,
        month: default_month_str,
        id: 1,
        selected: true,
        new_mens: -1.0,
        new_dur: "undefined",
      },
      hide_mensuality_change: true,
      hide_duration_change: true,
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
      validateEvtYear(val) {
        if (val == default_year_str) {
          return false;
        }
        return true;
      },
      validateEvtMonth(val) {
        if (val == default_month_str) {
          return false;
        }
        return true;
      },
      saveEventsubmit($q) {
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
    moveToNextSlide(move = true) {
      if (move) {
        this.$refs.carouselElement.next();
      }
    },
    moveToPrevSlide() {
      this.$refs.carouselElement.previous();
    },
  },
};
</script>
<style>
.dateselector {
  min-width: 180px;
}
.evtTypeVal {
  min-width: 180px;
}
</style>
