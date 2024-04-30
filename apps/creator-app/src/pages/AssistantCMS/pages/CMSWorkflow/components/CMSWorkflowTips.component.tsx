import { Tip, useConst } from '@voiceflow/ui-next';
import React from 'react';
import { useLocation } from 'react-router-dom';

import { TipPortal } from '@/components/Tip/TipPortal/TipPortal.component';
import { stopPropagation } from '@/utils/handler.util';

export const CMSWorkflowTips: React.FC = () => {
  const location = useLocation<{ isBack?: boolean }>();
  const showDoubleClickTip = useConst(location.state?.isBack);

  return (
    <>
      {showDoubleClickTip && (
        <TipPortal scope="workflow-double-click">
          {({ onClose }) => (
            <Tip title="Pro tip" description="You can jump directly to the canvas by double clicking a workflow's row.">
              <Tip.Button variant="secondary" label="Don’t show this again" onClick={stopPropagation(onClose)} />
            </Tip>
          )}
        </TipPortal>
      )}
    </>
  );
};
