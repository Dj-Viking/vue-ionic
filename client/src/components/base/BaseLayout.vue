<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-back-button
              :defaultHref="pageDefaultBackLink"
            ></ion-back-button>
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
import { defineComponent } from "@vue/runtime-core";
import { 
  IonPage, 
  IonHeader, 
  IonTitle, 
  IonContent, 
  IonToolbar,
  IonBackButton,
  IonButtons
} from "@ionic/vue";

export default defineComponent({
  props: {
    pageTitle: String,
    pageDefaultBackLink: String
  },
  components: {
    IonPage,
    IonHeader,
    IonTitle, 
    IonContent,
    IonToolbar,
    IonBackButton,
    IonButtons
  },
})
</script>

<style>

</style>