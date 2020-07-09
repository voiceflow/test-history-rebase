import React from 'react';

import Flex from '@/components/Flex';
import Tabs from '@/components/Tabs';
import * as Router from '@/ducks/router';
import { connect } from '@/hocs';
import { useHotKeys } from '@/hooks';
import { Hotkey } from '@/keymap';
import { CommentModeContext, MarkupModeContext } from '@/pages/Skill/contexts';
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
  const markupTool = React.useContext(MarkupModeContext);
  const { close: closeCommentingMode } = React.useContext(CommentModeContext);
  const options = showPublish ? TABS : TABS.filter((tab) => tab.value !== 'publish');

  const disableAllModes = () => {
    markupTool?.closeTool();
    closeCommentingMode();
  };

  const onChange = React.useCallback(
    (value) => {
      switch (value) {
        case 'prototype':
          disableAllModes();
          return goToPrototype();
        case 'publish':
          disableAllModes();
          return goToPublish();
        case 'canvas':
        default:
          return goToDesign();
      }
    },
    [goToDesign, goToPrototype, goToPublish]
  );

  useHotKeys(Hotkey.PROTOTYPE_PAGE, () => {
    disableAllModes();
    goToPrototype();
  });
  useHotKeys(Hotkey.DESIGN_PAGE, () => {
    goToDesign();
  });
  useHotKeys(Hotkey.BUILD_PAGE, () => {
    disableAllModes();
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

type ConnecteedeSkillSubHeaderProps = ConnectedProps<{}, typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(SkillSubHeader) as React.FC<SkillSubHeaderProps>;
