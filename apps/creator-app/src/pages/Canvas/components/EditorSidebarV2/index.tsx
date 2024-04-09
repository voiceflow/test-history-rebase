import * as Realtime from '@voiceflow/realtime-sdk';
import { stopImmediatePropagation } from '@voiceflow/ui';
import React from 'react';

import Drawer from '@/components/Drawer';
import { useFeature, useHideVoiceflowAssistant, useTheme } from '@/hooks';

import { useEditorSidebarV2 } from './hooks';

export { EditorSidebarContext } from './context';

const EditorSidebarV2 = () => {
  const api = useEditorSidebarV2();
  const theme = useTheme();
  const cmsWorkflows = useFeature(Realtime.FeatureFlag.CMS_WORKFLOWS);

  useHideVoiceflowAssistant({ hide: api.isOpened });

  return (
    <React.Fragment key={api.focus.target ?? 'unknown'}>
      <Drawer
        open={api.isOpened}
        width={api.width}
        onPaste={stopImmediatePropagation()}
        direction={Drawer.Direction.LEFT}
        animatedWidth
        overflowHidden
        disableAnimation={!api.hasData}
        style={{
          top: cmsWorkflows.isEnabled ? theme.components.header.newHeight : undefined,
          width: api.isOpened && api.isFullscreen ? 'calc(100% - 355px' : undefined,
          height: cmsWorkflows.isEnabled ? `calc(100% - ${theme.components.header.newHeight}px)` : undefined,
        }}
      >
        {api.editor}
      </Drawer>
    </React.Fragment>
  );
};

export default React.memo(EditorSidebarV2);
