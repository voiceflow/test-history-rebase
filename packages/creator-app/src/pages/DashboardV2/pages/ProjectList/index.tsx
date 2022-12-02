import { UserRole } from '@voiceflow/internal';
import * as Platform from '@voiceflow/platform-config';
import { AssistantCard as UIAssistantCard, AssistantCardProps, Banner, Button } from '@voiceflow/ui';
import dayjs from 'dayjs';
import * as Normal from 'normal-store';
import React from 'react';

import { AssistantCard } from '@/components/AssistantCard';
import Page from '@/components/Page';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Router from '@/ducks/router';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { withBatchLoadingGate } from '@/hocs';
import { useDispatch, useSelector } from '@/hooks';

import { Sidebar } from '../../components';
import { AssistantLoadingGate } from '../../gates';
import { getProjectStatusAndMembers } from '../../utils';
import { EmptySearch, Header } from './components';
import * as S from './styles';

const customProp: AssistantCardProps = {
  userRole: UserRole.VIEWER,
  title: 'Webchat - Book a Demo',
  status: 'By Voiceflow',
};

const ProjectList: React.FC = () => {
  const [search, setSearch] = React.useState('');

  const projects = useSelector(ProjectV2.allProjectsSelector);
  const userRole = useSelector(WorkspaceV2.active.userRoleSelector);
  const awarenessViewers = useSelector(ProjectV2.awarenessViewersSelector);
  const getMemberByIDSelector = useSelector(WorkspaceV2.active.getMemberByIDSelector);

  const goToAssistantOverview = useDispatch(Router.goToAssistantOverview);
  const goToCanvasWithVersionID = useDispatch(Router.goToCanvasWithVersionID);

  const activeViewersPerProject = React.useMemo(
    () =>
      Object.fromEntries(
        Object.entries(awarenessViewers).map(([projectID, projectViewers]) => [
          projectID,
          Object.values(projectViewers ?? {}).flatMap(Normal.denormalize),
        ])
      ),
    [awarenessViewers]
  );

  const orderedProjects = React.useMemo(
    () =>
      projects.sort((a, b) => {
        const aViewers = activeViewersPerProject[a.id] ?? [];
        const bViewers = activeViewersPerProject[b.id] ?? [];

        if (aViewers.length && !bViewers.length) return -1;
        if (bViewers.length && !aViewers.length) return 1;
        if (a.canvasUpdatedAt && !b.canvasUpdatedAt) return -1;
        if (b.canvasUpdatedAt && !a.canvasUpdatedAt) return 1;

        return dayjs(a.canvasUpdatedAt).isAfter(b.canvasUpdatedAt) ? -1 : 1;
      }),
    [projects, activeViewersPerProject]
  );

  const projectToRender = React.useMemo(
    () => (search ? orderedProjects.filter((project) => project.name.toLowerCase().includes(search.toLowerCase())) : orderedProjects),
    [orderedProjects, search]
  );

  return (
    <Page renderHeader={() => <Header search={search} onSearch={setSearch} />} renderSidebar={() => <Sidebar />}>
      <Page.Content>
        <Banner
          mb={32}
          title="Learn Voiceflow with video tutorials"
          onClick={() => {}}
          subtitle="In this course you’ll find everything you need to get started with Voiceflow from the ground up."
          buttonText="Start Course"
        />

        {search && !projectToRender.length ? (
          <EmptySearch onClear={() => setSearch('')} />
        ) : (
          <S.Grid>
            {projectToRender.map((item) => (
              <AssistantCard
                {...getProjectStatusAndMembers({ project: item, activeViewers: activeViewersPerProject[item.id], getMemberByIDSelector })}
                key={item.id}
                image={item.image}
                project={item}
                userRole={userRole ?? undefined}
                onClickCTA={() => goToCanvasWithVersionID(item.versionID)}
                onClickLink={() => goToAssistantOverview(item.versionID)}
              />
            ))}
          </S.Grid>
        )}

        <S.Title>Start with a template</S.Title>

        <S.Grid>
          <UIAssistantCard {...customProp} icon={Platform.Webchat.CONFIG.types.chat.icon.name}>
            <Button squareRadius variant={Button.Variant.PRIMARY}>
              Copy Template
            </Button>
          </UIAssistantCard>

          <UIAssistantCard {...customProp} icon={Platform.Whatsapp.CONFIG.types.chat.icon.name}>
            <Button squareRadius variant={Button.Variant.PRIMARY}>
              Copy Template
            </Button>
          </UIAssistantCard>

          <UIAssistantCard {...customProp} icon={Platform.MicrosoftTeams.CONFIG.types.chat.icon.name}>
            <Button squareRadius variant={Button.Variant.PRIMARY}>
              Copy Template
            </Button>
          </UIAssistantCard>
        </S.Grid>
      </Page.Content>
    </Page>
  );
};

export default withBatchLoadingGate(AssistantLoadingGate)(ProjectList);
