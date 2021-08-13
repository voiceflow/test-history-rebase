import React from 'react';
import { RenderElementProps, RenderLeafProps, RenderPlaceholderProps } from 'slate-react';

import { DefaultElement, LinkElement, Placeholder, PrismVariable, Text, VariableElement } from './components';
import { EditorAPI, PrismVariablesProperty } from './editor';

export const defaultRenderElement = ({ element, ...props }: RenderElementProps): JSX.Element => {
  if (EditorAPI.isLink(element)) return <LinkElement {...props} element={element} />;
  if (EditorAPI.isVariable(element)) return <VariableElement {...props} element={element} />;

  return <DefaultElement {...props} element={element} />;
};

export const defaultRenderPlaceholder = (props: RenderPlaceholderProps): JSX.Element => <Placeholder {...props} />;

export const defaultRenderLeaf = (props: RenderLeafProps): JSX.Element => {
  if (props.leaf[PrismVariablesProperty.VARIABLE]) return <PrismVariable {...props} />;

  return <Text {...props} />;
};
