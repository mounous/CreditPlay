<template>
  <router-view />
</template>

<script setup lang="ts">
import { AdMob } from '@capacitor-community/admob';
import {interstitialOptions,src,firebaseConfig} from 'stores/fireB'
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getRemoteConfig,getString,fetchAndActivate, getValue } from 'firebase/remote-config';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const  performFireBaseInit=async() =>{
// Initialize Firebase
  const app = initializeApp(firebaseConfig.value);
  // used for the firestore refs
  const remoteConfig = getRemoteConfig(app);
  remoteConfig.settings.minimumFetchIntervalMillis = 3000;
  remoteConfig.settings.fetchTimeoutMillis = 5000;
  remoteConfig.defaultConfig = {
    'interstitial_id': 'ca-app-pub-7825247187857323/2803363241'//real ad id : https://console.firebase.google.com/u/0/project/creditplay-ea9a5/config/env/firebase
    //'interstitial_id': 'ca-app-pub-testcacaprout'
    //'interstitial_id': 'ca-app-pub-3940256099942544/1033173712'//testing ad ID
  };
  await(fetchAndActivate(remoteConfig));
  interstitialOptions.value.adId = getString(remoteConfig, 'interstitial_id');
  src.value=getValue(remoteConfig,'interstitial_id').getSource();

}


performFireBaseInit();


AdMob.initialize({

   //testingDevices: ['88c62db7-b836-4491-8165-8ad9b4920162'],
   initializeForTesting: true,
   tagForChildDirectedTreatment:true,
   tagForUnderAgeOfConsent:true,
  });

  AdMob.setApplicationMuted({
    muted: false,
  });

  AdMob.setApplicationVolume({
    volume: 0.5,
  });
</script>
