/* ─── INDEXEDDB SERVICE ───
 * Handles persistent storage for history entries when user is not logged in.
 * Uses a sync ID to track which entries have been synced to the API.
 */

const DB_NAME = 'codeaura-db'
const DB_VERSION = 1
const HISTORY_STORE = 'history'

export interface DBHistoryEntry {
  id: string
  syncId: string
  timestamp: number
  themeId: string
  language: string
  codePreview: string
  config: Record<string, any>
  pinned: boolean
  synced: boolean
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(HISTORY_STORE)) {
        const store = db.createObjectStore(HISTORY_STORE, { keyPath: 'id' })
        store.createIndex('syncId', 'syncId', { unique: true })
        store.createIndex('synced', 'synced', { unique: false })
        store.createIndex('timestamp', 'timestamp', { unique: false })
      }
    }

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export async function getAllEntries(): Promise<DBHistoryEntry[]> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(HISTORY_STORE, 'readonly')
    const store = tx.objectStore(HISTORY_STORE)
    const request = store.getAll()
    request.onsuccess = () => {
      const entries = request.result as DBHistoryEntry[];
      entries.sort((a, b) => b.timestamp - a.timestamp)
      resolve(entries)
    }
    request.onerror = () => reject(request.error)
  })
}

export async function addEntryToDB(entry: DBHistoryEntry): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(HISTORY_STORE, 'readwrite')
    const store = tx.objectStore(HISTORY_STORE)
    store.put(entry)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export async function removeEntryFromDB(id: string): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(HISTORY_STORE, 'readwrite')
    const store = tx.objectStore(HISTORY_STORE)
    store.delete(id)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export async function updateEntryInDB(entry: DBHistoryEntry): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(HISTORY_STORE, 'readwrite')
    const store = tx.objectStore(HISTORY_STORE)
    store.put(entry)
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

export async function clearNonPinnedEntries(): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(HISTORY_STORE, 'readwrite')
    const store = tx.objectStore(HISTORY_STORE)
    const request = store.getAll()
    request.onsuccess = () => {
      const entries = request.result as DBHistoryEntry[]
      for (const entry of entries) {
        if (!entry.pinned) {
          store.delete(entry.id)
        }
      }
      tx.oncomplete = () => resolve()
    }
    tx.onerror = () => reject(tx.error)
  })
}

export async function getUnsyncedEntries(): Promise<DBHistoryEntry[]> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(HISTORY_STORE, 'readonly')
    const store = tx.objectStore(HISTORY_STORE)
    const index = store.index('synced')
    const request = index.getAll()
    request.onsuccess = () => resolve(request.result as DBHistoryEntry[])
    request.onerror = () => reject(request.error)
  })
}

export async function markEntriesAsSynced(ids: string[]): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(HISTORY_STORE, 'readwrite')
    const store = tx.objectStore(HISTORY_STORE)
    let pending = ids.length
    if (pending === 0) { resolve(); return }
    for (const id of ids) {
      const getReq = store.get(id)
      getReq.onsuccess = () => {
        const entry = getReq.result as DBHistoryEntry | undefined
        if (entry) {
          entry.synced = true
          store.put(entry)
        }
        pending--
        if (pending === 0) resolve()
      }
    }
    tx.onerror = () => reject(tx.error)
  })
}
