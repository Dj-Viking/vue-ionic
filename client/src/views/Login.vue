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
import { defineComponent, ref, onMounted } from "vue"
import router from "../router";
import BaseLayout from "../components/base/BaseLayout.vue"
import Spinner from "../components/spinner.vue";
import { gql } from "graphql-tag"
import { createLoginMutation } from "../graphql/mutations"
import { LoginResponse } from "../types";
import { mapActions } from "vuex";
export default defineComponent({
  components: {
    BaseLayout,
    Spinner,
    IonLabel,
    IonInput, 
    IonButton
  },
  setup() {
    const email = ref("");
    const password = ref("");
    const res = ref({});
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
    onLoginDone(result => {
      res.value = result.data;
      submitted.value = false;
    });
    function initFields(): void {
      submitted.value = false;
      email.value = "";
      password.value = "";
    }
    onMounted(initFields);
    return { submitLogin, email, password, loginIsLoading, loginError, res, submitted };
  },
  data() { 
    return {
      isError: false,
      errMsg: "",
      successMsg: "",
      showSpinner: false
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
    ...mapActions(["setUser"])
  },
  watch: {
    res: function(newValue: LoginResponse) {
      this.showSpinner = true;
      this.submitted = true;
      if (newValue.login.errors && newValue.login.errors.length) {
        const msg = newValue.login.errors[0].message;
        this.displayError(msg);
        this.resetError();
      } else {
        this.setUser({me: newValue.login.user});
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