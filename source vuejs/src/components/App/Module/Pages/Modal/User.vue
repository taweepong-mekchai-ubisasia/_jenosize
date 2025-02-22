<template>
  <teleport to="#app">
    <input type="checkbox" class="modal-toggle" v-model="base.form.modal" />
    <div class="modal" v-if="base.form.modal">
      <div
        class="modal-box relative w-11/12 sm:w-11/12 md:w-7/12 lg:w-7/12 max-w-5xl p-2 lg:p-4 max-h-screen"
      >
        <button
          @click="base.form.modal = false"
          class="btn btn-xs sm:btn-sm btn-circle absolute right-2 top-2"
          :disabled="base.form.loading"
        >
          ✕
        </button>
        <h3 class="text-md md:text-lg font-bold text-primary">USER</h3>
        <div class="divider my-1"></div>
        <div
          class="card-body overflow-auto max-h-[60vh] p-2 pb-0 lg:p-4 lg:pb-0 mb-0"
        >
          <div class="grid gap-4">
            <div class="form-control">
              <div class="join w-full">
                <button
                  class="btn join-item btn-xs sm:btn-sm w-24 disabled:text-white"
                  disabled
                >
                  Username
                </button>
                <input
                  type="text"
                  placeholder="Username"
                  class="input input-xs sm:input-sm input-bordered w-full"
                  v-model="base.form.object.username"
                />
              </div>
            </div>
            <div class="form-control">
              <div class="join w-full">
                <button
                  class="btn join-item btn-xs sm:btn-sm w-24 disabled:text-white"
                  disabled
                >
                  Password
                </button>
                <input
                  type="text"
                  placeholder="Password"
                  class="input input-xs sm:input-sm input-bordered w-full"
                  v-model="base.form.object.U_Password"
                />
              </div>
            </div>

            <div class="grid gap-4 grid-cols-1 lg:grid-cols-2">
              <div class="form-control">
                <div class="join w-full">
                  <button
                    class="btn join-item btn-xs sm:btn-sm w-24 disabled:text-white"
                    disabled
                  >
                    Firstname
                  </button>
                  <input
                    type="text"
                    placeholder="Fristname"
                    class="input input-xs sm:input-sm input-bordered w-full"
                    v-model="base.form.object.firstname"
                  />
                </div>
              </div>
              <div class="form-control">
                <div class="join w-full">
                  <button
                    class="btn join-item btn-xs sm:btn-sm w-24 disabled:text-white"
                    disabled
                  >
                    Lastname
                  </button>
                  <input
                    type="text"
                    placeholder="Lastname"
                    class="input input-xs sm:input-sm input-bordered w-full"
                    v-model="base.form.object.lastname"
                  />
                </div>
              </div>
              <div class="form-control">
                <div class="join w-full">
                  <button
                    class="btn join-item btn-xs sm:btn-sm w-24 disabled:text-white"
                    disabled
                  >
                    Create By
                  </button>
                  <input
                    type="text"
                    placeholder="Create By"
                    class="input input-xs sm:input-sm input-bordered w-full"
                    v-model="base.form.object.CreateBy"
                    disabled
                  />
                </div>
              </div>
              <div class="form-control">
                <div class="join w-full">
                  <button
                    class="btn join-item btn-xs sm:btn-sm w-24 disabled:text-white"
                    disabled
                  >
                    Create On
                  </button>
                  <input
                    type="text"
                    placeholder="Name"
                    class="input input-xs sm:input-sm input-bordered w-full"
                    :value="
                      base.form.object.U_CreateOn
                        ? $moment(base.form.object.U_CreateOn).format(
                            'YYYY-MM-DD hh:mm:ss'
                          ) || '-'
                        : '-'
                    "
                    disabled
                  />
                </div>
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
              class="btn btn-xs sm:btn-sm md:btn-md"
              :disabled="base.form.loading"
            >
              Cancel
            </button>
          </div>
          <div class="flex-1 form-control mt-6" @click="fnBase.save()">
            <button
              class="btn btn-success text-white btn-xs sm:btn-sm md:btn-md"
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
import { useStore } from "vuex";
import { fetchQuery, buildPath } from "@/composables/useQuery";
import { computed, defineComponent } from "vue";
import { useAuthStore } from "@/stores/auth";
export default defineComponent({
  components: {},
  inheritAttrs: false,
  name: "ModalUser",
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
        base.value.form.current = 0;
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
          base.value.form.object = {
            code: base.value.form.object.code,
            username: base.value.form.object.username,
            U_Password: base.value.form.object.U_Password,
            firstname: base.value.form.object.firstname,
            lastname: base.value.form.object.lastname,
          };

          const queryBody = {
            ...base.value.form.object,
          };

          const path = buildPath(
            null,
            "system/user" +
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
