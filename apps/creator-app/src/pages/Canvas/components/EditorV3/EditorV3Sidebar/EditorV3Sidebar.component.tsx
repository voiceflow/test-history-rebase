import * as Realtime from '@voiceflow/realtime-sdk';
import { Drawer } from '@voiceflow/ui-next';
import React from 'react';

import { useFeature, useHideVoiceflowAssistant } from '@/hooks';

import { useEditorSidebarV2 } from '../../EditorSidebarV2/hooks';
import { drawerStyle } from './EditorV3Sidebar.css';

export const EditorV3Sidebar = React.memo(() => {
  const api = useEditorSidebarV2();
  const cmsWorkflows = useFeature(Realtime.FeatureFlag.CMS_WORKFLOWS);

  useHideVoiceflowAssistant({ hide: api.isOpened });

  return (
    <React.Fragment key={api.focus.target ?? 'unknown'}>
      <Drawer isOpen={api.isOpened} className={drawerStyle({ isOpen: api.isOpened, newLayout: cmsWorkflows.isEnabled })}>
        {api.editor}
      </Drawer>
    </React.Fragment>
  );
});
