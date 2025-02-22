<template>
  <div
    :class="parrentClass ? parrentClass : 'min-h-[50vh]'"
    class="grid w-full h-full content-center justify-center items-center"
  >
    <section>
      <div class="prevent-select pointer-events-none text-warning w-full flex flex-col justify-center content-center items-center gap-4" :class="class">
        <div><Icon icon="fe:warning" class="h-20 w-20" /></div>
        <span class="font-extrabold">Empty Data</span>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: "EmptyData",
  props: {
    parrentClass: {
      default: "",
    },
    class: {
      default: "",
    },
  },
};
</script>
