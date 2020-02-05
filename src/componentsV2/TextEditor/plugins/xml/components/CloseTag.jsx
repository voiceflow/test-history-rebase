import React from 'react';

import Tag from './Tag';

export default function CloseTag({ store, tags, entityKey, contentState, offsetKey, globalStore }) {
  const { key, tag, text, linkedKey } = contentState.getEntity(entityKey).getData();
  const hoveredTagKey = store.get('hoveredTagKey');

  const onMouseEnter = React.useCallback(() => {
    if (globalStore.get('readOnly')) {
      return;
    }

    store.set('hoveredTagKey', key);

    store.forceRerender();
  }, [globalStore, key, store]);

  const onMouseLeave = React.useCallback(() => {
    if (globalStore.get('readOnly')) {
      return;
    }

    store.set('hoveredTagKey', null);

    store.forceRerender();
  }, [globalStore, store]);

  return (
    <Tag
      color={tags[tag]?.color}
      isHovered={key === hoveredTagKey || linkedKey === hoveredTagKey}
      onMouseLeave={onMouseLeave}
      onMouseEnter={onMouseEnter}
    >
      <span data-offset-key={offsetKey}>
        <span data-text={false}>{text}</span>
      </span>
    </Tag>
  );
}
