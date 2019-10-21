import React from 'react';

import Tab from '@/componentsV2/Tab';
import TabSet from '@/componentsV2/TabSet';
import { goToCurrentCanvas, goToPublish, goToTestDiagram } from '@/ducks/router';
import { activePlatformSelector, activeSkillIDSelector } from '@/ducks/skill';
import { connect } from '@/hocs';
import { preventDefault } from '@/utils/dom';

import CanvasViewers from './CanvasViewers';
import LogIndicator from './LogIndicator';

const TABS = [
  {
    label: 'canvas',
    onClick: ({ goToCurrentCanvas }) => goToCurrentCanvas,
  },
  {
    label: 'test',
    onClick: ({ goToTestDiagram }) => goToTestDiagram,
  },
  {
    label: 'publish',
    onClick: ({ goToPublish }) => goToPublish,
  },
];

const SkillSubHeader = ({ activePage, ...props }) => (
  <>
    <TabSet>
      {TABS.map(({ label, onClick }) => {
        const isActive = label === activePage;

        return (
          <Tab isActive={isActive} onClick={preventDefault(!isActive && onClick(props))} key={label}>
            {label}
          </Tab>
        );
      })}
    </TabSet>
    <CanvasViewers />
    <LogIndicator />
  </>
);

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
