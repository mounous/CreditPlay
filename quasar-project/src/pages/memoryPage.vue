<template>
  <QPage>
    <q-list class="bg-primary" separator bordered>
      <q-item v-for="item in listSave" :key="item.id" clickable @click="selected_id==item.id ? selected_id=DEFAULT_ID:selected_id = item.id" v-ripple>
        <q-item-section>
          <q-item-label>{{ item.name }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
    <q-btn label="tout supprimer" @click="deleteAllData"></q-btn>
    <q-btn label="Sauvegarder la simulation en cours" @click="saveCurrentData"></q-btn>
    <q-btn label="Supprimer la simulation" @click="deleteData()" :disable="selected_id==DEFAULT_ID"></q-btn>
    <q-btn label="Restaurer la simulation" @click="restoreData()" :disable="selected_id==DEFAULT_ID"></q-btn>
  </QPage>

</template>

<script setup>
import {ref} from 'vue'
import { LocalStorage } from 'quasar';
import { onBeforeMount } from 'vue';
import { bank,simu,startFormFilled } from 'src/stores/store';
import { useRouter } from 'vue-router';
const DEFAULT_ID=-1;
const DEFAULT_NAME='';
var listSave = ref([]);
var selected_id = ref(DEFAULT_ID);
var currentName=ref(DEFAULT_NAME);
const router = useRouter();
const getStorage = function () {
  if (LocalStorage.has('listSave')) {
    listSave.value = LocalStorage.getItem('listSave');
  }
}
const saveCurrentData=function(){
  listSave.value.push({simu : simu.value,bank:bank.value,id:listSave.value.length,name:currentName.value==DEFAULT_NAME ? 'Simulation '+String(listSave.value.length) : currentName.value,startFormFilled:startFormFilled.value});
  LocalStorage.set('listSave',listSave.value);
}
const getSimuIndexInStorage=function(id_in)
{
  var index=-1;
  //get the index in the list of simu
  for(var i=0;i<listSave.value.length;i++)
  {
    if((listSave.value)[i].id==id_in)
    {
      index=i;
      break;
    }
  }
  return index;
}
const restoreData=function(){
  var index=getSimuIndexInStorage(selected_id.value);
  if(index==-1)
  {
    //notify
  }
  else
  {
    simu.value=(listSave.value)[index].simu;
    bank.value=(listSave.value)[index].bank;
    startFormFilled.value=(listSave.value)[index].startFormFilled;
    router.push('/lineChart');
  }
}
const deleteData=function()
{
  var index=getSimuIndexInStorage(selected_id.value);
  if(index==-1)
  {
    //notify
  }
  else
  {
    listSave.value.splice(i,1);
  }
}
const deleteAllData=function(){
  listSave.value=[];
  LocalStorage.set('listSave',listSave.value);
}
onBeforeMount(getStorage);
</script>
