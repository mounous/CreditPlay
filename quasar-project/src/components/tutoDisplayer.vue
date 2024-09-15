<template>
  <q-card v-if="show_tuto==true" bordered  style="background-color: black;border-color:white;border-radius: 20px;border-width: 2px;" class="q-mt-md">

    <div style="display: flex;flex-direction: column;justify-content: center;align-content: center;justify-items: center;justify-content: center;">
      <div class="stickyIcon" style="background-color: black;">
        <q-icon name="info" size="lg" color="white" class="rotating"> </q-icon>
      </div>
      <div class="q-mt-md q-mb-md"  style="display: flex;flex-direction: column;">
        <slot ></slot>
      </div>
    </div>

  </q-card>
</template>

<script setup>

import { show_tuto } from 'src/stores/store';

</script>
<style scoped lang="css">


.stickyIcon
{
  z-index: 3;
  position:absolute;
  top:-20px;
  right:50%;
  transform: translateX(50%);
  opacity:1;

}


@-webkit-keyframes rotating /* Safari and Chrome */ {
  from {
    -webkit-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes rotating {
  from {
    -ms-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -webkit-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  to {
    -ms-transform: rotate(360deg);
    -moz-transform: rotate(360deg);
    -webkit-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
.rotating {
  -webkit-animation: rotating 1.5s linear ;
  -moz-animation: rotating 1.5s linear ;
  -ms-animation: rotating 1.5s linear ;
  -o-animation: rotating 1.5s linear ;
  animation: rotating 1.5s linear ;
}

.niceBorder
{

  background: linear-gradient(0.25turn, #3f87a6 ,#080808, #3f87a6);
}
</style>
