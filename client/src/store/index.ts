import { Memory } from "@/types";
import { createStore } from "vuex";

// import AuthService from "../utils/authService";

const store = createStore({
  state: {
    user: {
      me: null,
      token: undefined
    },
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
  mutations: {
    SET_USER(state, payload): void {
      state.user = payload
      console.log('set user after mutation', state.user);
    },
    SET_USER_TOKEN(state, payload): void {
      state.user.token = payload;
      console.log('set token after operation', state.user);
    }
  },
  actions: {
    async setUserToken(context, payload): Promise<void> {
      return new Promise((resolve) => {
        context.commit("SET_USER_TOKEN", payload);
        resolve(localStorage.setItem("id_token", payload));
      });
    },
    // async getUserToken(context, payload): Promise<null | string> {

    //   if (token) return token;
    //   else return null;
    // },
    async clearUserToken(_context, _payload): Promise<void> {
      return new Promise((resolve) => {
        resolve(localStorage.removeItem("id_token"));
      })
    },
    setUser(context, payload): void {
      return context.commit("SET_USER", payload);
    },
    // eslint-disable-next-line
    async getOneMemory(context, payload: { id: string }): Promise<Memory | never> {
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
    user(state){ return state.user; }
  }
});

export default store;