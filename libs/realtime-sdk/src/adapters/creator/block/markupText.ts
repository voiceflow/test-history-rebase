/* eslint-disable max-depth */
import { BaseText } from '@voiceflow/base-types';
import type { RawDraftContentState, RawDraftEntityRange, RawDraftInlineStyleRange } from 'draft-js';
import { parseToRgb } from 'polished';
import type { Text } from 'slate';

import type { Markup } from '@/models';

import { createBlockAdapter } from './utils';

enum DraftInlineStyle {
  COLOR = 'COLOR',
  ITALIC = 'ITALIC',
  UNDERLINE = 'UNDERLINE',
  FONT_WEIGHT = 'FONT_WEIGHT',
  FONT_FAMILY = 'FONT_FAMILY',
  FAKE_SELECTION = 'FAKE_SELECTION',
}

type DraftTextData = Omit<Markup.NodeData.Text, 'content'> & {
  content: RawDraftContentState;
  textAlignment?: string;
};

type Node = BaseText.AnyElement | Text;

const isDraftJSContent = (data: any): data is DraftTextData => 'blocks' in (data?.content ?? {});

const draftJSToSlateAdapter = (data: any): Markup.NodeData.Text => {
  if (isDraftJSContent(data)) {
    const {
      content: { blocks, entityMap = {} },
      textAlignment,
    } = data;

    const content = blocks.map(({ text, entityRanges, inlineStyleRanges }) => {
      const entityRangesToProcess: RawDraftEntityRange[] = [];
      let children: Node[] = [{ text }];

      // process newest ranges first
      [...entityRanges]
        .sort((lr, rr) => lr.key - rr.key)
        .reverse()
        .forEach((range) => {
          const shouldBeProcessed = !entityRangesToProcess.some(({ offset, length }) => {
            const end = offset + length;
            const rangeEnd = range.offset + range.length;

            return (range.offset >= offset && range.offset < end) || (rangeEnd > offset && rangeEnd <= end);
          });

          if (shouldBeProcessed) {
            entityRangesToProcess.push(range);
          }
        });

      let prevRangeEnd = 0;

      // process earliest ranges first
      entityRangesToProcess
        .sort((lr, rr) => lr.offset - rr.offset)
        .forEach((range) => {
          const url: string = entityMap[range.key]?.data?.url;

          if (!url) {
            return;
          }

          const beforeText = text.substring(prevRangeEnd, range.offset);
          const linkText = text.substr(range.offset, range.length);
          const afterText = text.substring(range.offset + range.length, text.length);

          (children[children.length - 1] as Text).text = beforeText;
          children.push({
            type: BaseText.ElementType.LINK,
            url,
            children: [{ text: linkText }],
          });
          children.push({ text: afterText });

          prevRangeEnd = range.offset + range.length;
        });

      // remove empty text nodes following each other
      children = children.filter(
        (node, index) =>
          index === 0 ||
          !('text' in node) ||
          node.text !== '' ||
          !('text' in children[index - 1]) ||
          (children[index - 1] as Text).text !== ''
      );

      // eslint-disable-next-line sonarjs/cognitive-complexity
      const getNodeChildrenOffset = (node: Node): number => {
        let offset = 0;

        for (const child of children) {
          if ('children' in child && Array.isArray(child.children)) {
            for (const grandchild of child.children as Text[]) {
              if (grandchild === node) {
                return offset;
              }

              offset += (grandchild.text as string)?.length ?? 0;
            }
          } else {
            if (child === node) {
              return offset;
            }

            offset += (child as Text).text?.length ?? 0;
          }
        }

        return offset;
      };

      const addLeafPropertyAtRange = (
        nodes: Node[],
        range: RawDraftInlineStyleRange,
        style: string,
        value: unknown
      ): Node[] =>
        nodes.flatMap((node) => {
          if ('children' in node && Array.isArray(node.children)) {
            return {
              ...node,
              children: addLeafPropertyAtRange(node.children, range, style, value),
            };
          }

          const nodeOffset = getNodeChildrenOffset(node);
          const nodeText = (node as Text).text ?? '';
          const nodeLength = nodeText.length;
          const nodeEnd = nodeOffset + nodeLength;
          const rangeEnd = range.offset + range.length;

          // the range is out of the node
          if (rangeEnd <= nodeOffset || range.offset >= nodeEnd) {
            return node;
          }

          // the range is the same as a node, or cover the whole node
          if (range.offset <= nodeOffset && rangeEnd >= nodeEnd) {
            return { ...node, [style]: value };
          }

          const offset = Math.max(range.offset - nodeOffset, 0);
          const length =
            rangeEnd > nodeEnd
              ? nodeLength
              : range.length - (range.offset < nodeOffset ? nodeOffset - range.offset : 0);

          const beforeStyledText = nodeText.substring(0, offset);
          const styledText = nodeText.substr(offset, length);
          const afterStyledText = nodeText.substring(offset + length, nodeText.length);

          const result = [{ ...node, text: styledText, [style]: value }];

          if (beforeStyledText) {
            result.unshift({ ...node, text: beforeStyledText });
          }

          if (afterStyledText) {
            result.push({ ...node, text: afterStyledText });
          }

          return result;
        });

      // process earliest style ranges first
      [...inlineStyleRanges]
        .sort((lr, rr) => lr.offset - rr.offset)
        .forEach((styleRange) => {
          const [draftProperty, value] = (styleRange.style || '').split('::');

          // eslint-disable-next-line default-case
          switch (draftProperty) {
            case DraftInlineStyle.ITALIC:
              children = addLeafPropertyAtRange(children, styleRange, BaseText.TextProperty.ITALIC, true);
              break;
            case DraftInlineStyle.UNDERLINE:
              children = addLeafPropertyAtRange(children, styleRange, BaseText.TextProperty.UNDERLINE, true);
              break;
            case DraftInlineStyle.FONT_FAMILY:
              children = addLeafPropertyAtRange(children, styleRange, BaseText.TextProperty.FONT_FAMILY, value);
              break;
            case DraftInlineStyle.FONT_WEIGHT:
              children = addLeafPropertyAtRange(children, styleRange, BaseText.TextProperty.FONT_WEIGHT, value);
              break;
            case DraftInlineStyle.COLOR: {
              try {
                const rgb = parseToRgb(value ?? '');

                const rgba = {
                  r: rgb.red,
                  g: rgb.green,
                  b: rgb.blue,
                  a: 'alpha' in rgb ? rgb.alpha : 1,
                };

                children = addLeafPropertyAtRange(children, styleRange, BaseText.TextProperty.COLOR, rgba);
              } catch {
                // empty
              }
            }
          }
        });

      return {
        [BaseText.ElementProperty.TEXT_ALIGN]: textAlignment || 'left',
        children,
      };
    });

    return {
      scale: data.scale,
      rotate: data.rotate,
      content,
      overrideWidth: data.overrideWidth && data.overrideWidth + 18,
      backgroundColor: data.backgroundColor,
    };
  }

  return data;
};

const markupText = createBlockAdapter<Markup.NodeData.Text, Markup.NodeData.Text>(
  (data) => draftJSToSlateAdapter(data),
  (data) => data
);

export default markupText;
