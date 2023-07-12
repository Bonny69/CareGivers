<template>
  <Side_bar></Side_bar>
  <div class="container"></div>
  <div v-if="isLogged()" style="font-size: 30px">
    {{ user }}
  </div>
  <div>
    <RouterView></RouterView>
  </div>
</template>

<script>
import Side_bar from "./components/Side_bar.vue";
import { decrypt } from "./components/cipher";

export default {
  name: "App",
  components: { Side_bar },
  data() {
    return {
      shouldIncludeComponent: true,
      user: "",
    };
  },
  methods: {
    isLogged() {
      let timeOut;
      timeOut = setTimeout(() => {
        console.log("isloogged");
        if (sessionStorage.getItem("token") != null) {
          this.user = decrypt(
            sessionStorage.getItem("email") + "0000000000000000000000000000000"
          );
          clearTimeout(timeOut);
        }
      }, 1000);
    },
  },
};
</script>
