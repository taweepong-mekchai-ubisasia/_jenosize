<template>
  <section>
    <div
      class="prevent-select pointer-events-none font-extrabold text-primary loading-custom loading_-custom"

   
      :class="class"
      v-if="type == 'text'"
    >
    <!-- class="prevent-select pointer-events-none text-warning w-full flex flex-col justify-center content-center items-center gap-4" -->
      <span class="font-extrabold">L</span>
      <span class="font-extrabold">O</span>
      <span class="font-extrabold">A</span>
      <span class="font-extrabold">D</span>
      <span class="font-extrabold">I</span>
      <span class="font-extrabold">N</span>
      <span class="font-extrabold">G</span>
    </div>
    <div
      class="prevent-select pointer-events-none font-extrabold text-primary loading-custom loading_-custom"
      :class="class"
      v-if="type == 'percent'"
    >
      <progress
        class="progress progress-success w-56"
        :value="percent"
        max="100"
      ></progress>
    </div>
  </section>
</template>

<script>
export default {
  name: "LoadingText",
  props: {
    class: {
      default: null,
    },
    percent: {
      default: 0,
    },
    type: {
      default: "text",
    },
  },
};
</script>

<style scoped>
/* common */
/* .loading-custom {
  font-size: 84px;
  font-family: "Montserrat", sans-serif;
  font-weight: 800;
  text-align: center;
} */
.loading-custom span {
  display: inline-block;
  margin: 0 -0.05em;
  padding: 0px 5px;
}

.loading_-custom span {
  margin: 0 -0.005em;
  animation: loading_-custom 0.7s infinite alternate;
}
.loading_-custom span:nth-child(2) {
  animation-delay: 0.1s;
}
.loading_-custom span:nth-child(3) {
  animation-delay: 0.2s;
}
.loading_-custom span:nth-child(4) {
  animation-delay: 0.3s;
}
.loading_-custom span:nth-child(5) {
  animation-delay: 0.4s;
}
.loading_-custom span:nth-child(6) {
  animation-delay: 0.5s;
}
.loading_-custom span:nth-child(7) {
  animation-delay: 0.6s;
}

@keyframes loading_-custom {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(0.8);
    opacity: .5;
  }
}
.prevent-select {
  -webkit-user-select: none; /* Safari */
  -ms-user-select: none; /* IE 10 and IE 11 */
  user-select: none; /* Standard syntax */
}
</style>
