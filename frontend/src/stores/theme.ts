/* ─── THEME STORE ───
 * Manages code theme selection and custom themes.
 */
import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { themes, getThemeById, type CodeTheme } from "../data/themes";

export const useThemeStore = defineStore("theme", () => {
  // ── State ──
  const currentThemeId = ref("tokyo-night");
  const customThemes = ref<CodeTheme[]>([]);

  // ── Computed ──
  const currentTheme = computed(() => {
    return (
      getThemeById(currentThemeId.value) ??
      customThemes.value.find((t) => t.id === currentThemeId.value) ??
      themes[0]
    );
  });

  const allThemes = computed(() => [...themes, ...customThemes.value]);

  // ── Actions ──
  function setTheme(id: string) {
    currentThemeId.value = id;
  }

  function randomizeTheme() {
    const available = allThemes.value;
    const random = available[Math.floor(Math.random() * available.length)];
    if (random) currentThemeId.value = random.id;
  }

  function addCustomTheme(theme: CodeTheme) {
    customThemes.value.push(theme);
  }

  function removeCustomTheme(id: string) {
    customThemes.value = customThemes.value.filter((t) => t.id !== id);
    if (currentThemeId.value === id) {
      currentThemeId.value = "tokyo-night";
    }
  }

  return {
    currentThemeId,
    currentTheme,
    customThemes,
    allThemes,
    setTheme,
    randomizeTheme,
    addCustomTheme,
    removeCustomTheme,
  };
});
