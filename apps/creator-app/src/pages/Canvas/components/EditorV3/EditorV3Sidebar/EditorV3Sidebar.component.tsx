import { clsx } from '@voiceflow/style';
import { Drawer } from '@voiceflow/ui-next';
import React from 'react';

import { UI } from '@/ducks';
import { useHideVoiceflowAssistant } from '@/hooks';
import { useSelector } from '@/hooks/store.hook';

import { useEditorSidebarV2 } from '../../EditorSidebarV2/hooks';
import { drawerStyle } from './EditorV3Sidebar.css';

export const EditorV3Sidebar = React.memo(() => {
  const api = useEditorSidebarV2();
  const isCanvasOnly = useSelector(UI.selectors.isCanvasOnly);

  useHideVoiceflowAssistant({ hide: api.isOpened });

  return (
    <React.Fragment key={api.focus.target ?? 'unknown'}>
      <Drawer width={351} isOpen={api.isOpened} className={clsx('vfui', drawerStyle({ withHeader: !isCanvasOnly }))}>
        {api.editor}
      </Drawer>
    </React.Fragment>
  );
});
