<script>
import { collapsed, toggleSidebar, sidebarWidth } from "./state";
import SidebarLink from "./SidebarLink.vue";
import mqtt from "mqtt/dist/mqtt";
import { ref } from "vue";
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState(["user"]),
  },
  props: {},
  components: { SidebarLink },
  setup() {
    return { collapsed, toggleSidebar, sidebarWidth };
  },

  data() {
    return {
      brokerUrl: "mqtt://localhost:1234",
      clientMQTT: null,
      flag: "",
      isInitialized: ref(false),
    };
  },

  created() {
    window.addEventListener("beforeunload", this.handleBeforeUnload);
  },
  beforeUnmount() {
    window.removeEventListener("beforeunload", this.handleBeforeUnload);
  },

  async mounted() {
    if (!this.checkFlag()) {
      this.setFlag();
      console.log(this.checkFlag());
      await this.connectMQTT();
      await this.updateVuexConnection();
      //console.log(this.$store.state.selectedItem);
    }
  },
  methods: {
    handleBeforeUnload() {
      event.preventDefault();
      event.returnValue = "";
    },
    connectMQTT() {
      return new Promise((resolve) => {
        //connessione resa sincrona per avere cascata in seguito iscrizioni
        const client = mqtt.connect(this.brokerUrl);
        client.on("connect", () => {
          console.log("Connected to MQTT broker");
          this.clientMQTT = client;
          resolve();
        });
      });
    },
    updateVuexConnection() {
      return new Promise((resolve) => {
        this.$store.dispatch("updateSelectedItem", this.clientMQTT);
        resolve();
      });
    },
    setFlag() {
      sessionStorage.setItem("flagBar", "1");
    },

    checkFlag() {
      return sessionStorage.getItem("flagBar") === "1";
    },
  },
};
</script>

<template>
  <div class="sidebar" :style="{ width: sidebarwidth }">
    <br />
    <h1>
      <span v-if="collapsed">
        <div class="scritta">
          <div>C</div>
          <div>A</div>
          <div>R</div>
          <div>E</div>
          <div>G</div>
          <div>I</div>
          <div>V</div>
          <div>E</div>
          <div>R</div>
          <div>S</div>
        </div>
      </span>
      <span v-else>&nbsp;Menù</span>
    </h1>

    <br /><br /><br />
    {{ user }}
    <br /><br /><br /><br /><br /><br />
    <SidebarLink to="/analytics">analytics</SidebarLink>
    <br />
    <SidebarLink to="/alert">alert</SidebarLink>
    <br />
    <SidebarLink to="/memos">promemoria</SidebarLink>
    <br />
    <SidebarLink to="/referenti">associa</SidebarLink>
    <br />

    <span
      class="collapse-icon"
      :class="{ 'rotate-180': collapsed }"
      @click="toggleSidebar"
    >
      <i class="fas fa-angle-double-left"></i>
    </span>
  </div>
</template>

<style>
:root {
  --sidebar-bc-color: #9e331d;
  --sidebar-item-hover: #c79598;
  --sidebar-item-active: #276749;
}
</style>

<style scoped>
.sidebar {
  color: white;
  background-color: var(--sidebar-bc-color);
  float: left;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  bottom: 0;
  padding: 0.4em;
  padding-right: 70px;
  transition: 0.3s ease;
  display: flex;
  text-align: center;
  flex-direction: column;
}

.collapse-icon {
  position: absolute;
  bottom: 0;
  padding: 0.75em;
  color: rgba(255, 255, 255, 0.7);
  transition: 0.2s linear;
}

.rotate-180 {
  transform: rotate(180deg);
  transition: 0.2s linear;
}
</style>
