import '../../../Dashboard/DashBoard.css';

import React from 'react';

import Page from '@/components/Page';
import { useActiveWorkspace } from '@/hooks';

import { ProjectListList as KanbanBoard } from '../../../Dashboard/components';
import { Sidebar } from '../../components';
import ProjectList from '.';
import { Header } from './components';

const TemporaryProjectList: React.OldFC = () => {
  const [search, setSearch] = React.useState('');
  const workspace = useActiveWorkspace();

  const isLocked = workspace?.state === 'LOCKED';

  return workspace?.settings.dashboardKanban ? (
    <Page renderHeader={() => <Header search={search} onSearch={setSearch} />} renderSidebar={() => <Sidebar />}>
      <KanbanBoard fullHeightContainer workspace={workspace} filter={search} isLocked={isLocked} />
    </Page>
  ) : (
    <ProjectList />
  );
};

export default TemporaryProjectList;
