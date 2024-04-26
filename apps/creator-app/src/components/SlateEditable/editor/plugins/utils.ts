/* eslint-disable callback-return */
import type { Nullable } from '@voiceflow/common';
import type { Node, Text } from 'slate';
import { Element } from 'slate';

import type { ElementType } from '../../constants';
import type { ProcessorNext } from './types';

export const matchAndProcessTextNodeToElement = (
  { type, node, regexp, next }: { type: ElementType; node: Text; regexp: RegExp; next: ProcessorNext },
  callback: (match: RegExpMatchArray, prevTextNode: Text) => Node[]
): Node[] => {
  const { text } = node;
  const nodes: Node[] = [];

  let prevMatch: Nullable<RegExpMatchArray> = null;

  for (const match of text.matchAll(regexp)) {
    let textNode: Text;

    // find text before the match
    if (!prevMatch) {
      textNode = { text: text.substring(0, match.index) };
    } else {
      textNode = { text: text.substring(prevMatch.index! + prevMatch[0].length, match.index) };
    }

    nodes.push(...callback(match, textNode));

    prevMatch = match;
  }

  const isNodesProcessed = nodes.some((node) => Element.isElement(node) && node.type === type);

  if (prevMatch && isNodesProcessed) {
    nodes.push(...next([{ text: text.substring(prevMatch.index! + prevMatch[0].length, text.length) || ' ' }]));
  }

  return isNodesProcessed ? nodes : next([node]);
};
