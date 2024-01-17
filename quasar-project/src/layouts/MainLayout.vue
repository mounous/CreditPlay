<template>
  <div class="q-pa-md bg-image">
    <q-layout view="lHh Lpr lFf">
      <q-header elevated>
        <q-toolbar>
          <q-btn
            flat
            dense
            round
            icon="menu"
            aria-label="Menu"
            @click="leftDrawerOpen = !leftDrawerOpen"
          />

          <q-toolbar-title> CreditPlay </q-toolbar-title>

          <div>FREE beta version 0.0.1</div>
        </q-toolbar>
      </q-header>

      <q-drawer
        v-model="leftDrawerOpen"
        show-if-above
        :width="200"
        :breakpoint="400"
      >
        <q-scroll-area
          style="
            height: calc(100% - 150px);
            margin-top: 150px;
            border-right: 1px solid #152570;
          "
        >
          <q-list padding>
            <q-item to="/" exact clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="feed" />
              </q-item-section>

              <q-item-section> Situation initiale </q-item-section>
            </q-item>

            <q-item to="/events" exact clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="toc" />
              </q-item-section>

              <q-item-section> Evenements </q-item-section>
            </q-item>

            <q-item to="/summary" exact clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="bar_chart" />
              </q-item-section>

              <q-item-section> Résumé </q-item-section>
            </q-item>

            <q-item to="/help" exact clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="help" />
              </q-item-section>

              <q-item-section> aide </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>

        <q-img
          class="absolute-top"
          src="https://upload.wikimedia.org/wikipedia/commons/1/10/Tursiops_truncatus_01.jpg"
          style="height: 150px"
          fit="fill"
        >
          <div class="absolute-bottom bg-transparent">
            <q-avatar size="56px" class="q-mb-sm">
              <img
                src="https://expernet-campus.re/wp-content/uploads/2021/03/cliches-developpeur-informatique.png"
              />
            </q-avatar>
            <div class="text-weight-bold">Francois Mounous</div>
            <div>@bottineEnNubuck</div>
          </div>
        </q-img>
      </q-drawer>

      <q-page-container>
        <KeepAlive>
          <router-view />
        </KeepAlive>
      </q-page-container>
    </q-layout>
  </div>
</template>

<script setup lang="ts">


import { SessionStorage } from 'quasar';
import { ref } from 'vue';

var leftDrawerOpen = ref(false);

if (!SessionStorage.has('amount')) {
  SessionStorage.set('amount', 176000);
}
if (!SessionStorage.has('taeg')) {
  SessionStorage.set('taeg', 3.25);
}
if (!SessionStorage.has('years')) {
  SessionStorage.set('years', 20);
}
if (!SessionStorage.has('event_nbr')) {
  SessionStorage.set('event_nbr', 0);
}
</script>

<style lang="scss">
.bg-image {
  background: linear-gradient(#cfdce1, #b2b7ee);
}
</style>
