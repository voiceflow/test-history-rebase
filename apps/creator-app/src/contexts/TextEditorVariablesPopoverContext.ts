import React from 'react';

export const TextEditorVariablesPopoverContext = React.createContext<HTMLElement>(document.body);
export const { Provider: TextEditorVariablesPopoverProvider, Consumer: TextEditorVariablesPopoverConsumer } =
  TextEditorVariablesPopoverContext;
