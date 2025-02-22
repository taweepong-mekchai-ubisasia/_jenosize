<template>
  <div class="card-body w-[100%] h-[100vh] lg:h-auto absolute lg:relative z-10">
    <div class="self-center"></div>
    <h1 class="text-2xl font-bold text-primary">Marketing Automation</h1>
    <div class="text-2xl font-black uppercase text-gray-700 text-opacity-60">
      Signin
    </div>

    <p class="font-bold uppercase text-gray-700 text-opacity-60">
      Verify your access
    </p>

    <fieldset class="fieldset">
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

      <button
        class="btn btn-primary mt-4"
        @click="fnBase.submit()"
        :disabled="base.loading"
      >
        {{ base.loading ? "Logging in..." : "Login" }}
      </button>
      <button
        class="btn btn-neutral"
        @click="base.loading ? '' : (tab = 'signup')"
        :disabled="base.loading"
      >
        Create new account
      </button>

      <div
        class="form-control"
        style="
          display: flex;
          flex-direction: row;
          align-content: center;
          flex-wrap: nowrap;
          justify-content: center;
          align-items: center;
        "
      >
        <label class="label">
          <a href="#" class="label-text-alt link link-hover text-opacity-60"
            >Forgot password?</a
          >
        </label>
        <p class="label-text-alt text-right">
          Visit @
          <a href="#" class="label-text-alt link link-hover font-bold"> </a>
        </p>
      </div>
    </fieldset>
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
  },
  errorMsg: "",
  loading: false,
});

const fnBase = {
  submit: async () => {
    if (base.value.loading) return;

    base.value.loading = true;
    const res = await authStore.login(base.value);
    if (base.value.errorMsg) {
      base.value.success = false;
      base.value.loading = false;
      return;
    }
    fnBase.loginSuccess();
  },
  loginSuccess: async () => {
    router.push("/");
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
