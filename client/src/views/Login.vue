<template>
  <base-layout
    :isHome="false"
  >
    <div>
      Hello login
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