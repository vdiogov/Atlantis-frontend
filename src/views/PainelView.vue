<template>
  <div class="conteiner">
    <div class="painel">
      <h1>Atendimento</h1>
    </div>
    <div class="painel2">
      <div class="queue1">
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
  </div>
</template>

<script>
import { useToast } from "vue-toastification";

export default {
  data() {
    return {
      senhas: [],
      senhasold: [],
      senhas2: [],
      senhas2old: [],
    }
  },
  methods: {
    getBuzz(){
      var audio = new Audio('bell.wav');
      audio.play();
    },
    getNormal() {
      const toast = useToast();

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

          if(JSON.stringify(this.senhas[0]) !== JSON.stringify(this.senhasold[0])){ 

            this.senhasold = list;
            this.getBuzz();

            toast.info("Senha normal: "+ list[0].senha +" Guiche: " + list[0].guiche, {
              timeout: 5000
            });

          }
        }
      ).catch(function (error) {
        console.log(error);
      });
    },
    getSpecial() {
      const toast = useToast();

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

          if(JSON.stringify(this.senhas2[0]) !== JSON.stringify(this.senhas2old[0])){ 

            this.senhas2old = list;
            this.getBuzz();

            toast.success("Senha preferencial: "+ list[0].senha +" Guiche: " + list[0].guiche , {
              timeout: 5000
            });
          }
        }
      ).catch(function (error) {
        console.log(error);
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
    this.interval = setInterval(() =>{
      this.reNew()},2000)
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
  min-height: 20vh;
  justify-content: center;
  display: flex;
  background-color: rgba(61, 61, 61, 0.80);
  border: 5px solid #0000007e;
  border-radius: 12px;
  margin-bottom: 50px;
  /* border: 2px dashed #f69c55; */
}

.painel2 {
  min-height: 40vh;
  justify-content: space-around;
  display: flex;
  background-color: rgba(61, 61, 61, 0.80);
  border: 5px solid #0000007e;
  border-radius: 12px;
  /* border: 2px dashed #f69c55; */
}

table {
  width: 100%;
  font-weight: bold;
  font-size: 180%;
  border-collapse: separate;
  border-spacing: 10px 0;
  margin-bottom: 20px;
}

tr>td {
  text-align: center;
  border-bottom: 1px solid gray;
}

strong {
  font-weight: bold;
  font-size: 180%;
}

h1 {
  margin: 20px;
  font-weight: bolder;
  font-size: 300%;
}

h2 {
  text-align: center;
  font-size: 200%;
}

body {
  background-image: url('/f3bfeb26-654e-4f3f-9ebd-94bef87c4c11.jpg');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  color: white;
}
</style>
