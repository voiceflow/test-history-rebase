import React from 'react';

import SubMenu, { SubMenuItem } from '@/components/SubMenu';
import * as Prototype from '@/ducks/prototype';
import * as Skill from '@/ducks/skill';
import { connect } from '@/hocs';
import { PROTOTYPE_MENU_OPTIONS } from '@/pages/Prototype/constants';
import { ConnectedProps } from '@/types';

type PrototypeMenuProps = {
  open: boolean;
};

const PrototypeMenu: React.FC<PrototypeMenuProps & ConnectedPrototypeMenuProps> = ({ open, platform, updatePrototypeMode }) => (
  <SubMenu
    open={open}
    options={PROTOTYPE_MENU_OPTIONS[platform].map((option: SubMenuItem) => option)}
    onChange={(value) => {
      updatePrototypeMode(value as Prototype.PrototypeMode);
    }}
  />
);

const mapStateToProps = {
  platform: Skill.activePlatformSelector,
};

const mapDispatchToProps = {
  updatePrototypeMode: Prototype.updatePrototypeMode,
};

type ConnectedPrototypeMenuProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(PrototypeMenu) as React.FC<PrototypeMenuProps>;
