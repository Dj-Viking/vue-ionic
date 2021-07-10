import { createApp, provide } from "vue"
import App from "./App.vue"
import { DefaultApolloClient } from "@vue/apollo-composable"
import ApolloClient from "apollo-boost";
import router from "./router";
import store from "./store";
import BaseLayout from "./components/base/BaseLayout.vue";
import { IonicVue } from "@ionic/vue";

//create apollo client
const apolloClient = new ApolloClient({
  // You should use an absolute URL here
  uri: 'localhost:4000/graphql'
});


/* Core CSS required for Ionic components to work properly */
import "@ionic/vue/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/vue/css/normalize.css";
import "@ionic/vue/css/structure.css";
import "@ionic/vue/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/vue/css/padding.css";
import "@ionic/vue/css/float-elements.css";
import "@ionic/vue/css/text-alignment.css";
import "@ionic/vue/css/text-transformation.css";
import "@ionic/vue/css/flex-utils.css";
import "@ionic/vue/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import "./theme/core.css";


const app = createApp({
  setup(){
    provide(DefaultApolloClient, apolloClient)
  },
  render: (h: any) => h(App)
})
.use(IonicVue)
.use(router)
.use(store);
//creating a base layout wrapper component
app.component('base-layout', BaseLayout);
  
router.isReady().then(() => {
  app.mount("#app");
});