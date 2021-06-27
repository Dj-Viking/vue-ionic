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
        <div v-for="(item, i) in list" :key="i">
          <ion-item>
            {{item.name}}
          </ion-item>
        </div>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { ListItem, ListItemClass } from "../types";
import { 
  IonList, 
  IonItem, 
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
    IonItem,
    IonList,
    IonPage,
    IonHeader,
    IonTitle, 
    IonContent,
    IonToolbar 
  },
  data() {
    return {
      list: (function(): Array<ListItem> {
        return new Array(5).fill(undefined).map((_: any, index: number) => {
          return new ListItemClass(`${index + 1}. Item ${index + 1}`)
        });
      })()
    }
  },
  created() {
    console.log('checking list on mounted', this.list);
  },
});
</script>

<style scoped>
  ion-title {
    background-color: rgb(52, 228, 255);
  }
</style>