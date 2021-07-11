<template>
  <base-layout
    :isHome="false"
  >
    <form 
      style="margin: 0 auto;"
      @submit="submit($event)"
    >
      <div
        style="
          display: flex; 
          flex-direction: column;
          margin: 0 10%;
          justify-content: center;
          align-items: center;
        "
      >
        <ion-label>
          Username
        </ion-label>
        <ion-input v-model="username" type="text"></ion-input>
        <ion-label>
          Email
        </ion-label>
        <ion-input v-model="email" type="text"></ion-input>
        <ion-label>
          Password
        </ion-label>
        <ion-input v-model="password" type="password"></ion-input>
        <ion-button @click="() => {
          submitRegister({
            options: {
              email,
              username,
              password
            }
          })
        }">
          <span v-if="!showSpinner">
            SIGN UP 
          </span>
          <span v-if="registerIsLoading || showSpinner">
            <Spinner />
          </span>
        </ion-button>
        
        <div v-if="isError">
          <span style="color: red;">
            {{ errMsg }}
          </span>
        </div>
        <div v-else>
          <span style="color: green;">
            {{ successMsg }}
          </span>
        </div>
      </div>
    </form>
  </base-layout>
</template>

<script lang="ts">
import { 
  IonLabel, 
  IonInput, 
  IonButton
} from '@ionic/vue';
import { defineComponent, ref } from "vue";
import BaseLayout from "../components/base/BaseLayout.vue";
import router from "../router";
import Spinner from "../components/spinner.vue";
import { createRegisterMutation } from "../graphql/mutations";
import { gql } from "graphql-tag"
import { useMutation } from "@vue/apollo-composable";
import { 
  // RegisterArgs, 
  RegisterResponse 
} from "../types";
/**
 * for more help with vue3 composition api and vue apollo check out 
 * @see https://v4.apollo.vuejs.org/guide-composable/mutation.html#ondone
 */
export default defineComponent({
  setup() {
    const email = ref('');
    const username = ref('');
    const password = ref('');
    const res = ref({});
    // here the call to useMutation can resolve your component
    const { 
      mutate: submitRegister, 
      loading: registerIsLoading, 
      error: registerError, 
      onDone: onRegisterDone 
    } = 
      useMutation(
        gql`${createRegisterMutation()}`, {
          variables: {
            options: {
              email: email.value,
              username: username.value,
              password: password.value
            }
          }
        }
      );
    onRegisterDone(result => {
      res.value = result.data;
      console.log('result on register done', res);
    });
    return { submitRegister, email, username, password, registerIsLoading, registerError, res };
  },
  components: {
    BaseLayout,
    IonLabel, 
    IonInput, 
    IonButton,
    Spinner
  },
  data() { 
    return {
      isError: false,
      errMsg: "",
      isSubmitted: false,
      successMsg: "",
      showSpinner: false
    }
  },
  methods: {
    displayError(msg: string): void {
      this.isError = true;
      this.errMsg = msg;
    },
    resetError(): void {
      setTimeout(() => {
        this.isError = false;
      }, 3000);
    }
  },
  watch: {
    submitted: function(newValue: boolean) {
      console.log("submitted changed", newValue);
      
    },
    email: function(newValue){
      console.log("new email value watched", newValue);
    },
    username: function(newValue){
      console.log("new username value watched", newValue);
    },
    password: function(newValue){
      console.log("new password value watched", newValue);
    },
    res: function(newValue: RegisterResponse) {
      if (newValue.register.errors && newValue.register.errors.length) {
        const msg = newValue.register.errors[0].message;
        this.displayError(msg);
        this.resetError();
      } else {
        this.successMsg = "Success!! teleporting to home page";
          this.showSpinner = true;
        setTimeout(() => {
          this.showSpinner = false;
          router.push({ name: "home" })
        }, 4000);
      }
    }
  },
})
</script>

<style scoped>
  ion-input {
    border: solid black 1px;
    background-color: #325bff5f;
    border-radius: 10px;
  }
</style>