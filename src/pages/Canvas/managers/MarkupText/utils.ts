import { EditorState, Modifier, convertToRaw } from 'draft-js';

import { InlineStylePrefix } from './constants';

const INLINE_STYLE_SEPARATOR = '::';

export const getRawContent = (editorState: EditorState) => {
  return convertToRaw(editorState.getCurrentContent());
};

export const createPrefixedInlineStyle = (prefix: InlineStylePrefix, value: string) => `${prefix}${INLINE_STYLE_SEPARATOR}${value}`;

export const isPrefixedInlineStyle = (prefix: InlineStylePrefix, style: string | undefined) =>
  style?.startsWith(`${prefix}${INLINE_STYLE_SEPARATOR}`)!!;

export const getInlineStylePrefixAndValue = (style: string | undefined) =>
  !style ? ([] as []) : (style.split(INLINE_STYLE_SEPARATOR) as [string, string] | [string]);

export const togglePrefixedInlineStyle = (editorState: EditorState, prefix: InlineStylePrefix, value: string) => {
  const selection = editorState.getSelection();
  const currentStyle = editorState.getCurrentInlineStyle();

  const inlineStyles = currentStyle.filter((style) => isPrefixedInlineStyle(prefix, style));

  if (selection.isCollapsed()) {
    let state = editorState;

    if (inlineStyles.size) {
      inlineStyles.forEach((inlineStyle) => {
        state = EditorState.setInlineStyleOverride(state, currentStyle.remove(inlineStyle!));
      });
    }

    return value ? EditorState.setInlineStyleOverride(state, currentStyle.add(createPrefixedInlineStyle(prefix, value))) : state;
  }

  let newContent = editorState.getCurrentContent();

  if (inlineStyles.size) {
    inlineStyles.forEach((inlineStyle) => {
      newContent = Modifier.removeInlineStyle(newContent, selection, inlineStyle!);
    });
  }

  if (value) {
    newContent = Modifier.applyInlineStyle(newContent, selection, createPrefixedInlineStyle(prefix, value));
  }

  return EditorState.push(editorState, newContent, 'change-inline-style');
};
