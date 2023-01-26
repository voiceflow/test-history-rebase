import dayjs from 'dayjs';
import * as Normal from 'normal-store';
import React from 'react';

import { bannerBg } from '@/assets';
import { AssistantCard } from '@/components/AssistantCard';
import Page from '@/components/Page';
import * as Account from '@/ducks/account';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Router from '@/ducks/router';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useDispatch, useSelector } from '@/hooks';
import { ProjectIdentityProvider } from '@/pages/Project/contexts/ProjectIdentityContext';

import { Sidebar } from '../../components';
import { getProjectStatusAndMembers } from '../../utils';
import { EmptySearch, Header } from './components';
import * as S from './styles';

const ProjectList: React.FC = () => {
  const [search, setSearch] = React.useState('');

  const userID = useSelector(Account.userIDSelector)!;
  const projects = useSelector(ProjectV2.allProjectsSelector);
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
        if (a.updatedAt && !b.updatedAt) return -1;
        if (b.updatedAt && !a.updatedAt) return 1;

        return dayjs(a.updatedAt).isAfter(b.updatedAt) ? -1 : 1;
      }),
    [projects, activeViewersPerProject]
  );

  const projectToRender = React.useMemo(
    () => (search ? orderedProjects.filter((project) => project.name.toLowerCase().includes(search.toLowerCase())) : orderedProjects),
    [orderedProjects, search]
  );

  return (
    <Page white renderHeader={() => <Header search={search} onSearch={setSearch} />} renderSidebar={() => <Sidebar />}>
      {search && !projectToRender.length ? (
        <EmptySearch onClear={() => setSearch('')} />
      ) : (
        <Page.Content>
          <S.StyledBanner
            mb={32}
            title="Learn Voiceflow with video tutorials"
            subtitle="In this course you’ll find everything you need to get started with Voiceflow from the ground up."
            closeKey="dashboard-learn-banner"
            buttonText="Start Course"
            backgroundImage={bannerBg}
          />

          {Boolean(projectToRender.length) && (
            <S.Grid>
              {projectToRender.map((item) => (
                <AssistantCard
                  {...getProjectStatusAndMembers({ project: item, activeViewers: activeViewersPerProject[item.id], getMemberByIDSelector })}
                  key={item.id}
                  image={item.image}
                  project={item}
                  onClickCTA={() => goToCanvasWithVersionID(item.versionID)}
                  onClickLink={() => goToAssistantOverview(item.versionID)}
                />
              ))}
            </S.Grid>
          )}

          <S.Title>Start with a template</S.Title>

          <S.Grid>
            {projectToRender.map((item) => (
              <ProjectIdentityProvider key={item.id} activeRole={Normal.getOne(item.members, String(userID))?.role ?? null}>
                <AssistantCard
                  {...getProjectStatusAndMembers({ project: item, activeViewers: activeViewersPerProject[item.id], getMemberByIDSelector })}
                  image={item.image}
                  project={item}
                  onClickCTA={() => goToCanvasWithVersionID(item.versionID)}
                  onClickLink={() => goToAssistantOverview(item.versionID)}
                />
              </ProjectIdentityProvider>
            ))}
          </S.Grid>
        </Page.Content>
      )}
    </Page>
  );
};

export default ProjectList;
