<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>

          <ion-buttons slot="start">
            <ion-back-button
              :defaultHref="pageDefaultBackLink"
            ></ion-back-button>
          </ion-buttons>

          <ion-buttons slot="end">
            <ion-button
              @click="() => {
                if (!isHome) {
                  return router.back()
                }
                if (isHome && !isLoggedIn) {
                  return router.push({name: 'login'})
                }
              }"
            >
              {{ !isHome ? "Home" : isHome && !isLoggedIn ? "Login" : null }}
            </ion-button>

            <ion-button
              @click="() => {
                if (isHome && !isLoggedIn){
                  return router.push({name: 'signup'})
                }
                if (isHome && isLoggedIn) {
                  logout();
                  refetch();
                  return router.push({name: 'home'});
                }
                if (!isHome && isLoggedIn) {
                  logout();
                  refetch();
                  return router.push({name: 'home'});
                }
              }"
            >
              {{ (isHome || !isHome) && isLoggedIn ? "Logout" : (!isHome || isHome) && !isLoggedIn ? "Signup" : null }}
            </ion-button>

          </ion-buttons>

          <ion-title>
            {{ pageTitle }}
          </ion-title>
          
        </ion-toolbar>
      </ion-header>
      <ion-content>
        <slot />
      </ion-content>
  </ion-page>
</template>

<script lang="ts">
//get like a global auth class to check if the page we are looking at while authenticated on should have a different look
import { defineComponent, ref, inject } from "@vue/runtime-core";
import router from "../../router";
import { useQuery, useMutation } from "@vue/apollo-composable";
import { createMeQuery } from "../../graphql/queries";
import { createLogoutMutation } from "../../graphql/mutations";
import { gql } from "graphql-tag";
import { mapActions, mapGetters } from "vuex";
import { 
  IonPage, 
  IonHeader, 
  IonTitle, 
  IonContent, 
  IonToolbar,
  IonBackButton,
  IonButtons,
  IonButton
} from "@ionic/vue";
import { LogoutResponse, MeQueryResponse } from "../../types";
import { EmitsOptions, SetupContext } from "vue";
import Auth from "../../utils/authService";

export default defineComponent({
  props: {
    pageTitle: String,
    pageDefaultBackLink: String,
    isHome: Boolean,
  },
  components: {
    IonPage,
    IonHeader,
    IonTitle, 
    IonContent,
    IonToolbar,
    IonBackButton,
    IonButtons,
    IonButton
  },
  // eslint-disable-next-line
  setup(this: void, _props, _ctx: SetupContext<EmitsOptions>) {

    const globalEmail = inject("$email");
    const isLoggedIn = ref(false);
    const logoutRes = ref({});
    const { result: meResult, refetch } = useQuery(gql`${createMeQuery()}`);

    const { 
      mutate: logout,
      onDone: onLogoutDone  
    } = useMutation(gql`${createLogoutMutation()}`, { variables: { email: globalEmail }});

    onLogoutDone(result => {
      isLoggedIn.value = false;
      logoutRes.value = result.data
    });

    return { meResult, logout, logoutRes, refetch, globalEmail, isLoggedIn };
  },
  data() {
    return {
      router: router,
    }
  },
  computed: {
    ...mapGetters(["user"])
  },
  methods: {
    ...mapActions(["setMe"])
  },
  watch: {
    meResult: async function(newValue: MeQueryResponse) {
      console.log("what is the me new value response", newValue)
      //check if we're logged in after each me query response
      if (newValue.me === null) {
        this.setMe({});
        this.isLoggedIn = false;
      } else {
        this.setMe(newValue);
        localStorage.setItem("global_email", newValue.me.email);
        await Auth.setToken(newValue.me.token);
        this.isLoggedIn = true;
      }
      const token = await Auth.getToken();
      const isExpired = await Auth.isTokenExpired(token);
      if (isExpired === false) this.isLoggedIn = true;
      else this.isLoggedIn = false;

      console.log("is token expired", isExpired)
    },
    logoutRes: async function(newValue: LogoutResponse) {
      console.log("what is the logout response new value", newValue);
      localStorage.removeItem("global_email");
      Auth.clearToken();
      if (newValue.logout.user === null) {
        this.isLoggedIn = false;
      }
    },
    "$route": async function() {
      //wait for the refetch
      await this.refetch();
      const token = await Auth.getToken();
      const isExpired = await Auth.isTokenExpired(token);
      if (isExpired === false) this.isLoggedIn = true;
      else this.isLoggedIn = false;
      console.log("watching for route changen are we logged in", this.isLoggedIn);
      //get the user info on route change to get user state if logged in
    }
  },
  async created() {
    //if the token isn't expired then keep the logged-in view
    const token = await Auth.getToken();
    const isExpired = await Auth.isTokenExpired(token);
    if (isExpired === false) this.isLoggedIn = true;
    else this.isLoggedIn = false;
    console.log("is token expired", isExpired);

  }
})
</script>

<style>

</style>