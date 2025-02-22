<template>
  <div :data-theme="globalStore.theme">
    <div class="lg:hero min-h-screen lg:bg-base-200">
      <div class="lg:hero-content text-center">
        <div class="w-full lg:max-w-2xl">
          <div
            class="card flex-shrink-0 lg:w-screen w-full lg:max-w-md shadow-2xl bg-base-100 h-screen lg:h-auto flex lg:flex-row lg:flex-nowrap flex-col-reverse"
            style="align-content: center; align-items: center"
          >
            <template v-if="tab == 'signin'"
              ><AppModulePagesModalSignin v-model="tab"
            /></template>

            <template v-if="tab == 'signup'">
              <AppModulePagesModalSignup v-model="tab"
            /></template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive, watch } from "vue";
import AppModulePagesModalSignin from "@/components/App/Module/Pages/Modal/Signin.vue";
import AppModulePagesModalSignup from "@/components/App/Module/Pages/Modal/Signup.vue";

import { storeToRefs } from "pinia";
import { useAuthStore } from "@/stores/auth";
import { useGlobalStore } from "@/stores/global";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const globalStore = useGlobalStore();
const router = useRouter();

const { token } = storeToRefs(authStore);
const { user } = storeToRefs(authStore);

const tab = ref("signin");

const base = ref({
  form: {
    username: "",
    password: "",
  },
  errorMsg: "",
});

const authen = ref({
  form: {},
  logining: false,
  errorMsg: "",
});

const login = async () => {
  authen.value.logining = true;
  const res = await authStore.login(authen.value);
  if (authen.value.errorMsg) {
    authen.value.success = false;
    authen.value.logining = false;
    return;
  }
  loginSuccess();
};

const loginSuccess = async () => {
  authen.value.success = true;
  authen.value.logining = false;
};

watch(
  () => authStore.user,
  (newValue) => {
    if (newValue) {
      loginSuccess();
    } else {
      authStore.logout();
    }
  }
);

onMounted(async () => {});
</script>

<style lang="scss" scoped></style>

<style scoped>
/* เพิ่มสไตล์ที่คุณต้องการ */
</style>
