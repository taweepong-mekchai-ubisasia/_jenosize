<template>
  <teleport to="#app">
    <input type="checkbox" class="modal-toggle" v-model="base.form.modal" />
    <div class="modal" v-if="base.form.modal">
      <div
        class="modal-box relative w-11/12 max-w-screen p-2 lg:p-4 max-h-screen"
      >
        <button
          @click="base.form.modal = false"
          class="btn btn-xs sm:btn-sm btn-circle absolute right-2 top-2"
          :disabled="base.form.loading"
        >
          ✕
        </button>
        <h3 class="text-md md:text-lg font-bold text-primary">
          {{
            base.form.object.code
              ? `Email Campaign : ${base.form.object.code}`
              : "New Email Campaign"
          }}
        </h3>
        <div class="divider my-1"></div>
        <div
          class="card-body overflow-auto max-h-[80vh] p-2 pb-0 lg:p-4 lg:pb-0 mb-0"
        >
          <div class="grid gap-4">
            <!-- <div class="form-control">
              <div class="label justify-end my-0 py-0">
                <label class="label cursor-pointer flex gap-3 p-0">
                  <span class="label-text">Is Active</span>
                  <input
                    type="checkbox"
                    class="toggle toggle-xs sm:toggle-sm md:toggle-md toggle-success"
                    checked="checked "
                    v-model="base.form.object.G_IsActive"
                  />
                </label>
              </div>
            </div> -->
            <div class="form-control">
              <div class="join w-full">
                <button
                  class="btn join-item btn-xs sm:btn-sm w-24 disabled:text-white"
                  disabled
                >
                  Campaign
                </button>
                <input
                  type="text"
                  placeholder="Campaign"
                  class="input input-xs sm:input-sm input-bordered join-item w-full"
                  v-model="base.form.object.campaign"
                />
              </div>
            </div>
            <div class="form-control">
              <div class="join w-full">
                <button
                  class="btn join-item btn-xs sm:btn-sm w-24 disabled:text-white"
                  disabled
                >
                  Subject
                </button>
                <input
                  type="text"
                  placeholder="Subject"
                  class="input input-xs sm:input-sm input-bordered w-full"
                  v-model="base.form.object.subject"
                />
              </div>
            </div>
            <div class="form-control">
              <div class="join w-full">
                <AppModuleGlobalQuillEditor v-model="base.form" />
              </div>
            </div>
          </div>
        </div>

        <div
          class="backdrop-blur sticky top-0 items-center gap-2 xs:px-0 sm:px-0 px-4 flex"
        >
          <div class="flex-1 form-control mt-6">
            <button
              @click="base.form.modal = false"
              class="btn btn-xs sm:btn-sm w-full"
              :disabled="base.form.loading"
            >
              Cancel
            </button>
          </div>
          <div class="flex-1 form-control mt-6" @click="fnBase.save()">
            <button
              class="btn btn-primary text-white btn-xs sm:btn-sm w-full"
              :disabled="base.form.loading"
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
import { fetchQuery, buildPath } from "@/composables/useQuery";
import AppModuleGlobalQuillEditor from "@/components/App/Module/Global/QuillEditor.vue";
import { computed, defineComponent } from "vue";
import { useAuthStore } from "@/stores/auth";

export default defineComponent({
  components: {
    AppModuleGlobalQuillEditor,
  },
  inheritAttrs: false,
  name: "ModalCampaign",
  props: {
    modelValue: {
      type: Object,
      required: true,
    },
    createValue: {
      type: String,
      required: "",
    },
  },
  emits: ["update:modelValue", "update:success"],
  setup(props, { emit }) {
    const authStore = useAuthStore();
    const base = computed({
      get: () => props.modelValue,
      set: (value) => emit("update:modelValue", value),
    });

    const fnBase = {
      create: () => {
        base.value.form.current = null;
        base.value.form.object = {};
        base.value.form.method = "POST";
        base.value.form.modal = true;
      },
      edit: (code, index) => {
        base.value.form.object = { ...base.value.rows[index] };
        base.value.form.current = code;
        base.value.form.method = "PUT";

        base.value.form.modal = true;
      },
      save: async () => {
        if (base.value.form.loading) return;
        base.value.form.loading = true;
        try {
          const formData = new FormData();
          formData.append("code", base.value.form.object.code);
          formData.append("campaign", base.value.form.object.campaign);
          formData.append("subject", base.value.form.object.subject);
          formData.append("file", base.value.form.object.file);

          // base.value.form.object = {
          //   code: base.value.form.object.code,
          //   campaign: base.value.form.object.campaign,
          //   subject: base.value.form.object.subject,
          // };

          const queryBody = formData;

          const path = buildPath(
            null,
            "web/campaign" +
              (base.value.form.method === "PUT"
                ? `/${base.value.form.current}`
                : "")
          );
          const method = base.value.form.method || "POST";
          const res = await fetchQuery({}, method, path, queryBody);

          if (!res.status) {
            console.error("Failed to save data");
            return;
          }

          if (base.value.form.current === 0) {
            base.value.form.current = res.rows[0].code;
          }
        } catch (error) {
          console.error("An error occurred during save operation:", error);
        } finally {
          base.value.form.modal = false;
          base.value.form.loading = false;
          emit("update:success", null);
        }
      },
    };

    return { base, fnBase, authStore };
  },
});
</script>
