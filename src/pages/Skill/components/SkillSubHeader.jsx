import React from 'react';

import Flex from '@/components/Flex';
import Tabs from '@/components/Tabs';
import * as Router from '@/ducks/router';
import { connect } from '@/hocs';
import { useHotKeys } from '@/hooks';
import { Hotkey } from '@/keymap';
import { MarkupModeContext } from '@/pages/Skill/contexts';

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

const SkillSubHeader = ({ showPublish, activePage, goToDesign, goToPrototype, goToPublish }) => {
  const markupTool = React.useContext(MarkupModeContext);
  const options = showPublish ? TABS : TABS.filter((tab) => tab.value !== 'publish');

  const closeMarkupTool = React.useCallback(() => {
    if (markupTool?.isOpen) {
      markupTool?.closeTool();
    }
  }, [markupTool?.isOpen, markupTool?.closeTool]);

  const onChange = React.useCallback(
    (value) => {
      switch (value) {
        case 'prototype':
          closeMarkupTool();
          return goToPrototype();
        case 'publish':
          closeMarkupTool();
          return goToPublish();
        case 'canvas':
        default:
          closeMarkupTool();
          return goToDesign();
      }
    },
    [goToDesign, goToPrototype, goToPublish, closeMarkupTool]
  );

  useHotKeys(Hotkey.PROTOTYPE_PAGE, () => {
    closeMarkupTool();
    goToPrototype();
  });
  useHotKeys(Hotkey.DESIGN_PAGE, () => {
    closeMarkupTool();
    goToDesign();
  });
  useHotKeys(Hotkey.BUILD_PAGE, () => {
    closeMarkupTool();
    goToPublish();
  });

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

export default connect(null, mapDispatchToProps)(SkillSubHeader);
