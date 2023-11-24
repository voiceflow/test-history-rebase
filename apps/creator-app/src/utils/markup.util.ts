import type { Markup, MarkupSpan } from '@voiceflow/dtos';
import { SlateEditor } from '@voiceflow/ui-next';
import type { MarkupSpanLink, MarkupSpanText } from '@voiceflow/utils-designer';
import {
  isMarkupEntity,
  isMarkupSpan,
  isMarkupSpanLink,
  isMarkupSpanText,
  isMarkupString,
  isMarkupVariable,
  markupFactory,
} from '@voiceflow/utils-designer';
import createMultiAdapter from 'bidirectional-adapter';
import { Descendant, Text } from 'slate';
import { match } from 'ts-pattern';

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
              .when(isMarkupSpanText, ({ text: [text], attributes: { __type, ...attrs } }): SlateEditor.Text => ({ ...attrs, text }))
              .when(
                isMarkupSpanLink,
                ({ text, attributes: { url } }): SlateEditor.LinkElementType => ({
                  url,
                  type: SlateEditor.ElementType.LINK,
                  children: markupToSlate.fromDB(text, { iteration: iteration + 1 }),
                })
              )
              .otherwise(
                ({ text, attributes: { ...attrs } = {} }): SlateEditor.Element => ({
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

            return variableVariant === SlateEditor.VariableElementVariant.VARIABLE ? { variableID } : { entityID: variableID };
          })
          .when(Text.isText, (item): string | MarkupSpanText => {
            // TODO: fix any
            const { text, color, italic, underline, fontWeight, fontFamily, strikeThrough, backgroundColor } = item as any;

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
