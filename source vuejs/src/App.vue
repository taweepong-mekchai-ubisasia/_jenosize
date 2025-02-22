<template>
  <div class="scroll-smooth">
    <router-view ref="view" />
  </div>
</template>
<script setup>
import { ref, onMounted, onBeforeUnmount, watch, computed } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useGlobalStore } from "@/stores/global";
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const globalStore = useAuthStore();

import { useFavicon } from "@vueuse/core";

const icon = useFavicon();

onMounted(async () => {
  const token = localStorage.getItem("user_token");
  useAuthStore.token = token;
  if (token && route.name === "Authen") {
    try {
      const userData = await authStore.getUserFromToken(token);
      if (userData) {
        if (route.name === "Authen") {
          return router.push("/");
        }
      }
      // if (userData) {
      //   await authStore.setUser(userData);
      // }
    } catch (error) {
      authStore.logout();
    }
  }
});
</script>

<style lang="scss">
#app,
html,
* {
  --pure-white: #ffffff;
  --primary-color: #b9c6d2;
  --secondary-color: #d0dde9;
  --tertiary-color: #edf0f8;
  --accent-color: #ff3e00;
  --heading-color: rgba(0, 0, 0, 0.7);
  --text-color: #444444;
  --background-without-opacity: rgba(255, 255, 255, 0.7);
  --column-width: 42rem;
  --column-margin-top: 4rem;
  scroll-behavior: smooth;
}

body {
  height: 100dvh;
  --tw-bg-opacity: 1;
  background-color: var(--fallback-b2, oklch(var(--b2) / var(--tw-bg-opacity)));
}

body::before {
  content: "";
  width: 80vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 10vw;
  z-index: -1;
  background: radial-gradient(
    50% 50% at 50% 50%,
    var(--pure-white) 0%,
    rgba(255, 255, 255, 0) 100%
  );
  opacity: 0.05;
}

/* width */
::-webkit-scrollbar {
  width: 3.5px;
  height: 3.5px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #b6b6b6;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #a4a4a4;
}
select:active,
select:hover,
select:focus,
input:active,
input:hover,
input:focus {
  outline-width: 0px !important;
}

tr,
td {
  white-space: nowrap;
}
.crop {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 10px;
}
:root:has(
    :is(
        .modal-open,
        .modal:target,
        .modal-toggle:checked + .modal,
        .modal[open]
      )
  ) {
  scrollbar-gutter: unset !important;
}
</style>
