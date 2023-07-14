<template>
  <div class="layout">
    <button
      id="alert"
      v-if="isPatient()"
      style="
        background-color: #9e331d;
        border-radius: 5px;
        width: 200px;
        height: 90px;
        top: 70px;
        color: white;
        font-size: 26px;
      "
      :style="{ backgroundColor: buttonHover ? '#ff0000' : '#9e331d' }"
      @click="sendEmergency"
      @mouseenter="buttonHover = true"
      @mouseleave="buttonHover = false"
    >
      ALERT
    </button>
    <div class="analitiche">
      <div class="header">
        <h1 style="padding-top: 20px">STATISTICHE</h1>
        <hr style="width: 100%" color="black" />
      </div>
      <input type="date" v-model="startDate" />&nbsp;&nbsp;&nbsp;
      <input type="date" v-model="endDate" />&nbsp;&nbsp;&nbsp;
      <select id="dropdownMenu" v-model="parametro">
        <option value="spO2">spO2</option>
        <option value="fc">fc</option>
        <option value="systolic">systolic</option>
        <option value="diastolic">diastolic</option>
      </select>
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <input
        type="button"
        value="CALCOLA"
        :class="{ 'button-hover': hoverButton }"
        style="border-radius: 5px; border-color: grey"
        @mouseover="hoverButton = true"
        @mouseleave="hoverButton = false"
        @click="getMedia()"
      />
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <div style="margin-top: 40px; font-size: large">
        {{ avg }}
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable vue/multi-word-component-names */
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
      avg: "Inserisci le informazioni per calcolare la media dei parametri vitali relativa ai valori selezionati",
      buttonHover: false,
      ruolo: sessionStorage.getItem("ruolo"),
    };
  },
  created() {
    // console.log(process.env.SECRET_KEY);
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
      //console.log(sessionStorage);
      let collezione;
      if (this.isPatient) {
        collezione = sessionStorage.getItem("email") + "/vitalparameters";
      } else {
        collezione =
          sessionStorage.getItem("email_paziente") + "/vitalparameters";
      }

      if (
        this.startDate != null &&
        this.endDate != null &&
        this.parametro != null
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
.alert {
  width: 100px;
}

.alert :hover {
  background-color: red;
}

.layout {
  text-align: center;
}

.button-hover {
  background-color: grey;
}

.analitiche {
  text-align: center;
  border-radius: 10px;
  margin-top: 200px;
  background: #c59c9f;
  height: 350px;
  width: 700px;
}
</style>
