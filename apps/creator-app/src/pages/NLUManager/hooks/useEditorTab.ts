import { Nullable } from '@voiceflow/common';
import React from 'react';

import { EditorTabs } from '../constants';

const FULLSCREEN_TABS = new Set([EditorTabs.INTENT_CONFLICTS]);

const useEditorTab = () => {
  const [editorTab, setEditorTab] = React.useState<Nullable<EditorTabs>>(null);
  const inFullScreenTab = editorTab && FULLSCREEN_TABS.has(editorTab);

  const closeEditorTab = () => setEditorTab(null);
  const isEditorTabActive = (tab: EditorTabs) => editorTab === tab;
  const openEditorTab = (tab: EditorTabs) => setEditorTab(tab);

  return {
    editorTab,
    openEditorTab,
    closeEditorTab,
    inFullScreenTab,
    isEditorTabActive,
  };
};

export default useEditorTab;
