import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import store from './store'

import jwt_decode from 'jwt-decode'
import VueCookies from 'vue-cookies'

import './assets/main.css'

import axios from 'axios'
import VueAxios from 'vue-axios'

import Toast from "vue-toastification";
import "vue-toastification/dist/index.css"; 


const app = createApp(App)

app.use(router)

app.use(store);

app.use(VueAxios, axios)

app.use(Toast);

app.mount('#app')
