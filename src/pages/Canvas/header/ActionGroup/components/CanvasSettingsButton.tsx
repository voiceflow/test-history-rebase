import React from 'react';

import IconButton, { IconButtonVariant } from '@/components/IconButton';
import TippyTooltip from '@/components/TippyTooltip';
import { Permission } from '@/config/permissions';
import * as Router from '@/ducks/router';
import { connect } from '@/hocs';
import { usePermission } from '@/hooks';
import { SettingsModalContext } from '@/pages/Settings/contexts';
import { ConnectedProps } from '@/types';

const CanvasSettingsButton: React.FC<ConnectedCanvasSettingsButton> = ({ goToSettings }) => {
  const [canEditCanvas] = usePermission(Permission.EDIT_CANVAS);
  const { isEnabled } = React.useContext(SettingsModalContext)!;

  return (
    <TippyTooltip disabled={!canEditCanvas} title="Settings" position="bottom">
      <IconButton
        disabled={!canEditCanvas}
        active={isEnabled}
        preventFocusStyle
        variant={IconButtonVariant.OUTLINE}
        icon="cog"
        large
        onClick={goToSettings}
        iconProps={{ width: 16, height: 15 }}
      />
    </TippyTooltip>
  );
};

const mapDispatchToProps = {
  goToSettings: Router.goToCurrentSettings,
};
type ConnectedCanvasSettingsButton = ConnectedProps<{}, typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(CanvasSettingsButton);
