import { createStore } from 'vuex'
import axios from 'axios'
import cookies from 'vue-cookies'

import { useToast } from "vue-toastification";

const toast = useToast();
      
const store = createStore({
    state: {
        jwt: cookies.get('access'),
        jwtrefresh: cookies.get('refresh'),
        endpoints: {
            obtainJWT: 'http://127.0.0.1:8000/api/token/',
            refreshJWT: 'http://127.0.0.1:8000/api/token/refresh/',
            verifyJWT: 'http://127.0.0.1:8000/api/token/verify/',
        }
    },
    mutations: {
        updateToken(state, newToken) {
            cookies.set('access',newToken);
            state.jwt = newToken;
        },
        updateTokenrefresh(state, newToken) {
            cookies.set('refresh',newToken);
            state.jwtrefresh = newToken;
        },
        removeToken(state) {
            cookies.remove("access");
            cookies.remove("refresh");
            state.jwt = null;
        }
    },
    actions: {
        obtainToken(context, payload) {
            const data = {
                username: payload.user,
                password: payload.pass,
            }
            axios.post(this.state.endpoints.obtainJWT, data)
                .then((response) => {
                    this.commit('updateToken', response.data.access);
                    this.commit('updateTokenrefresh', response.data.refresh);

                    return true;
                })
                .catch((error) => {
                    console.log(error);
                    toast.error("Erro no usuário ou senha.", {
                        timeout: 2000
                      });
                      
                    this.commit('removeToken');
                    return false;
                })
        },
        refreshToken() {
            const payload = {
                refresh: this.state.jwtrefresh
            }
            axios.post(this.state.endpoints.refreshJWT, payload)
                .then((response) => {
                    this.commit('updateToken', response.data.access)
                })
                .catch((error) => {
                    console.log(error)
                })
        },
        removeToken() {

                this.commit('removeToken');
                
        },
        inspectToken() {
            return new Promise((resolve, reject) => {

                const token = this.state.jwt;

                if (token) {
                    const data = {
                        token: this.state.jwt
                    }
                    axios.post(this.state.endpoints.verifyJWT, data)
                    .then((response) => {
                        resolve(response);
                    })
                    .catch((error) => {
                        reject(error);
                    })
                }
            })
            
            
        },
    }
})

export default store
