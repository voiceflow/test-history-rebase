import React from 'react';

import IconButton, { IconButtonVariant } from '@/components/IconButton';
import TippyTooltip from '@/components/TippyTooltip';
import { Permission } from '@/config/permissions';
import { usePermission } from '@/hooks';
import { SettingsModalContext } from '@/pages/Settings/contexts';

const CanvasSettingsButton = () => {
  const [canEditCanvas] = usePermission(Permission.EDIT_CANVAS);
  const { isEnabled, toggle } = React.useContext(SettingsModalContext)!;

  return (
    <TippyTooltip disabled={!canEditCanvas} title="Settings" position="bottom">
      <IconButton
        disabled={!canEditCanvas}
        active={isEnabled}
        preventFocusStyle
        variant={IconButtonVariant.OUTLINE}
        icon="cog"
        large
        onClick={toggle}
        iconProps={{ width: 16, height: 15 }}
      />
    </TippyTooltip>
  );
};

export default CanvasSettingsButton;
