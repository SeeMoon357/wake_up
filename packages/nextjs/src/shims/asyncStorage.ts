type KV = Record<string, string>;

const inMemoryStore: KV = {};

function hasLocalStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function read(key: string): string | null {
  if (hasLocalStorage()) {
    return window.localStorage.getItem(key);
  }
  return Object.prototype.hasOwnProperty.call(inMemoryStore, key) ? inMemoryStore[key] : null;
}

function write(key: string, value: string) {
  if (hasLocalStorage()) {
    window.localStorage.setItem(key, value);
    return;
  }
  inMemoryStore[key] = value;
}

function remove(key: string) {
  if (hasLocalStorage()) {
    window.localStorage.removeItem(key);
    return;
  }
  delete inMemoryStore[key];
}

const AsyncStorage = {
  getItem: async (key: string) => read(key),
  setItem: async (key: string, value: string) => {
    write(key, value);
  },
  removeItem: async (key: string) => {
    remove(key);
  },
  clear: async () => {
    if (hasLocalStorage()) {
      window.localStorage.clear();
      return;
    }
    Object.keys(inMemoryStore).forEach((key) => delete inMemoryStore[key]);
  },
  getAllKeys: async () => {
    if (hasLocalStorage()) {
      return Object.keys(window.localStorage);
    }
    return Object.keys(inMemoryStore);
  },
  multiGet: async (keys: string[]) => keys.map((key) => [key, read(key)] as [string, string | null]),
  multiSet: async (entries: [string, string][]) => {
    entries.forEach(([key, value]) => write(key, value));
  },
  multiRemove: async (keys: string[]) => {
    keys.forEach((key) => remove(key));
  },
  mergeItem: async (key: string, value: string) => {
    const current = read(key);
    if (!current) {
      write(key, value);
      return;
    }
    try {
      const merged = JSON.stringify({ ...JSON.parse(current), ...JSON.parse(value) });
      write(key, merged);
    } catch {
      write(key, value);
    }
  },
  multiMerge: async (entries: [string, string][]) => {
    for (const [key, value] of entries) {
      await AsyncStorage.mergeItem(key, value);
    }
  },
};

export default AsyncStorage;
