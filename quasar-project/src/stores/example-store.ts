import { defineStore } from 'pinia';
import {ref} from 'vue'

export const startFormFilled=ref(false);
export const setStartFormFilled=function(bool_filled:boolean){startFormFilled.value=bool_filled};
export const useCounterStore = defineStore('counter', {
  state: () => ({
    counter: 0,
  }),
  getters: {
    doubleCount: (state) => state.counter * 2,
  },
  actions: {
    increment() {
      this.counter++;
    },
  },
});
