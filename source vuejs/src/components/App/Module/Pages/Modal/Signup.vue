<template>
  <div
    class="card flex-shrink-0 lg:w-screen w-full lg:max-w-md shadow-2xl bg-base-100 h-screen lg:h-auto flex lg:flex-row lg:flex-nowrap flex-col-reverse"
    style="align-content: center; align-items: center"
  >
    <div
      class="card-body w-[100%] h-[100vh] lg:h-auto absolute lg:relative z-10"
    >
      <div class="self-center"></div>

      <h1 class="text-2xl font-bold text-primary">Marketing Automation</h1>
      <div class="text-2xl font-black uppercase text-gray-700 text-opacity-60">
        Register
      </div>

      <p class="font-bold uppercase text-gray-700 text-opacity-60">
        Create new user
      </p>

      <fieldset class="fieldset">
        <div
          class="alert shadow-lg py-2 alert-success text-white"
          v-if="base.successMsg"
        >
          <div>
            <span class="text-xs">{{ base.successMsg }}</span>
          </div>
        </div>
        <div
          class="alert shadow-lg py-2 alert-error text-white"
          v-if="base.errorMsg"
        >
          <div>
            <span class="text-xs">{{ base.errorMsg }}</span>
          </div>
        </div>
        <label class="fieldset-label">Username</label>
        <input
          type="text"
          class="input w-full"
          placeholder="Username"
          v-model="base.form.username"
          @keyup.enter="fnBase.submit()"
        />
        <label class="fieldset-label">Password</label>
        <input
          type="password"
          class="input w-full"
          placeholder="Password"
          v-model="base.form.password"
          @keyup.enter="fnBase.submit()"
        />

        <label class="fieldset-label">Fristname</label>
        <input
          type="text"
          class="input w-full"
          placeholder="Fristname"
          v-model="base.form.firstname"
          @keyup.enter="fnBase.submit()"
        />

        <label class="fieldset-label">Lastname</label>
        <input
          type="text"
          class="input w-full"
          placeholder="Lastname"
          v-model="base.form.lastname"
          @keyup.enter="fnBase.submit()"
        />
        <!-- <div class="text-left">
          <a class="link link-hover">Forgot password?</a>
        </div> -->
        <button
          class="btn btn-primary mt-4"
          @click="fnBase.submit()"
          :disabled="base.loading"
        >
          Register
        </button>
        <button
          class="btn btn-neutral"
          @click="tab = 'signin'"
          :disabled="base.loading"
        >
          I already have a user account
        </button>
      </fieldset>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, reactive, watch } from "vue";

import { storeToRefs } from "pinia";
import { useAuthStore } from "@/stores/auth";
import { useGlobalStore } from "@/stores/global";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const globalStore = useGlobalStore();
const router = useRouter();

const { token } = storeToRefs(authStore);
const { user } = storeToRefs(authStore);

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue"]);

const tab = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const base = ref({
  form: {
    username: "",
    password: "",
    firstname: "",
    lastname: "",
  },
  errorMsg: "",
  loading: false,
  successMsg: "",
});

const fnBase = {
  submit: async () => {
    if (base.value.loading) return;
    base.value.loading = true;
    const res = await authStore.signup(base.value);
    if (base.value.errorMsg) {
      base.value.success = false;
      base.value.loading = false;
      return;
    }
    fnBase.loginSuccess();
  },
  loginSuccess: async () => {
    base.value.form = {
      username: "",
      password: "",
      firstname: "",
      lastname: "",
    };
    base.value.success = true;
    base.value.loading = false;
  },
};

watch(
  () => authStore.user,
  (newValue) => {
    if (newValue) {
      fnBase.loginSuccess();
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
