const stores = new Map();
let prev = null;
let store = null;

export default {
  first: {
    onChange(editorState) {
      const id = editorState
        .getCurrentContent()
        .getBlockMap()
        .hashCode();
      store = JSON.parse(stores.get(id) || stores.get(prev) || '{}');
      return editorState;
    },
    getStore() {
      return store;
    },
    captureChange(contentState) {
      const id = contentState.getBlockMap().hashCode();
      stores.set(id, JSON.stringify(store));
      prev = id;
    },
  },
  last: {
    onChange(editorState) {
      const id = editorState
        .getCurrentContent()
        .getBlockMap()
        .hashCode();
      stores.set(id, JSON.stringify(store));
      prev = id;
      return editorState;
    },
  },
};
