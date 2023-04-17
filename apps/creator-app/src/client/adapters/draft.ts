import { Utils } from '@voiceflow/common';
import { createSimpleAdapter } from 'bidirectional-adapter';
import { RawDraftContentBlock, RawDraftContentState, RawDraftEntityRange } from 'draft-js';
import _isString from 'lodash/isString';

export type VFDraftState = RawDraftContentState & { text: string };
export type EntityMap = RawDraftContentState['entityMap'];
export type VFContent = (string | { id?: string; name: string })[];

export const extractDraftJSEntities = (text: string, entityRanges: RawDraftEntityRange[], entityMap: EntityMap) => {
  const variableContent: (string | { name: string })[] = [];
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

export const buildDraftJSContent = (content: VFContent, existingEntitiesMap?: EntityMap): VFDraftState => {
  const [text, entityMap, entityRanges] = content.reduce<[string, EntityMap, RawDraftEntityRange[], number]>(
    ([textAcc, entityMapAcc, entityRangesAcc, cursor], value) => {
      const textValue = _isString(value) ? value : `{${value.name}}`;

      if (!_isString(value)) {
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

  const blocks: RawDraftContentBlock[] = [
    {
      key: Utils.id.cuid.slug(),
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

export const draftJSContentAdapter = createSimpleAdapter<VFDraftState, VFContent>(
  (draftJSContent) =>
    draftJSContent
      ? draftJSContent.blocks
          .flatMap(({ text, entityRanges }) => (entityRanges.length ? extractDraftJSEntities(text, entityRanges, draftJSContent.entityMap) : text))
          .reduce<VFContent>((acc, content, index) => {
            if (index > 0 && _isString(acc[acc.length - 1]) && _isString(content)) {
              acc.push(`${acc.pop()}\n${content}`);
            } else {
              acc.push(content);
            }

            return acc;
          }, [])
      : [],
  (content, existingEntitiesMap?: EntityMap) => buildDraftJSContent(content, existingEntitiesMap)
);
