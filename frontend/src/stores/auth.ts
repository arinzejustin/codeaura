/* ─── AUTH STORE ───
 * Manages user authentication state.
 * Auth flow goes through the API server (which uses Supabase Auth).
 */
import { defineStore } from "pinia";
import { ref, computed } from "vue";

const API_URL: string = import.meta.env.VITE_API_URL || "";

export interface User {
  id: string;
  login: string;
  name: string | null;
  avatarUrl: string;
  email: string | null;
}

export const useAuthStore = defineStore("auth", () => {
  // ── State ──
  const user = ref<User | null>(null);
  const accessToken = ref<string | null>(null);
  const isLoading = ref(false);

  // ── Computed ──
  const isLoggedIn = computed(() => !!user.value);

  // ── Persistence (localStorage) ──
  function loadFromStorage() {
    try {
      const savedUser = localStorage.getItem("codeaura-user");
      const savedToken = localStorage.getItem("codeaura-token");
      if (savedUser && savedToken) {
        user.value = JSON.parse(savedUser);
        accessToken.value = savedToken;
      }
    } catch {}
  }

  function saveToStorage() {
    if (user.value && accessToken.value) {
      localStorage.setItem("codeaura-user", JSON.stringify(user.value));
      localStorage.setItem("codeaura-token", accessToken.value);
    }
  }

  function clearStorage() {
    localStorage.removeItem("codeaura-user");
    localStorage.removeItem("codeaura-token");
  }

  // ── Actions ──
  function setUser(userData: User, token: string) {
    user.value = userData;
    accessToken.value = token;
    saveToStorage();
  }

  function logout() {
    // Notify the API (fire-and-forget)
    if (accessToken.value) {
      fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken.value}` },
      }).catch(() => {});
    }

    user.value = null;
    accessToken.value = null;
    clearStorage();
  }

  /**
   * Initiate GitHub OAuth flow via the API server.
   * Redirects the user to the API's /auth/github endpoint,
   * which handles the Supabase OAuth flow.
   */
  function loginWithGitHub() {
    isLoading.value = true;
    // Redirect to the API server's GitHub auth endpoint
    window.location.href = `${API_URL}/auth/github`;
  }

  /**
   * Fetch the current user's profile from the API.
   * Used to validate the stored token is still valid.
   */
  async function fetchMe(): Promise<boolean> {
    if (!accessToken.value) return false;

    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${accessToken.value}` },
      });

      if (!response.ok) {
        logout();
        return false;
      }

      const data = await response.json();
      user.value = data;
      saveToStorage();
      return true;
    } catch {
      return false;
    }
  }

  // Load saved session on init
  loadFromStorage();

  return {
    user,
    accessToken,
    isLoading,
    isLoggedIn,
    setUser,
    logout,
    loginWithGitHub,
    fetchMe,
    loadFromStorage,
  };
});
