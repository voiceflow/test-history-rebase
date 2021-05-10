import React from 'react';

import Flex from '@/components/Flex';
import Tabs from '@/components/Tabs';
import { Permission } from '@/config/permissions';
import { PlatformType } from '@/constants';
import * as Router from '@/ducks/router';
import * as Skill from '@/ducks/skill';
import * as Workspace from '@/ducks/workspace';
import { connect } from '@/hocs';
import { useHotKeys, usePermission } from '@/hooks';
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

export type ProjectSubHeaderProps = {
  showPublish: boolean;
  activePage: string;
};

const ProjectSubHeader: React.FC<ProjectSubHeaderProps & ConnectedSkillSubHeaderProps> = ({
  platform,
  showPublish,
  activePage,
  goToDesign,
  goToPrototype,
  goToPublish,
  isViewerOrLibraryRole,
}) => {
  const [codeExport] = usePermission(Permission.CODE_EXPORT);

  const headerOptions = TABS.filter((tab) => tab.value !== 'prototype');
  const options =
    showPublish && !(platform === PlatformType.GENERAL && !codeExport) ? headerOptions : headerOptions.filter((tab) => tab.value !== 'publish');

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
  platform: Skill.activePlatformSelector,
  isViewerOrLibraryRole: Workspace.isViewerOrLibraryRoleSelector,
};

const mapDispatchToProps = {
  goToDesign: Router.goToCurrentCanvas,
  goToPrototype: Router.goToCurrentPrototype,
  goToPublish: Router.goToActivePlatformPublish,
};

type ConnectedSkillSubHeaderProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(ProjectSubHeader) as React.FC<ProjectSubHeaderProps>;
