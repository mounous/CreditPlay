

import {ref} from 'vue'
export const mustAlertChart=ref(false);
export const startFormFilled=ref(false);
export const setStartFormFilled=function(bool_filled:boolean){startFormFilled.value=bool_filled};
export const simu=ref({
  credit:{
    has_been_rebougth:false,
    mensuality:0,
    amount:0,
    duration_m:0,
    rate:0,
    startingDate:'',
    amort:[],
    total_cost:0,
    y:0,
    m:0,
  },
  events:[],
});

export const bank=ref({
  accounts:[],
  monthly_sum:[],
});



export const show_tuto=ref(false);
export const tutoPhase=ref(0);
export const simu_before_tuto=ref();
export const bank_before_tuto=ref();
export const startformfilled_before_tuto=ref();
