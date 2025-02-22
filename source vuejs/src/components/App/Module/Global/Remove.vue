<template>
  <teleport to="#app">
    <input type="checkbox" class="modal-toggle" v-model="base.modal" />
    <div class="modal">
      <div class="modal-box relative">
        <button
          @click="base.modal = false"
          class="btn btn-xs sm:btn-sm btn-circle absolute right-2 top-2"
          :disabled="base.loading"
        >
          ✕
        </button>
        <h3 class="text-lg font-bold text-error">REMOVE ITEM</h3>
        <div class="divider my-1"></div>
        <div class="card-body overflow-auto max-h-[60vh]">
          Are your sure for remove this item?
        </div>

        <div class="backdrop-blur sticky top-0 items-center gap-2 px-4 flex">
          <div class="flex-1 form-control mt-2">
            <button
              @click="base.modal = false"
              class="btn btn-xs sm:btn-sm md:btn-md w-full"
              :disabled="base.loading"
            >
              Cancel
            </button>
          </div>
          <div class="flex-1 form-control mt-2">
            <button
              class="btn btn-xs sm:btn-sm md:btn-md btn-error text-white w-full"
              @click="confirm_remove()"
              :disabled="base.loading"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script>
import { useStore } from "vuex";
import { fetchQuery, buildPath } from "@/composables/useQuery";

import { computed, defineComponent } from "vue";

export default defineComponent({
  name: "Remove",
  props: {
    modelValue: {
      type: Object,
      required: true,
    },
  },
  emits: ["update:modelValue", "update:success"],
  setup(props, { emit }) {
    const base = computed({
      get: () => props.modelValue,
      set: (value) => emit("update:modelValue", value),
    });

    const confirm_remove = async () => {
      if (base.value.loading) return;
      base.value.loading = true;
      try {
        const body = {
          code: base.value.current,
          rows: base.value.rows ? base.value.rows : [{ code: base.value.code }],
        };
        const path = buildPath(null, base.value.path);
        const res = await fetchQuery({}, "DELETE", path, body);
        if (!res.status) {
          console.error("Failed to save data");
          return;
        }

        base.value.modal = false;
      } catch (error) {
        console.error("An error occurred during save operation:", error);
      } finally {
        base.value.loading = false;
        emit("update:success", null);
      }
    };

    return {
      base,
      confirm_remove,
    };
  },
});
</script>
