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
                  setUser(null);
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
              {{ (!isHome || isHome) && isLoggedIn ? "Logout" : isHome && !isLoggedIn ? "Signup" : null }}
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
import { ActionMethod, mapActions, mapGetters } from "vuex";
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
import { LogoutResponse, MeQueryResponse, SetUserActionFn, SetUserPayload } from "../../types";

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
  setup(ctx: any){
    
    const token = inject("$token");
    const logoutRes = ref({});
    const { result, refetch } = useQuery(gql`${createMeQuery()}`);
    const { 
      mutate: logout,
      onDone: onLogoutDone  
    } = useMutation(gql`${createLogoutMutation()}`);
    onLogoutDone(result => {
      logoutRes.value = result.data
    });
    return { result, logout, logoutRes, refetch, token };
  },
  data() {
    return {
      router: router,
      isLoggedIn: false,
    }
  },
  computed: {
    ...mapGetters(["user"])
  },
  methods: {
    ...mapActions(["setUser"])
  },
  watch: {
    result: function(newValue: MeQueryResponse) {
      this.setUser(newValue);
      if (this.user.me && this.user.me.username){
        this.isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
      }
    },
    logoutRes: function(newValue: LogoutResponse) {
      if (newValue.logout){
        this.setUser(newValue.logout.user);
        // set global token to empty string
        this.token = "";
      }
    },
    "$route": function() {
      //get the user info on route change to get user state if logged in
      this.refetch();
      if (this.user.me && this.user.me.username) {
        this.isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
      }
    }
  },
  created(){
    console.log("checking global apollo client")
    if (this.user.me && this.user.me.username) {
      this.isLoggedIn = true;
    }
  }
})
</script>

<style>

</style>