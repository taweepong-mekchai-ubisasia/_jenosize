<template>
  <div>
    <button
      class="btn btn-xs sm:btn-sm btn-error text-white relative flex items-center"
      :class="{ '': isOpen, 'bg-primary border-primary': !isOpen }"
      @click="toggleDrawer"
    >
      <Icon icon="tabler:search" class="w-4 h-4" />
      <span class="hidden lg:block">Search</span>
      <span
        v-if="isOpen"
        class="absolute top-0 right-0 w-2.5 h-2.5 bg-success rounded-full"
      ></span>
    </button>
    <teleport to="#app">
      <div v-if="isOpen">
        <DraggableResizableVue
          v-if="computedScreen.screen != 'xs' && computedScreen.screen != 'sm'"
          v-model:w="width"
          v-model:x="x"
          v-model:y="y"
          :min-width="200"
          :w="true"
          :x="x"
          :y="y"
          class="resizable-box z-[100] w-full max-w-full border border-gray-300 bg-base-100 shadow-2xl rounded-3xl p-0 pb-0"
          v-model:active="element.isActive"
        >
          <div class="p-4 pt-2 pb-0 flex justify-between items-center">
            <h3 class="text-xs sm:text-sm font-bold text-left">Search</h3>
            <button
              class="btn btn-sm btn-circle btn-error text-white"
              @click="toggleDrawer"
            >
              <Icon icon="material-symbols:close" />
            </button>
          </div>
          <div class="divider my-1"></div>
          <div
            class="relative p-4 overflow-y-auto h-[calc(100%-70px)] overflow-auto"
          >
            <div class="grid gap-y-2 gap-x-2 w-full h-full grid-cols-1">
              <div v-for="(v, i) in base" :key="i" class="relative">
                <template v-if="v.type === 'combobox' && v.component">
                  <component
                    :is="v.component"
                    :label="v.label"
                    :url="v.dataComponent.url"
                    :selectMode="v.dataComponent.selectMode"
                    :image="v.dataComponent.image"
                    :fieldDisplay="v.dataComponent.fieldDisplay"
                    :imagePath="v.dataComponent.imagePath"
                    v-model="v.value"
                    :lastDisplay="
                      v.value.length == 0
                        ? ''
                        : [0][v.dataComponent.fieldDisplay]
                    "
                    :lastFile="''"
                    :objectData="v.dataComponent.objectData"
                    :inSearch="true"
                  />
                </template>
                <template v-else>
                  <label
                    class="absolute top-[-0.5rem] left-[0.65rem] text-xs bg-base-100 z-10 font-bold text-opacity-50"
                  >
                    {{ v.label }}
                  </label>
                  <input
                    :type="v.type"
                    :placeholder="v.placeholder"
                    class="input input-xs sm:input-sm input-bordered border-gray-300 w-full"
                    :class="class"
                    @input="handleInput"
                    v-model="v.value"
                  />
                </template>
              </div>
              <div>
                <button
                  type="button"
                  class="btn btn-xs sm:btn-sm btn-error w-full text-white"
                  @click="clearSearch"
                  :disabled="loading"
                >
                  Clear
                </button>
              </div>
            </div>
          </div>
        </DraggableResizableVue>
        <div
          class="z-[100] fixed bottom-0 left-0 w-full max-w-full border-t border-gray-300 bg-base-100 shadow-2xl rounded-t-3xl"
          v-else
        >
          <div class="relative">
            <div class="px-4 pt-4 flex">
              <Icon
                icon="material-symbols:drag-handle-rounded"
                class="mr-2"
                @touchmove="touchmove"
              />
              <h3 class="text-xs sm:text-sm font-bold text-left">Search</h3>

              <button
                class="btn btn-sm btn-circle absolute right-2 top-2 btn-error text-white"
                @click="toggleDrawer"
              >
                <Icon icon="material-symbols:close" />
              </button>
            </div>
            <div class="divider my-1"></div>
            <div
              class="overflow-auto"
              :style="{
                height: `${
                  lastHeight < screenHeight / 2
                    ? `calc(${modelValue.length * 80}px)`
                    : lastHeight > screenHeight / 1.3
                    ? `${screenHeight / 1.25}px`
                    : `${lastHeight}px`
                }`,
                maxHeight: `${
                  lastHeight < screenHeight / 2
                    ? '25svh'
                    : lastHeight > screenHeight / 1.3
                    ? `${screenHeight / 1.25}px`
                    : `${lastHeight}px`
                }`,
              }"
            >
              <div class="relative p-4 overflow-y-auto h-full" ref="areaBox">
                <div class="grid grid-cols-1 gap-y-2 gap-x-2 w-full h-auto">
                  <div v-for="(v, i) in base" :key="i" class="relative">
                    <template v-if="v.type === 'combobox' && v.component">
                      <!-- {{v.value}} -->
                      <component
                        :is="v.component"
                        :label="v.label"
                        :url="v.dataComponent.url"
                        :selectMode="v.dataComponent.selectMode"
                        :image="v.dataComponent.image"
                        :fieldDisplay="v.dataComponent.fieldDisplay"
                        :imagePath="v.dataComponent.imagePath"
                        v-model="v.value"
                        :lastDisplay="
                          v.value.length == 0
                            ? ''
                            : [0][v.dataComponent.fieldDisplay]
                        "
                        :lastFile="''"
                        :objectData="v.dataComponent.objectData"
                        :inSearch="true"
                      />
                    </template>
                    <template v-else>
                      <label
                        class="absolute top-[-0.5rem] left-[0.65rem] text-xs bg-base-100 z-10 font-bold text-opacity-50"
                      >
                        {{ v.label }}
                      </label>
                      <input
                        :type="v.type"
                        :placeholder="v.placeholder"
                        class="input input-xs sm:input-sm input-bordered border-gray-300 w-full"
                        :class="class"
                        @input="handleInput"
                        v-model="v.value"
                    /></template>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import debounce from "lodash/debounce";
import {
  ref,
  onMounted,
  onUnmounted,
  computed,
  defineAsyncComponent,
  markRaw,
} from "vue";
import DraggableResizableVue from "draggable-resizable-vue3";

const props = defineProps({
  modelValue: {
    type: Array,
    required: true,
  },
  class: {
    type: [String, Object],
    default: "",
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const screen = ref("xs");
const configScreen = ref({ innerWidth: 4, x: 1.1, y: 1.2 });

const computedScreen = computed(() => {
  return {
    screen: screen.value,
    config: configScreen.value,
  };
});

const width = ref(window.innerWidth / configScreen.value.innerWidth); // ความกว้างเต็มจอ
const x = ref(0); // ตำแหน่งแกน X เริ่มต้น
const y = ref(0); // ตำแหน่งแกน Y เริ่มต้น
const element = ref({ isActive: false });

const emit = defineEmits(["update:modelValue", "update:search"]);

const base = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const isOpen = ref(false);
const toggleDrawer = () => {
  isOpen.value = !isOpen.value;
};
const debouncedSearch = debounce(() => emit("update:search", null), 200);
const handleInput = () => debouncedSearch();

const updateScreenConfig = () => {
  const ww = window.innerWidth;
  switch (true) {
    case ww >= 1024:
      configScreen.value = {
        innerWidth: 4,
        x: 1.1,
        y: 1.2,
      };
      screen.value = "lg";
      break;

    case ww >= 768:
      configScreen.value = {
        innerWidth: 2,
        x: 1.35,
        y: 1.15,
      };
      screen.value = "md";
      break;

    case ww >= 640:
      configScreen.value = {
        innerWidth: 4,
        x: 1.1,
        y: 1.2,
      };
      screen.value = "sm";
      break;

    default:
      configScreen.value = {
        innerWidth: 4,
        x: 1.1,
        y: 1.2,
      };
      screen.value = "xs";
      break;
  }

  width.value = ww / configScreen.value.innerWidth; // ความกว้างเต็มจอ
  x.value = (ww - width.value) / configScreen.value.x;
  // y.value = -window.innerHeight / 2;
  y.value = -window.innerHeight / configScreen.value.y;
};

onMounted(() => {
  updateScreenConfig();
  window.addEventListener("resize", updateScreenConfig);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateScreenConfig);
});

const touchStartY = ref(0);
const deltaY = ref(null);
const lastHeight = ref(null);
const screenHeight = ref(window.innerHeight);

const touchmove = (e) => {
  const touchCurrentY = e.touches[0].clientY;
  deltaY.value = touchCurrentY - touchStartY.value;
  lastHeight.value = window.innerHeight - deltaY.value;
};

const clearSearch = () => {
  base.value.forEach((v) => (v.value = ""));
  debouncedSearch();
};
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter {
  transform: translateY(100%);
}
.slide-enter-to {
  transform: translateY(0%);
}
.slide-leave-to {
  transform: translateY(100%);
}

.fixed {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.resizable-box {
  width: 100%;
}

.content {
  padding: 10px;
  font-size: 14px;
}

.drv-resizable {
  z-index: 100 !important;
  border: unset;
}
</style>
