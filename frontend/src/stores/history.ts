/* ─── HISTORY STORE ───
 * Persists history entries to IndexedDB for offline-first usage.
 * When user is not logged in, entries are stored locally with a syncId.
 * When user logs in, unsynced entries can be pushed to the API.
 */
import { defineStore } from "pinia";
import { ref } from "vue";
import {
  getAllEntries,
  addEntryToDB,
  removeEntryFromDB,
  updateEntryInDB,
  clearNonPinnedEntries,
  getUnsyncedEntries,
  markEntriesAsSynced,
  type DBHistoryEntry,
} from "./db";
import { useAuthStore } from "./auth";

export interface HistoryEntry {
  id: string;
  syncId: string;
  timestamp: number;
  themeId: string;
  language: string;
  codePreview: string;
  config: Record<string, any>;
  pinned: boolean;
  synced: boolean;
}

export const useHistoryStore = defineStore("history", () => {
  const entries = ref<HistoryEntry[]>([]);
  const maxEntries = 50;
  const isSyncing = ref(false);

  /** Load all entries from IndexedDB on init */
  async function loadEntries() {
    try {
      const dbEntries = await getAllEntries();
      entries.value = dbEntries;
    } catch (e) {
      console.warn("Failed to load history from IndexedDB:", e);
    }
  }

  /** Add a new history entry */
  async function addEntry(
    entry: Omit<
      HistoryEntry,
      "id" | "timestamp" | "pinned" | "syncId" | "synced"
    >,
  ) {
    const newEntry: HistoryEntry = {
      ...entry,
      id: `hist-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      syncId: crypto.randomUUID(),
      timestamp: Date.now(),
      pinned: false,
      synced: false,
    };

    // Remove oldest non-pinned entry if at capacity
    if (entries.value.length >= maxEntries) {
      const unpinned = entries.value.filter((e) => !e.pinned);
      if (unpinned.length > 0) {
        const oldest = unpinned[unpinned.length - 1];
        if (oldest) {
          entries.value = entries.value.filter((e) => e.id !== oldest.id);
          await removeEntryFromDB(oldest.id).catch(() => {});
        }
      }
    }

    entries.value.unshift(newEntry);
    await addEntryToDB(newEntry as DBHistoryEntry).catch(() => {});
  }

  /** Update the latest history entry */
  async function updateLastEntry(entryData: Partial<HistoryEntry>) {
    // If there's no entry or the latest is pinned (meaning we probably shouldn't mutate it directly as a session), bail out or add new
    if (entries.value.length === 0 || entries.value[0]?.pinned) {
      await addEntry(
        entryData as Omit<
          HistoryEntry,
          "id" | "timestamp" | "pinned" | "syncId" | "synced"
        >,
      );
      return;
    }

    const latest = entries.value[0]!;
    Object.assign(latest, entryData, { timestamp: Date.now(), synced: false });

    await updateEntryInDB(latest as DBHistoryEntry).catch(() => {});
  }

  /** Toggle pin on an entry */
  async function togglePin(id: string) {
    const entry = entries.value.find((e) => e.id === id);
    if (entry) {
      entry.pinned = !entry.pinned;
      await updateEntryInDB(entry as DBHistoryEntry).catch(() => {});
    }
  }

  /** Remove a single entry */
  async function removeEntry(id: string) {
    entries.value = entries.value.filter((e) => e.id !== id);
    await removeEntryFromDB(id).catch(() => {});
  }

  /** Clear all non-pinned entries */
  async function clearHistory() {
    entries.value = entries.value.filter((e) => e.pinned);
    await clearNonPinnedEntries().catch(() => {});
  }

  /**
   * Sync unsynced entries to the API (when user is logged in).
   * In production, replace the fetch URL with your actual API endpoint.
   */
  async function syncToApi() {
    const auth = useAuthStore();
    if (!auth.isLoggedIn || !auth.accessToken) return;

    isSyncing.value = true;
    try {
      const unsynced = await getUnsyncedEntries();
      if (unsynced.length === 0) return;

      // In production, call your API:
      const apiUrl = import.meta.env.VITE_API_URL || "/api";
      const response = await fetch(`${apiUrl}/history/sync`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.accessToken}`,
        },
        body: JSON.stringify({ entries: unsynced }),
      });

      if (response.ok) {
        const syncedIds = unsynced.map((e) => e.id);
        await markEntriesAsSynced(syncedIds);

        // Update local state
        for (const entry of entries.value) {
          if (syncedIds.includes(entry.id)) {
            entry.synced = true;
          }
        }
      }
    } catch (e) {
      console.warn("Sync failed (will retry later):", e);
    } finally {
      isSyncing.value = false;
    }
  }

  // Load entries from IndexedDB on store initialization
  loadEntries();

  return {
    entries,
    isSyncing,
    addEntry,
    updateLastEntry,
    togglePin,
    removeEntry,
    clearHistory,
    syncToApi,
    loadEntries,
  };
});
