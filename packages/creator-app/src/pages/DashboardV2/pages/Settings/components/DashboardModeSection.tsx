import dayjs from 'dayjs';
import React from 'react';

import Page from '@/components/Page';
import RadioGroup from '@/components/RadioGroup';
import * as Settings from '@/components/Settings';
import * as Workspace from '@/ducks/workspace';
import { useActiveWorkspace, useDispatch, useLinkedState } from '@/hooks';

enum DashboardTypes {
  KANBAN = 'kankban',
  CARD = 'card',
}

const OPTIONS = [
  { id: DashboardTypes.KANBAN, label: 'Kanban' },
  { id: DashboardTypes.CARD, label: 'Cards' },
];

const DESCRIPTIONS = {
  [DashboardTypes.KANBAN]: 'Use a Kanban board and swimlanes to create your teams customized workflow.',
  [DashboardTypes.CARD]: 'Visualize your assistants as simple cards that can be searched and filtered.',
};

const CUTOFF_DATE = `2025-01-12T00:00:00.000Z`;

const DashboardModeSection: React.FC = () => {
  const toggleDashboardKanban = useDispatch(Workspace.toggleActiveWorkspaceDashboardKanban);
  const workspace = useActiveWorkspace();
  const mode = workspace?.settings.dashboardKanban ? DashboardTypes.KANBAN : DashboardTypes.CARD;
  const [dashboardMode] = useLinkedState(mode);

  const isCardOnly = React.useMemo(() => !workspace || dayjs(workspace.created).isAfter(CUTOFF_DATE), [workspace?.created]);

  const handleToggle = (type: DashboardTypes) => {
    const kanban = type === DashboardTypes.KANBAN;

    toggleDashboardKanban(kanban);
  };

  if (isCardOnly) return null;

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

          <Settings.SubSection.RadioGroupDescription offset={dashboardMode === DashboardTypes.CARD}>
            {DESCRIPTIONS[dashboardMode]}
          </Settings.SubSection.RadioGroupDescription>
        </Settings.SubSection>
      </Page.Section>
    </>
  );
};

export default DashboardModeSection;
