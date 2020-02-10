import { EditorState } from 'draft-js';

import Store from '../store';

const TAGS_HISTORY_KEY = 'vf-text-editor-xml-tags-history';
const TAGS_HISTORY_SIZE = 10;

class XMLStore extends Store {
  constructor(type, data) {
    super(data);

    this.TAGS_HISTORY_KEY = `${TAGS_HISTORY_KEY}-${type}`;

    try {
      this.tagsHistory = JSON.parse(localStorage.getItem(this.TAGS_HISTORY_KEY)) || [];
    } catch {
      this.tagsHistory = [];
    }
  }

  getTagsToHistory = () => {
    return [...this.tagsHistory];
  };

  addTagToHistory = (tagData) => {
    this.tagsHistory.unshift(tagData);

    if (this.tagsHistory.length > TAGS_HISTORY_SIZE) {
      this.tagsHistory.length = TAGS_HISTORY_SIZE;
    }

    localStorage.setItem(this.TAGS_HISTORY_KEY, JSON.stringify(this.tagsHistory));
  };

  forceRerender = () => {
    const editorState = this.getEditorState();

    this.setEditorState(EditorState.forceSelection(editorState, editorState.getSelection()));
  };
}

export default XMLStore;
