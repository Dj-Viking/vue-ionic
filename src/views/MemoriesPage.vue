<template>
  <base-layout page-title="Memories">
    <ion-list>
      <div v-for="(item, i) in list" :key="i">
        <ion-item :router-link="item.route">
          <ion-thumbnail slot="start">
            <ion-img :src="item.image" :alt="item.name"></ion-img>
          </ion-thumbnail>
          <ion-label>
            {{item.name}}
          </ion-label>
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
  IonImg,
  IonThumbnail,
  IonLabel
} from "@ionic/vue";

export default defineComponent({
  components: {
    IonItem,
    IonList,
    IonImg,
    IonThumbnail,
    IonLabel
  },
  data() {
    return {
      images: ((): Array<string> => [""])(),
      memories: ((): Array<string> => [""])(),
      list: (function(): Array<ListItem> {
        return new Array(3).fill(undefined).map((_: any, index: number) => {
          const attributes: ListItemAttributes = {
            id: index + 1,
            image: "askdjfkdsjfkd",
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
        "Mountains"
      ]
    },
    initImages(): void {
      //have to set the image paths relative to where the app
      // itself is mounting which is in the public folder
      // and the app mounts on the index.html page
      this.images = [
        './assets/images/sunset.jpg',
        './assets/images/eclipse.jpg',
        './assets/images/mountains.jpg',
      ]
    },
    initList(memories: Array<string>, images: Array<string>): void {
      this.list = new Array(3).fill(undefined).map((_: any, index: number) => {
        const attributes: ListItemAttributes = {
          id: index + 1,
          image: `${images[index]}`,
          name: `${index + 1}. ${memories[index]}`,
          route: `/memories/${index + 1}`
        }
        return new ListItemClass(attributes);
      });
    }
  },
  created() {
    this.initMemories();
    this.initImages();
    this.initList(this.memories, this.images);
    console.log('checking list', this.list);
    
  },
});
</script>

<style scoped>
  /* ion-title {
    background-color: rgb(52, 228, 255);
  } */
</style>