<template>
  <Side_bar></Side_bar>
  <div class="container"></div>
  <div>
    <RouterView></RouterView>
  </div>
</template>

<script>
import Side_bar from "./components/Side_bar.vue";

export default {
  name: "App",
  components: { Side_bar },
  data() {
    return {
      shouldIncludeComponent: true,
      user: "",
    };
  },
};
</script>
