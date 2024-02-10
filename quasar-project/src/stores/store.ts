
import {ref} from 'vue'

export const startFormFilled=ref(false);
export const setStartFormFilled=function(bool_filled:boolean){startFormFilled.value=bool_filled};
export const simu=ref({
  credit:{
    mensuality:0,
    amount:0,
    year:0,
    rate:0,
    startingDate:'',
    amort:[],
    total_cost:0,
  },
  events:[],
});
