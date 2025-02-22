<template>
  <AppLayout ref="AppLayoutComponent">
    <template #view>
      <div class="flex justify-center items-center h-[70vh]">
        <div class="max-w-md text-center">
          <h1 class="text-6xl md:text-8xl font-extrabold text-success">
            Welcome
          </h1>
          <h1 class="text-3xl font-bold text-primary hidden md:block">
            To Marketing Automation
          </h1>
        </div>
      </div>
    </template>
  </AppLayout>
</template>
<script>
import AppLayout from "@/components/App/Layout.vue";
export default {
  name: "Home",
  components: {
    AppLayout,
  },
  setup() {},
};
</script>
