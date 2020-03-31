export default function createEntityStore(defaultStore = '{}') {
  const stores = new WeakMap();
  let prev = null;
  let store = null;

  return {
    first: {
      onChange(editorState) {
        const id = editorState.getCurrentContent().getBlockMap();
        store = JSON.parse(stores.get(id) || stores.get(prev) || defaultStore);
        return editorState;
      },
    },
    last: {
      onChange(editorState) {
        const id = editorState.getCurrentContent().getBlockMap();
        stores.set(id, JSON.stringify(store));
        prev = id;
        return editorState;
      },
    },
    getStore() {
      return store;
    },
    captureChange(contentState) {
      const id = contentState.getBlockMap();
      stores.set(id, JSON.stringify(store));
      prev = id;
    },
    exportStore() {
      return JSON.stringify(store);
    },
  };
}
