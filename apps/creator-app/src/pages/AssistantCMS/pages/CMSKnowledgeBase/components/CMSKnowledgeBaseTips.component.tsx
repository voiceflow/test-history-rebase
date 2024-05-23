import { Tip, useConst } from '@voiceflow/ui-next';
import React from 'react';
import { useLocation } from 'react-router-dom';

import { TipHotkey } from '@/components/Tip/TipHotkey/TipHotkey.component';
import { TipPortal } from '@/components/Tip/TipPortal/TipPortal.component';
import { getHotkeys, Hotkey } from '@/keymap';
import { stopPropagation } from '@/utils/handler.util';

export const CMSKnowledgeBaseTips: React.FC = () => {
  const location = useLocation<{ showKnowledgeBaseHotkeyTip?: boolean }>();
  const showKnowledgeBaseHotkeyTip = useConst(location.state?.showKnowledgeBaseHotkeyTip);

  return (
    <>
      {showKnowledgeBaseHotkeyTip && (
        <TipPortal scope="knowledge-base-hotkey">
          {({ onClose }) => (
            <Tip
              title="Pro tip"
              description={
                <>
                  Navigate to your knowledge base faster with the shortcut{' '}
                  <TipHotkey hotkeys={getHotkeys(Hotkey.BACK_TO_KNOWLEDGE_BASE)} />.
                </>
              }
            >
              <Tip.Button variant="secondary" label="Don’t show this again" onClick={stopPropagation(onClose)} />
            </Tip>
          )}
        </TipPortal>
      )}
    </>
  );
};
