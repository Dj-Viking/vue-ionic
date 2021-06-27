<template>
  <base-layout pageDefaultBackLink="/" pageTitle="Memory Details">
    <h2 v-if="!memory">
      Could not find that stored memory
    </h2>
    <h2 v-if="memory">
      <pre>
        memory {{memory}}
      </pre>
    </h2>
  </base-layout>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { mapActions } from "vuex";
import BaseLayout from "../components/base/BaseLayout.vue";

export default defineComponent({
  components: { BaseLayout },
  data() {
    return {
      memoryId: this.$route.params.id,
      memory: {}
    }
  },
  methods: {
    ...mapActions([
      "getOneMemory"
    ])
  },
  async created(): Promise<void> {
    //making eslint happy with this strict typing of the id prop
    const payload: { id: string | string[] } = {
      id: this.memoryId
    }
    this.memory = await this.getOneMemory(payload);
  }
})
</script>

<style>

</style>