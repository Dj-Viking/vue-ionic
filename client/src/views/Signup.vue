<template>
  <base-layout
    :isHome="false"
  >
    <pre>
      {{ registerMutationObj }}
    </pre>
    <ion-item>
      <ion-label>
        Email
      </ion-label>
      <ion-input type="text"></ion-input>
    </ion-item>
  </base-layout>
</template>

<script lang="ts">
import { 
  IonLabel, 
  IonInput, 
  IonItem 
} from '@ionic/vue';
import { defineComponent } from "vue";
import BaseLayout from "../components/base/BaseLayout.vue";
import { REGISTER_MUTATION } from "../graphql/mutations";
import { useMutation } from "@vue/apollo-composable";
import { RegisterResponse } from "../types";
export default defineComponent({
  components: {
    BaseLayout,
    IonLabel, 
    IonInput, 
    IonItem 
  },
    data() {
    return {
      registerMutationObj: null
    }
  },
  methods: {
    async register() {
      // Call to the graphql mutation
      try {
        const createdMutation = useMutation(REGISTER_MUTATION)
        const res = await createdMutation.mutate();
        const registerRes: RegisterResponse = res.data
        console.log('response ', res);
        console.log("register response", registerRes);
        this.registerMutationObj = registerRes;
      } catch (error) {
        console.error(error);
      }
    }
  },
  async mounted() {
    await this.register();
  } 
})
</script>

<style>

</style>