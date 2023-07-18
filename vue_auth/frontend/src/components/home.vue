<template>
  <div class="header">
    <h1>Seleziona un paziente</h1>
  </div>
  <div class="container">
    <div class="patient-boxes">
      <div
        v-for="patient in patients"
        :key="patient.email"
        class="patient-box"
        :class="{ selected: patient === selectedPatient }"
        @click="selectPatient(patient)"
      >
        <div class="info">
          <div class="name">{{ patient.name }}</div>
          <div class="surname">{{ patient.surname }}</div>
          <div class="email">{{ patient.email }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { decrypt, encrypt } from "./cipher";

export default {
  name: "Home",
  data() {
    return {
      patients: [],
      selectedPatient: null,
      patientData: [],
    };
  },
  mounted() {
    this.fetchPatients();
  },
  methods: {
    async fetchPatients() {
      const email = {
        email_caregiver: sessionStorage.getItem("email"),
      };
      await axios
        .post("http://localhost:5001/home", email)
        .then(async (response) => {
          console.log(response.data);

          const documents = response.data;
          for (let i = 0; i < documents.length; i++) {
            const info = await this.getInfo(documents[i].patient);
            const patient = {
              name: info.nome.toUpperCase(),
              surname: info.cognome.toUpperCase(),
              email: decrypt(documents[i].patient),
            };
            this.patients.push(patient);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },

    async getInfo(emailUser) {
      const data = {
        email: emailUser,
      };

      try {
        const response = await axios.post("http://localhost:5000/user", data);
        const info = {
          nome: decrypt(response.data.nome),
          cognome: decrypt(response.data.cognome),
        };
        console.log(info);
        return info;
      } catch (error) {
        console.error(error);
        alert("errore, prego riavviare");
        throw new Error("Failed to fetch user information");
      }
    },

    selectPatient(patientId) {
      this.selectedPatient = patientId;
      const selectedPatientEmail = encrypt(patientId.email);
      sessionStorage.setItem("email_paziente", selectedPatientEmail);
      sessionStorage.setItem("flagScelta", 1);
      this.$router.push("/memos");
    },
  },
};
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  margin-top: -140px;
}

.header {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 250px;
}

h1 {
  margin-bottom: 0;
  color: #6200ee;
}

.patient-box {
  width: 270px;
  height: 200px;
  background-color: #03dac5;
  color: black;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s;
}

.patient-box:hover {
  background-color: #3700b3;
  color: white;
}

.patient-box:active {
  background-color: lightgreen;
}

.info {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.name {
  font-weight: bold;
  font-size: x-large;
  margin-bottom: 10px;
}

.surname {
  font-weight: bold;
  font-size: x-large;
  margin-bottom: 10px;
}

.email {
  font-style: italic;
  font-size: x-large;
}

.patient-boxes {
  display: flex;
  flex-wrap: wrap;
  gap: 60px;
}
</style>
