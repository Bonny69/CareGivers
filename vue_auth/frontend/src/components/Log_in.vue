<template>
  <body class="body">
    <form class="box" @submit.prevent="login()">
      <h1>Login</h1>
      <input type="email" name="" v-model="email" placeholder="email" />
      <input
        type="password"
        name=""
        v-model="password"
        placeholder="password"
        autocomplete="on"
      />
      <input type="submit" name="" value="LOGIN" />
      <p id="text">
        Non hai un account?
        <RouterLink to="/signup" style="color: black">Registrati</RouterLink>
      </p>
    </form>
  </body>
</template>

<script>
import axios from "axios";
import { encrypt, decrypt } from "./cipher";

export default {
  name: "Log_in",

  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    async login() {
      let loggedUser = {
        email: encrypt(this.email),
        password: encrypt(this.password),
      };

      await axios.post("http://localhost:5000/login", loggedUser).then(
        (res) => {
          console.log(res.data);
          if (res.status === 200) {
            console.log(res.data.token);
            sessionStorage.setItem("token", res.data.token);
            sessionStorage.setItem("email", res.data.email);
            sessionStorage.setItem("ruolo", decrypt(res.data.ruolo));
            this.$store.commit("setUser", decrypt(res.data.email));

            this.$router.push("/memos");
          } else {
            alert("errore! controllare le credenziali inserite");
          }
        },
        (err) => {
          console.log(err);
        }
      );
    },
  },
};
</script>

<style scoped>
.body,
html {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  width: 100%;
  font-family: sans-serif;
}

.box h1 {
  color: black;
  text-transform: uppercase;
  font-weight: 500;
}

.box {
  font-size: large;
  width: 425px;
  padding: 50px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #9e331d;
  text-align: center;
  border-radius: 10px;
  opacity: 0.8;
  border-color: white;
}

.box input[type="email"],
.box input[type="password"] {
  border: 0;
  background: rgba(255, 255, 255, 0.86);
  display: block;
  margin: 20px auto;
  text-align: center;
  font-size: 20px;
  border: 2px solid white;
  padding: 8px 10px;
  width: 200px;
  outline: none;
  color: black;
  border-radius: 5px;
  transition: o.25s;
}

.box input[type="email"]:focus,
.box input[type="password"]:focus {
  width: 250px;
  background: #cdc7c9;
}

.box input[type="submit"] {
  border: 0;
  background: rgba(255, 255, 255, 0.86);
  display: block;
  margin: 20px auto;
  text-align: center;
  border: 2px solid white;
  font-size: 18px;
  padding: 8px 40px;
  outline: none;
  color: black;
  border-radius: 5px;
  transition: o.25s;
  cursor: pointer;
}

.box input[type="submit"]:hover {
  background: #c79598;
}

#text {
  color: white;
}
</style>
