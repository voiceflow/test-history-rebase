import React from 'react';
import { Tooltip } from 'react-tippy';

import IconButton, { IconButtonVariant } from '@/components/IconButton';
import { SettingsModalContext } from '@/pages/Settings/contexts';
import { EditPermissionContext } from '@/pages/Skill/contexts';

const CanvasSettingsButton = () => {
  const { isViewer } = React.useContext(EditPermissionContext)!;
  const { isEnabled, toggle } = React.useContext(SettingsModalContext)!;

  return (
    <Tooltip disabled={isViewer} title="Settings" position="bottom">
      <IconButton
        disabled={isViewer}
        active={isEnabled}
        preventFocusStyle
        variant={IconButtonVariant.OUTLINE}
        icon="cog"
        large
        onClick={toggle}
        iconProps={{ width: 16, height: 15 }}
      />
    </Tooltip>
  );
};

export default CanvasSettingsButton;
