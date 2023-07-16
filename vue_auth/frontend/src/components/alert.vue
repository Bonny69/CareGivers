<template>
  <div class="layout">
    <button
      id="alert"
      v-if="isPatient()"
      :class="{ 'button-hover': buttonHover }"
      @click="sendEmergency"
      @mouseenter="buttonHover = true"
      @mouseleave="buttonHover = false"
    >
      <i class="fas fa-exclamation-circle"></i> ALERT
    </button>
    <div class="analitiche">
      <div class="header">
        <h1>STATISTICHE</h1>
        <hr />
        <div class="message">{{ message }}</div>
        <div style="margin-top: 40px; font-size: large" v-if="avg !== null">
          {{ avg }}
        </div>
      </div>
      <div class="input-container">
        <input type="date" v-model="startDate" />
        <input type="date" v-model="endDate" />
        <select id="dropdownMenu" v-model="parametro">
          <option value="spO2">spO2</option>
          <option value="fc">fc</option>
          <option value="systolic">systolic</option>
          <option value="diastolic">diastolic</option>
        </select>
        <button class="calc-button" :disabled="isLoading" @click="getMedia">
          {{ isLoading ? "CALCOLANDO..." : "CALCOLA" }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { encrypt } from "./cipher";

export default {
  name: "alert",

  data() {
    return {
      data: "",
      client: null,
      startDate: null,
      endDate: null,
      parametro: null,
      avg: null,
      buttonHover: false,
      ruolo: sessionStorage.getItem("ruolo"),
      message:
        "Inserire le informazioni necessarie per il calcolo delle statistiche dei parametri vitali rilevati:",
    };
  },
  created() {
    if (sessionStorage.getItem("token") === null) {
      alert("non autorizzato");
      this.$router.push("/login");
    } else {
      if (
        sessionStorage.getItem("ruolo") === "caregiver" &&
        sessionStorage.getItem("flagScelta") === null
      ) {
        alert("selezionare un paziente");
        this.$router.push("/home");
      }
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
    isPatient() {
      return this.ruolo === "paziente";
    },

    sendEmergency() {
      const userInput = window.prompt("Cosa succede?");
      const topic = sessionStorage.getItem("email") + "/urgentAlert";
      const data = {
        collection: sessionStorage.getItem("email") + "/vitalparameters",
      };

      axios.post("http://localhost:5005/getLastValue", data).then((res) => {
        if (res.status === 200) {
          const stringMQTT =
            userInput +
            " FC = " +
            res.data.fc +
            " spO2 = " +
            res.data.spO2 +
            " systolic = " +
            res.data.systolic +
            " diastolic = " +
            res.data.diastolic;
          this.client.publish(topic, encrypt(stringMQTT));
          ("alert inviato");
        }
      });
    },

    handleBeforeUnload() {
      event.preventDefault();
      event.returnValue = "";
    },

    getMedia() {
      let collezione;
      if (this.isPatient) {
        collezione = sessionStorage.getItem("email") + "/vitalparameters";
      } else {
        collezione =
          sessionStorage.getItem("email_paziente") + "/vitalparameters";
      }

      if (
        this.startDate !== null &&
        this.endDate !== null &&
        this.parametro !== null
      ) {
        const data = {
          collection: collezione,
          firstDate: this.startDate,
          secondDate: this.endDate,
          parametro: this.parametro,
        };
        console.log(data);
        axios.post("http://localhost:5005/getMedia", data).then((res) => {
          if (res.status === 200) {
            const stringa =
              "La media dei valori rilevati per il periodo selezionato è di " +
              parseInt(res.data[0].averageField);
            this.avg = stringa;
          }
        });
      }
    },
  },
};
</script>

<style>
.layout {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
}

button#alert {
  background-color: #9e331d;
  border-radius: 5px;
  width: 200px;
  height: 90px;
  color: white;
  font-size: 26px;
  transition: background-color 0.3s;
}

button#alert.button-hover {
  background-color: #ff0000;
}

.analitiche {
  text-align: center;
  border-radius: 10px;
  margin-top: 50px;
  background-color: #c59c9f;
  padding: 10px;
  width: 700px;
  max-height: 550px;
  max-width: 90vw;
}

.analitiche .header {
  padding-top: 60px;
}

.analitiche h1 {
  font-size: 24px;
}

.analitiche hr {
  width: 100%;
  border: none;
  border-top: 1px solid black;
  margin-bottom: 20px;
}

.input-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
}

input[type="date"],
select {
  margin-right: 10px;
  padding: 5px;
  font-size: 16px;
  border-radius: 5px;
}

.message {
  font-size: 20px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
}

button.calc-button {
  padding: 5px 10px;
  font-size: 16px;
  border-radius: 5px;
  border-color: grey;
  transition: background-color 0.3s;
}

button.calc-button:hover {
  background-color: grey;
}
</style>
