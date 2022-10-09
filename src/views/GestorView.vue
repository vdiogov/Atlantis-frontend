<template>
  <div class="painel">
    <h1>Controle do painel</h1>
    <form @submit.prevent>
      <div class="row" v-if="logged == false">
        <div class="input">
          <label for="user">Usuario:</label><br>
          <input type="text" id="user" name="user" v-model="user" autocomplete>
        </div>
        <div class="input">
          <label for="password">Senha:</label><br>
          <input type="password" id="password" name="password" v-model="password" autocomplete>
        </div>
        <div class="input">
          <label for="guiche">Guiche:</label><br>
          <input type="text" id="guiche" name="guiche" v-model="guiche" autocomplete>
        </div>
        <div>
          <button class="button6" @click="getLogin()">Logar</button>
        </div>
      </div>
      <div class="row" v-if="logged">
        Usuario: {{ user }} <br>
        Guiche: {{ guiche }}
        <div>
          <button class="button5" @click="delLogin()">Deslogar</button>
        </div>
      </div>
      <div class="row" v-if="logged">
        <div>
          <button class="button1" @click="addNormal()">Chamar Proximo Normal</button>
        </div>
        <div>
          <button class="button4" @click="addSpecial()">Chamar Proximo Preferencial</button>
        </div>
        <div>
          <button class="button2" @click="addLast()">Tocar Novamente</button>
        </div>
      </div>
      <div class="row" v-if="logged">
        <div>
          <button class="button3" @click="delNormal()">Voltar Senha Normal</button>
        </div>
        <div>
          <button class="button3" @click="delSpecial()">Voltar Senha Preferencial</button>
        </div>
      </div>
    </form>
  </div>
  <div class="painel2" v-if="logged">
    <div v-if="this.senhas.length != 0" class="queue1">
      <h2>Normal</h2>
      <table>
        <tr>
          <td>Senha</td>
          <td>Guiche</td>
          <td>Data/Hora</td>
        </tr>
        <tr v-for="senha in senhas">
          <td>{{ senha.senha }}</td>
          <td>{{ senha.guiche }}</td>
          <td>{{ senha.data }}</td>
        </tr>
      </table>
    </div>
    <div v-if="this.senhas2.length != 0" style="border-left:1px solid #9F9F9F;height:auto;margin: 20px;"></div>
    <div v-if="this.senhas2.length != 0" class="queue2">
      <h2>Preferencial</h2>
      <table>
        <tr>
          <td>Senha</td>
          <td>Guiche</td>
          <td>Data/Hora</td>
        </tr>
        <tr v-for="senha in senhas2">
          <td>{{ senha.senha }}</td>
          <td>{{ senha.guiche }}</td>
          <td>{{ senha.data }}</td>
        </tr>
      </table>
    </div>
  </div>
  <div class="row" v-if="logged">
    <div><button v-if="this.senhas.length != 0" class="button5" @click="delALL()">ZERAR FILA NORMAL</button>
      <button v-if="this.senhas2.length != 0" class="button5" @click="delALLSpecial()">ZERAR FILA PREFERENCIAL</button>
    </div>
  </div>
</template>

<script>
import { useToast } from "vue-toastification";
import { mapActions } from 'vuex';
import cookies from 'vue-cookies'

export default {
  data() {
    return {
      senhas: [],
      senhas2: [],
      logged: false,
      user: "",
      password: "",
      guiche: "",
      jwt: "",
      userid: "",
      url: "",
    }
  },
  methods: {
    ...mapActions(['obtainToken', 'refreshToken', 'removeToken', 'inspectToken']),
    async addNormal() {
      const toast = useToast();

      await this.inspectToken().then((response) => {
        if (response.status === 200) {
          this.jwt = response.data.access
          this.logged = true;
        } else {
          this.refreshToken()
        }
      }).catch((error) => {
        this.jwt = "";
        console.log(error)
      })

      this.jwt = cookies.get('access');

      var num;

      if (typeof this.senhas[0] != "undefined") {
        num = parseInt(this.senhas[0].senha) + 1;
      } else {
        num = 1;
      }

      var numx = String(num).padStart(4, '0')

      console.log(numx)

      const json = JSON.stringify(
        {
          numero: numx,
          atendente: this.userid,
          guiche: this.guiche,
          buzz: true
        });

      this.axios.post("http://127.0.0.1:8000/queue/", json,
        {
          headers: {
            Authorization: 'Bearer ' + this.jwt,
            'Content-Type': 'application/json',
          }
        }).then(
          (response) => {
            console.log(response);
            this.url = response.data.url;
            toast.success("Senha normal chamada.", {
              timeout: 2000
            });
          }
        ).catch(function (error) {
          console.log(error);
        });

    },
    async addSpecial() {
      const toast = useToast();

      await this.inspectToken().then((response) => {
        if (response.status === 200) {
          this.jwt = response.data.access
          this.logged = true;
        } else {
          this.refreshToken()
        }
      }).catch((error) => {
        this.jwt = "";
        console.log(error)
      })

      this.jwt = cookies.get('access');

      var num;

      if (typeof this.senhas2[0] != "undefined") {
        num = parseInt(this.senhas2[0].senha) + 1;
      } else {
        num = 1;
      }

      var numx = String(num).padStart(4, '0')

      console.log(numx)

      const json = JSON.stringify(
        {
          numero: numx,
          atendente: this.userid,
          guiche: this.guiche,
          buzz: true
        });

      this.axios.post("http://127.0.0.1:8000/queuespecial/", json,
        {
          headers: {
            Authorization: 'Bearer ' + this.jwt,
            'Content-Type': 'application/json',
          }
        }).then(
          (response) => {
            this.url = response.data.url;
            toast.success("Senha preferencial chamada.", {
              timeout: 2000
            });
          }
        ).catch(function (error) {
          console.log(error);
        });


    },
    async addLast() {
      const toast = useToast();

      await this.inspectToken().then((response) => {
        if (response.status === 200) {
          this.jwt = response.data.access
          this.logged = true;
        } else {
          this.refreshToken()
        }
      }).catch((error) => {
        this.jwt = "";
        console.log(error)
      })

      const json = JSON.stringify(
        {
          guiche: this.guiche,
          buzz: false
        });

      this.jwt = cookies.get('access');

      if (this.url != "") {

        this.axios.patch(this.url, json,
          {
            headers: {
              Authorization: 'Bearer ' + this.jwt,
              'Content-Type': 'application/json',
            }
          }).then(
            (response) => {

              toast.info("Tocando som de chamada.", {
                timeout: 2000
              });
            }
          ).catch(function (error) {
            console.log(error);
          });

      }
      
    },
    async delNormal() {
      const toast = useToast();

      await this.inspectToken().then((response) => {
        if (response.status === 200) {
          this.jwt = response.data.access
          this.logged = true;
        } else {
          this.refreshToken()
        }
      }).catch((error) => {
        this.jwt = "";
        console.log(error)
      })

      this.jwt = cookies.get('access');

      if (typeof this.senhas[0].url != "undefined") {

        this.axios.delete(this.senhas[0].url,
          {
            headers: {
              Authorization: 'Bearer ' + this.jwt,
              'Content-Type': 'application/json',
            }
          }).then(
            (response) => {

              toast.error("Voltando senha normal.", {
                timeout: 2000
              });
            }
          ).catch(function (error) {
            console.log(error);
          });

      }

    },
    async delSpecial() {

      const toast = useToast();

      await this.inspectToken().then((response) => {
        if (response.status === 200) {
          this.jwt = response.data.access
          this.logged = true;
        } else {
          this.refreshToken()
        }
      }).catch((error) => {
        this.jwt = "";
        console.log(error)
      })

      this.jwt = cookies.get('access');

      if (typeof this.senhas2[0] != "undefined") {

        this.axios.delete(this.senhas2[0].url,
          {
            headers: {
              Authorization: 'Bearer ' + this.jwt,
              'Content-Type': 'application/json',
            }
          }).then(
            (response) => {

              toast.error("Voltando senha preferencial.", {
                timeout: 2000
              });
            }
          ).catch(function (error) {
            console.log(error);
          });

      }



    },
    async delALL() {
      if (confirm("Deseja realmente limpar as senhas preferenciais chamadas?")) {
        const toast = useToast();


        await this.inspectToken().then((response) => {
          if (response.status === 200) {
            this.jwt = response.data.access
            this.logged = true;
          } else {
            this.refreshToken()
          }
        }).catch((error) => {
          this.jwt = "";
          console.log(error)
        })

        this.jwt = cookies.get('access');

        if (typeof this.senhas[0] != "undefined") {

          this.axios.delete('http://127.0.0.1:8000/queueDELETE/',
            {
              headers: {
                Authorization: 'Bearer ' + this.jwt,
                'Content-Type': 'application/json',
              }
            }).then(
              (response) => {
                toast.error("Limpando painel preferencial.", {
                  timeout: 2000
                });

              }
            ).catch(function (error) {
              console.log(error);
            });

        }

      }
    },
    async delALLSpecial() {
      if (confirm("Deseja realmente limpar as senhas preferenciais chamadas?")) {
        const toast = useToast();


        await this.inspectToken().then((response) => {
          if (response.status === 200) {
            this.jwt = response.data.access
            this.logged = true;
          } else {
            this.refreshToken()
          }
        }).catch((error) => {
          this.jwt = "";
          console.log(error)
        })

        this.jwt = cookies.get('access');

        if (typeof this.senhas2[0] != "undefined") {

          this.axios.delete('http://127.0.0.1:8000/queuespecialDELETE/',
            {
              headers: {
                Authorization: 'Bearer ' + this.jwt,
                'Content-Type': 'application/json',
              }
            }).then(
              (response) => {
                toast.error("Limpando painel preferencial.", {
                  timeout: 2000
                });

              }
            ).catch(function (error) {
              console.log(error);
            });

        }

      }
    },
    getNormal() {
      this.axios.get("http://127.0.0.1:8000/queue/").then(
        (response) => {
          var list = [];
          for (var i = 0; i < response.data.results.length; i++) {
            var item = {};
            item.senha = response.data.results[i].numero
            item.buzz = response.data.results[i].buzz
            item.guiche = response.data.results[i].guiche
            item.url = response.data.results[i].url
            var updated_at = new Date(response.data.results[i].updated_at)
            item.data = updated_at.toLocaleString();
            list.push(item);
          }
          this.senhas = list;
        }
      ).catch(function (error) {
        console.log(error);
      });
    },
    getSpecial() {
      this.axios.get("http://127.0.0.1:8000/queuespecial/").then(
        (response) => {
          var list = [];
          for (var i = 0; i < response.data.results.length; i++) {
            var item = {};
            item.senha = response.data.results[i].numero
            item.buzz = response.data.results[i].buzz
            item.guiche = response.data.results[i].guiche
            item.url = response.data.results[i].url
            var updated_at = new Date(response.data.results[i].updated_at)
            item.data = updated_at.toLocaleString();
            list.push(item);
          }
          this.senhas2 = list;
        }
      ).catch(function (error) {
        console.log(error);
      });
    },
    async getLogin() {
      const toast = useToast();
      var data = {}
      data.user = this.user
      data.pass = this.password
      this.obtainToken(data)

      await this.inspectToken().then((response) => {
        if (response.status === 200) {
          const toast = useToast();
          toast.success("Logado com sucesso.", {
            timeout: 2000
          });

          this.logged = true;
          this.jwt = cookies.get('access');

        }
      }).catch((error) => {
        console.log(error)
      })

      this.axios.get("http://127.0.0.1:8000/users/?username=" + this.user,{
              headers: {
                Authorization: 'Bearer ' + this.jwt,
                'Content-Type': 'application/json',
              }
            }).then(
          (response) => {
              this.userid = response.data.results[0].url
            }
          ).catch(function (error) {
            console.log(error);
          });
    },
    delLogin() {
      const toast = useToast();

      this.password = ""

      this.removeToken();

      this.logged = false;

      toast.success("Deslogado com sucesso.", {
        timeout: 2000
      });

    },
    reNew() {
      this.getNormal();
      this.getSpecial();
    },
  },
  mounted() {
    this.reNew()
  },
  created() {
    this.interval = setInterval(() => {
      this.reNew()
    }, 2000)
  },
  destroyed() {
    clearInterval(this.interval)
  }
}
</script>

<style>
#app {
  display: grid;
  grid-template-columns: max-content;
  padding: 0 2rem;
}

.container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: wrap;
}

.painel {
  min-height: 50vh;
  min-width: 100%;
}

.painel2 {
  min-height: 30vh;
  justify-content: space-around;
  display: flex;
  /* border: 2px dashed #f69c55; */
}

.input {
  margin: 10px;
}

.button1 {
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  background-color: transparent;
  border: 5px solid #3379fc;
  border-radius: 12px;
  color: #9F9F9F;
  margin: 20px;
}

.button1:hover {
  background-color: #3379fc;
  border-radius: 12px;
  color: white;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  padding: 15px 32px;
  margin: 20px;
}

.button2 {
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  background-color: transparent;
  border: 5px solid #4CAF50;
  border-radius: 12px;
  color: #9F9F9F;
  margin: 20px;
}

.button2:hover {
  background-color: #4CAF50;
  border-radius: 12px;
  color: white;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  padding: 15px 32px;
  margin: 20px;
}

.button3 {
  justify-content: center;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  background-color: transparent;
  border: 5px solid #eb2929;
  border-radius: 12px;
  color: #9F9F9F;
  margin: 20px;

}

.button3:hover {
  background-color: #eb2929;
  border-radius: 12px;
  color: white;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  padding: 15px 32px;
  margin: 20px;

}

.button4 {
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  background-color: transparent;
  border: 5px solid #7061fc;
  border-radius: 12px;
  color: #9F9F9F;
  margin: 20px;
}

.button4:hover {
  background-color: #7061fc;
  border-radius: 12px;
  color: white;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  padding: 15px 32px;
  margin: 20px;
}

.button5 {
  justify-content: center;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  background-color: transparent;
  border: 5px solid #eb2929;
  border-radius: 12px;
  color: #9F9F9F;
  margin: 20px;

}

.button5:hover {
  background-color: #eb2929;
  border-radius: 12px;
  color: white;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 20px;

}

.button6 {
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  background-color: transparent;
  border: 5px solid #3379fc;
  border-radius: 12px;
  color: #9F9F9F;
  margin: 20px;
}

.button6:hover {
  background-color: #3379fc;
  border-radius: 12px;
  color: white;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  padding: 15px 32px;
  margin: 20px;
}

.row {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
}

.painel2 {
  min-height: 30vh;
  justify-content: space-around;
  display: flex;
  /* border: 2px dashed #f69c55; */
}

table {
  width: 100%;
  font-weight: bold;
  font-size: 150%;
  border-collapse: separate;
  border-spacing: 10px 0;
}

tr>td {
  text-align: center;
  border-bottom: 1px solid gray;
}

strong {
  font-weight: bold;
  font-size: 150%;
}

h1 {
  margin: 20px;
  font-weight: bolder;
  font-size: 300%;
  text-align: center;
}

h2 {
  text-align: center;
}
</style>
