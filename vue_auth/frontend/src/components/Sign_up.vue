<template>
  <form class="box" @submit.prevent="signUp()">
    <h1>Sign Up</h1>
    <div class="form group">
      <label>nome:</label>
      <input
        type="text"
        v-model="nome"
        class="form-control"
        placeholder="nome"
      />
    </div>

    <div class="form group">
      <label>cognome:</label>
      <input
        type="text"
        v-model="cognome"
        class="form-control"
        placeholder="cognome"
      />
    </div>

    <div class="form group">
      <label>Data di nascita:</label>
      <input
        type="date"
        v-model="dataDiNascita"
        class="form-control"
        placeholder="data di nascita"
      />
    </div>

    <div class="form group">
      <label>email:</label>
      <input
        type="email"
        v-model="email"
        class="form-control"
        placeholder="email"
      />
    </div>

    <div class="form group">
      <label>password:</label>
      <input
        type="password"
        v-model="password"
        class="form-control"
        placeholder="password"
        autocomplete="on"
      />
    </div>

    <div class="form group">
      <label>conferma password:</label>
      <input
        type="password"
        v-model="ripetiPassword"
        class="form-control"
        placeholder="conferma password"
        autocomplete="on"
      />
    </div>

    <div class="form group">
      <label>ruolo:</label><br />
      <select id="ruolo" v-model="ruolo" style="width: 180px">
        <option value="paziente">paziente</option>
        <option value="caregiver" selected>caregiver</option>
      </select>
    </div>

    <input type="submit" name="" value="REGISTER" />
    <p id="text">
      hai un account?
      <RouterLink to="/login" style="color: #03dac5">login</RouterLink>
    </p>
  </form>
</template>

<script>
import axios from "axios";
import { encrypt } from "./cipher";

export default {
  name: "Sign_up",

  data() {
    return {
      nome: "",
      cognome: "",
      dataDiNascita: "",
      email: "",
      password: "",
      ripetiPassword: "",
      ruolo: "",
    };
  },

  methods: {
    async signUp() {
      let newUser = {
        nome: encrypt(this.nome),
        cognome: encrypt(this.cognome),
        dataDiNascita: this.dataDiNascita,
        email: encrypt(this.email),
        password: encrypt(this.password),
        ripetiPassword: encrypt(this.ripetiPassword),
        ruolo: encrypt(this.ruolo),
      };

      await axios.post("http://localhost:5000/signup", newUser).then(
        (res) => {
          console.log(res.data);
          this.$router.push("/login");
        },
        (err) => {
          this.error = err.response.data.error;
          return console.log(err.response);
        }
      );
    },
  },
};
</script>

<style>
.body,
html {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  width: 100%;
  font-family: sans-serif;
}

.box {
  font-size: large;
  font-style: normal;
  width: 440px;
  padding: 20px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #6200ee;
  text-align: center;
  border-radius: 10px;
  opacity: 0.8;
  border-color: white;
}

.box h1 {
  color: white;
  text-transform: uppercase;
  font-weight: 500;
}

.box label {
  color: white;
}

.box input[type="email"],
.box input[type="password"],
.box input[type="text"],
.box input[type="date"] {
  border: 0;
  background: rgba(255, 255, 255, 0.86);
  display: block;
  margin: 5px auto;
  text-align: center;
  font-size: 20px;
  border: 2px solid white;
  padding: 14px 10px;
  width: 200px;
  outline: none;
  color: black;
  border-radius: 5px;
  transition: o.25s;
}

.box input[type="email"]:focus,
.box input[type="password"]:focus,
.box input[type="text"]:focus {
  width: 230px;
  background-color: #cdc7c9;
}

.box input[type="submit"] {
  border: 0;
  background: rgba(255, 255, 255, 0.86);
  display: block;
  margin: 15px auto;
  text-align: center;
  border: 2px solid white;
  font-size: 18px;
  padding: 8px 40px;
  outline: none;
  color: black;
  border-radius: 12px;
  transition: o.25s;
  cursor: pointer;
}

.box input[type="submit"]:hover {
  background: #03dac5;
}

#text {
  color: white;
}
</style>
