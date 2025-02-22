<template>
  <input
    type="checkbox"
    id="modal-confirm"
    ref="confirm"
    class="modal-toggle"
    v-model="confirm"
  />
  <div class="modal">
    <div class="modal-box relative text-center m-0 p-0">
      <div class="navbar absolute top-0 left-0 bg-transparent z-10">
        <div class="flex-1"></div>
        <div class="flex-none">
          <label
            for="modal-confirm"
            class="btn btn-sm btn-ghost absolute right-2 top-2"
          >
            ✕
          </label>
        </div>
      </div>
      <div class="card-body pb-2">
        <div class="text-xl font-bold">
          <Icon icon="zondicons:exclamation-outline" />
        </div>
        <div class="text-xl font-bold">Confirm Change</div>
        <div class="form-control mt-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <button
                class="btn btn-sm md:btn-md lg:btn-lg bg-black text-white border-black w-full"
                @click="confirm = !confirm"
              >
                Cancel
              </button>
            </div>
            <div>
              <button
                class="btn btn-sm md:btn-md lg:btn-lg bg-black text-white border-black w-full"
                @click="update()"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <slot name="modal"></slot>
  <div class="flex h-screen" :data-theme="theme">
    <aside
      :class="[
        'fixed inset-y-0 z-50 w-full lg:w-64 bg-gray-800 text-white p-4 transition-transform transform',
        sidebarOpen ? 'translate-x-0 ' : '-translate-x-full lg:hidden',
        'lg:relative ',
      ]"
    >
      <div class="flex justify-between items-center">
        <h1 class="text-lg text-white/50 font-extrabold">
          Marketing Automation
        </h1>
        <button
          @click="toggleSidebar"
          class="p-2 btn btn-link rounded lg:hidden hover:no-underline"
        >
          <Icon icon="ic:outline-close" class="h-4 w-4" />
        </button>
      </div>
      <nav class="mt-4" v-if="user">
        <ul class="menu rounded-box w-full">
          <li>
            <a
              href="#"
              class="flex gap-4 group hover:no-underline"
              :class="$route.name == 'Dashboard' ? 'active' : ''"
              @click="menutype == 'Dashboard' ? '' : changepage('Dashboard')"
            >
              <span class="flex-1 text-1xl"> Dashboard </span>
            </a>
          </li>
          <li>
            <details open>
              <summary>Marketing</summary>
              <ul>
                <li>
                  <a
                    href="#"
                    class="flex gap-4 group hover:no-underline"
                    :class="$route.name == 'Campaign' ? 'active' : ''"
                    @click="
                      menutype == 'Campaign' ? '' : changepage('Campaign')
                    "
                  >
                    <span class="flex-1 text-1xl"> Campaign </span>
                  </a>
                </li>
              </ul>
            </details>
          </li>

          <li>
            <details open>
              <summary>System</summary>
              <ul>
                <li>
                  <a
                    href="#"
                    class="flex gap-4 group hover:no-underline"
                    :class="$route.name == 'User' ? 'active' : ''"
                    @click="menutype == 'User' ? '' : changepage('User')"
                  >
                    <span class="flex-1 text-1xl"> User </span>
                  </a>
                </li>
              </ul>
            </details>
          </li>
        </ul>
      </nav>
    </aside>
    <div class="flex-1 flex flex-col">
      <header
        class="bg-primary text-white p-4 flex justify-between items-center"
        ref="navbar"
      >
        <div class="flex flex-row gap-x-2">
          <button @click="toggleSidebar" class="hover:bg-primary rounded">
            <Icon icon="mingcute:menu-fill" />
          </button>
          <h2 class="text-lg font-extrabold">
            {{ sidebarOpen ? "" : "Marketing Automation" }}
          </h2>
        </div>
        <div class="flex flex-row gap-x-2">
          <div class="dropdown dropdown-end flex gap-1">
            <div
              tabindex="0"
              role="button"
              class="btn btn-link no-underline text-white hover:no-underline btn-xs flex"
            >
              <Icon icon="mdi:account-circle" class="w-5 h-5" />
              <span class="font-bold text-sm hidden lg:block"
                >{{ user?.firstname }} {{ user?.lastname }}</span
              >
            </div>
            <div
              tabindex="0"
              role="button"
              class="btn btn-link no-underline text-white hover:no-underline btn-xs flex"
            >
              <button
                class="btn btn-link no-underline hover:no-underline text-white px-0 font-extrabold"
                @click="authStore.logout()"
              >
                <Icon icon="hugeicons:logout-04" class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main class="flex-1 p-4 overflow-auto">
        <div ref="breadcrumbs">
          <slot name="breadcrumbs"></slot>
        </div>
        <slot name="view"></slot>
      </main>

      <footer class="bg-base-content text-white p-4 text-center">
        © 2024 MyApp. All Rights Reserved.
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, computed } from "vue";

import { useAuthStore } from "@/stores/auth";
import { useGlobalStore } from "@/stores/global";

const authStore = useAuthStore();
const globalStore = useGlobalStore();

import { useRouter } from "vue-router";
const router = useRouter();

const profile = ref(null);

const sidebarOpen = ref(false);

const confirm = ref(false);
const menutype = ref(null);

const user = computed(() => authStore.user);
const theme = computed(() => globalStore.theme);
const serviceUrl = computed(() => globalStore.serviceUrl);

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};

const changepage = (page) => {
  router.push({ name: `${page}` });
};

const navbarHeight = ref(0);
const breadcrumbsHeight = ref(0);
const navbar = ref(null);
const breadcrumbs = ref(null);
const updateContentHeight = () => {
  navbarHeight.value = navbar.value.offsetHeight || 0;
  breadcrumbsHeight.value = breadcrumbs.value.offsetHeight || 0;
  sidebarOpen.value = !(screen.width <= 1024);
};

onMounted(async () => {
  updateContentHeight();
  window.addEventListener("resize", updateContentHeight);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateContentHeight);
});
defineExpose({
  navbarHeight,
  breadcrumbsHeight,
});
</script>

<style scoped></style>
