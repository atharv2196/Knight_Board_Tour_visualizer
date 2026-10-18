import { createStore } from "vuex"
import board from "./modules/board"

export default createStore({
  modules: { board },
  state: {
    instruction: "Place the knight at an initial position and press I'm ready"
  },
  mutations: {
    UPDATE_INSTRUCTION(state, instruction) {
      state.instruction = instruction
    }
  },
  actions: {
    updateInstruction({ commit }, payload) {
      commit("UPDATE_INSTRUCTION", payload)
    }
  },
  getters: {
    instruction: ({ instruction }) => instruction
  }
})
