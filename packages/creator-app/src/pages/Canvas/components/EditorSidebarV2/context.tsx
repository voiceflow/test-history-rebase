import { useContextApi } from '@voiceflow/ui';
import React from 'react';

import { NodeEditorV2Props } from '../../managers/types';

export const EditorSidebarContext = React.createContext<NodeEditorV2Props<any, any> | null>(null);

export const { Consumer: EditorSidebarConsumer } = EditorSidebarContext;

interface EditorSidebarProviderProps {
  value: NodeEditorV2Props<any, any>;
}

export const EditorSidebarProvider: React.FC<EditorSidebarProviderProps> = ({ value, children }) => {
  const api = useContextApi(value);

  return <EditorSidebarContext.Provider value={api}>{children}</EditorSidebarContext.Provider>;
};
