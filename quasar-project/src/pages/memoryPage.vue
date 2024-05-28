<template>
  <q-page v-touch-swipe.mouse.left.right="handleSwipeExt" style="display: flex; ">

    <div
      style="flex-direction: column;width: 100%;">
      <div class="col q-mt-md" style="height: 60%;">

        <q-scroll-area style="height:100%;">
          <q-list class="bg-primary q-ma-md" separator bordered>
            <q-item v-for="item in listSave" :key="item.id" clickable
              @click="selected_id == item.id ? selected_id = DEFAULT_ID : selected_id = item.id" v-ripple
              :active="selected_id == item.id" active-class="bg-blue-grey-8 text-black">
              <q-item-section>
                <q-item-label no-wrap="false" style="font-weight: bold;"> {{ item.name}} </q-item-label >
                <q-item-label no-wrap="false"> {{ item.date}} </q-item-label >
              </q-item-section>
              <q-item-section avatar>
                <q-btn style="width:20px" icon="delete_forever" @click="deleteData(item.id)"></q-btn>
              </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
      </div>
      <div class="col" style="height: 40%;">
        <div class="column justify-center items-center content-center q-ma-md">
          <div>
            <q-btn class="q-ma-md" size='large' :label=transStr(stringsIDs.str_btn_restore) color="blue-grey-8" @click="restoreData"
              :disable="selected_id == DEFAULT_ID"></q-btn>
          </div>
          <div>
            <q-btn class="q-ma-md" size='large' style="font-size: medium;" :label=transStr(stringsIDs.str_btn_save_current) color="blue-grey-8"
              @click="mustPopName = true"></q-btn>
          </div>
          <div>
            <q-btn class="q-ma-md" size='large' :label=transStr(stringsIDs.str_btn_delete_all) color="blue-grey-8"
              @click="deleteAllData"></q-btn>
          </div>
        </div>
      </div>
    </div>
    <q-dialog v-model="mustPopName">
      <q-card>
        <div class="q-ma-xl">
          {{ transStr(stringsIDs.str_pop_simu_save_name) }}
        </div>
        <q-input class="q-ma-md" v-model="currentName"></q-input>
        <q-btn class="q-ma-md" :label=transStr(stringsIDs.str_pop_simu_default_name) @click="saveCurrentData"></q-btn>
        <q-btn class="q-ma-md" :label=transStr(stringsIDs.str_pop_simu_custom_name) @click="saveCurrentData"
          :disable="isNameAlreadyInUse(currentName)"></q-btn>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { LocalStorage } from 'quasar';
import { onBeforeMount } from 'vue';
import { bank, simu, startFormFilled } from 'src/stores/store';
import { useRouter } from 'vue-router';
import { targetPage } from '../utils/swipe_utils.js'
import { transStr, stringsIDs } from 'src/stores/languages';

const DEFAULT_ID = -1;
const DEFAULT_NAME = '';
var mustPopName = ref(false);
var listSave = ref([]);
var selected_id = ref(DEFAULT_ID);
var currentName = ref(DEFAULT_NAME);
const router = useRouter();
const handleSwipeExt = function ({ evt, touch, mouse, direction, duration, distance }) {
  router.push(targetPage(direction, router.currentRoute.value.fullPath));
}
const saveCurrentData = function () {
  var date = new Date();
  mustPopName.value = false;
  //clean heavy data that can be recomputed easily
  if (bank.value.accounts.length != 0) {
    for (var i = 0; i < bank.value.accounts.length; i++) {
      bank.value.accounts[i].computedOverTime = [];
    }
  }
  //generate unique name
  var nameSim = '';


  if (currentName.value == DEFAULT_NAME) {
    nameSim = 'Simulation ' + (getHighestIndex() + 1).toString();
  }
  else {
    nameSim = currentName.value;
  }
  listSave.value.push({ simu: simu.value, bank: bank.value, id: generateuniqueID(), name: nameSim, startFormFilled: startFormFilled.value,date : date.toLocaleDateString()+' ('+date.getHours().toString()+':'+date.getMinutes().toString()+':'+date.getSeconds().toString()+')' });
  LocalStorage.set('listSave', listSave.value);
  currentName.value = DEFAULT_NAME;
}

const isNameAlreadyInUse = function (name) {
  for (var j = 0; j < listSave.value.length - 1; j++) {
    if (listSave.value[j].name == name) {
      return true;
    }
  }
  return false;
}
const getHighestIndex = function () {
  var current_index = 0;
  var highest_index = 0;
  for (var j = 0; j < listSave.value.length; j++) {
    if (listSave.value[j].name.split(' ')[0] == 'Simulation') {
      current_index = Number(listSave.value[j].name.split(' ')[1]);
      if (current_index > highest_index) {
        highest_index = current_index;
      }
    }
  }
  return highest_index;
}
const generateuniqueID = function () {
  var highest_id = 0;
  for (var i = 0; i < listSave.value.length; i++) {
    if (listSave.value[i].id > highest_id) {
      highest_id = listSave.value[i].id;
    }
  }
  return highest_id + 1;
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
const deleteData = function (selected_id) {
  var index = getSimuIndexInStorage(selected_id);
  if (index == -1) {
    //notify
  }
  else {
    if (listSave.value.length > 1) {
      listSave.value.splice(index, 1);
      LocalStorage.set('listSave', listSave.value);
    }
    else {
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

<style lang="scss"></style>
