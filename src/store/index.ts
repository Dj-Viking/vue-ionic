import { Memory } from "@/types";
import { createStore } from "vuex";

const store = createStore({
  state: {
    memories: [
      {
        id: 1,
        name: "Sunset",
        description: "here is a sunset",
        image: "./assets/images/sunset.jpg",
        route: "/memories/1"
      },
      {
        id: 2,
        name: "Eclipse",
        description: "wow spooky",
        image: "./assets/images/eclipse.jpg",
        route: "/memories/2"
      },
      {
        id: 3,
        name: "Mountains",
        description: "nice",
        image: "./assets/images/mountains.jpg",
        route: "/memories/3"
      },
    ]
  },
  mutations: {},
  actions: {
    // eslint-disable-next-line
    async getOneMemory(context, payload: { id: string }): Promise<Memory> {
      try {
        const { id } = payload;
        return Promise.resolve(this.state.memories.filter(memory => memory.id === Number(id))[0])
      } catch (error) {
        console.error(error);
        return Promise.reject(error);
      }
    }
  },
  getters: {
    //these have to be non-arrow functions otherwise
    // the state parameter passed in will be undefined
    // in the lexical context of `this` in the arrow function
    memories(state) { return state.memories; },
  }
});

export default store;