<template>
    <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>
          {{ pageTitle }}
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list>
        <slot />
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { 
  IonList, 
  IonPage, 
  IonHeader, 
  IonTitle, 
  IonContent, 
  IonToolbar 
} from "@ionic/vue";

export default defineComponent({
  props: {
    pageTitle: String
  },
  components: {
    IonList,
    IonPage,
    IonHeader,
    IonTitle, 
    IonContent,
    IonToolbar 
  },
})
</script>

<style>

</style>