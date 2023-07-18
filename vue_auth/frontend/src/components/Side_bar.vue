<script>
import { collapsed, toggleSidebar, sidebarWidth } from "./state";
import SidebarLink from "./SidebarLink.vue";
import mqtt from "mqtt/dist/mqtt";
import { ref } from "vue";
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState(["user"]),
    userLine1() {
      // Split the user string into two lines
      return this.user ? this.user.substring(0, 10) : "";
    },
    userLine2() {
      // Split the user string into two lines
      return this.user ? this.user.substring(10) : "";
    },
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
      const enhancedSidebarWidth = "300px";
      this.setFlag();
      await this.connectMQTT();
      await this.updateVuexConnection();
      return { collapsed, toggleSidebar, sidebarWidth: enhancedSidebarWidth };
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
  <div class="sidebar" :style="{ width: sidebarWidth }">
    <br />
    <div class="user-lines">
      <span class="user-line">{{ userLine1 }}</span>
      <span class="user-line">{{ userLine2 }}</span>
    </div>
    <br />
    <br /><br />
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

      <span v-else style="color: white">&nbsp;Menù</span>
    </h1>

    <br /><br /><br />
    <SidebarLink to="/analytics">Analytics</SidebarLink>
    <br />
    <SidebarLink to="/alert">Alert</SidebarLink>
    <br />
    <SidebarLink to="/memos">Promemoria</SidebarLink>
    <br />
    <SidebarLink to="/referenti">Associa</SidebarLink>
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
  --sidebar-bc-color: #3700b3;
  --sidebar-item-hover: #03dac5;
  --sidebar-item-active: #587099;
}

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

.user-lines {
  font-size: 24px;
  line-height: 1.2;
}

.user-line {
  display: block;
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
