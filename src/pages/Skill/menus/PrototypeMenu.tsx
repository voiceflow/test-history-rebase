import React from 'react';

import SubMenu from '@/components/SubMenu';
import { FeatureFlag } from '@/config/features';
import * as Prototype from '@/ducks/prototype';
import * as Skill from '@/ducks/skill';
import { connect } from '@/hocs';
import { useFeature } from '@/hooks';
import { PROTOTYPE_MENU_OPTIONS } from '@/pages/Prototype/constants';
import { ConnectedProps } from '@/types';

type PrototypeMenuProps = {
  open: boolean;
};

const PrototypeMenu: React.FC<PrototypeMenuProps & ConnectedPrototypeMenuProps> = ({ open, platform, mode, updatePrototypeMode }) => {
  const visualPrototype = useFeature(FeatureFlag.VISUAL_PROTOTYPE);

  return (
    <SubMenu
      open={open}
      options={PROTOTYPE_MENU_OPTIONS[platform].filter(({ value }) => visualPrototype.isEnabled || value !== Prototype.PrototypeMode.DISPLAY)}
      selected={mode}
      onChange={(value) => {
        updatePrototypeMode(value as Prototype.PrototypeMode);
      }}
    />
  );
};

const mapStateToProps = {
  mode: Prototype.activePrototypeModeSelector,
  platform: Skill.activePlatformSelector,
};

const mapDispatchToProps = {
  updatePrototypeMode: Prototype.updateActivePrototypeMode,
};

type ConnectedPrototypeMenuProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(PrototypeMenu) as React.FC<PrototypeMenuProps>;
