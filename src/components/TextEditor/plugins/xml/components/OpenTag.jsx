import toLower from 'lodash/toLower';
import React, { Fragment } from 'react';

import { useHoveredXmlTag } from '../hooks';
import { updateAttribute } from '../utils';
import AttributeValue from './AttributeValue';
import Tag from './Tag';

export default function OpenTag({ tags, store, entityKey, contentState, offsetKey, globalStore }) {
  const { key, text, tag, attributes, isSingle, linkedKey } = contentState.getEntity(entityKey).getData();
  const tagData = tags[tag];
  const attributesNames = Object.keys(attributes || {});

  const hoveredTagKey = useHoveredXmlTag(key, linkedKey, store);

  const onMouseEnter = React.useCallback(() => {
    if (globalStore.get('readOnly')) {
      return;
    }

    store.forceRerenderTags(key);
  }, [key, store, globalStore]);

  const onMouseLeave = React.useCallback(() => {
    if (globalStore.get('readOnly')) {
      return;
    }

    store.forceRerenderTags();
  }, [store, globalStore]);

  const onUpdateAttribute = React.useCallback(
    (name, value) => {
      const editorState = store.getEditorState();

      store.setEditorState(updateAttribute(editorState, entityKey, { name, value }));
      store.forceRerenderTags();
    },
    [store, entityKey]
  );

  if (!tagData) {
    return (
      <Tag
        color={tagData?.color}
        isHovered={key === hoveredTagKey || (linkedKey && linkedKey === hoveredTagKey)}
        onMouseLeave={onMouseLeave}
        onMouseEnter={onMouseEnter}
      >
        <span data-offset-key={offsetKey}>
          <span data-text={false}>{text}</span>
        </span>
      </Tag>
    );
  }
  return (
    <Tag
      color={tagData.color}
      isHovered={key === hoveredTagKey || (linkedKey && linkedKey === hoveredTagKey)}
      onMouseLeave={onMouseLeave}
      onMouseEnter={onMouseEnter}
    >
      <span data-offset-key={offsetKey}>
        <span data-text={false}>{`<${tag}`}</span>
        {!!attributesNames.length && (
          <>
            <span> </span>
            {attributesNames.map((attributeName, i) => {
              const attributeData = tagData.attributes?.[toLower(attributeName)];
              const value = attributes[attributeName];

              return (
                <Fragment key={attributeName}>
                  {i !== 0 && <span> </span>}
                  <span>{attributeName}</span>
                  <span>=</span>
                  <AttributeValue
                    key={attributeName}
                    name={attributeName}
                    store={store}
                    value={value}
                    tagData={tagData}
                    onUpdate={onUpdateAttribute}
                    globalStore={globalStore}
                    onMouseLeave={onMouseLeave}
                    attributeData={attributeData}
                  />
                </Fragment>
              );
            })}
          </>
        )}
        <span data-text={false}>{`${isSingle ? ' /' : ''}>`}</span>
      </span>
    </Tag>
  );
}
