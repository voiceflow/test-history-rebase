import React from 'react';

import Page from '@/components/Page';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useSelector } from '@/hooks/redux';

import { Sidebar } from '../../components';
import ProjectList from '.';
import { Header, KanbanList } from './components';

const TemporaryProjectList: React.FC = () => {
  const dashboardKanban = useSelector(WorkspaceV2.active.dashboardKanbanSettingsSelector);

  const [search, setSearch] = React.useState('');

  return dashboardKanban ? (
    <Page renderHeader={() => <Header search={search} onSearch={setSearch} isKanban />} renderSidebar={() => <Sidebar />}>
      <KanbanList fullHeightContainer filter={search} />
    </Page>
  ) : (
    <ProjectList />
  );
};

export default TemporaryProjectList;
