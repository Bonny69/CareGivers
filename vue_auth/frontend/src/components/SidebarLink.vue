<script>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { collapsed } from "./state";
import { RouterLink } from "vue-router";

export default {
  props: {
    to: { type: String, required: true },
    icon: { type: String, required: true },
  },
  setup(props) {
    const route = useRoute();
    const isActive = computed(() => route.path === props.to);
    return { isActive, collapsed };
  },
  components: { RouterLink },
};
</script>

<template>
  <router-link :to="to" class="link" :class="{ active: isActive }">
    <i class="icon" :class="icon"></i>
    <Transition name="fade">
      <span v-if="!collapsed"><slot></slot> </span>
    </Transition>
  </router-link>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.link {
  display: flex;
  align-items: center;

  cursor: pointer;
  position: relative;
  font-weight: 400;
  user-select: none;

  font-size: x-large;
  margin: 0.3em 0;
  padding: 0.6em;
  border-radius: 0.25em;
  height: 1.5em;

  color: white;
  text-decoration: none;
}

.link:hover {
  background-color: var(--sidebar-item-hover);
  color: black;
}

.link:active {
  background-color: var(--sidebar-item-active);
}

.link.icon {
  flex-shrink: 0;
  width: 25px;
  margin-right: 10px;
}
</style>
