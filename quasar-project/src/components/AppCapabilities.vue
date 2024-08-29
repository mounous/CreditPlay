<template>
    <div class="q-pa-md" >
      <q-list bordered>
      <q-item v-for="i in capabilities" :key="i" clickable v-ripple>
        <q-item-section avatar v-if="i.ok==true">
          <q-icon color="green" name="check" />
        </q-item-section>
        <q-item-section avatar v-if="i.ok==false">
          <q-icon color="red" name="close" />
        </q-item-section>

        <q-item-section>
          <div style="font-size: x-large;">{{i.text}}</div>
        </q-item-section>
      </q-item>
      </q-list>
    </div>
</template>

<script setup>
import { stringsIDs, transStr } from 'src/stores/languages';
import { ref } from 'vue';
const capabilities=ref([ {ok:true,text:transStr(stringsIDs.str_cap_simulate_credit)},
                        {ok:true,text:transStr(stringsIDs.str_cap_modulate_credit)},
                        {ok:true,text:transStr(stringsIDs.str_cap_rebuy)},
                        {ok:true,text:transStr(stringsIDs.str_cap_savings_simu)},
                        {ok:false,text:transStr(stringsIDs.str_cap_coffee)} ]);

</script>
