export default class Store {
  constructor(data = {}) {
    this.data = data;
  }

  set(key, value) {
    this.data[key] = value;
  }

  setEditorMethods(getEditorState, setEditorState) {
    this.getEditorState = getEditorState;
    this.setEditorState = setEditorState;
  }

  merge(data) {
    Object.assign(this.data, data);
  }

  get(key) {
    return this.data[key];
  }

  getEditorState() {
    return this.getEditorState();
  }

  setEditorState(state) {
    return this.setEditorState(state);
  }
}
