import { DraftInlineStyle, EditorState, RawDraftContentState, convertFromRaw } from 'draft-js';
import { CSSProperties } from 'react';

import { DraftBuiltInStyle, InlineStylePrefix } from '../constants';
import { getInlineStylePrefixAndValue } from '../utils';

export const createEditorState = (content: RawDraftContentState) =>
  content.blocks.length ? EditorState.createWithContent(convertFromRaw(content)) : EditorState.createEmpty();

export const customStyleFn = (styles: DraftInlineStyle): CSSProperties =>
  styles.reduce<CSSProperties>((acc, style) => {
    const [prefix, value] = getInlineStylePrefixAndValue(style);

    switch (prefix) {
      case DraftBuiltInStyle.ITALIC: {
        return {
          ...acc,
          fontStyle: 'italic',
        };
      }
      case DraftBuiltInStyle.UNDERLINE: {
        return {
          ...acc,
          textDecoration: 'underline',
        };
      }
      case InlineStylePrefix.FONT_FAMILY: {
        return {
          ...acc,
          fontFamily: value!,
        };
      }
      case InlineStylePrefix.FONT_WEIGHT: {
        return {
          ...acc,
          fontWeight: +value!,
        };
      }
      case InlineStylePrefix.FONT_SIZE: {
        return {
          ...acc,
          fontSize: `${value!}px`,
        };
      }
      case InlineStylePrefix.COLOR: {
        return {
          ...acc,
          color: value!,
        };
      }
      default: {
        return acc!;
      }
    }
  }, {});
