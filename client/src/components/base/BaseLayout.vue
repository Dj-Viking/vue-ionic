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
              @click="() => isHome ? router.push({ name: 'login' }) : router.back()"
            >
              {{ !isHome ? "Home" : "Login" }}
            </ion-button>

            <ion-button
              @click="() => router.push({ name: 'signup' })"
            >
              {{ !isHome ? null : "Signup" }}
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
import { defineComponent } from "@vue/runtime-core";
import router from "../../router";
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

export default defineComponent({
  data() {
    return {
      router: router
    }
  },
  props: {
    pageTitle: String,
    pageDefaultBackLink: String,
    isHome: Boolean,
    navButtonText: String
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
})
</script>

<style>

</style>