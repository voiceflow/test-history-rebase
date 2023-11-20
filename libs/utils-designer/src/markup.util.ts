import { Utils } from '@voiceflow/common';
import type { Entity, Markup, MarkupSpan, Variable } from '@voiceflow/dtos';
import { SlateEditor } from '@voiceflow/ui-next';
import type { MultiAdapter } from 'bidirectional-adapter';
import { createMultiAdapter } from 'bidirectional-adapter';
import type { Descendant } from 'slate';
import { Text } from 'slate';
import { match } from 'ts-pattern';

type MarkupItem = Markup[number];

const ENTITY_OR_VARIABLE_TEXT_REGEXP = /{(\w*)}/g;

interface MarkupSpanText extends Omit<MarkupSpan, 'text'> {
  text: [string];
  attributes: {
    __type: 'text';
  };
}

interface MarkupSpanLink extends MarkupSpan {
  attributes: {
    __type: 'link';
    url: string;
  };
}

export const isMarkupVariableReference = (markupItem: Markup[number]): markupItem is { variableID: string } => {
  return (markupItem as { variableID: string }).variableID !== undefined;
};

export const isMarkupEntityReference = (markupItem: Markup[number]): markupItem is { entityID: string } => {
  return (markupItem as { entityID: string }).entityID !== undefined;
};

export const markupFactory = (text = ''): Markup => [{ text: [text] }];

export const isMarkupSpan = (value: MarkupItem): value is MarkupSpan =>
  Utils.object.isObject(value) && Utils.object.hasProperty(value, 'text');

export const isMarkupSpanText = (value: MarkupSpan): value is MarkupSpanText =>
  value.attributes?.__type === 'text' &&
  Array.isArray(value.text) &&
  value.text.length === 1 &&
  typeof value.text[0] === 'string';

export const isMarkupSpanLink = (value: MarkupSpan): value is MarkupSpanLink =>
  value.attributes?.__type === 'link' && !!value.attributes.url;

export const isMarkupEntity = (value: MarkupItem): value is { entityID: string } =>
  Utils.object.isObject(value) && Utils.object.hasProperty(value, 'entityID');

export const isMarkupString = (value: MarkupItem): value is string => typeof value === 'string';

export const isMarkupVariable = (value: MarkupItem): value is { variableID: string } =>
  Utils.object.isObject(value) && Utils.object.hasProperty(value, 'variableID');

export const isMarkupEmpty = (markup: Markup): boolean =>
  !markup.length ||
  markup.every((text) =>
    isMarkupString(text) ? !text.trim() : !isMarkupEntity(text) && !isMarkupVariable(text) && isMarkupEmpty(text.text)
  );

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
  variablesMapByID: Partial<Record<string, Variable>>;
  ignoreMissingEntities?: boolean;
  ignoreMissingVariables?: boolean;
}

interface MarkupToStringToOptions {
  entitiesMapByName: Partial<Record<string, Entity>>;
  variablesMapByName: Partial<Record<string, Variable>>;
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

export const replaceMarkupEntity = (
  markup: Markup,
  { oldEntityID, newEntityID }: { oldEntityID: string; newEntityID: string }
): Markup => {
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

export const markupToString: MultiAdapter<Markup, string, [MarkupToStringFromOptions], [MarkupToStringToOptions]> =
  createMultiAdapter<Markup, string, [MarkupToStringFromOptions], [MarkupToStringToOptions]>(
    (
      markup,
      { entitiesMapByID, variablesMapByID, ignoreMissingEntities, ignoreMissingVariables } = {
        entitiesMapByID: {},
        variablesMapByID: {},
      }
    ) =>
      markup.reduce<string>(
        (acc, item) =>
          acc +
          match(item)
            .when(isMarkupSpan, ({ text }) => markupToString.fromDB(text, { entitiesMapByID, variablesMapByID }))
            .when(isMarkupString, (item) => item)
            .when(isMarkupEntity, ({ entityID }) =>
              !entitiesMapByID[entityID] && ignoreMissingEntities
                ? ''
                : `{${entitiesMapByID[entityID]?.name ?? entityID}}`
            )
            .when(isMarkupVariable, ({ variableID }) =>
              !variablesMapByID[variableID] && ignoreMissingVariables
                ? ''
                : `{${variablesMapByID[variableID]?.name ?? variableID}}`
            )
            .exhaustive(),
        ''
      ),
    (text, { entitiesMapByName, variablesMapByName }) => {
      const matches = [...text.matchAll(ENTITY_OR_VARIABLE_TEXT_REGEXP)];

      if (!matches.length) return [{ text: [text] }];

      const span: MarkupSpan = {
        text: [],
      };

      let prevMatch: RegExpMatchArray | null = null;

      for (const match of matches) {
        const entity = entitiesMapByName[match[1]];
        const variable = variablesMapByName[match[1]];

        let substring: string;

        if (!prevMatch) {
          substring = text.substring(0, match.index);
        } else {
          substring = text.substring(prevMatch.index! + prevMatch[0].length, match.index);
        }

        if (substring) {
          span.text.push(substring);
        }

        if (entity) {
          span.text.push({ entityID: entity.id });
        } else if (variable) {
          span.text.push({ variableID: variable.id });
        } else {
          span.text.push(match[0]);
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

export const markupToSlate = createMultiAdapter<Markup, Descendant[], [] | [{ iteration?: number }]>(
  (markup, { iteration = 0 } = {}) => {
    if (!markup.length) return iteration === 0 ? SlateEditor.StaticEditor.createTextState('') : [{ text: '' }];

    if (markup.length === 1 && typeof markup[0] === 'string')
      return iteration === 0 ? SlateEditor.StaticEditor.createTextState(markup[0]) : [{ text: markup[0] }];

    return markup.reduce<Descendant[]>(
      (acc, item) => [
        ...acc,
        match(item)
          .when(isMarkupString, (item): Text => ({ text: item }))
          .when(
            isMarkupEntity,
            ({ entityID }): SlateEditor.VariableElementType => ({
              type: SlateEditor.ElementType.VARIABLE,
              children: [{ text: '' }],
              variableID: entityID,
              variableVariant: SlateEditor.VariableElementVariant.ENTITY,
            })
          )
          .when(
            isMarkupVariable,
            ({ variableID }): SlateEditor.VariableElementType => ({
              type: SlateEditor.ElementType.VARIABLE,
              children: [{ text: '' }],
              variableID,
              variableVariant: SlateEditor.VariableElementVariant.VARIABLE,
            })
          )
          .when(isMarkupSpan, (span) =>
            match(span)
              .when(
                isMarkupSpanText,
                ({ text: [text], attributes: { __type, ...attrs } }): SlateEditor.Text => ({ ...attrs, text })
              )
              .when(
                isMarkupSpanLink,
                ({ text, attributes: { url } }): SlateEditor.LinkElementType => ({
                  url,
                  type: SlateEditor.ElementType.LINK,
                  children: markupToSlate.fromDB(text, { iteration: iteration + 1 }),
                })
              )
              .otherwise(
                ({ text, attributes: { __type, ...attrs } = {} }): SlateEditor.Element => ({
                  ...attrs,
                  children: markupToSlate.fromDB(text, { iteration: iteration + 1 }),
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
    if (SlateEditor.StaticEditor.isEmptyState(slate)) return markupFactory();

    return slate.reduce<Markup>(
      (acc, item) => [
        ...acc,
        match(item)
          .when(SlateEditor.StaticEditor.isLink, (item): MarkupSpanLink => {
            const { url = '', children } = item;

            return {
              text: markupToSlate.toDB(children),
              attributes: { __type: 'link', url },
            };
          })
          .when(SlateEditor.StaticEditor.isVariable, (item): { variableID: string } | { entityID: string } => {
            const { variableID, variableVariant } = item;

            return variableVariant === SlateEditor.VariableElementVariant.VARIABLE
              ? { variableID }
              : { entityID: variableID };
          })
          .when(Text.isText, (item): string | MarkupSpanText => {
            // TODO: fix any
            const { text, color, italic, underline, fontWeight, fontFamily, strikeThrough, backgroundColor } =
              item as any;

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
          })
          .otherwise(
            // TODO: fix any
            ({ type: _, children, textAlign }: any): MarkupSpan => ({
              text: markupToSlate.toDB(children),
              ...(textAlign && { attributes: { textAlign } }),
            })
          ),
      ],
      []
    );
  }
);
