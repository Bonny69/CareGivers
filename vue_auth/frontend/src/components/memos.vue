<template>
  <body>
    <div class="wrapper">
      <div class="container-farmaci">
        <div class="heading-farmaci">
          <h3>FARMACI</h3>
          <hr style="width: 100%" color="black" />
        </div>
        <!-- input -->
        <div class="insert" v-if="!isPatient()">
          <input
            type="text"
            v-model="farmaco"
            placeholder="Aggiungi farmaco..."
          />&nbsp;
          <input
            type="number"
            v-model="dosaggio"
            placeholder="Dosaggio (mg)"
          />&nbsp;
          <input type="time" v-model="farmacOrario" />
          <button @click="SubmitDrug" class="add-btn-farmaci">AGGIUNGI</button>
        </div>
        <!-- table -->
        <div class="table-container-farmaci">
          <table border="{3}" class="table-farmaci">
            <thead>
              <tr>
                <th>Farmaco</th>
                <th>Dosaggio (mg)</th>
                <th>Orario</th>
                <th v-if="!isPatient()">Elimina</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(task, index) in terapia"
                :key="index"
                :class="{ 'blue-bg': task.reminderDate === today }"
              >
                <td>{{ task.farmaco }}</td>
                <td>{{ task.dosaggio }}</td>
                <td>{{ task.orario }}</td>
                <td v-if="!isPatient()">
                  <href
                    class="del-btn"
                    style="border-radius: 4px"
                    @click="deleteDrug(index)"
                  >
                    Elimina
                  </href>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="container-task">
        <div class="heading-task">
          <h3>PROMEMORIA</h3>
          <hr style="width: 100%" color="black" />
        </div>
        <!-- input -->
        <div class="insert" v-if="!isPatient()">
          <input
            type="text"
            v-model="task"
            placeholder="Aggiungi promemoria..."
          />&nbsp; <input type="date" v-model="reminderDate" />&nbsp;
          <input type="time" v-model="reminderTime" />
          <button @click="SubmitTask" class="add-btn-task">AGGIUNGI</button>
        </div>
        <!-- table -->
        <div class="table-container-task">
          <table border="{3}" class="table-task">
            <thead>
              <tr>
                <th>Evento</th>
                <th>Data</th>
                <th>Orario</th>
                <th v-if="!isPatient()">Elimina</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(task, index) in tasks"
                :key="index"
                :class="{ 'blue-bg': task.reminderDate === today }"
              >
                <td>{{ task.evento }}</td>
                <td>{{ task.data }}</td>
                <td>{{ task.orario }}</td>
                <td v-if="!isPatient()">
                  <href
                    class="del-btn"
                    style="border-radius: 4px"
                    @click="deleteTask(index)"
                  >
                    Elimina
                  </href>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </body>
</template>

<script>
/* eslint-disable vue/multi-word-component-names */
import axios from "axios";
import { encrypt, decrypt } from "./cipher";

export default {
  name: "memos",
  data() {
    return {
      ruolo: sessionStorage.getItem("ruolo"),
      today: new Date().toISOString().slice(0, 10),
      task: "",
      farmaco: "",
      farmacOrario: "",
      isSideBarMounted: false,
      dosaggio: "",
      reminderTime: this.memo ? this.memo.reminderTime : "",
      reminderDate: this.memo ? this.memo.reminderDate : "",
      editTask: null,
      tasks: [],
      terapia: [],
      topicDrug: sessionStorage.getItem("email") + "/drug",
      topicTask: sessionStorage.getItem("email") + "/task",
      topicDeleteDrug: sessionStorage.getItem("email") + "/deleteDrug",
      topicDeleteTask: sessionStorage.getItem("email") + "/deleteTask",
      topicAlert: sessionStorage.getItem("email") + "/insAlert",
      client: null,
    };
  },
  created() {
    //console.log(process.env.VUE_APP_SECRET_KEY);
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
    this.setup();
  },

  methods: {
    handleBeforeUnload() {
      event.preventDefault();
      event.returnValue = "";
    },
    setFlag() {
      sessionStorage.setItem("flag", 1);
    },

    checkFlag() {
      return sessionStorage.getItem("flag") == null;
    },

    isPatient() {
      return this.ruolo === "paziente";
    },

    setAlertsFarmaci() {
      for (let i = 0; i < this.terapia.length; i++) {
        const nomeFarmaco = this.terapia[i].farmaco;
        //console.log("nome farmaco: " + nomeFarmaco);
        //console.log(this.terapia[i].orario + " orario terapia");
        const [hours, minutes] = this.terapia[i].orario.split(":");
        const dateObj = new Date();
        dateObj.setHours(hours);
        dateObj.setMinutes(minutes);

        let currentTime = new Date();
        //console.log(currentTime.getTime() + " CURRENTIME");
        let timeDiff = dateObj.getTime() - currentTime.getTime();
        //console.log(timeDiff);
        if (timeDiff > 0) {
          setTimeout(function () {
            if (this.terapia[i].farmaco === nomeFarmaco) {
              //controlla se il farmaco è stato eliminato prima di mandare alert
              console.log("ALERT INVIATO " + nomeFarmaco);
              alert(nomeFarmaco);
            }
          }, timeDiff);
        }
      }
    },

    setAlertsTasks() {
      const currentDate = new Date();
      for (let i = 0; i < this.tasks.length; i++) {
        const evento = this.tasks[i].evento;
        const data = new Date(this.tasks[i].data);
        const orario = this.tasks[i].orario;

        if (
          data.getDate() === currentDate.getDate() &&
          data.getMonth() === currentDate.getMonth() &&
          data.getFullYear() === currentDate.getFullYear()
        ) {
          const [hours, minutes] = orario.split(":");
          const dateObj = new Date();
          dateObj.setHours(hours);
          dateObj.setMinutes(minutes);

          let currentTime = new Date();
          let timeDiff = dateObj.getTime() - currentTime.getTime();

          if (timeDiff > 0) {
            setTimeout(function () {
              if (this.tasks[i].evento === evento) {
                //controlla se l'evento è stato eliminato e quindi ancora uguale a quello salvato prima
                console.log("ALERT INVIATO PER EVENTO " + evento);
                alert(evento + " alle ore " + orario);
              }
            }, timeDiff);
          }
        }
      }
    },

    // delete task
    async deleteTask(index) {
      const data = {
        email: sessionStorage.getItem("email_paziente"),
        evento: encrypt(this.tasks[index].evento),
      };

      await axios.post("http://localhost:5002/deleteTask", data).then(
        //modificare
        (res) => {
          console.log(res.data);
          if (res.status === 200) {
            const message = encrypt(this.tasks[index].evento);
            this.tasks.splice(index, 1);

            const topic =
              sessionStorage.getItem("email_paziente") + "/deleteTask";
            this.client.publish(topic, message);
            alert("promemoria eliminato correttamente");
          }
        },
        (err) => {
          console.log(err);
          alert("Errore in fase di cancellazione del promemoria");
        }
      );
    },

    // Add Task
    async SubmitTask() {
      if (this.task.length === 0) {
        return;
      }
      if (this.editTask != null) {
        this.tasks[this.editTask].name = this.task;
        this.editTask = null;
      } else {
        const memoCiphered = {
          evento: encrypt(this.task),
          data: this.reminderDate,
          orario: encrypt(this.reminderTime),
          email_paziente: sessionStorage.getItem("email_paziente"),
        };
        console.log(memoCiphered);

        await axios.post("http://localhost:5002/insertMemo", memoCiphered).then(
          (res) => {
            console.log(res.data);
            if (res.status === 200) {
              this.tasks.push({
                evento: this.task,
                data: this.reminderDate,
                orario: this.reminderTime,
              });

              const topic = sessionStorage.getItem("email_paziente") + "/task";

              console.log(topic + " TOPIC TASK MQTT");
              this.client.publish(topic, JSON.stringify(memoCiphered));
              alert("promemoria inserito correttamente");
            }
          },
          (err) => {
            console.log(err);
            alert("Errore in fase di inserimento del promemoria");
          }
        );
      }
    },

    async setup() {
      this.client = this.$store.state.selectedItem;
      if (this.isPatient()) {
        console.log(decrypt(sessionStorage.getItem("email")));
        this.getMemos(sessionStorage.getItem("email"));
        this.getFarmaci(sessionStorage.getItem("email"));
        if (this.checkFlag()) {
          // checkFlag() permette di far eseguire la parte dell'if solo una volta all'inizio
          this.setAlertsFarmaci();
          this.setAlertsTasks();

          //iscrizioni
          this.client.subscribe(this.topicAlert);
          this.client.subscribe(this.topicTask);
          this.client.subscribe(this.topicDrug);
          this.client.subscribe(this.topicDeleteDrug);
          this.client.subscribe(this.topicDeleteTask);

          this.client.on("message", (topic, message) => {
            if (topic === this.topicDrug) {
              console.log("drug mqtt call");
              this.setAlertDrugFromMqtt(message);
            }
            if (topic === this.topicAlert) {
              console.log("alert TRIGGERED");
              const data = JSON.parse(message.toString());

              console.log("ALERT SOGLIE " + data);
              localStorage.setItem("fcth", data.fcth);
              localStorage.setItem("spO2th", data.spO2th);
              localStorage.setItem("systh", data.systh);
              localStorage.setItem("diasth", data.diasth);
              alert("nuove soglie inserite");
            }
            if (topic === this.topicTask) {
              console.log("task mqtt call");
              this.setAlertTaskFromMqtt(message);
            }
            if (topic === this.topicDeleteDrug) {
              console.log("delete drug mqtt call");
              const data = decrypt(message.toString());
              console.log(data);

              for (let i = 0; i < this.terapia.length; i++) {
                if (this.terapia[i].farmaco === data) {
                  console.log(this.terapia[i].farmaco === data);
                  this.terapia.splice(i, 1);
                  alert("terapia eliminata");
                }
              }
            }
            if (topic === this.topicDeleteTask) {
              const data = decrypt(message.toString());
              console.log("task mqtt call");

              for (let i = 0; i < this.tasks.length; i++) {
                if (this.tasks[i].evento === data) {
                  this.tasks.splice(i, 1);
                  alert("evento eliminato");
                }
              }
            }
          });
          this.$store.dispatch("updateSelectedItem", this.client);
        }
        this.setFlag();
      } else {
        console.log(sessionStorage.getItem("email_paziente"));
        this.getMemos(sessionStorage.getItem("email_paziente"));
        this.getFarmaci(sessionStorage.getItem("email_paziente"));

        if (this.checkFlag()) {
          this.setAlertsFarmaci();
          this.setAlertsTasks();
          this.setFlag();
          const topicPV = sessionStorage.getItem("email_paziente") + "/pv";

          const topicUrgentAlert =
            sessionStorage.getItem("email_paziente") + "/urgentAlert";

          this.client.subscribe(topicPV);
          this.client.subscribe(topicUrgentAlert);
          this.client.on("message", (topic, message) => {
            if (topic === topicUrgentAlert) {
              console.log("alert urgente");
              const payload = message.toString();
              alert("ATTENZIONE: " + decrypt(payload));
            }
          });
          this.$store.dispatch("updateSelectedItem", this.client);
        }
      }
    },

    setAlertTaskFromMqtt(message) {
      const data = JSON.parse(message.toString());
      console.log(data); // Parse JSON message into an object

      const dateParts = data.data.split("/");
      const date = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
      const attivita = {
        evento: decrypt(data.evento),
        orario: decrypt(data.orario),
        data: data.data,
      };
      const currentDate = new Date();

      if (
        date.getDate() === currentDate.getDate() &&
        date.getMonth() === currentDate.getMonth() &&
        date.getFullYear() === currentDate.getFullYear()
      ) {
        const [hours, minutes] = data.orario.split(":");
        const dateObj = new Date();
        dateObj.setHours(hours);
        dateObj.setMinutes(minutes);

        let currentTime = new Date();
        let timeDiff = dateObj.getTime() - currentTime.getTime();

        if (timeDiff > 0) {
          setTimeout(function () {
            console.log("ALERT INVIATO PER EVENTO " + data.evento);
            alert(data.evento + " alle ore " + data.orario);
          }, timeDiff);
        }
      }
      this.tasks.push(attivita);
      alert("nuovo evento inserito!");
    },

    setAlertDrugFromMqtt(message) {
      //console.log(topicMemo + " " + message);
      console.log("drug mqtt triggered");

      const data = JSON.parse(message.toString());
      console.log(data); // Parse JSON message into an object

      const medicinale = {
        farmaco: decrypt(data.farmaco),
        orario: decrypt(data.orario),
        dosaggio: data.dosaggio,
      };

      this.terapia.push(medicinale);
      console.log(this.terapia);
      console.log(medicinale);

      const [hours, minutes] = data.orario.split(":");
      const dateObj = new Date();
      dateObj.setHours(hours);
      dateObj.setMinutes(minutes);
      let currentTime = new Date();
      let timeDiff = dateObj.getTime() - currentTime.getTime();
      alert("terapia aggiornata!");

      if (timeDiff > 0) {
        setTimeout(function () {
          //controlla se il farmaco è stato eliminato prima di mandare alert
          console.log("ALERT INVIATO " + medicinale.farmacox);
          alert(
            "assumere " + medicinale.farmaco + " " + medicinale.dosaggio + "mg"
          );
        }, timeDiff);
      }
    },

    async SubmitDrug() {
      if (this.farmaco.length === 0) {
        return;
      }
      if (this.editTask != null) {
        this.tasks[this.editTask].name = this.task;
        this.editTask = null;
      } else {
        const medicinale = {
          farmaco: this.farmaco,
          orario: this.farmacOrario,
          dosaggio: this.dosaggio,
          email_paziente: sessionStorage.getItem("email_paziente"),
        };

        const medicinaleCiphered = {
          farmaco: encrypt(this.farmaco),
          orario: encrypt(this.farmacOrario),
          dosaggio: this.dosaggio.toString(),
          email_paziente: sessionStorage.getItem("email_paziente"),
        };

        await axios
          .post("http://localhost:5002/insertTherapy", medicinaleCiphered)
          .then(
            (res) => {
              console.log(res.data);
              if (res.status === 200) {
                this.terapia.push(medicinale);
                const topic =
                  sessionStorage.getItem("email_paziente") + "/drug";
                console.log(topic + " TOPIC DRUG");
                this.client.publish(topic, JSON.stringify(medicinaleCiphered));
                alert("terapia inserito correttamente");
              }
            },
            (err) => {
              console.log(err);
              alert("Errore in fase di inserimento della terapia");
            }
          );
      }
    },

    async deleteDrug(index) {
      const data = {
        email: sessionStorage.getItem("email_paziente"),
        farmaco: encrypt(this.terapia[index].farmaco),
      };
      await axios.post("http://localhost:5002/deleteDrug", data).then(
        (res) => {
          console.log(res.data);
          if (res.status === 200) {
            const message = encrypt(this.terapia[index].farmaco);
            console.log(message);
            const topic =
              sessionStorage.getItem("email_paziente") + "/deleteDrug";

            this.terapia.splice(index, 1);
            this.client.publish(topic, message);
            alert("farmaco eliminato correttamente");
          }
        },
        (err) => {
          console.log(err);
          alert("Errore in fase di cancellazione del farmaco");
        }
      );
    },

    async getMemos(email_) {
      const email = { email: email_ };
      await axios
        .get("http://localhost:5002/getMemos", { params: email })
        .then((response) => {
          const documents = response.data;

          for (let i = 0; i < documents.length; i++) {
            const promemoria = {
              evento: decrypt(documents[i].evento),
              orario: decrypt(documents[i].orario),
              data: documents[i].data.substr(0, 10), //substr aggiusta data
            };
            this.tasks.push(promemoria);
          }
        });
    },

    async getFarmaci(email_) {
      const email = { email: email_ };

      await axios
        .get("http://localhost:5002/getTherapy", { params: email })
        .then((response) => {
          const documents = response.data;

          for (let i = 0; i < documents.length; i++) {
            const farmaco = {
              farmaco: decrypt(documents[i].farmaco),
              orario: decrypt(documents[i].orario),
              dosaggio: documents[i].dosaggio,
            };
            this.terapia.push(farmaco);
          }
        });
    },
  },
};
</script>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: -220px;
}

.heading-farmaci {
  font-weight: bold;
  margin-bottom: 30px;
  color: #c79598;
}

.heading-task {
  font-weight: bold;
  margin-bottom: 30px;
  color: darkgoldenrod;
}

.del-btn {
  background-color: #88474c;
  color: white;
}

.container-farmaci {
  width: 1300px;
  margin-left: 250px;
  text-align: center;
  margin-top: 150px;
}

.container-task {
  width: 1300px;
  margin-left: 250px;
  text-align: center;
  margin-top: 150px;
}

.table-container-farmaci {
  max-height: 200px;
  overflow-y: scroll;
}

.table-container-task {
  max-height: 200px;
  overflow-y: scroll;
}

.table-farmaci {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
  margin-top: 20px;
  background-color: #c79598;
}

.table-task {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
  margin-top: 20px;
  background-color: palegoldenrod;
}

td,
th {
  border: 1px solid #dddddd;
  text-align: center;
  padding: 8px;
}

tr:nth-child(even) {
  background-color: #dddddd;
}

button:hover {
  background-color: #9e331d;
}

.blue-bg {
  background-color: blue;
}

.add-btn-farmaci {
  border: none;
  width: 100px;
  height: 30px;
  padding: 2px;
  background-color: grey;
  color: white;
  margin-left: 50px;
  margin-bottom: 20px;
  border-radius: 5px;
  transition: o.25s;
  cursor: pointer;
}

.add-btn-task {
  border: none;
  width: 100px;
  height: 30px;
  padding: 2px;
  background-color: grey;
  color: white;
  margin-left: 50px;
  margin-bottom: 20px;
  border-radius: 5px;
  transition: o.25s;
  cursor: pointer;
}

.edit-btn {
  border: none;
  background-color: #77b631;
  color: white;
}
</style>
