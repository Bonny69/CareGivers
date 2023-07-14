<template>
  <div>
    <h1>Select a Patient</h1>
    <div class="patient-boxes">
      <div
        v-for="patient in patients"
        :key="patient._id"
        class="patient-box"
        :class="{ selected: patient._id === selectedPatient }"
        @click="selectPatient(patient._id)"
      >
        <span>{{ patient.name }}</span>
      </div>
    </div>

    <div v-if="selectedPatient">
      <h2>Patient Data</h2>
      <ul>
        <li v-for="data in patientData" :key="data._id">
          <!-- Display patient data here -->
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Home",
  data() {
    return {
      patients: ["ciao", "suca"],
      selectedPatient: null,
      patientData: ["paolo", "rebi"],
    };
  },
  mounted() {
    this.fetchPatients();
  },
  methods: {
    async fetchPatients() {
      console.log(sessionStorage.getItem("email"));
      const email = {
        email_caregiver: sessionStorage.getItem("email"),
      };
      await axios
        .post("http://localhost:5001/home", email)
        .then((response) => {
          console.log(response.data);
          this.patients = response.data;
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
