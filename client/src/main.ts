import { createApp, h, provide } from "vue"
import App from "./App.vue"
import router from "./router";
import store from "./store";
import BaseLayout from "./components/base/BaseLayout.vue";
import { IonicVue } from "@ionic/vue";


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

//apollo stuff
import { ApolloClient, ApolloLink, concat, createHttpLink, InMemoryCache } from "@apollo/client/core";
import { DefaultApolloClient } from "@vue/apollo-composable";
import AuthService from "./utils/authService";

// Cache implementation
const cache = new InMemoryCache()


let token;
(async () => token = await AuthService.getToken())()

const authMiddleware = new ApolloLink((operation, next) => {
  // add the authorization to the headers
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      authorization: `Bearer ${localStorage.getItem("id_token") || null}`,
    }
  }));
  return next(operation);
})

// HTTP connection to the API
const httpLink = createHttpLink({
  // You should use an absolute URL here
  uri: process.env.NODE_ENV === "development" ? "http://localhost:4000/graphql" : "/graphql",
  headers: {
    authorization: `Bearer ${token ? token : null}`
  },
  credentials: "include"
});

// Create the apollo client
const apolloClient = new ApolloClient({
  link: concat(authMiddleware, httpLink),
  cache,
});
const app = createApp({ setup() { provide(DefaultApolloClient, apolloClient);
                                  provide("$email", null); }
                      , render: () => h(App) })
                                              .use(IonicVue)
                                              .use(router)
                                              .use(store);
//creating a base layout wrapper component
app.component('base-layout', BaseLayout);
  
router.isReady().then(() => {
  app.mount("#app");
});