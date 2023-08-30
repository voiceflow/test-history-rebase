import React from 'react';

import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useSelector } from '@/hooks/redux';

import ProjectList from '.';
import { KanbanList } from './components';

const TemporaryProjectList: React.FC = () => {
  const dashboardKanban = useSelector(WorkspaceV2.active.dashboardKanbanSettingsSelector);

  return dashboardKanban ? <KanbanList /> : <ProjectList />;
};

export default TemporaryProjectList;
