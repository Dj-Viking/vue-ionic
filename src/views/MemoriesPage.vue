<template>
  <base-layout page-title="here is a title">
    <ion-list>
      <div v-for="(item, i) in list" :key="i">
        <ion-item :router-link="item.route">
          {{item.name}}
        </ion-item>
      </div>
    </ion-list>
  </base-layout>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { ListItemAttributes, ListItem, ListItemClass } from "../types";
import { 
  IonList, 
  IonItem, 
} from "@ionic/vue";

export default defineComponent({
  props: {
    pageTitle: String
  },
  components: {
    IonItem,
    IonList,
  },
  data() {
    return {
      list: (function(): Array<ListItem> {
        return new Array(5).fill(undefined).map((_: any, index: number) => {
          const attributes: ListItemAttributes = {
            id: index + 1,
            name: `${index + 1}. Item ${index + 1}`,
            route: `/memories/${index + 1}`
          }
          return new ListItemClass(attributes)
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
  /* ion-title {
    background-color: rgb(52, 228, 255);
  } */
</style>