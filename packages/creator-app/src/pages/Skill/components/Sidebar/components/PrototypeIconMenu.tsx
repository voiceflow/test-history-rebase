import React from 'react';

import SidebarIconMenu from '@/components/SidebarIconMenu';
import * as Project from '@/ducks/project';
import * as Prototype from '@/ducks/prototype';
import { useDispatch, useSelector, useSetup, useToggle } from '@/hooks';
import { getMenuOptions } from '@/pages/Prototype/constants';

const PrototypeIconMenu: React.FC = () => {
  const [opened, toggleOpened] = useToggle(false);
  const mode = useSelector(Prototype.activePrototypeModeSelector);
  const platform = useSelector(Project.activePlatformSelector);

  const updatePrototypeMode = useDispatch(Prototype.updateActivePrototypeMode);

  useSetup(() => {
    // to run open animation
    toggleOpened(true);
  });

  return (
    <SidebarIconMenu open={opened} options={getMenuOptions(platform)} activeValue={mode} onSelect={(option) => updatePrototypeMode(option.value)} />
  );
};

export default PrototypeIconMenu;
