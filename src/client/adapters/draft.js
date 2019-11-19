import cuid from 'cuid';

import { createSimpleAdapter } from './utils';

export const extractDraftJSEntities = (text, entityRanges, entityMap) => {
  const variableContent = [];
  let cursor = 0;

  entityRanges.forEach(({ key, offset, length }) => {
    if (offset > cursor) {
      variableContent.push(text.slice(cursor, offset));
    }

    variableContent.push({ name: entityMap[key].data.mention.name });

    cursor = offset + length;
  });

  if (cursor < text.length) {
    variableContent.push(text.slice(cursor));
  }

  return variableContent;
};

export const buildDraftJSContent = (content, existingEntitiesMap) => {
  const [text, entityMap, entityRanges] = content.reduce(
    ([textAcc, entityMapAcc, entityRangesAcc, cursor], value) => {
      const isVariable = typeof value === 'object';
      const textValue = isVariable ? `{${value.name}}` : value;

      if (isVariable) {
        const existingEntity = existingEntitiesMap?.[value.name];

        if (!existingEntitiesMap || existingEntity) {
          const key = Object.keys(entityMapAcc).length;

          entityMapAcc[key] = {
            type: '{mention',
            mutability: 'IMMUTABLE',
            data: { mention: existingEntity || { name: value.name } },
          };
          entityRangesAcc.push({
            key,
            offset: cursor,
            length: textValue.length,
          });
        }
      }

      return [textAcc + textValue, entityMapAcc, entityRangesAcc, cursor + textValue.length];
    },
    ['', {}, [], 0]
  );

  const blocks = [
    {
      key: cuid.slug(),
      text,
      type: 'unstyled',
      depth: 0,
      entityRanges,
      inlineStyleRanges: [],
    },
  ];

  return {
    text,
    blocks,
    entityMap,
  };
};

export const draftJSContentAdapter = createSimpleAdapter(
  (draftJSContent) =>
    draftJSContent
      ? draftJSContent.blocks
          .flatMap(({ text, entityRanges }) => (entityRanges.length ? extractDraftJSEntities(text, entityRanges, draftJSContent.entityMap) : text))
          .reduce((acc, content, index) => {
            if (index > 0 && typeof acc[acc.length - 1] === 'string' && typeof content === 'string') {
              acc.push(`${acc.pop()}\n${content}`);
            } else {
              acc.push(content);
            }

            return acc;
          }, [])
      : [],
  (content, existingEntitiesMap) => buildDraftJSContent(content, existingEntitiesMap)
);
