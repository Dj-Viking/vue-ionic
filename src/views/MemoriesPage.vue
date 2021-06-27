<template>
  <base-layout page-title="Memories">
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
      memories: ((): Array<string> => [""])(),
      list: (function(): Array<ListItem> {
        return new Array(3).fill(undefined).map((_: any, index: number) => {
          const attributes: ListItemAttributes = {
            id: index + 1,
            name: `${index + 1}. this is all replaced later on init`,
            route: `/memories/${index + 1}`
          }
          return new ListItemClass(attributes)
        });
      })()
    }
  },
  methods: {
    initMemories(): void {
      this.memories = [
        "Sunset",
        "Eclipse",
        "Mountians"
      ]
    },
    initList(memories: Array<string>): void {
      this.list = new Array(3).fill(undefined).map((_: any, index: number) => {
        const attributes: ListItemAttributes = {
          id: index + 1,
          name: `${index + 1}. ${memories[index]}`,
          route: `/memories/${index + 1}`
        }
        return new ListItemClass(attributes);
      });
    }
  },
  created() {
    this.initMemories();
    this.initList(this.memories);
  },
});
</script>

<style scoped>
  /* ion-title {
    background-color: rgb(52, 228, 255);
  } */
</style>