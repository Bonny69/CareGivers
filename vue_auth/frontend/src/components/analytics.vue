<template>
  <div class="chart-container">
    <canvas id="line"></canvas>
    <canvas id="lineSpO2"></canvas>
    <canvas id="lineBP"></canvas>
  </div>
</template>

<script>
/* eslint-disable vue/multi-word-component-names */
import Chart from "chart.js";
import spO2 from "./spO2LineChart";
import fc from "./fcLineChart";
import bp from "./BPLineChart";
import axios from "axios";
import { encrypt, decrypt } from "./cipher";

export default {
  name: "line",
  data() {
    return {
      spO2: spO2,
      fc: fc,
      bp: bp,
      client: null,
      topicPV: sessionStorage.getItem("email_paziente") + "/pv",
      ruolo: sessionStorage.getItem("ruolo"),
      count: 0,
      chartInstanceFC: null,
      chartInstanceSpO2: null,
      chartInstanceBP: null,
      isDataFetched: false, // Track whether data has been fetched
    };
  },

  mounted() {
    this.client = this.$store.state.selectedItem;

    if (!this.isPatient()) {
      this.getAlerts(sessionStorage.getItem("email_paziente"));
      this.client.subscribe(this.topicPV);
      this.client.on("message", (topic, message) => {
        if (topic === sessionStorage.getItem("email_paziente") + "/pv") {
          const data = JSON.parse(decrypt(message.toString()));
          const pv = {
            HR: data.HR,
            SpO2: data.SpO2,
            systolic: data.systolic,
            diastolic: data.diastolic,
          };

          this.createChart();
          this.updateChartData(pv); // Update the chart data with the received message
          this.updateChart();
        }
      });

      this.$store.dispatch("updateSelectedItem", this.client);
    } else {
      this.getAlerts(sessionStorage.getItem("email"));
      this.createChart();
      this.fetchData("HR")
        .then(() => this.fetchData("SpO2"))
        .then(() => this.fetchData("bp"))
        .then(() => this.extractObjectFromStorage());
      //console.log("mounted");
      setInterval(() => {
        this.fetchData("HR"); //get data every 10 minutes
        this.fetchData("SpO2");
        this.fetchData("bp");

        this.extractObjectFromStorage();
      }, 20000);
    }
  },

  created() {
    window.addEventListener("beforeunload", this.handleBeforeUnload);
    if (sessionStorage.getItem("token") === null) {
      alert("non autorizzato");
      this.$router.push("/login");
    }
  },
  beforeUnmount() {
    window.removeEventListener("beforeunload", this.handleBeforeUnload);
  },

  methods: {
    extractObjectFromStorage() {
      let fc = JSON.parse(sessionStorage.getItem("fcValue"));
      let spO2 = JSON.parse(sessionStorage.getItem("spO2Value"));
      let sys = JSON.parse(sessionStorage.getItem("sysValue"));
      let dias = JSON.parse(sessionStorage.getItem("diasValue"));

      let object = {
        fc: fc.toString(),
        spO2: spO2.toString(),
        systolic: sys.toString(),
        diastolic: dias.toString(),
        collection: sessionStorage.getItem("email") + "/vitalparameters",
      };
      //console.log(object);
      //console.log(this.count++);

      axios.post("http://localhost:5005/insertPv", object).then((res) => {
        if (res.status === 200) {
          console.log("parametri inseriti correttamente");
        }
      });
    },

    handleBeforeUnload() {
      event.preventDefault();
      event.returnValue = "";
    },

    isPatient() {
      return this.ruolo === "paziente";
    },

    getAlerts(indirizzo) {
      let data = {
        email: indirizzo,
      };
      axios.post("http://localhost:5005/getAlerts", data).then(
        (res) => {
          if (
            res.status === 200 &&
            res.data.fc != null &&
            res.data.spO2 != null &&
            res.data.systolic != null &&
            res.data.diastolic != null
          ) {
            localStorage.setItem("fcth", decrypt(res.data.fc));
            localStorage.setItem("spO2th", decrypt(res.data.spO2));
            localStorage.setItem("systh", decrypt(res.data.systolic));
            localStorage.setItem("diasth", decrypt(res.data.diastolic));
            console.log("settaggio alert corretto");
          }
        },
        (err) => {
          console.log(err);
          alert("nessuna soglia inserita!");
        }
      );
    },

    async fetchData(param) {
      const rifPaziente = sessionStorage.getItem("email");
      const collezione = rifPaziente + "/vitalparameters";
      let data = {
        field: param,
        collection: collezione,
      };

      if (param === "bp") {
        data = {
          field: "systolic",
          field2: "diastolic",
          collection: collezione,
        };
      }

      await axios
        .get("http://localhost:5005/getData", { params: data })
        .then((res) => {
          if (res.status === 200) {
            const newData = res.data;
            this.updateChartData(newData);
            if (!this.isDataFetched) {
              this.createChart(); // Create the chart after the data has been fetched
              this.isDataFetched = true;
            } else {
              this.updateChart();
            }
            const topic = sessionStorage.getItem("email") + "/pv";
            this.client.publish(topic, encrypt(JSON.stringify(newData)));
          }
        });
    },

    createChart() {
      const ctxFC = document.getElementById("line");
      this.chartInstanceFC = new Chart(ctxFC, this.fc);

      const ctxSpO2 = document.getElementById("lineSpO2");
      this.chartInstanceSpO2 = new Chart(ctxSpO2, this.spO2);

      const ctxBP = document.getElementById("lineBP");
      this.chartInstanceBP = new Chart(ctxBP, this.bp);
    },

    updateChart() {
      if (this.chartInstanceFC) {
        this.chartInstanceFC.update(); // Update the chart if the chart instance exists
      }
      if (this.chartInstanceSpO2) {
        this.chartInstanceSpO2.update(); // Update the chart if the chart instance exists
      }
      if (this.chartInstanceBP) {
        this.chartInstanceBP.update(); // Update the chart if the chart instance exists
      }
    },

    updateChartData(newData) {
      const date = new Date();
      const timeLabel = date.getHours() + ":" + date.getMinutes();

      // Create new arrays for labels and data points
      if (newData.HR != null) {
        if (
          localStorage.getItem("fcth") != null &&
          newData.HR > localStorage.getItem("fcth")
        ) {
          alert("ALERT FREQUENZA CARDIACA");
        }

        sessionStorage.setItem("fcValue", newData.HR);

        const newLabelsFC = [...this.fc.data.labels, timeLabel];
        const newDataPointsFC = [...this.fc.data.datasets[0].data, newData.HR];

        // Limit the number of data points displayed on the chart
        const maxDataPoints = 10;
        if (newLabelsFC.length > maxDataPoints) {
          newLabelsFC.shift();
          newDataPointsFC.shift();
        }

        // Update the chart instance with the new arrays
        this.chartInstanceFC.data.labels = newLabelsFC;
        this.chartInstanceFC.data.datasets[0].data = newDataPointsFC;

        // Update the chart
        this.updateChart();
      }
      if (newData.SpO2 != null) {
        if (
          localStorage.getItem("spO2th") != null &&
          newData.SpO2 < localStorage.getItem("SpO2th")
        ) {
          alert("ALERT SATURAZIONE");
        }

        sessionStorage.setItem("spO2Value", JSON.stringify(newData.SpO2));

        const newLabelsSpO2 = [...this.spO2.data.labels, timeLabel];
        const newDataPointsSpo2 = [
          ...this.spO2.data.datasets[0].data,
          newData.SpO2,
        ];

        // Limit the number of data points displayed on the chart
        const maxDataPoints = 10;
        if (newLabelsSpO2.length > maxDataPoints) {
          newLabelsSpO2.shift();
          newDataPointsSpo2.shift();
        }

        // Update the chart instance with the new arrays
        this.chartInstanceSpO2.data.labels = newLabelsSpO2;
        this.chartInstanceSpO2.data.datasets[0].data = newDataPointsSpo2;

        // Update the chart
        this.updateChart();
      }
      if (newData.systolic != null) {
        if (
          localStorage.getItem("systh") != null &&
          newData.systolic > localStorage.getItem("systh")
        ) {
          alert("ALERT PRESSIONE SISTOLICA");
        }
        if (
          localStorage.getItem("diasth") != null &&
          newData.diastolic > localStorage.getItem("diasth")
        ) {
          alert("ALERT PRESSIONE DIASTOLICA");
        }

        sessionStorage.setItem("sysValue", JSON.stringify(newData.systolic));
        sessionStorage.setItem("diasValue", JSON.stringify(newData.diastolic));

        const newLabelsBP = [...this.bp.data.labels, timeLabel];
        const newDataPointsBPsys = [
          ...this.bp.data.datasets[0].data,
          newData.systolic,
        ];

        const newDataPointsBPdias = [
          ...this.bp.data.datasets[1].data,
          newData.diastolic,
        ];

        // Limit the number of data points displayed on the chart
        const maxDataPoints = 10;
        if (newLabelsBP.length > maxDataPoints) {
          newLabelsBP.shift();
          newDataPointsBPsys.shift();
          newDataPointsBPdias.shift();
        }

        // Update the chart instance with the new arrays
        this.chartInstanceBP.data.labels = newLabelsBP;
        this.chartInstanceBP.data.datasets[0].data = newDataPointsBPsys;
        this.chartInstanceBP.data.datasets[1].data = newDataPointsBPdias;

        // Update the chart
        this.updateChart();
      }
    },
  },
};
</script>

<style>
.chart-container {
  width: 900px;
  height: 800px;
  font-size: large;
  margin-left: 10%;
  display: flex;
  flex-direction: column;
  gap: 70px; /* Adjust the gap value as needed */
}
</style>
