<template>
  <base-layout
    :isHome="false"
  >
    <form 
      style="margin: 0 auto;"
      @submit.prevent="() => {
        submitRegister({
          options: {
            email,
            username,
            password
          }
        })
      }"
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

        <input type="submit" style="display: none;">

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
          <span v-if="!registerIsLoading && !showSpinner">
            SIGN UP 
          </span>
          <div style="width: 100%; height: 100%" v-if="registerIsLoading || (showSpinner && submitted)">
            <Spinner />
          </div>
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
import { defineComponent, ref, onMounted } from "vue";
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
import { mapActions, mapGetters } from 'vuex';
/**
 * for more help with vue3 composition api and vue apollo check out 
 * @see https://v4.apollo.vuejs.org/guide-composable/mutation.html#ondone
 */
export default defineComponent({
  components: {
    BaseLayout,
    IonLabel, 
    IonInput, 
    IonButton,
    Spinner
  },
  setup() {
    const email = ref("");
    const username = ref("");
    const password = ref("");
    const res = ref({});
    const submitted = ref(false);
    // here the call to useMutation can resolve your component
    const { 
      mutate: submitRegister, 
      loading: registerIsLoading, 
      error: registerError, 
      onDone: onRegisterDone 
    } = useMutation(gql`${createRegisterMutation()}`, {
      variables: {
        options: {
          email: email.value,
          username: username.value,
          password: password.value
        }
      }
    });
    onRegisterDone(result => {
      res.value = result.data;
      submitted.value = false;
    });
    function initFields(): void {
      submitted.value = false;
      email.value = "";
      username.value = "";
      password.value = "";
    }
    onMounted(initFields);

    return { submitRegister, email, username, password, registerIsLoading, registerError, res, submitted };
  },
  data() { 
    return {
      isError: false,
      errMsg: "",
      successMsg: "",
      showSpinner: false
    }
  },
  computed: {
    ...mapGetters(["user"])
  },
  methods: {
    displayError(msg: string): void {
      this.isError = true;
      this.showSpinner = false;
      this.submitted = false;
      this.errMsg = msg;
    },
    resetError(): void {
      setTimeout(() => {
        this.isError = false;
        this.submitted = false;
      }, 3000);
    },
    ...mapActions(["setUserToken"])
  },
  watch: {
    res: async function(newValue: RegisterResponse) {
      this.showSpinner = true;
      this.submitted = true;
      console.log('result from signing up', newValue);
      if (newValue.register.errors && newValue.register.errors.length) {
        const msg = newValue.register.errors[0].message;
        this.displayError(msg);
        this.resetError();
        console.log('error while getting signup res', newValue.register.errors[0]);
      } else {
        //set the token for local state memory on the user to be the auth'd state of the app? 
        await this.setUserToken(newValue.register.token);
        console.log('did user get the token stored locally after successful signup???', this.user);
        
        this.successMsg = "Success!! teleporting to home page";
        setTimeout(() => {
          this.showSpinner = false;
          this.submitted = false;
          router.back();
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
  ion-button {
    height: 80px;
  }
</style>