<template>
  <div class="border-2 border-dashed border-primary/50 w-full">
    <div class="w-full">
      <div class="flex justify-between items-center bg-neutral/80 p-2">
        <template v-if="!edit">
          <div class="text-white font-extrabold">Email Content</div>
          <button
            class="btn text-warning btn-xs float-right btn-link no-underline hover:no-underline"
            @click="edit = true"
          >
            <Icon icon="tabler:edit" class="h-4 w-4" />
          </button>
        </template>
        <template v-else>
          <div class="text-white/60 font-extrabold">
            [ CTRL + S ] to SAVE
            <span class="text-red-300 ml-4"
              >** จำเป็นต้องบันทึกการเปลี่ยนแปลงทุกครั้ง</span
            >
          </div>
          <button
            class="btn text-error btn-xs float-right btn-link no-underline hover:no-underline"
            @click="edit = false"
          >
            <Icon icon="mingcute:close-fill" class="h-4 w-4" />
          </button>
        </template>
      </div>
    </div>
    <div
      class="ql-editor"
      ref="contentRef"
      :class="`${!edit ? '' : 'hidden'}`"
    ></div>
    <div
      class="overflow-x-auto w-full max-h-[65vh] min-h-[65vh] my-4"
      :class="`${!edit ? 'hidden' : ''}`"
    >
      <QuillEditor
        ref="quillRef"
        theme="snow"
        toolbar="full"
        :class="`max-h-[55vh] min-h-[55vh]`"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, computed } from "vue";
import { fetchQuery, buildPath } from "@/composables/useQuery";
import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";
import Query from "@/assets/js/fetch.js";
import { storeToRefs } from "pinia";

import { useAuthStore } from "@/stores/auth";
import { useGlobalStore } from "@/stores/global";

const authStore = useAuthStore();
const globalStore = useGlobalStore();

import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();

const { user, token } = storeToRefs(authStore);

const isCtrl = ref(false);
const edit = ref(false);
const content = ref("");
const contentRef = ref(null);
const quillRef = ref(null);

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(["update:modelValue", "update:success"]);

const base = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const keyup = (e) => {
  if (e.key === "Control") isCtrl.value = false;
};

const keydown = (e) => {
  if (e.key === "Control") isCtrl.value = true;
  if (
    (e.key === "S" || e.key === "s" || e.key === "ห" || e.key === "ฆ") &&
    isCtrl.value
  ) {
    e.preventDefault();
    saveTemplate();
  }
};

const getTemplate = async () => {
  if (!contentRef.value || !base.value.object.contents) return;
  try {
    const response = await fetch(
      `${globalStore.serviceUrl}upload/file/${base.value.object.contents}?pathfile=templates`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      console.error("ERROR QUERY");
      return;
    }
    const res = await response.text();
    content.value = res;
    contentRef.value.innerHTML = content.value;
  } catch (error) {
    console.log(error);
  }
};

const saveTemplate = async () => {
  if (!quillRef.value) return;
  const formData = new FormData();
  const htmlContent = quillRef.value.getHTML();
  const blob = new Blob([htmlContent], { type: "text/html" });
  const file = new File([blob], "template.html", { type: "text/html" });
  base.value.object.file = file;
  edit.value = false;
  contentRef.value.innerHTML = htmlContent;
};

onMounted(async () => {
  document.addEventListener("keyup", keyup);
  document.addEventListener("keydown", keydown);
  await getTemplate();
  const formData = new FormData();
  const htmlContent = quillRef.value.getHTML();
  const blob = new Blob([htmlContent], { type: "text/html" });
  const file = new File([blob], "template.html", { type: "text/html" });
  base.value.object.file = file;
});

onBeforeUnmount(() => {
  document.removeEventListener("keyup", keyup);
  document.removeEventListener("keydown", keydown);
});

watch(
  () => edit.value,
  (newValue) => {
    if (newValue) {
      quillRef.value.setHTML(content.value);
      const formData = new FormData();
      const blob = new Blob([content.value], { type: "text/html" });
      const file = new File([blob], "template.html", { type: "text/html" });
      base.value.object.file = file;
    }
  }
);
</script>
