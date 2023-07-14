<template>
  <div>
    <h1>Select a Patient</h1>
    <div class="patient-boxes">
      <div
        v-for="patient in patients"
        :key="patient"
        class="patient-box"
        :class="{ selected: patient === selectedPatient }"
        @click="selectPatient(patient)"
      >
        <span>{{ patient }}</span>
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
        .then((response) => {
          console.log(response.data);

          const documents = response.data;
          for (let i = 0; i < documents.length; i++) {
            console.log(decrypt(documents[i].patient));
            this.patients.push(decrypt(documents[i].patient));
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },

    selectPatient(patientId) {
      // Update the selected patient and fetch their data
      this.selectedPatient = patientId;
      this.fetchPatientData();
    },
    fetchPatientData() {
      // Fetch the patient data for the selected patient
      if (this.selectedPatient) {
        axios
          .get(`/api/patients/${this.selectedPatient}/data`)
          .then((response) => {
            this.patientData = response.data;
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        this.patientData = [];
      }
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
