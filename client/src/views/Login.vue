<template>
  <base-layout
    :isHome="false"
  >
    <form 
      style="margin: 0 auto;"
      @submit.prevent="() => {
        submitLogin({
          options: {
            email,
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
          Email
        </ion-label>
        <ion-input v-model="email" type="text"></ion-input>
        <ion-label>
          Password
        </ion-label>
        <ion-input v-model="password" type="password"></ion-input>
        <ion-button @click="() => {
          submitLogin({
            options: {
              email,
              password
            }
          })
        }">
          <span v-if="!loginIsLoading && !showSpinner">
            LOGIN
          </span>
          <div style="width: 100%; height: 100%" v-if="loginIsLoading || (showSpinner && submitted)">
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
import { useMutation } from "@vue/apollo-composable";
import { defineComponent, ref, onMounted, inject, SetupContext, EmitsOptions } from "vue"
import router from "../router";
import BaseLayout from "../components/base/BaseLayout.vue"
import Spinner from "../components/spinner.vue";
import { gql } from "graphql-tag"
import { createLoginMutation } from "../graphql/mutations"
import { LoginResponse } from "../types";
import { mapActions } from "vuex";
import testAuthService from "../utils/authService"; //aliased to test for testing
export default defineComponent({
  components: {
    BaseLayout,
    Spinner,
    IonLabel,
    IonInput, 
    IonButton
  },
  // eslint-disable-next-line
  setup(this: void, _props, _ctx: SetupContext<EmitsOptions>){
    //global token injection to this component to set later on login
    const globalEmail = inject("$email");
    const email = ref("");
    const password = ref("");
    const loginRes = ref({});
    const submitted = ref(false);

    const { 
      mutate: submitLogin, 
      loading: loginIsLoading, 
      error: loginError, 
      onDone: onLoginDone 
    } = useMutation(
      gql`${createLoginMutation()}`, {
        variables: {
          options: {
            email: email.value,
            password: password.value
          }
        }
      }
    );

    onLoginDone((result) => {
      //set global token from login result
      loginRes.value = result.data;
      submitted.value = false;
    });

    function initFields(): void {
      submitted.value = false;
      email.value = "";
      password.value = "";
    }

    onMounted(initFields);
    
    return { submitLogin, email, password, loginIsLoading, loginError, loginRes, submitted, globalEmail };
  },
  data() { 
    return {
      isError: false as boolean,
      errMsg: "" as string,
      successMsg: "" as string,
      showSpinner: false as boolean,
      authService: testAuthService as typeof testAuthService,
    }
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
    ...mapActions(["setMe", "setUserToken"]),
  },
  watch: {
    loginRes: async function(newValue: LoginResponse): Promise<void> {
      this.showSpinner = true;
      this.submitted = true;
      console.log('login response', newValue);
      if (newValue.login.errors && newValue.login.errors.length) {
        const msg = newValue.login.errors[0].message;
        this.displayError(msg);
        this.resetError();
      } else if (newValue.login.user){
        //set global email for logging out later
        localStorage.setItem("global_email", newValue.login.user.email);
        //take the login response data and sign a token put it in local storage
        await testAuthService.setToken(newValue.login.user.token)
        await this.setUserToken(newValue.login.user.token);
        this.setMe(newValue.login.user);
        this.successMsg = "Success!! teleporting to home page";
        setTimeout(() => {
          this.email = "";
          this.password = "";
          this.showSpinner = false;
          this.submitted = false;
          router.back();
        }, 2000);
      } else return console.error("there was no truthy value returned for the user object or errors"); 
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