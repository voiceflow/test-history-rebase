import { Drawer } from '@voiceflow/ui-next';
import React from 'react';

import { useHideVoiceflowAssistant } from '@/hooks';

import { useEditorSidebarV2 } from '../../EditorSidebarV2/hooks';
import { drawerStyle } from './Sidebar.css';

export const Sidebar = React.memo(() => {
  const api = useEditorSidebarV2();

  useHideVoiceflowAssistant({ hide: api.isOpened });

  return (
    <React.Fragment key={api.focus.target ?? 'unknown'}>
      <Drawer isOpen={api.isOpened} className={drawerStyle({ isOpen: api.isOpened })}>
        {api.editor}
      </Drawer>
    </React.Fragment>
  );
});
