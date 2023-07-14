<template>
  <div>
    <h1>Select a Patient</h1>
    <div class="patient-boxes">
      <div
        v-for="patient in patients"
        :key="patient.email"
        class="patient-box"
        :class="{ selected: patient === selectedPatient }"
        @click="selectPatient(patient)"
      >
        <span>{{ patient.name }} {{ patient.surname }}</span>
        <span>{{ patient.email }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { decrypt } from "./cipher";

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
      //console.log(sessionStorage.getItem("email"));
      const email = {
        email_caregiver: sessionStorage.getItem("email"),
      };
      await axios
        .post("http://localhost:5001/home", email)
        .then(async (response) => {
          console.log(response.data);

          const documents = response.data;
          for (let i = 0; i < documents.length; i++) {
            console.log(decrypt(documents[i].patient));
            const info = await this.getInfo(documents[i].patient);
            console.log(info);
            this.patients.push(decrypt(documents[i].patient));
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
        throw new Error("Failed to fetch user information");
      }
    },

    selectPatient(patientId) {
      // Update the selected patient and fetch their data
      this.selectedPatient = patientId;
      this.fetchPatientData();
    },
  },
};
</script>

<style>
.patient-boxes {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.patient-box {
  width: 200px;
  height: 100px;
  background-color: lightblue;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.patient-box.selected {
  background-color: lightgreen;
}
</style>
