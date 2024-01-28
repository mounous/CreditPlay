<template>
  <q-page class="flex flex center">
    <q-card
      class="my-card text-white"
      style="background: radial-gradient(circle, #35a2ff 0%, #014a88 100%)"
    >
      <q-card-section class="q-pt-none">
        {{ init_credit_String }}
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import {ref} from 'vue'
import { SessionStorage } from 'quasar';
var mensVal = SessionStorage.getItem('mensuality_str').toString();
var total_cost_init=SessionStorage.getItem('total_cost_init');
var init_credit_String = ref('Sans modulation : '+mensVal+' coût total : '+total_cost_init.toString());
</script>
