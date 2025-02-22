<template>
  <div class="hero bg-base-200 min-h-screen">
    <div class="hero-content text-center">
      <div class="max-w-md">
        <h1 class="text-8xl font-extrabold text-error">403</h1>
        <h1 class="text-3xl font-bold text-primary">Forbidden</h1>
        <p class="py-6">
          Access to this resource on the access is denied!<br />
          <span class="py-6 opacity-60"
            >Please contact the administrator to change access rights.</span
          >
        </p>

        <router-link to="/" class="btn  btn-xs btn-primary text-white"
          >Back to Home</router-link
        >
        <!-- <button class="btn btn-primary">Get Started</button> -->
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "403",
  setup() {},
};
</script>
