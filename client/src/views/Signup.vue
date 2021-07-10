<template>
  <base-layout
    :isHome="false"
  >
    <div>
      Hello signup
    </div>
  </base-layout>
</template>

<script>
import {defineComponent} from "vue"
import BaseLayout from "../components/base/BaseLayout.vue"
export default defineComponent({
  components: {
    BaseLayout
  },
})
</script>

<style>

</style>