import dayjs from 'dayjs';
import React from 'react';

import Page from '@/components/Page';
import RadioGroup from '@/components/RadioGroup';
import * as Settings from '@/components/Settings';
import { DASHBOARD_V2_RELEASE_DATE } from '@/constants';
import * as Workspace from '@/ducks/workspace';
import { useActiveWorkspace, useDispatch, useLinkedState, useTrackingEvents } from '@/hooks';

enum DashboardTypes {
  CARD = 'card',
  KANBAN = 'kanban',
}

const OPTIONS = [
  { id: DashboardTypes.CARD, label: 'Cards' },
  { id: DashboardTypes.KANBAN, label: 'Kanban' },
];

const DESCRIPTIONS = {
  [DashboardTypes.KANBAN]: 'Use a Kanban board and swimlanes to create your teams customized workflow.',
  [DashboardTypes.CARD]: 'Visualize your assistants as simple cards that can be searched and filtered.',
};

const DashboardModeSection: React.FC = () => {
  const workspace = useActiveWorkspace();
  const [tracking] = useTrackingEvents();

  const toggleDashboardKanban = useDispatch(Workspace.toggleActiveWorkspaceDashboardKanban);

  const mode = workspace?.settings.dashboardKanban ? DashboardTypes.KANBAN : DashboardTypes.CARD;

  const [dashboardMode] = useLinkedState(mode);

  const isCardOnly = React.useMemo(() => !workspace || dayjs(workspace.created).isAfter(DASHBOARD_V2_RELEASE_DATE), [workspace?.created]);

  const handleToggle = (type: DashboardTypes) => {
    const kanban = type === DashboardTypes.KANBAN;

    toggleDashboardKanban(kanban);
    tracking.trackDashboardStyleChanged({ style: type });
  };

  if (isCardOnly && mode === DashboardTypes.CARD) return null;

  return (
    <>
      <Page.Section
        header={
          <Page.Section.Header>
            <Page.Section.Title>Dashboard</Page.Section.Title>
          </Page.Section.Header>
        }
      >
        <Settings.SubSection header="Dashboard Styles" splitView>
          <Settings.SubSection.RadioGroupContainer>
            <RadioGroup column options={OPTIONS} checked={dashboardMode} onChange={handleToggle} activeBar noPaddingLastItem={false} />
          </Settings.SubSection.RadioGroupContainer>

          <Settings.SubSection.RadioGroupDescription offset={dashboardMode === DashboardTypes.KANBAN}>
            {DESCRIPTIONS[dashboardMode]}
          </Settings.SubSection.RadioGroupDescription>
        </Settings.SubSection>
      </Page.Section>
    </>
  );
};

export default DashboardModeSection;
