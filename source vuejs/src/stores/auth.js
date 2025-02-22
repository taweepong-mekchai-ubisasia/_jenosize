import { defineStore } from "pinia";
import { useGlobalStore } from "@/stores/global";
import router from "@/router";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: localStorage.getItem("user_token") || null,
  }),
  actions: {
    setUser(user) {
      this.user = user;
    },
    setToken(token) {
      this.token = token;
      if (token) {
        localStorage.setItem("user_token", token);
      } else {
        localStorage.removeItem("user_token");
      }
    },
    logout() {
      this.setUser(null);
      this.setToken(null);
      router.push("/Authen");
      return true;
    },
    async signup(base) {
      const globalStore = useGlobalStore();
      const serviceUrl = globalStore.serviceUrl;

      base.errorMsg = "";
      if (
        !base.form.username ||
        !base.form.password ||
        !base.form.firstname ||
        !base.form.lastname
      ) {
        base.errorMsg = "error required";
        return;
      }
      try {
        const response = await fetch(`${serviceUrl}auth/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(base.form),
        });
        if (!response.ok) {
          return (base.errorMsg = "Invalid credentials");
        }
        const data = await response.json();
        base.successMsg = "Successfully created";
        return;
      } catch (error) {
        base.errorMsg = error.errorMsg;
        return;
      }
    },
    async login(base) {
      const globalStore = useGlobalStore();
      const serviceUrl = globalStore.serviceUrl;

      base.errorMsg = "";
      if (!base.form.username || !base.form.password) {
        base.errorMsg = "Username/Password required";
        return;
      }
      try {
        const response = await fetch(`${serviceUrl}auth/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(base.form),
        });
        // if (!response.ok) throw new Error("Invalid credentials");
        if (!response.ok) {
          if (response.status === 401) {
            return (base.errorMsg = "Invalid username or password");
          }
          return (base.errorMsg = "Invalid credentials");
        }
        const data = await response.json();
        this.setToken(data.token);
        this.setUser(data.user);
        router.push("/");
        return;
      } catch (error) {
        base.errorMsg = error.errorMsg;
        return;
      }
    },
    async getUserFromToken(token) {
      const globalStore = useGlobalStore();
      const serviceUrl = globalStore.serviceUrl;
      try {
        const response = await fetch(`${serviceUrl}auth/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          this.setToken(data.token);
          this.setUser(data.user);
          return true;
        } else {
          this.logout();
          return false;
        }
      } catch (error) {
        this.logout();
        return false;
      }
    },
    async refreshToken() {
      const globalStore = useGlobalStore();
      const serviceUrl = globalStore.serviceUrl;
      try {
        const response = await fetch(`${serviceUrl}auth/refresh-token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.token}`,
          },
          body: JSON.stringify({ token: this.token }),
        });

        if (response.ok) {
          const data = await response.json();
          this.setToken(data.token);
          return true;
        } else {
          this.logout();
          return false;
        }
      } catch (error) {
        this.logout();
        return false;
      }
    },
  },
});
