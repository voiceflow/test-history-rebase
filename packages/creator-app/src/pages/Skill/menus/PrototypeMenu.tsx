import React from 'react';

import SubMenu from '@/components/SubMenu';
import * as Project from '@/ducks/project';
import * as Prototype from '@/ducks/prototype';
import { connect } from '@/hocs';
import { getMenuOptions } from '@/pages/Prototype/constants';
import { ConnectedProps } from '@/types';

type PrototypeMenuProps = {
  open: boolean;
};

const PrototypeMenu: React.FC<PrototypeMenuProps & ConnectedPrototypeMenuProps> = ({ open, platform, mode, updatePrototypeMode }) => (
  <SubMenu
    open={open}
    options={getMenuOptions(platform)}
    selected={mode}
    onChange={(value) => {
      updatePrototypeMode(value as Prototype.PrototypeMode);
    }}
  />
);

const mapStateToProps = {
  platform: Project.activePlatformSelector,
  mode: Prototype.activePrototypeModeSelector,
};

const mapDispatchToProps = {
  updatePrototypeMode: Prototype.updateActivePrototypeMode,
};

type ConnectedPrototypeMenuProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(PrototypeMenu) as React.FC<PrototypeMenuProps>;
