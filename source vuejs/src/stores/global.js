import { defineStore } from "pinia";
export const apiUrl = import.meta.env.VITE_API_URL;

export const useGlobalStore = defineStore("global", {
  state: () => ({
    serviceUrl: apiUrl,
    theme: "nord",
  }),
  actions: {},
});
