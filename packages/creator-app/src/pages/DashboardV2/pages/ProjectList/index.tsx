import { Box } from '@voiceflow/ui';
import * as Normal from 'normal-store';
import React from 'react';

import { bannerBg } from '@/assets';
import { AssistantCard } from '@/components/AssistantCard';
import Page from '@/components/Page';
import SearchBar from '@/components/SearchBar';
import * as Account from '@/ducks/account';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Router from '@/ducks/router';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useDispatch, useSelector } from '@/hooks';
import { ProjectIdentityProvider } from '@/pages/Project/contexts/ProjectIdentityContext';

import { Sidebar } from '../../components';
import { getProjectStatusAndMembers } from '../../utils';
import { EmptySearch, Header } from './components';
import { SortByOptions, SortOptionType } from './constants';
import * as S from './styles';
import { getProjectSortFunction } from './utils';

const ProjectList: React.FC = () => {
  const [search, setSearch] = React.useState('');
  const [sortBy, setSortBy] = React.useState<SortOptionType>(SortByOptions[0]);

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
    () => projects.sort(getProjectSortFunction(activeViewersPerProject, sortBy.id)),
    [projects, activeViewersPerProject, sortBy]
  );

  const projectToRender = React.useMemo(
    () => (search ? orderedProjects.filter((project) => project.name.toLowerCase().includes(search.toLowerCase())) : orderedProjects),
    [orderedProjects, search]
  );

  return (
    <Page white renderHeader={() => <Header search={search} onSearch={setSearch} />} renderSidebar={() => <Sidebar />}>
      <Page.Content>
        {!search && (
          <S.StyledBanner
            mb={14}
            title="Learn Voiceflow with video tutorials"
            subtitle="In this course you’ll find everything you need to get started with Voiceflow from the ground up."
            closeKey="dashboard-learn-banner"
            buttonText="Start Course"
            backgroundImage={bannerBg}
          />
        )}
        <Box.FlexApart fullWidth mb={10}>
          <SearchBar value={search} onSearch={setSearch} placeholder="Search assistants" noBorder />
          <S.StyledSelect
            value={sortBy}
            borderLess
            isSecondaryIcon
            minWidth={false}
            maxWidth={150}
            minMenuWidth={152}
            options={SortByOptions}
            onSelect={(option) => option && setSortBy(option)}
            getOptionLabel={(option) => option?.label}
          />
        </Box.FlexApart>

        {search && !projectToRender.length ? (
          <EmptySearch onClear={() => setSearch('')} />
        ) : (
          <>
            {!!projectToRender.length && (
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
            )}

            <S.Title>Start with a template</S.Title>

            <S.Grid>
              {projectToRender.map((item) => (
                <AssistantCard
                  key={item.id}
                  {...getProjectStatusAndMembers({ project: item, activeViewers: activeViewersPerProject[item.id], getMemberByIDSelector })}
                  image={item.image}
                  project={item}
                  onClickCTA={() => goToCanvasWithVersionID(item.versionID)}
                  onClickLink={() => goToAssistantOverview(item.versionID)}
                />
              ))}
            </S.Grid>
          </>
        )}
      </Page.Content>
    </Page>
  );
};

export default ProjectList;
