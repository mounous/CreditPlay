<template>
    <div>
      <q-list bordered>
      <q-item v-for="i in capabilities" :key="i" clickable v-ripple>

        <q-item-section>
          <div style="font-size: medium;color: white;">{{transStr(i.id)}}</div>
        </q-item-section>
        <q-item-section>
          <videoPlayer :name=i.vid_id></videoPlayer>
        </q-item-section>
      </q-item>
      </q-list>
    </div>
</template>

<script setup>
import videoPlayer from './videoPlayer.vue';
import { stringsIDs, transStr } from 'src/stores/languages';
import { ref } from 'vue';

const capabilities=ref([
                        {id:stringsIDs.str_cap_modulate_credit,vid_id:stringsIDs.str_modulate_credit},
                        {id:stringsIDs.str_ops_cap_reloan,vid_id:stringsIDs.str_reloan_credit},
                        {id:stringsIDs.str_ops_cap_rebuy,vid_id:stringsIDs.str_rebuy_savings_help},
                         ]);




</script>
