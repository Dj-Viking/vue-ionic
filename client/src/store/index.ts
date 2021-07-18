import { Memory } from "@/types";
import { createStore } from "vuex";

//aliased to have dollar sign. export defaults can be named anything once imported
import $AuthService from "../utils/authService";

const store = createStore({
  state: {
    user: {
      username: "",
      email: "",
      token: "",
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
      state.user = {
        ...state.user,
        ...payload
      };
      console.log('set user after mutation', state.user);
    },
    SET_USER_TOKEN(state, payload): void {
      state.user = {
        ...state.user,
        token: payload
      }
      console.log('set token after operation', state.user);
    },
    CLEAR_USER_TOKEN(state, payload: ""): void {
      state.user.token = payload;
    }
  },
  actions: {
    async setUserToken(context, payload): Promise<boolean> {
      try {
        //set local state user's token string
        context.commit("SET_USER_TOKEN", payload);
        //store the token in local storage until 
        // we destroy it on logout or until it expires and can't be used for requests
        // and can't be used anymore and then have to log in again or 

        //token comes from the graphql mutation of logging in or signing up
        await $AuthService.setToken(payload);
        if (typeof (await $AuthService.getToken()) !== "string" ) return Promise.resolve(false);
        else return Promise.resolve(true);
      } catch (error) {
        console.error(error);
        return Promise.resolve(false)
      }
    },
    // async getUserToken(context, payload): Promise<null | string> {

    //   if (token) return token;
    //   else return null;
    // },
    async clearUserToken(context, payload = ""): Promise<boolean> {
      try {
        //send the empty string to the vuex state mutator
        context.commit("CLEAR_USER_TOKEN", payload);
        //destroy the token in local storage
        await $AuthService.clearToken();
        if ((await $AuthService.getToken()) === false) return Promise.resolve(false);
        return Promise.resolve(true);
      } catch (error) {
        console.error(error);
        return Promise.resolve(false);
      }
    },
    setUser(context, payload): void {
      return context.commit("SET_USER", payload);
    },
    // eslint-disable-next-line
    async getUserProfile(context, payload): Promise<null> {
      try {
        //get the token from local storage and verify/decode it to get the user data in the token
      } catch (error) {
        console.error(error);
        return Promise.resolve(null);
      }
    },
    // eslint-disable-next-line
    async getOneMemory(_context, payload: { id: string }): Promise<Memory | never> {
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