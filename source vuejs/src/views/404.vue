<template>
  <div class="hero bg-base-200 min-h-screen">
    <div class="hero-content text-center">
      <div class="max-w-md">
        <h1 class="text-8xl font-extrabold text-error">404</h1>
        <h1 class="text-3xl font-bold text-primary">Page not found</h1>
        <p class="py-6">
          We Lost This Page!<br />
          <span class="py-6 opacity-60"
            >Sorry. the page you're looking for doesn't exist or has been moved.</span
          >
        </p>

        <router-link to="/" class="btn btn-xs btn-primary text-white"
          >Back to Home</router-link
        >
        <!-- <button class="btn btn-primary">Get Started</button> -->
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "404",
  components: {},
  setup() {},
};
</script>
