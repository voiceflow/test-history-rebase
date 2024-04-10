import * as Realtime from '@voiceflow/realtime-sdk';
import { Drawer } from '@voiceflow/ui-next';
import React from 'react';

import { UI } from '@/ducks';
import { useFeature, useHideVoiceflowAssistant } from '@/hooks';
import { useSelector } from '@/hooks/store.hook';

import { useEditorSidebarV2 } from '../../EditorSidebarV2/hooks';
import { drawerStyle } from './EditorV3Sidebar.css';

export const EditorV3Sidebar = React.memo(() => {
  const api = useEditorSidebarV2();
  const cmsWorkflows = useFeature(Realtime.FeatureFlag.CMS_WORKFLOWS);
  const isCanvasOnly = useSelector(UI.selectors.isCanvasOnly);

  useHideVoiceflowAssistant({ hide: api.isOpened });

  return (
    <React.Fragment key={api.focus.target ?? 'unknown'}>
      <Drawer isOpen={api.isOpened} className={drawerStyle({ isOpen: api.isOpened, withHeader: cmsWorkflows.isEnabled && !isCanvasOnly })}>
        {api.editor}
      </Drawer>
    </React.Fragment>
  );
});
