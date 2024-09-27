<template>
  <q-page v-touch-swipe.mouse.left.right="handleSwipeExt" style="display: flex; " :key="tutoPhase">
    <q-page-sticky position="top-right" :offset="[0, 0]" style="z-index:3">
      <q-icon name="help" size="x-large" color="white" class="q-mt-md q-mr-md" v-if="show_tuto==false" @click="[show_tuto=true,tutoPhase=0,nextTick(scrollDown)]"></q-icon>
   </q-page-sticky>
    <div
      style="flex-direction: column;width: 100%;">
      <div class="col q-mt-md" style="height: 60%;">

        <q-scroll-area style="height:100%; max-width: 99%;"  ref="scrollAreaRef" :key="tutoPhase">
          <q-list dark v-if="listSave.length!=0 && (show_tuto==false || tutoPhase>=1)" class="q-ma-md" separator bordered @click.stop style="background-color: darkslategrey;" >
            <q-item v-for="item in listSave" :key="item.id" clickable
              @click="selected_id == item.id ? selected_id = DEFAULT_ID : selected_id = item.id" v-ripple
              :active="selected_id == item.id" active-class="bg-blue-grey-8 text-black">
              <q-item-section>
                <q-item-label no-wrap="false" style="font-weight: bold;"> {{ truncate(item.name)}} </q-item-label >
                <q-item-label no-wrap="false"> {{ item.date}} </q-item-label >
              </q-item-section>
              <q-item-section avatar>
                <q-btn  color="black"  style="width:20px;background-color: cadetblue;" icon="delete_forever" @click="deleteData(item.id)"></q-btn>
              </q-item-section>
            </q-item>
          </q-list>
          <div  v-if="show_tuto==true" class="q-mt-md" style="display: flex;flex-direction: column;align-items: center;align-content: center;">
            <tutoDisplayer>
              <tutoTxt  v-if="show_tuto==true && tutoPhase==0" :txt=transStr(stringsIDs.str_tuto_mem_1)></tutoTxt>
              <SaveContent v-if="show_tuto==true && tutoPhase==1"></SaveContent>
              <tutoTxt  v-if="show_tuto==true && tutoPhase==2" :txt=transStr(stringsIDs.str_tuto_mem_3)></tutoTxt>
              <tutoTxt  v-if="show_tuto==true && tutoPhase==3" :txt=transStr(stringsIDs.str_tuto_mem_4)></tutoTxt>
              <tutoTxt  v-if="show_tuto==true && tutoPhase==4" :txt=transStr(stringsIDs.str_tuto_mem_5)></tutoTxt>
              <tutoTxt  v-if="show_tuto==true && tutoPhase==5" :txt=transStr(stringsIDs.str_tuto_mem_6)></tutoTxt>
              <tutoTxt  v-if="show_tuto==true && tutoPhase==6" :txt=transStr(stringsIDs.str_tuto_mem_7)></tutoTxt>
              <shakeBtn v-if="show_tuto==true && tutoPhase!=2 && tutoPhase!=4  && tutoPhase!=5" class="q-ma-md" btn-label=">>" @click="HandleClick()"></shakeBtn>
            </tutoDisplayer>
          </div>
        </q-scroll-area>
      </div>

      <div class="col q-ma-md" style="height: 40%;">
        <div class="column justify-center items-center content-center">
          <div>
            <q-btn class="q-ma-xs" size='large' :label=transStr(stringsIDs.str_btn_restore) color="blue-grey-8" @click="restoreData"
              :disable="selected_id == DEFAULT_ID || show_tuto" @click.stop></q-btn>
          </div>
          <div>
            <q-btn class="q-ma-md" size='large' style="font-size: medium;" :label=transStr(stringsIDs.str_btn_save_current) color="blue-grey-8"
              @click="mustPopName = true" @click.stop :disable="show_tuto==true && tutoPhase!=2"></q-btn>
          </div>
          <div>
            <q-btn class="q-ma-xs" size='large' :label=transStr(stringsIDs.str_btn_delete_all) color="blue-grey-8"
              @click="deleteAllData" @click.stop :disable="tutoPhase!=5 && show_tuto==true"></q-btn>
          </div>
        </div>
      </div>
    </div>
    <q-dialog v-model="mustPopName">
      <q-card bordered class="bg-black" style="border-color: white;">
        <div style="display: flex;flex-direction: column;align-items: center;align-content: center;justify-content: center;justify-items: center;">
          <div class="q-ma-md" style="text-align: center;color: white;font-size: 17px">
            {{ transStr(stringsIDs.str_pop_simu_save_name) }}
          </div>
          <q-input dark bg-color="blue-grey-10" class="q-ma-md" style="font-size: x-large;"  v-model="currentName" @keyup.enter="saveCurrentData"></q-input>
          <div style="display: flex;flex-direction: row; align-items: center;align-content: center;justify-content: center;justify-items: center;">
            <q-btn color="blue-grey-8" class="q-ma-md" :label=transStr(stringsIDs.str_pop_simu_default_name) @click="saveCurrentData" :disable="show_tuto==true || currentName.length!=0"></q-btn>
            <q-btn color="blue-grey-8" class="q-ma-md" :label=transStr(stringsIDs.str_pop_simu_custom_name) @click="saveCurrentData"
              :disable="isNameAlreadyInUse(currentName) || currentName.length==0"></q-btn>
          </div>
        </div>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import tutoDisplayer from 'src/components/tutoDisplayer.vue';
import tutoTxt from 'src/components/tutoTxt.vue';
import { useQuasar } from 'quasar';
import { onMounted, ref } from 'vue'
import { LocalStorage } from 'quasar';
import { onBeforeMount,nextTick } from 'vue';
import { bank, mustAlertChangeChart, show_tuto, simu, startFormFilled, tutoPhase,showNotifMem } from 'src/stores/store';
import { useRouter } from 'vue-router';
import { targetPage } from '../utils/swipe_utils.js'
import { transStr, stringsIDs } from 'src/stores/languages';
import {mustAlertChangeMem} from '../stores/store'
import SaveContent from 'src/components/SaveContent.vue';
import shakeBtn from 'src/components/shakeBtn.vue'

var scrollAreaRef=ref();
const DEFAULT_ID = -1;
const DEFAULT_NAME = '';
var mustPopName = ref(false);
var listSave = ref([]);
var selected_id = ref(DEFAULT_ID);
var currentName = ref(DEFAULT_NAME);
const router = useRouter();
const $q=useQuasar();
const truncate=function(str){
  if(str==null)
{
  return '';
}
  return (str.length > 25) ? str.slice(0, 24) + '...' : str;
};

const handleSwipeExt = function ({ evt, touch, mouse, direction, duration, distance }) {
  router.push(targetPage(direction, router.currentRoute.value.fullPath));
}

const scrollDown=function()
{
  scrollAreaRef.value.setScrollPercentage('vertical',1.0,800);
}
const HandleClick=function()
{
  if(show_tuto.value==false)
  {
    return ;
  }
  if(tutoPhase.value==1)
  {
    var date = new Date();
    listSave.value.push({ simu: {}, bank: {}, id: 1, name: 'Simulation 1', startFormFilled: true,date : date.toLocaleDateString()+' ('+date.getHours().toString()+':'+date.getMinutes().toString()+':'+date.getSeconds().toString()+')' });
    listSave.value.push({ simu: {}, bank: {}, id: 2, name: 'Simulation 2', startFormFilled: true,date : date.toLocaleDateString()+' ('+date.getHours().toString()+':'+date.getMinutes().toString()+':'+date.getSeconds().toString()+')' });
    listSave.value.push({ simu: {}, bank: {}, id: 3, name: 'Simulation 3', startFormFilled: true,date : date.toLocaleDateString()+' ('+date.getHours().toString()+':'+date.getMinutes().toString()+':'+date.getSeconds().toString()+')' });
    listSave.value.push({ simu: {}, bank: {}, id: 4, name: 'Simulation 4', startFormFilled: true,date : date.toLocaleDateString()+' ('+date.getHours().toString()+':'+date.getMinutes().toString()+':'+date.getSeconds().toString()+')' });
  }
  tutoPhase.value++;
  if(tutoPhase.value==7)
  {
    show_tuto.value=false;
    tutoPhase.value=0;
    if (LocalStorage.has('listSave'))
    {
      listSave.value = LocalStorage.getItem('listSave');
    }
    else
    {
      listSave.value=[];
    }
  }
  setTimeout(scrollDown,150);

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
  if(show_tuto.value==false)
  {
    LocalStorage.set('listSave', listSave.value);
  }
  else
  {
    if(tutoPhase.value==2)
    {
      tutoPhase.value++;
      setTimeout(scrollDown,150);
    }
  }
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
  tutoPhase.value=-1;
  if(mustAlertChangeMem.value==true)
  {
    if(showNotifMem.value==true)
    {
      $q.notify({ color: 'blue', textColor: 'black', icon: 'info', message: transStr(stringsIDs.str_save_possible),
                  actions:[


                    {
                      label:transStr(stringsIDs.str_save),handler:()=>{
                                                                              mustPopName.value = true
                                                                            }
                    },
                    {
                      label:transStr(stringsIDs.str_not_again),handler:()=>{
                                                                              showNotifMem.value=false;
                                                                              LocalStorage.set('showNotifMem',false);
                                                                              $q.notify({ color: 'blue', textColor: 'black', icon: 'info', message: transStr(stringsIDs.str_reenable_tuto), closeBtn:transStr(stringsIDs.str_close)})
                                                                            }
                    },
                  ]}) ;
    }
    mustAlertChangeMem.value=false;
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
    mustAlertChangeChart.value=true;
    if(show_tuto.value==false)
    {
      router.push('/summary');
    }
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
      if(show_tuto.value==false)
      {
        LocalStorage.set('listSave', listSave.value);
      }
      else
      {
        tutoPhase.value++;
        setTimeout(scrollDown,150);
      }
    }
    else {
      deleteAllData();
    }
  }
}
const deleteAllData = function () {
  listSave.value = [];
  if(show_tuto.value==false)
  {
    LocalStorage.set('listSave', listSave.value);
  }
  else
  {
    tutoPhase.value++;
  }
}
onBeforeMount(getStorage);
const scrollInit=function ()
{
  setTimeout(scrollDown(),200);
}
onMounted(scrollInit);
</script>

<style lang="scss"></style>
