// eslint-disable-next-line
import { Memory, UserState, ClearUserTokenActionFn, GetOneMemoryActionFn, SetUserMutationFn, ClearUserTokenMutationFn, MyStore, SetUserTokenActionFn, MeQueryResponse } from "@/types";
import { ActionContext, createStore } from "vuex";

//aliased to have dollar sign. export defaults can be named anything once imported
import AuthService from "../utils/authService";

const store = createStore({
  state: {
    user: {
      username: null,
      email: null,
      token: null,
    } as UserState,
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
    ] as Memory[]
  },
  mutations: {
    /**
     * Sets the vuex state user based on the input payload
     * this is getting the me {} object from the MeQuery so lets just take out what's in the me object 
     * and set it to the user
     * @type {MyStore["mutations"]["SET_USER"]}
     */
    SET_ME(state, payload: MeQueryResponse): void {
      console.log('what is the payload', payload);

      // eslint-disable-next-line
      if (payload.hasOwnProperty("me")) {
        state.user = {
          ...state.user,
          ...payload.me
        } as UserState;
      } else {
        state.user = {
          ...state.user,
          ...payload
        } as UserState;
      }

      console.log('set me after set me mutation', state.user);
    },
    /**
     * sets the token string on the user's local state 
     * @type {MyStore["mutations"]["SET_USER_TOKEN"]}
     */
    SET_USER_TOKEN(state, payload: string): void {
      state.user = {
        ...state.user,
        token: payload
      } as UserState
      console.log('set token after operation', state.user);
    },
    /**
     * clear the user token from the vuex state user
     * @type {MyStore["mutations"]["CLEAR_USER_TOKEN"]}
     */
    CLEAR_USER_TOKEN(state, payload: ""): void {
      state.user.token = payload;
    }
  },
  actions: {
    /**
     * perform an async function that calls auth service to set the token in local storage to set
     * the authorization header for every graphql mutation/query that needs the token in the auth header
     * and also set the local vuex state user.token 
     * 
     * ActionContext has inference of what the current local state of the store as first argument
     * and second argument is inferred as the rootState 
     * @type {MyStore["actions"]["setUserToken"]}
     */
    async setUserToken(
      context: ActionContext<MyStore["state"], MyStore["state"]>,
      payload: string
    ): Promise<boolean> {
      try {
        //set local state user's token string
        context.commit("SET_USER_TOKEN", payload);
        //store the token in local storage until 
        // we destroy it on logout or until it expires and can't be used for requests
        // and can't be used anymore and then have to log in again or 

        //token comes from the graphql mutation of logging in or signing up
        await AuthService.setToken(payload);
        if (typeof (await AuthService.getToken()) !== "string" ) return Promise.resolve(false);
        else return Promise.resolve(true);
      } catch (error) {
        console.error(error);
        return Promise.resolve(false)
      }
    },
    /**
     * 
     * @type {MyStore["actions"]["clearUserToken"]}
     */
    async clearUserToken(
      context: ActionContext<MyStore["state"], MyStore["state"]>, 
      payload = ""
    ): Promise<boolean> {
      try {
        //send the empty string to the vuex state mutator
        context.commit("CLEAR_USER_TOKEN", payload);
        //destroy the token in local storage
        AuthService.clearToken();
        if ((await AuthService.getToken()) === null) return Promise.resolve(false);
        return Promise.resolve(true);
      } catch (error) {
        console.error(error);
        return Promise.resolve(false);
      }
    },
    /**
     * @type {MyStore["actions"]["setUser"]}
     */
    setMe(
      context: ActionContext<MyStore["state"], MyStore["state"]>,
      payload: UserState
    ): void {
      return context.commit("SET_ME", payload);
    },
    // eslint-disable-next-line
    /**
     * @type {MyStore["actions"]["getOneMemory"]}
     */
    async getOneMemory(
      _context: ActionContext<MyStore["state"], MyStore["state"]>,
      payload: { id: string }
    ): Promise<Memory | never> {
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