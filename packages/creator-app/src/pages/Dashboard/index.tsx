import './DashBoard.css';

import React from 'react';
import { useLocation } from 'react-router-dom';

import SeoHelmet from '@/components/SeoHelmet';
import { ModalType } from '@/constants';
import { SeoPage } from '@/constants/seo';
import * as Notifications from '@/ducks/notifications';
import * as Router from '@/ducks/router';
import { withBatchLoadingGate } from '@/hocs/withBatchLoadingGate';
import { useDispatch, useModals, useSetup, useWorkspaceTracking } from '@/hooks';
import * as ModalsV2 from '@/ModalsV2';
import perf, { PerfAction } from '@/performance';
import { DashboardClassName } from '@/styles/constants';
import * as Query from '@/utils/query';

import { ProjectListList } from './components';
import { DashboardGate } from './gates';
import DashboardHeader from './Header';

const Dashboard: React.FC = () => {
  const location = useLocation();

  const clearSearch = useDispatch(Router.clearSearch);
  const fetchNotifications = useDispatch(Notifications.fetchNotifications);

  const query = location?.search ? Query.parse(location.search) : null;

  const [filterText, handleFilterText] = React.useState('');
  const importModal = ModalsV2.useModal(ModalsV2.Project.Import);
  const collaboratorsModal = ModalsV2.useModal(ModalsV2.Collaborators);
  const { open: openPaymentModal } = useModals(ModalType.PAYMENT);

  useSetup(() => {
    perf.action(PerfAction.DASHBOARD_RENDERED);
    fetchNotifications();

    if (query?.import) {
      clearSearch();
      importModal.openVoid({ projectID: query?.import });
    } else if (query?.invite_collaborators) {
      collaboratorsModal.openVoid();
    } else if (query?.upgrade_workspace) {
      openPaymentModal();
    }
  });

  useWorkspaceTracking();

  const filter = React.useMemo(() => filterText.trim().toLowerCase(), [filterText]);

  return (
    <div id="app" className={DashboardClassName.DASHBOARD}>
      <DashboardHeader handleFilterText={handleFilterText} />

      <SeoHelmet page={SeoPage.DASHBOARD} />

      <ProjectListList filter={filter} />
    </div>
  );
};

export default withBatchLoadingGate(DashboardGate)(Dashboard);
