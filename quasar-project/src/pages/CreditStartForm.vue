<template>
  <q-page class="bg-white column">
    <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md">
      <q-input
        filled
        type="number"
        v-model="amount_l"
        label="Somme empruntée"
        hint="pas d'unité, pas de virgule"
        lazy-rules
        :rules="[
          (val) => validateAmount(val) || 'Merci de renseigner la somme',
        ]"
      />

      <q-input
        filled
        label="TAEG"
        type="number"
        step="any"
        v-model="taeg_l"
        lazy-rules
        :rules="[(val) => validateTAEG(val) || 'Ce TAEG semble irréel']"
      />

      <q-input
        filled
        type="number"
        v-model="years_l"
        label="Durée d'emprunt"
        lazy-rules
        :rules="[
          (val) =>
            validateYears(val) || 'Merci de renseigner la durée en année',
        ]"
      />

      <div>
        <q-btn label="Submit" type="submit" color="primary" />
        <q-btn
          label="Reset"
          type="reset"
          color="primary"
          flat
          class="q-ml-sm"
        />
      </div>
    </q-form>
  </q-page>
</template>

<script>
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";
import { ref } from "vue";
import { computeMensuality, computeCredit } from "./credit_utility.js";
export default {
  setup() {
    const $q = useQuasar();
    const router = useRouter();

    return {
      amount_l: ref($q.sessionStorage.getItem("amount")),
      years_l: ref($q.sessionStorage.getItem("years")),
      taeg_l: ref($q.sessionStorage.getItem("taeg")),
      validateTAEG(taeg) {
        $q.sessionStorage.set("taeg", taeg);
        const taeg_lu = $q.sessionStorage.getItem("taeg");
        return taeg_lu == taeg;
      },
      validateYears(years) {
        $q.sessionStorage.set("years", years);
        const years_lu = $q.sessionStorage.getItem("years");
        return years_lu == years;
      },
      validateAmount(amount) {
        $q.sessionStorage.set("amount", amount);
        const amount_lu = $q.sessionStorage.getItem("amount");
        return amount_lu == amount;
      },
      onSubmit() {
        computeMensuality($q);
        computeCredit($q);
        $q.notify({
          color: "green-4",
          textColor: "white",
          icon: "cloud_done",
          message: "Submitted",
        });
        router.push("/summary");
      },

      onReset() {
        years_l.value = 0;
        taeg_l.value = 0;
        amount_l.value = 0;
        accept.value = false;
      },
    };
  },
};
</script>
