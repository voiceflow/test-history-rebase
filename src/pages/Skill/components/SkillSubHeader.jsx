import React from 'react';

import Flex from '@/components/Flex';
import Tabs from '@/components/Tabs';
import { goToCurrentCanvas, goToPrototype, goToPublish } from '@/ducks/router';
import { activePlatformSelector, activeSkillIDSelector } from '@/ducks/skill';
import { connect } from '@/hocs';
import { useHotKeys } from '@/hooks';
import { Hotkey } from '@/keymap';

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

const SkillSubHeader = ({ showPublish, activePage, goToCurrentCanvas, goToPrototype, goToPublish }) => {
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
          return goToCurrentCanvas();
      }
    },
    [goToCurrentCanvas, goToPrototype, goToPublish]
  );

  useHotKeys(Hotkey.PROTOTYPE_PAGE, () => goToPrototype());
  useHotKeys(Hotkey.DESIGN_PAGE, () => goToCurrentCanvas());
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

const mapStateToProps = {
  platform: activePlatformSelector,
  skillID: activeSkillIDSelector,
};

const mapDispatchToProps = {
  goToCurrentCanvas,
  goToPrototype,
  goToPublish,
};

const mergeProps = ({ skillID, platform }, { goToPrototype, goToPublish }) => ({
  goToPrototype: () => goToPrototype(skillID),
  goToPublish: () => goToPublish(skillID, platform),
});

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)(SkillSubHeader);
