<template>

    <div style="display: flex;flex-direction: column;align-items: center;align-content: center;">


         <th class="q-mt-md q-mb-md" style="color: white;font-size:17px;">{{transStr(stringsIDs.str_tuto_mem_2)}}</th>
         <q-list dense>
           <q-item>
             <q-item-section avatar>  <q-icon color="green" name="check" /> </q-item-section>
             <q-item-section> <th   style="color: white;font-size:15px;text-align: left;">{{transStr(stringsIDs.str_tuto_mem_content_1)}}</th> </q-item-section>
           </q-item>
           <q-item>
             <q-item-section avatar>  <q-icon color="green" name="check" /> </q-item-section>
             <q-item-section> <th  style="color: white;font-size:15px;text-align: left">{{transStr(stringsIDs.str_tuto_mem_content_2)}}</th> </q-item-section>
           </q-item>
           <q-item>
             <q-item-section avatar>  <q-icon color="green" name="check" /> </q-item-section>
             <q-item-section> <th   style="color: white;font-size:15px;text-align: left">{{transStr(stringsIDs.str_tuto_mem_content_3)}}</th> </q-item-section>
           </q-item>
         </q-list>
         <th class="q-ma-md" style="color: white;font-size:17px;">{{transStr(stringsIDs.str_tuto_mem_content_4)}}</th>
        </div>

</template>

<script setup>
import { stringsIDs,transStr } from 'src/stores/languages';


</script>
