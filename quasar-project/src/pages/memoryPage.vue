<template>
  <q-layout>
    <q-page-container>
      <q-page  v-touch-swipe.mouse="handleSwipeExt">
    <div>
    <div>
      <q-list class="bg-primary" separator bordered>
        <q-item v-for="item in listSave" :key="item.id" clickable
          @click="selected_id == item.id ? selected_id = DEFAULT_ID : selected_id = item.id" v-ripple>
          <q-item-section>
            <q-item-label>{{ item.name }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
    <div class="col flex flex center q-ma-md">
      <div>
        <q-btn class="q-ma-md" :label=transStr(stringsIDs.str_btn_delete_all) color="blue-grey-8" @click="deleteAllData"></q-btn>
      </div>
      <div>
        <q-btn class="q-ma-md" :label=transStr(stringsIDs.str_btn_save_current) color="blue-grey-8" @click="mustPopName = true"></q-btn>
      </div>
      <div>
        <q-btn class="q-ma-md" :label=transStr(stringsIDs.str_btn_delete) color="blue-grey-8" @click="deleteData"
        :disable="selected_id == DEFAULT_ID"></q-btn>
      </div>
      <div>
        <q-btn class="q-ma-md" :label=transStr(stringsIDs.str_btn_restore) color="blue-grey-8" @click="restoreData"
        :disable="selected_id == DEFAULT_ID"></q-btn>
      </div>
    </div>
    <div class="col q-ma-md">
      <q-dialog v-model="mustPopName">
        <q-card>
        <div class="q-ma-xl">
          {{ transStr(stringsIDs.str_pop_simu_save_name) }}
        </div>
        <q-input class="q-ma-md" v-model="currentName"></q-input>
        <q-btn class="q-ma-md" :label=transStr(stringsIDs.str_pop_simu_default_name) @click="saveCurrentData"></q-btn>
        <q-btn class="q-ma-md" :label=transStr(stringsIDs.str_pop_simu_custom_name) @click="saveCurrentData"></q-btn>
      </q-card>
      </q-dialog>

    </div>
  </div>
  </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
import { LocalStorage } from 'quasar';
import { onBeforeMount } from 'vue';
import { bank, simu, startFormFilled } from 'src/stores/store';
import { useRouter } from 'vue-router';
import {targetPage} from '../utils/swipe_utils.js'
import { transStr,stringsIDs } from 'src/stores/languages';
const DEFAULT_ID = -1;
const DEFAULT_NAME = '';
var mustPopName = ref(false);
var listSave = ref([]);
var selected_id = ref(DEFAULT_ID);
var currentName = ref(DEFAULT_NAME);
const router = useRouter();
const handleSwipeExt=function ({ evt, touch, mouse, direction, duration, distance })
{
  router.push(targetPage(direction,router.currentRoute.value.fullPath));
}
const saveCurrentData = function () {
  mustPopName.value = false;
  if(bank.value.accounts.length!=0)
  {
    for(var i=0;i<bank.value.accounts.length;i++)
    {
      bank.value.accounts[i].computedOverTime=[];
    }
  }
  listSave.value.push({ simu: simu.value, bank: bank.value, id: listSave.value.length, name: currentName.value == DEFAULT_NAME ? 'Simulation ' + String(listSave.value.length) : currentName.value, startFormFilled: startFormFilled.value });
  LocalStorage.set('listSave', listSave.value);
  currentName.value = DEFAULT_NAME;
}
const getSimuIndexInStorage = function (id_in) {
  var index = -1;
  //get the index in the list of simu
  for (var i = 0; i < listSave.value.length; i++) {
    if ((listSave.value)[i].id == id_in) {
      index = i;
      break;
    }
  }
  return index;
}
const getStorage = function () {
  if (LocalStorage.has('listSave')) {
    listSave.value = LocalStorage.getItem('listSave');
  }
}
const restoreData = function () {
  var index = getSimuIndexInStorage(selected_id.value);
  if (index == -1) {
    //notify
  }
  else {
    simu.value = (listSave.value)[index].simu;
    bank.value = (listSave.value)[index].bank;
    startFormFilled.value = (listSave.value)[index].startFormFilled;
    router.push('/lineChart');
  }
}
const deleteData = function () {
  var index = getSimuIndexInStorage(selected_id.value);
  if (index == -1) {
    //notify
  }
  else {
    if(listSave.value.length>1)
    {
      listSave.value.splice(index, 1);
      LocalStorage.set('listSave', listSave.value);
    }
    else
    {
      deleteAllData();
    }

  }
}
const deleteAllData = function () {
  listSave.value = [];
  LocalStorage.set('listSave', listSave.value);
}
onBeforeMount(getStorage);
</script>
