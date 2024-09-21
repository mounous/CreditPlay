<template>
    <div  >
      <div class="q-mt-md"  style="display: flex;flex-direction: column;align-items: center;align-content: center;justify-content:center;justify-items:center">
        <th class="q-ma-md text-center" style="color: white;font-size:20px;">{{transStr(stringsIDs.str_tuto_process_4)}}</th>
      </div>
      <q-list bordered :key="capabilities.length">
      <q-item v-for="i in capabilities" :key="i" clickable v-ripple>
        <q-item-section avatar v-if="i.ok==true">
          <q-icon color="green" name="check" />
        </q-item-section>
        <q-item-section avatar v-if="i.ok==false">
          <q-icon color="red" name="close" />
        </q-item-section>

        <q-item-section>
          <div  style=" text-align: left; font-size: 22px;color: white;">{{transStr(i.id)}}</div>
          </q-item-section>

      </q-item>
      </q-list>
    </div>
</template>

<script setup>
import { stringsIDs, transStr } from 'src/stores/languages';
import { ref,onMounted } from 'vue';
const capabilities=ref([]);
const capabilities_ref=ref([{ok:true,id:stringsIDs.str_cap_simulate_credit},
                        {ok:true,id:stringsIDs.str_cap_modulate_credit},
                        {ok:true,id:stringsIDs.str_cap_rebuy},
                        {ok:true,id:stringsIDs.str_cap_savings_simu},
                        {ok:false,id:stringsIDs.str_cap_coffee}
                         ]);
const addOneElement=function()
{
  if(capabilities.value.length!=capabilities_ref.value.length)
  {
    capabilities.value.push(capabilities_ref.value[capabilities.value.length]);

  }
}

const launchAnimation=function()
{
  setInterval(addOneElement,900);
}
onMounted(launchAnimation);


</script>
