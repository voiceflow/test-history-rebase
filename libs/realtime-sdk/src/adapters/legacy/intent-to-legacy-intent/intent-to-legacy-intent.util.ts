import { BaseText } from '@voiceflow/base-types';
import { SLOT_REGEXP, Utils } from '@voiceflow/common';
import type { Entity, Markup, MarkupSpan, Variable } from '@voiceflow/dtos';
import type { MultiAdapter } from 'bidirectional-adapter';
import { createMultiAdapter } from 'bidirectional-adapter';
import { Text } from 'slate';
import { match } from 'ts-pattern';

type MarkupItem = Markup[number];

interface MarkupSpanText extends Omit<MarkupSpan, 'text'> {
  text: [string];
  attributes: { __type: 'text' };
}

interface MarkupSpanLink extends MarkupSpan {
  attributes: { __type: 'link'; url: string };
}

export const markupFactory = (text = ''): Markup => [{ text: [text] }];

export const isMarkupSpan = (value: MarkupItem): value is MarkupSpan => Utils.object.isObject(value) && Utils.object.hasProperty(value, 'text');

export const isMarkupSpanText = (value: MarkupSpan): value is MarkupSpanText =>
  value.attributes?.__type === 'text' && Array.isArray(value.text) && value.text.length === 1 && typeof value.text[0] === 'string';

export const isMarkupSpanLink = (value: MarkupSpan): value is MarkupSpanLink => value.attributes?.__type === 'link' && !!value.attributes.url;

export const isMarkupEntity = (value: MarkupItem): value is { entityID: string } =>
  Utils.object.isObject(value) && Utils.object.hasProperty(value, 'entityID');

export const isMarkupString = (value: MarkupItem): value is string => typeof value === 'string';

export const isMarkupVariable = (value: MarkupItem): value is { variableID: string } =>
  Utils.object.isObject(value) && Utils.object.hasProperty(value, 'variableID');

export const isMarkupEmpty = (markup: Markup): boolean =>
  !markup.length ||
  markup.every((text) => (isMarkupString(text) ? !text.trim() : !isMarkupEntity(text) && !isMarkupVariable(text) && isMarkupEmpty(text.text)));

export const isMarkupWithEntities = (markup: Markup): boolean => {
  return markup.some((item) => {
    if (isMarkupSpan(item)) {
      return isMarkupWithEntities(item.text);
    }

    if (Array.isArray(item)) {
      return isMarkupWithEntities(item);
    }

    return isMarkupEntity(item);
  });
};

interface MarkupToStringFromOptions {
  entitiesMapByID: Partial<Record<string, Entity>>;
  ignoreMissingEntities?: boolean;
  ignoreMissingVariables?: boolean;
}

interface MarkupToStringToOptions {
  entitiesOnly?: boolean;
}

const getMarkupAllEntityIDs = (markup: Markup): string[] =>
  markup.reduce<string[]>((acc, item) => {
    if (isMarkupSpan(item)) {
      return [...acc, ...getMarkupAllEntityIDs(item.text)];
    }
    if (Array.isArray(item)) {
      return [...acc, ...getMarkupAllEntityIDs(item)];
    }
    if (isMarkupEntity(item)) {
      return [...acc, item.entityID];
    }

    return acc;
  }, []);

export const getMarkupEntityIDs = (markup: Markup) => Utils.array.unique(getMarkupAllEntityIDs(markup));

const getMarkupAllVariableIDs = (markup: Markup): string[] =>
  markup.reduce<string[]>((acc, item) => {
    if (isMarkupSpan(item)) {
      return [...acc, ...getMarkupAllVariableIDs(item.text)];
    }
    if (Array.isArray(item)) {
      return [...acc, ...getMarkupAllVariableIDs(item)];
    }
    if (isMarkupVariable(item)) {
      return [...acc, item.variableID];
    }

    return acc;
  }, []);

export const getMarkupVariableIDs = (markup: Markup) => Utils.array.unique(getMarkupAllVariableIDs(markup));

export const replaceMarkupEntity = (markup: Markup, { oldEntityID, newEntityID }: { oldEntityID: string; newEntityID: string }): Markup => {
  return markup.reduce<Markup>((acc, item) => {
    if (isMarkupEntity(item) && item.entityID === oldEntityID) {
      return [...acc, { entityID: newEntityID }];
    }
    if (isMarkupSpan(item)) {
      return [...acc, { ...item, text: replaceMarkupEntity(item.text, { oldEntityID, newEntityID }) }];
    }
    return [...acc, item];
  }, []);
};

export const fillMarkupWithVariablesValues = (promptText: string, variables: Record<string, string>) => {
  let s = promptText;
  // eslint-disable-next-line guard-for-in
  for (const prop in variables) {
    s = s.replace(new RegExp(`{${prop}}`, 'g'), variables[prop]);
  }
  return s;
};

export const markupToString: MultiAdapter<Markup, string, [MarkupToStringFromOptions], [MarkupToStringToOptions] | []> = createMultiAdapter<
  Markup,
  string,
  [MarkupToStringFromOptions],
  [MarkupToStringToOptions] | []
>(
  (markup, { entitiesMapByID }) =>
    markup.reduce<string>(
      (acc, item) =>
        acc +
        match(item)
          .when(isMarkupSpan, ({ text }) => markupToString.fromDB(text, { entitiesMapByID }))
          .when(isMarkupString, (item) => item)
          .when(isMarkupEntity, ({ entityID }) => `{{[${entitiesMapByID[entityID]?.name ?? 'unknown'}].${entityID}}}`)
          .when(isMarkupVariable, ({ variableID }) => `{{[${variableID}].${variableID}}}`)
          .exhaustive(),
      ''
    ),
  (text, { entitiesOnly } = {}) => {
    const matches = [...text.matchAll(SLOT_REGEXP)];

    if (!matches.length) return [{ text: [text] }];

    const span: MarkupSpan = { text: [] };

    let prevMatch: RegExpMatchArray | null = null;

    for (const match of matches) {
      const entityID = match[2];
      const entityName = match[1];
      const isVariable = !entitiesOnly && entityID === entityName;

      let substring: string;

      if (!prevMatch) {
        substring = text.substring(0, match.index);
      } else {
        substring = text.substring(prevMatch.index! + prevMatch[0].length, match.index);
      }

      if (substring) {
        span.text.push(substring);
      }

      if (isVariable) {
        span.text.push({ variableID: entityID });
      } else {
        span.text.push({ entityID });
      }

      prevMatch = match;
    }

    if (!prevMatch) {
      return [span];
    }

    const substring = text.substring(prevMatch.index! + prevMatch[0].length, text.length);

    if (substring) {
      span.text.push(substring);
    }

    return [span];
  }
);

const isEmptyState = (nodes: BaseText.SlateTextValue): boolean =>
  nodes.every((element) => (Text.isText(element) ? !element.text.trim() : (element as any).type !== 'variable' && isEmptyState(element.children)));

export const markupToSlate = createMultiAdapter<
  Markup,
  BaseText.SlateTextValue,
  [{ iteration?: number; entitiesMapByID: Partial<Record<string, Entity>>; variablesMapByID: Partial<Record<string, Variable>> }]
>(
  (markup, { iteration = 0, entitiesMapByID, variablesMapByID }): BaseText.SlateTextValue => {
    if (!markup?.length) return iteration === 0 ? [{ children: [{ text: '' }] }] : [{ text: '' }];

    if (markup.length === 1 && typeof markup[0] === 'string') return iteration === 0 ? [{ children: [{ text: markup[0] }] }] : [{ text: markup[0] }];

    return markup.reduce<BaseText.SlateTextValue>(
      (acc, item) => [
        ...acc,
        match(item)
          .when(isMarkupString, (item): Text => ({ text: item }))
          .when(
            isMarkupEntity,
            ({ entityID }): BaseText.VariableElement => ({
              id: entityID,
              type: BaseText.ElementType.VARIABLE,
              name: entitiesMapByID[entityID]?.name ?? 'unknown',
              isSlot: true,
              children: [{ text: '' }],
            })
          )
          .when(
            isMarkupVariable,
            ({ variableID }): BaseText.VariableElement => ({
              id: variableID,
              type: BaseText.ElementType.VARIABLE,
              name: variablesMapByID[variableID]?.name ?? 'unknown',
              isSlot: false,
              children: [{ text: '' }],
            })
          )
          .when(isMarkupSpan, (span) =>
            match(span)
              .when(isMarkupSpanText, ({ text: [text], attributes: { __type, ...attrs } }): BaseText.Text => ({ ...attrs, text }))
              .when(
                isMarkupSpanLink,
                ({ text, attributes: { url } }): BaseText.LinkElement => ({
                  url,
                  type: BaseText.ElementType.LINK,
                  children: markupToSlate.fromDB(text, { iteration: iteration + 1, entitiesMapByID, variablesMapByID }),
                })
              )
              .otherwise(
                ({ text, attributes: { __type, ...attrs } = {} }): BaseText.Element => ({
                  ...attrs,
                  children: markupToSlate.fromDB(text, { iteration: iteration + 1, entitiesMapByID, variablesMapByID }),
                })
              )
          )

          .exhaustive(),
      ],
      []
    );
  },
  // eslint-disable-next-line sonarjs/cognitive-complexity
  (slate) => {
    if (isEmptyState(slate)) return markupFactory();

    return slate.reduce<Markup>(
      (acc, item) => [
        ...acc,
        match(item)
          .when(
            (value): value is BaseText.LinkElement => !Text.isText(value) && value.type === BaseText.ElementType.LINK,
            (item): MarkupSpanLink => {
              const { url = '', children } = item;

              return { text: markupToSlate.toDB(children), attributes: { __type: 'link', url } };
            }
          )
          .when(
            (value): value is BaseText.VariableElement => !Text.isText(value) && value.type === BaseText.ElementType.VARIABLE,
            (item): { variableID: string } | { entityID: string } => {
              const { id, name } = item;

              const isSlot = item.isSlot ?? id !== name;

              return isSlot ? { entityID: id } : { variableID: id };
            }
          )
          .when(
            (value): value is BaseText.Text => Text.isText(value),
            (item): string | MarkupSpanText => {
              const { text, color, italic, underline, fontWeight, fontFamily, strikeThrough, backgroundColor } = item;

              if (!color && !italic && !underline && !fontWeight && !fontFamily && !strikeThrough && !backgroundColor) {
                return text;
              }

              return {
                text: [text],
                attributes: {
                  __type: 'text',
                  ...(color && { color }),
                  ...(italic && { italic }),
                  ...(underline && { underline }),
                  ...(fontWeight && { fontWeight }),
                  ...(fontFamily && { fontFamily }),
                  ...(strikeThrough && { strikeThrough }),
                  ...(backgroundColor && { backgroundColor }),
                },
              };
            }
          )
          .otherwise(
            ({ type: _, children, textAlign }): MarkupSpan => ({
              text: markupToSlate.toDB(children),
              ...(textAlign && { attributes: { textAlign } }),
            })
          ),
      ],
      []
    );
  }
);
