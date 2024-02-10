
import {ref} from 'vue'

export const startFormFilled=ref(false);
export const setStartFormFilled=function(bool_filled:boolean){startFormFilled.value=bool_filled};

