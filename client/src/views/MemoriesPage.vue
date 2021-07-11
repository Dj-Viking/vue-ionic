<template>
  <base-layout page-title="Memories" :isHome="true">
    <ion-list>
      <div v-for="(item, i) in list" :key="i">
        <ion-item :router-link="item.route">
          <ion-thumbnail slot="start">
            <ion-img :src="item.image" :alt="item.name"></ion-img>
          </ion-thumbnail>
          <ion-label>
            {{i + 1}}. {{item.name}}
          </ion-label>
        </ion-item>
      </div>
    </ion-list>
  </base-layout>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Memory, ListItemClass } from "../types";
import { mapGetters } from "vuex";
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
      //initializing to an array of memories so I am succinct about what type of thing I am exposing to the vue template
      list: (function(): Array<Memory> {
        return new Array(3).fill(undefined).map((_: any, index: number) => {
          const memory: Memory = {
            id: index + 1,
            image: "askdjfkdsjfkd",
            description: "aldkjfskdjfjkdfdk",
            name: `${index + 1}. this is all replaced later on init`,
            route: `/memories/${index + 1}`
          }
          return new ListItemClass(memory)
        });
      })()
    }
  },
  computed: {
    ...mapGetters(["memories"])
  },
  methods: {
    initList(memories: Array<Memory>): void {
      this.list = memories.map((m: Memory) => new ListItemClass(m))
    }
  },
  created(): void {
    this.initList(this.memories);
    console.log("creating instance");
  },
});
</script>

<style scoped>
  /* ion-title {
    background-color: rgb(52, 228, 255);
  } */
  ion-item {
    cursor: pointer;
  }
</style>