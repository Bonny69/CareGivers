<template>
  <Side_bar> </Side_bar>
  <div :style="{ 'margin-left': sidebarWidth }"></div>

  <body>
    <div class="inputReferente" v-if="!isPatient()">
      <h3>Inserire email paziente:</h3>
      <input
        type="email"
        v-model="e_mail"
        class="form-control"
        placeholder="email paziente"
      />
      <br />
      <h2>INSERISCI OTP</h2>
      <div class="otp-bx">
        <input type="text" v-model="firstOtp" maxlength="1" />
        <input type="text" v-model="secondOtp" maxlength="1" />
        <input type="text" v-model="thirdOtp" maxlength="1" class="space" />
        <input type="text" v-model="fourthOtp" maxlength="1" />
        <input type="text" v-model="fifthOtp" maxlength="1" />
      </div>
      <br />
      <input type="submit" @click="sendOtp()" value="CONFERMA" />
    </div>

    <div class="threeshold" v-if="!isPatient() && hasChosenPatient()">
      <div>
        <h3 style="color: #c35b46">ALERTS</h3>
        <hr style="width: 100%" color="#9e331d" />
      </div>
      <label>FC:&nbsp;</label>
      <input type="number" v-model="fc" />&nbsp;&nbsp;
      <label>spO2:&nbsp;</label>&nbsp;
      <input type="number" v-model="spO2" /> &nbsp;
      <label>sistolica:&nbsp;</label>&nbsp;
      <input type="number" v-model="systolic" />&nbsp;
      <label>diastolica:&nbsp;</label>&nbsp;
      <input type="number" v-model="diastolic" />&nbsp;&nbsp;&nbsp;
      <input
        type="submit"
        @click="insertAlerts()"
        value="AGGIUNGI"
        style="color: white; padding: 3px; background-color: #c35b46"
      />
    </div>

    <div
      class="inputPaziente"
      v-if="isPatient()"
      style="background-color: #c59c9f"
    >
      <h1>Genera OTP:</h1>
      <br />
      <input type="submit" @click="createOtp()" value="GENERA" />
    </div>
  </body>
</template>

<script>
/* eslint-disable vue/multi-word-component-names */
import axios from "axios";
import { encrypt } from "./cipher";
export default {
  name: "referenti",

  data() {
    return {
      otp: "",
      e_mail: "",
      ruolo: sessionStorage.getItem("ruolo"),
      firstOtp: "",
      secondOtp: "",
      thirdOtp: "",
      fourthOtp: "",
      fifthOtp: "",
      fc: "",
      spO2: "",
      systolic: "",
      diastolic: "",
      client: null,
      topicAlert: sessionStorage.getItem("email_paziente") + "/insAlert",
    };
  },

  created() {
    if (sessionStorage.getItem("token") === null) {
      alert("non autorizzato");
      this.$router.push("/login");
    }
    window.addEventListener("beforeunload", this.handleBeforeUnload);
  },
  beforeUnmount() {
    window.removeEventListener("beforeunload", this.handleBeforeUnload);
  },

  mounted() {
    this.client = this.$store.state.selectedItem;
  },

  methods: {
    handleBeforeUnload() {
      event.preventDefault();
      event.returnValue = "";
    },
    isPatient() {
      return this.ruolo === "paziente";
    },
    hasChosenPatient() {
      return sessionStorage.getItem("flagScelta") === 1;
    },
    setFlag() {
      sessionStorage.setItem("flagref", 1);
    },

    checkFlag() {
      return sessionStorage.getItem("flagref") == null;
    },
    createOtp() {
      const length = 5;
      let otp = "";

      for (let i = 0; i < length; i++) {
        otp += Math.floor(Math.random() * 10);
      }
      console.log(otp);

      const data = {
        otp: encrypt(otp),
        email: sessionStorage.getItem("email"),
      };
      axios.post("http://localhost:5001/insertOtp", data).then(
        (res) => {
          console.log(res.data);
          if (res.status === 200) {
            alert("OTP inserito con successo " + otp);
          }
        },
        (err) => {
          alert(err + " errore generazione otp");
        }
      );
    },

    sendOtp() {
      const data = {
        otp: encrypt(
          this.firstOtp +
            this.secondOtp +
            this.thirdOtp +
            this.fourthOtp +
            this.fifthOtp
        ),
        email_paziente: encrypt(this.e_mail),
        email_caregiver: sessionStorage.getItem("email"),
      };

      axios.post("http://localhost:5001/checkOtp", data).then(
        (res) => {
          console.log(res.data);
          if (res.status === 200) {
            alert("associazione confermata");
            localStorage.setItem("email_paziente", this.e_mail);
          }
        },
        (err) => {
          alert(err + " errore! prego riprovare");
        }
      );
    },

    async insertAlerts() {
      const data = {
        email: sessionStorage.getItem("email_paziente"),
        fc: encrypt(this.fc.toString()),
        spO2: encrypt(this.spO2.toString()),
        systolic: encrypt(this.systolic.toString()),
        diastolic: encrypt(this.diastolic.toString()),
      };

      await axios.post("http://localhost:5005/insertAlerts", data).then(
        (res) => {
          if (res.status === 200) {
            localStorage.setItem("fcth", this.fc);
            localStorage.setItem("spO2th", this.spO2);
            localStorage.setItem("systh", this.systolic);
            localStorage.setItem("diasth", this.diastolic);

            const alerts = {
              fcth: encrypt(this.fc.toString()),
              spO2th: encrypt(this.spO2.toString()),
              systh: encrypt(this.systolic.toString()),
              diasth: encrypt(this.diastolic.toString()),
            };
            //console.log(this.client);
            this.client.publish(this.topicAlert, JSON.stringify(alerts));
            alert("soglie inserite correttamente");
          } else {
            alert("errore in fase di inserimento");
          }
        },
        (err) => {
          console.log(err);
          alert("errore! prego riprovare");
        }
      );
    },
  },
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: sans-serif;
}

body {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100vh;
}

.otp-bx {
  display: flex;
  padding: 10px;
}

.otp-bx input {
  width: 50px;
  font-size: 32px;
  padding: 10px;
  text-align: center;
  border-radius: 5px;
  margin: 2px;
  border: 2px solid;
  font-weight: bold;
  outline: none;
  transition: all 0.1s;
}

.otp-bx.input :focus {
  border: 2px solid #27ffa9;
  box-shadow: 0 0 2px 2px #27ffd76a;
}

.space {
  margin-right: 1rem !important;
}

.inputReferente {
  text-align: center;
  background-color: #c59c9f;
  border-radius: 10px;
  padding: 40px;
  width: 400px;
}

.inputReferente input[type="submit"] {
  border: 0;
  background: rgba(255, 255, 255, 0.86);
  margin: 20px auto;
  text-align: center;
  border: 2px solid white;
  font-size: 18px;
  padding: 8px 40px;
  border-radius: 5px;
  transition: o.25s;
  cursor: pointer;
}

.inputReferente input[type="submit"]:hover {
  background: lightgray;
}

.inputPaziente {
  text-align: center;
  background-color: lightgrey;
  border-radius: 10px;
  padding: 40px;
}

.inputPaziente input[type="submit"] {
  border: 0;
  background: rgba(255, 255, 255, 0.86);
  margin: 20px auto;
  text-align: center;
  border: 2px solid white;
  font-size: 18px;
  padding: 8px 40px;
  border-radius: 5px;
  transition: o.25s;
  cursor: pointer;
}

.inputPaziente input[type="submit"]:hover {
  background: lightgray;
}

.threeshold {
  text-align: center;
  margin-top: 60px;
}
</style>
