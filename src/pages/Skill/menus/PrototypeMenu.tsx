import React from 'react';

import SubMenu, { SubMenuItem } from '@/components/SubMenu';
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
      selected={mode}
      options={PROTOTYPE_MENU_OPTIONS[platform]
        .filter(({ value }) => visualPrototype.isEnabled || value !== Prototype.PrototypeMode.DISPLAY)
        .map((option: SubMenuItem) => option)}
      onChange={(value) => {
        updatePrototypeMode(value as Prototype.PrototypeMode);
      }}
    />
  );
};

const mapStateToProps = {
  platform: Skill.activePlatformSelector,
  mode: Prototype.activePrototypeModeSelector,
};

const mapDispatchToProps = {
  updatePrototypeMode: Prototype.updateActivePrototypeMode,
};

type ConnectedPrototypeMenuProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(PrototypeMenu) as React.FC<PrototypeMenuProps>;
