import { stopImmediatePropagation } from '@voiceflow/ui';
import React from 'react';

import Drawer from '@/components/Drawer';
import { RemoveIntercom } from '@/components/IntercomChat';
import * as Creator from '@/ducks/creator';
import { useSelector } from '@/hooks';

interface SidebarDrawerProps {
  isOpened: boolean;
  hasData: boolean;
  width: number;
  isFullscreen?: boolean;
}

const SidebarDrawer: React.FC<SidebarDrawerProps> = ({ isFullscreen, isOpened, hasData, width, children }) => {
  const focus = useSelector(Creator.creatorFocusSelector);

  return (
    <React.Fragment key={focus.target ?? 'unknown'}>
      <Drawer
        open={isOpened}
        width={width}
        onPaste={stopImmediatePropagation()}
        direction={Drawer.Direction.LEFT}
        overflowHidden
        disableAnimation={!hasData}
        animatedWidth
        style={isFullscreen ? { width: 'calc(100% - 355px' } : {}}
      >
        {children}
      </Drawer>

      {isOpened && <RemoveIntercom />}
    </React.Fragment>
  );
};

export default SidebarDrawer;
