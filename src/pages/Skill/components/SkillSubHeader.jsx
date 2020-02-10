import React from 'react';

import Flex from '@/componentsV2/Flex';
import Tabs from '@/componentsV2/Tabs';
import { goToCurrentCanvas, goToPublish, goToTestDiagram } from '@/ducks/router';
import { activePlatformSelector, activeSkillIDSelector } from '@/ducks/skill';
import { connect } from '@/hocs';

import CanvasViewers from './CanvasViewers';

const TABS = [
  {
    value: 'canvas',
    label: 'design',
  },
  {
    value: 'test',
    label: 'prototype',
  },
  {
    value: 'publish',
    label: 'build',
  },
];

const SkillSubHeader = ({ showPublish, activePage, goToCurrentCanvas, goToTestDiagram, goToPublish }) => {
  const options = showPublish ? TABS : TABS.filter((tab) => tab.value !== 'publish');

  const onChange = React.useCallback(
    (value) => {
      switch (value) {
        case 'test':
          return goToTestDiagram();
        case 'publish':
          return goToPublish();
        case 'canvas':
        default:
          return goToCurrentCanvas();
      }
    },
    [goToCurrentCanvas, goToTestDiagram, goToPublish]
  );

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
  goToTestDiagram,
  goToPublish,
};

const mergeProps = ({ skillID, platform }, { goToTestDiagram, goToPublish }) => ({
  goToTestDiagram: () => goToTestDiagram(skillID),
  goToPublish: () => goToPublish(skillID, platform),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps
)(SkillSubHeader);
