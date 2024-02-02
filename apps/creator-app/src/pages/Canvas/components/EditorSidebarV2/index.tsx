import { stopImmediatePropagation } from '@voiceflow/ui';
import React from 'react';

import Drawer from '@/components/Drawer';
import { useHideVoiceflowAssistant } from '@/hooks';

import { useEditorSidebarV2 } from './hooks';

export { EditorSidebarContext } from './context';

const EditorSidebarV2 = () => {
  const api = useEditorSidebarV2();

  useHideVoiceflowAssistant({ hide: api.isOpened });

  return (
    <React.Fragment key={api.focus.target ?? 'unknown'}>
      <Drawer
        open={api.isOpened}
        width={api.width}
        style={api.isOpened && api.isFullscreen ? { width: 'calc(100% - 355px' } : {}}
        onPaste={stopImmediatePropagation()}
        direction={Drawer.Direction.LEFT}
        animatedWidth
        overflowHidden
        disableAnimation={!api.hasData}
      >
        {api.editor}
      </Drawer>
    </React.Fragment>
  );
};

export default React.memo(EditorSidebarV2);
