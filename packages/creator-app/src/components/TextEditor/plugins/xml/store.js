import Store from '../store';

const TAGS_HISTORY_KEY = 'vf-text-editor-xml-tags-history';
const TAGS_HISTORY_SIZE = 10;

class XMLStore extends Store {
  constructor(type, data) {
    super(data);

    this.tags = new Map();
    this.TAGS_HISTORY_KEY = `${TAGS_HISTORY_KEY}-${type}`;

    try {
      this.tagsHistory = JSON.parse(localStorage.getItem(this.TAGS_HISTORY_KEY)) || [];
    } catch {
      this.tagsHistory = [];
    }
  }

  registerTag = (key, linkedKey, forceUpdate) => {
    this.tags.set(`key-${key}`, forceUpdate);
    this.tags.set(`linked-key-${linkedKey}`, forceUpdate);
  };

  unRegisterTag = (key, linkedKey) => {
    this.tags.delete(`key-${key}`);
    this.tags.delete(`linked-key-${linkedKey}`);
  };

  getTagsToHistory = () => [...this.tagsHistory];

  addTagToHistory = (tagData) => {
    this.tagsHistory.unshift(tagData);

    if (this.tagsHistory.length > TAGS_HISTORY_SIZE) {
      this.tagsHistory.length = TAGS_HISTORY_SIZE;
    }

    localStorage.setItem(this.TAGS_HISTORY_KEY, JSON.stringify(this.tagsHistory));
  };

  forceRerenderTags = (key) => {
    const prevHoveredTagKey = this.get('hoveredTagKey');

    this.set('hoveredTagKey', key);

    this.tags.get(`key-${key}`)?.();
    this.tags.get(`linked-key-${key}`)?.();
    this.tags.get(`key-${prevHoveredTagKey}`)?.();
    this.tags.get(`linked-key-${prevHoveredTagKey}`)?.();
  };
}

export default XMLStore;
