import React from 'react';

import Flex from '@/components/Flex';
import Tabs from '@/components/Tabs';
import * as Router from '@/ducks/router';
import { connect } from '@/hocs';
import { useHotKeys } from '@/hooks';
import { Hotkey } from '@/keymap';
import { ConnectedProps } from '@/types';

import CanvasViewers from './CanvasViewers';

const TABS = [
  {
    value: 'canvas',
    label: 'design',
  },
  {
    value: 'prototype',
    label: 'prototype',
  },
  {
    value: 'publish',
    label: 'build',
  },
];

export type SkillSubHeaderProps = {
  showPublish: boolean;
  activePage: string;
};

const SkillSubHeader: React.FC<SkillSubHeaderProps & ConnecteedeSkillSubHeaderProps> = ({
  showPublish,
  activePage,
  goToDesign,
  goToPrototype,
  goToPublish,
}) => {
  const options = showPublish ? TABS : TABS.filter((tab) => tab.value !== 'publish');

  const onChange = React.useCallback(
    (value) => {
      switch (value) {
        case 'prototype':
          return goToPrototype();
        case 'publish':
          return goToPublish();
        case 'canvas':
        default:
          return goToDesign();
      }
    },
    [goToDesign, goToPrototype, goToPublish]
  );

  useHotKeys(Hotkey.PROTOTYPE_PAGE, () => goToPrototype());
  useHotKeys(Hotkey.DESIGN_PAGE, () => goToDesign());
  useHotKeys(Hotkey.BUILD_PAGE, () => goToPublish());

  return (
    <>
      <Tabs options={options} selected={activePage} onChange={onChange} />
      <Flex>
        <CanvasViewers />
      </Flex>
    </>
  );
};

const mapDispatchToProps = {
  goToDesign: Router.goToCurrentCanvas,
  goToPrototype: Router.goToCurrentPrototype,
  goToPublish: Router.goToActivePlatformPublish,
};

type ConnecteedeSkillSubHeaderProps = ConnectedProps<{}, typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(SkillSubHeader) as React.FC<SkillSubHeaderProps>;
