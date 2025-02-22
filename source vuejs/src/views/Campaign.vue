<template>
  <AppLayout ref="AppLayoutComponent">
    <template #modal>
      <AppModulePagesSystemModalCampaign
        v-model="base.data"
        @update:success="fnBase.success"
        ref="baseModal"
      />
      <AppModuleGlobalRemove
        v-model="remove"
        @update:success="fnRemove.success"
        ref="removeModal"
      />
    </template>
    <template #breadcrumbs>
      <div class="breadcrumbs text-sm">
        <ul>
          <li>Web</li>
          <li>Email Campaign</li>
        </ul>
      </div>
    </template>
    <template #view>
      <div class="card shadow-lg bg-base-100">
        <div class="card-body overflow-auto p-2 lg:p-4">
          <div>
            <div
              v-if="base.pagination.loading"
              class="absolute z-10 w-full h-full flex flex-row flex-nowrap content-center justify-center items-center bg-base-100 bg-opacity-50 top-0 left-0"
            >
              <AppModuleGlobalLoadingText
                :class="`p-4 py-12 text-3xl text-center`"
              />
            </div>
            <div :class="`${base.pagination.loading ? 'blur-sm' : ''}`">
              <div ref="titleZone">
                <div
                  class="gap-2 sm:gap-4 flex-row flex w-full justify-end items-center relative"
                >
                  <h3
                    class="text-lg font-bold text-primary px-4 whitespace-nowrap"
                  >
                    Email Campaign
                  </h3>

                  <div
                    class="gap-2 sm:gap-4 flex-row flex w-full justify-end relative"
                  >
                    <AppModuleGlobalSearch
                      @update:search="fnBase.search"
                      v-model="base.search"
                      :loading="base.pagination.loading"
                    />

                    <label
                      class="btn btn-xs sm:btn-sm btn-success modal-button text-white"
                      @click="$refs.baseModal.fnBase.create"
                    >
                      <Icon icon="material-symbols:add" class="w-4 h-4" />

                      <span class="hidden lg:block">Create</span>
                    </label>
                  </div>
                </div>
                <div class="divider my-1"></div>
              </div>
              <div
                class="overflow-x-auto w-full my-2"
                :style="{
                  maxHeight: contentHeight,
                  minHeight: contentHeight,
                }"
              >
                <div
                  v-if="!base.pagination.loading && base.data.rows.length == 0"
                >
                  <AppModuleGlobalEmptyData
                    :class="`p-4 py-12 text-3xl text-center `"
                  />
                </div>
                <ul class="rounded-box w-full p-0" v-else>
                  <li v-for="(v, i) in base.data.rows" :key="v.code">
                    <div
                      class="card-body w-full border border-t-0 border-x-0 border-base-300 p-2 md:p-4 flex flex-col"
                    >
                      <div class="flex flex-row justify-between items-start">
                        <div class="flex gap-4 flex-row">
                          <div class="flex flex-col">
                            <span
                              class="card-title text-primary text-sm md:text-md flex items-start"
                            >
                              <div
                                class="badge badge-sm badge-primary badge-outline"
                              >
                                #{{ v.id }}
                              </div>
                              Campaign : {{ v.campaign || "-" }}<br />
                              Subject
                              {{ v.subject || "-" }}
                            </span>
                          </div>
                        </div>

                        <div
                          class="card-actions justify-end hidden md:flex flex-row"
                        >
                          <div class="dropdown dropdown-bottom dropdown-end">
                            <div
                              tabindex="0"
                              role="button"
                              class="btn btn-primary text-white btn-xs"
                            >
                              <Icon icon="bx:detail" class="w-4 h-4" />

                              <span class="hidden lg:block">Details</span>
                            </div>

                            <ul
                              tabindex="0"
                              class="dropdown-content menu menu-xs bg-base-100 rounded-box z-[1] w-40 px-4 py-2 shadow"
                            >
                              <li class="block lg:hidden text-xs">
                                Battery Setting
                              </li>
                              <li class="block lg:hidden text-xs text-primary">
                                Current : {{ v.TV_BatteryPercent }} %
                              </li>
                              <li class="block lg:hidden text-xs text-error">
                                Charge : {{ v.TV_BatteryToCharg }} %
                              </li>
                              <li class="block lg:hidden text-xs text-success">
                                Work: {{ v.TV_BatteryReadyToWork }} %
                              </li>
                              <li class="block lg:hidden text-xs"></li>
                              <li class="text-xs">Created</li>
                              <li class="text-xs">
                                By : {{ v.CreateBy || "-" }}
                              </li>
                              <li class="text-xs">
                                {{
                                  $moment(v.TV_CreateOn).format(
                                    "YYYY-MM-DD hh:mm:ss"
                                  ) || "-"
                                }}
                              </li>

                              <li class="text-xs"></li>
                              <li class="text-xs">Updated</li>
                              <li class="text-xs">
                                By : {{ v.UpdateBy || "-" }}
                              </li>
                              <li class="text-xs">
                                {{
                                  $moment(v.TV_UpdateOn).format(
                                    "YYYY-MM-DD hh:mm:ss"
                                  ) || "-"
                                }}
                              </li>
                            </ul>
                          </div>

                          <button
                            class="btn text-white btn-xs btn-warning"
                            @click="
                              $refs.baseModal.fnBase.edit(`${v.code}`, `${i}`)
                            "
                          >
                            <Icon icon="icon-park-solid:edit" class="w-4 h-4" />
                            <span class="hidden lg:block">Edit</span>
                          </button>

                          <button
                            class="btn btn-error text-white btn-xs"
                            @click="
                              fnRemove.item(`web/campaign/soft/${v.code}`)
                            "
                          >
                            <Icon
                              icon="material-symbols:delete"
                              class="w-4 h-4"
                            />
                            <span class="hidden lg:block">Remove</span>
                          </button>
                        </div>
                        <div
                          class="card-actions justify-end flex md:hidden flex-row relative z-20"
                        >
                          <div class="dropdown dropdown-bottom dropdown-end">
                            <div
                              tabindex="0"
                              role="button"
                              class="btn btn-link btn-xs m-1"
                            >
                              <Icon icon="eva:more-vertical-fill" />
                            </div>
                            <ul
                              tabindex="0"
                              class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
                            >
                              <li>
                                <a
                                  @click="
                                    $refs.baseModal.fnBase.edit(
                                      `${v.code}`,
                                      `${i}`
                                    )
                                  "
                                  >Edit</a
                                >
                              </li>
                              <li>
                                <a
                                  @click="
                                    fnRemove.item(`web/campaign/soft/${v.code}`)
                                  "
                                  >Remove</a
                                >
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <AppModuleGlobalPagination
              v-model="base.pagination"
              @update:page="fnBase.get"
            />
          </div>
        </div>
      </div>
    </template>
  </AppLayout>
</template>
<script>
import { useContentHeight } from "@/composables/useContentHeight";
import { fetchQuery, buildPath } from "@/composables/useQuery";
import { ref } from "vue";

import AppLayout from "@/components/App/Layout.vue";
import AppModuleGlobalPagination from "@/components/App/Module/Global/Pagination.vue";
import AppModuleGlobalSearch from "@/components/App/Module/Global/Search.vue";
import AppModuleGlobalLoadingText from "@/components/App/Module/Global/LoadingText.vue";
import AppModuleGlobalEmptyData from "@/components/App/Module/Global/EmptyData.vue";
import AppModulePagesSystemModalCampaign from "@/components/App/Module/Pages/Modal/Campaign.vue";
import AppModuleGlobalRemove from "@/components/App/Module/Global/Remove.vue";

import { modbusTCP } from "@/composables/useSocket.js";
import { useAuthStore } from "@/stores/auth";
export default {
  name: "Campaign",
  components: {
    AppLayout,
    AppModuleGlobalPagination,
    AppModuleGlobalSearch,
    AppModuleGlobalLoadingText,
    AppModuleGlobalEmptyData,
    AppModulePagesSystemModalCampaign,
    AppModuleGlobalRemove,
  },
  setup() {
    const authStore = useAuthStore();
    const AppLayoutComponent = ref(null);
    const titleZone = ref(null);

    const { contentHeight } = useContentHeight(AppLayoutComponent, titleZone);

    const base = ref({
      pagination: {
        page: 1,
        row: 20,
        next: false,
        back: false,
        loading: false,
        total: 0,
      },
      data: {
        rows: [],
        form: {
          loading: false,
          modal: false,
          object: {},
        },
      },

      search: [
        {
          type: "search",
          id: "q",
          placeholder: "Search",
          label: "Search",
          value: "",
        },
      ],
    });

    const remove = ref({
      current: 0,
      model: false,
      path: "",
      loading: false,
    });

    const fnBase = {
      search: async () => {
        try {
          base.value.pagination.page = 1;
          await fnBase.get();
        } catch (error) {
          console.error("Error during search:", error);
        }
      },
      get: async () => {
        if (base.value.pagination.loading) return;
        base.value.pagination.loading = true;
        try {
          const queryParams = {
            page: base.value.pagination.page,
            row: base.value.pagination.row,
            search: base.value.search,
            getTotal: true,
          };
          const path = buildPath(queryParams, `web/campaign`);
          const res = await fetchQuery({}, "GET", path);
          if (res.status) {
            base.value.data.rows = res.rows;
            base.value.pagination.total = res.total;
            base.value.pagination.next =
              base.value.pagination.page * base.value.pagination.row <
              base.value.pagination.total;
            base.value.pagination.back = base.value.pagination.page > 1;
          } else {
            console.error("Error fetching base:", res.errorMsg);
          }
          return res;
        } catch (error) {
          console.error("Error fetching data:", error);
          return { success: false, errorMsg: error.message };
        } finally {
          base.value.pagination.loading = false;
        }
      },
      success() {
        base.value.pagination.page = 1;
        fnBase.search();
      },
    };

    const fnRemove = {
      item: (path) => {
        remove.value.modal = true;
        remove.value.path = path;
      },
      success: () => {
        base.value.pagination.page = 1;
        fnBase.search();
      },
    };

    fnBase.search();

    return {
      base,
      remove,
      fnBase,
      fnRemove,
      titleZone,
      contentHeight,
      AppLayoutComponent,
      authStore,
    };
  },
};
</script>
