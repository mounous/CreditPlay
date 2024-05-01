

import {ref} from 'vue'

export const startFormFilled=ref(false);
export const setStartFormFilled=function(bool_filled:boolean){startFormFilled.value=bool_filled};
export const simu=ref({
  credit:{
    has_been_rebougth:false,
    mensuality:0,
    amount:0,
    duration_y:0,
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
