import React from 'react';

import Flex from '@/components/Flex';
import Tabs from '@/components/Tabs';
import { FeatureFlag } from '@/config/features';
import * as Router from '@/ducks/router';
import * as Workspace from '@/ducks/workspace';
import { connect } from '@/hocs';
import { useFeature, useHotKeys } from '@/hooks';
import { Hotkey } from '@/keymap';
import { ConnectedProps } from '@/types';

import CanvasViewers from './CanvasViewers';

const TABS = [
  {
    id: 'vf-design-tab',
    value: 'canvas',
    label: 'design',
  },
  {
    id: 'vf-prototype-tab',
    value: 'prototype',
    label: 'prototype',
  },
  {
    id: 'vf-launch-tab',
    value: 'publish',
    label: 'launch',
  },
];

const TEST_REPORT_TAB = {
  id: 'vf-test-reports-tab',
  value: 'conversations',
  label: 'conversations',
};

export type ProjectSubHeaderProps = {
  showPublish: boolean;
  activePage?: string;
};

const ProjectSubHeader: React.FC<ProjectSubHeaderProps & ConnectedSkillSubHeaderProps> = ({
  showPublish,
  activePage,
  goToDesign,
  goToPrototype,
  goToPublish,
  isViewerOrLibraryRole,
  goToConversations,
}) => {
  const testReports = useFeature(FeatureFlag.TEST_REPORTS);

  const headerOptions = TABS.filter((tab) => tab.value !== 'prototype');
  const options = showPublish ? headerOptions : headerOptions.filter((tab) => tab.value !== 'publish');

  if (testReports.isEnabled) {
    options.push(TEST_REPORT_TAB);
  }

  const onChange = React.useCallback(
    (value) => {
      switch (value) {
        case 'prototype':
          return goToPrototype();
        case 'publish':
          return goToPublish();
        case 'conversations':
          return goToConversations();
        case 'canvas':
        default:
          return goToDesign();
      }
    },
    [goToDesign, goToPrototype, goToPublish]
  );

  useHotKeys(Hotkey.TEST_MODE, () => goToPrototype(), { preventDefault: true });
  useHotKeys(Hotkey.DESIGN_PAGE, () => goToDesign());
  useHotKeys(Hotkey.LAUNCH_PAGE, () => !isViewerOrLibraryRole && goToPublish());

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
  isViewerOrLibraryRole: Workspace.isViewerOrLibraryRoleSelector,
};

const mapDispatchToProps = {
  goToDesign: Router.goToCurrentCanvas,
  goToPrototype: Router.goToCurrentPrototype,
  goToPublish: Router.goToActivePlatformPublish,
  goToConversations: Router.goToConversationsPage,
};

type ConnectedSkillSubHeaderProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(ProjectSubHeader) as React.FC<ProjectSubHeaderProps>;
