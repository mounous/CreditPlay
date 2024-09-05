<template>

    <div style="display: flex;flex-direction: column;align-items: center;align-content: center;">
      <div style="display: flex;flex: 1;"></div>
      <div style="display: flex;flex-direction: column;flex: 4;justify-content: center;">
         <th class="q-ma-md" style="color: white;font-size:20px;">{{transStr(stringsIDs.str_tuto_bank_1)}}</th>
         <q-list dense>
           <q-item>
             <q-item-section avatar>  <q-icon color="green" name="check" /> </q-item-section>
             <q-item-section> <th  class="q-ma-xs" style="color: white;font-size:15px;">{{transStr(stringsIDs.str_tuto_save_cap_1)}}</th> </q-item-section>
           </q-item>
           <q-item>
             <q-item-section avatar>  <q-icon color="green" name="check" /> </q-item-section>
             <q-item-section> <th  class="q-ma-xs" style="color: white;font-size:15px;">{{transStr(stringsIDs.str_tuto_save_cap_2)}}</th> </q-item-section>
           </q-item>
           <q-item>
             <q-item-section avatar>  <q-icon color="green" name="check" /> </q-item-section>
             <q-item-section> <th  class="q-ma-xs" style="color: white;font-size:15px;">{{transStr(stringsIDs.str_tuto_save_cap_3)}}</th> </q-item-section>
           </q-item>
         </q-list>
        </div>
        <div style="display: flex;flex: 1; justify-content: center;">
          <span  style='color: white; font-size:50px;'>&#8595;</span>
        </div>
        <div style="display: flex;flex-direction: column;flex: 5;justify-content: center;">
         <th class="q-ma-md" style="color: white;font-size:20px;">{{transStr(stringsIDs.str_tuto_save_en_intro)}}</th>
         <q-list dense >
           <q-item>
             <q-item-section avatar>  <q-icon color="green" name="check" /> </q-item-section>
             <q-item-section> <th  class="q-ma-xs" style="color: white;font-size:15px;">{{transStr(stringsIDs.str_tuto_save_en_1)}}</th> </q-item-section>
           </q-item>
           <q-item>
             <q-item-section avatar>  <q-icon color="green" name="check" /> </q-item-section>
             <q-item-section> <th  class="q-ma-xs" style="color: white;font-size:15px;">{{transStr(stringsIDs.str_tuto_save_en_2)}}</th> </q-item-section>
           </q-item>
         </q-list>
        </div>
        <div style="display: flex;flex: 1;">
          <q-btn  class="q-ma-md" label=">>" rounded color="blue-grey-8"></q-btn>
        </div>
        <div style="display: flex;flex: 1;"></div>
    </div>
</template>

<script setup>
import { stringsIDs,transStr } from 'src/stores/languages';


</script>
