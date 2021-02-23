import React from 'react';

import SubMenu from '@/components/SubMenu';
import * as Prototype from '@/ducks/prototype';
import * as Skill from '@/ducks/skill';
import { connect } from '@/hocs';
import { PROTOTYPE_MENU_OPTIONS } from '@/pages/Prototype/constants';
import { ConnectedProps } from '@/types';

type PrototypeMenuProps = {
  open: boolean;
};

const PrototypeMenu: React.FC<PrototypeMenuProps & ConnectedPrototypeMenuProps> = ({ open, platform, mode, updatePrototypeMode }) => (
  <SubMenu
    open={open}
    options={PROTOTYPE_MENU_OPTIONS[platform]}
    selected={mode}
    onChange={(value) => {
      updatePrototypeMode(value as Prototype.PrototypeMode);
    }}
  />
);

const mapStateToProps = {
  platform: Skill.activePlatformSelector,
  mode: Prototype.activePrototypeModeSelector,
};

const mapDispatchToProps = {
  updatePrototypeMode: Prototype.updateActivePrototypeMode,
};

type ConnectedPrototypeMenuProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(PrototypeMenu) as React.FC<PrototypeMenuProps>;
