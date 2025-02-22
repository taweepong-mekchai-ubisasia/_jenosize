import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
// import vueDevTools from "vite-plugin-vue-devtools";
import { VitePWA } from "vite-plugin-pwa";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 5174,
    // hmr: true,
    // open: true,
  },
  base: "/marketing_automation/",
  plugins: [
    tailwindcss(),
    vue(),
    vueJsx(),
    // vueDevTools(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
      },
      manifest: {
        name: "Safety Application",
        short_name: "Safety",
        start_url: "/marketing_automation/",
        display: "standalone",
        orientation: "portrait",
        background_color: "#ffffff",
        lang: "en",
        scope: "/marketing_automation/",
        theme_color: "#ffffff",
        icons: [
          {
            src: "https://upload.wikimedia.org/wikipedia/commons/c/c4/Cdemu_192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "https://upload.wikimedia.org/wikipedia/commons/c/c4/Cdemu_192x192.png",
            sizes: "512x512",
            type: "image/png",
          },
          // {
          //   src: "images/icons/icon-192x192.png",
          //   sizes: "192x192",
          //   type: "image/png",
          // },
          // {
          //   src: "images/icons/icon-512x512.png",
          //   sizes: "512x512",
          //   type: "image/png",
          // },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
