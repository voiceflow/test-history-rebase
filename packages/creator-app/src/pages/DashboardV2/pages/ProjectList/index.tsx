import { Box } from '@voiceflow/ui';
import * as Normal from 'normal-store';
import React from 'react';

import { AssistantCard } from '@/components/AssistantCard';
import Page from '@/components/Page';
import SearchBar from '@/components/SearchBar';
import { LimitType } from '@/constants/limits';
import { Permission } from '@/constants/permissions';
import * as Account from '@/ducks/account';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Router from '@/ducks/router';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useDispatch, usePermission, usePlanLimitedConfig, useSelector } from '@/hooks';
import { ProjectIdentityProvider } from '@/pages/Project/contexts/ProjectIdentityContext';

import { Sidebar } from '../../components';
import { getProjectStatusAndMembers } from '../../utils';
import { Banner, EmptySearch, EmptyWorkspace, Header, TemplateSection } from './components';
import { SortByOptions, SortByTypes, SortOptionType } from './constants';
import * as S from './styles';
import { getProjectSortFunction } from './utils';

const ProjectList: React.FC = () => {
  const [search, setSearch] = React.useState('');
  const [sortBy, setSortBy] = React.useState<SortOptionType>(SortByOptions[0]);
  const [canCreateAssistant] = usePermission(Permission.EDIT_PROJECT);

  const projects = useSelector(ProjectV2.allProjectsSelector);
  const awarenessViewers = useSelector(ProjectV2.awarenessViewersSelector);
  const getMemberByIDSelector = useSelector(WorkspaceV2.active.getMemberByIDSelector);
  const userID = useSelector(Account.userIDSelector)!;

  const goToCanvasWithVersionID = useDispatch(Router.goToCanvasWithVersionID);
  const goToAssistantOverview = useDispatch(Router.goToAssistantOverview);

  const projectsLimitConfig = usePlanLimitedConfig(LimitType.PROJECTS, { value: projects.length, limit: 2 });

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

  const lastTwoActiveProjects = React.useMemo(
    () =>
      projects
        .sort(getProjectSortFunction(activeViewersPerProject, SortByTypes.LastViewed))
        .slice(0, 2)
        .map((project) => project.id),
    [activeViewersPerProject, projects]
  );

  const orderedProjects = React.useMemo(
    () => projects.sort(getProjectSortFunction(activeViewersPerProject, sortBy.id)),
    [projects, activeViewersPerProject, sortBy]
  );

  const projectToRender = React.useMemo(
    () => (search ? orderedProjects.filter((project) => project.name.toLowerCase().includes(search.toLowerCase())) : orderedProjects),
    [orderedProjects, search]
  );

  const hasProjects = !!projectToRender.length;
  const emptySearch = !!search && !hasProjects;
  const emptyWorkspace = !search && !hasProjects;
  const showTemplates = !emptySearch && canCreateAssistant && projectToRender.length < 3;

  if (emptyWorkspace) {
    return (
      <Page white renderHeader={() => <Header />} renderSidebar={() => <Sidebar />}>
        <S.Content fullHeight>
          {canCreateAssistant && <Banner />}
          {!canCreateAssistant && <EmptyWorkspace />}
          {canCreateAssistant && <TemplateSection />}
        </S.Content>
      </Page>
    );
  }

  return (
    <Page white renderHeader={() => <Header />} renderSidebar={() => <Sidebar />}>
      <S.Content fullHeight={emptySearch}>
        {!search && <Banner />}

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
            modifiers={{ offset: { offset: -11 } }}
          />
        </Box.FlexApart>

        {emptySearch && <EmptySearch onClear={() => setSearch('')} />}

        {hasProjects && (
          <S.Grid>
            {projectToRender.map((item) => (
              <ProjectIdentityProvider key={item.id} activeRole={Normal.getOne(item.members, String(userID))?.role ?? null}>
                <AssistantCard
                  {...getProjectStatusAndMembers({ project: item, activeViewers: activeViewersPerProject[item.id], getMemberByIDSelector })}
                  onClickCard={() => goToAssistantOverview(item.versionID)}
                  onClickDesigner={() => goToCanvasWithVersionID(item.versionID)}
                  project={item}
                  isLocked={!!projectsLimitConfig && !lastTwoActiveProjects.includes(item.id)}
                />
              </ProjectIdentityProvider>
            ))}
          </S.Grid>
        )}

        {showTemplates && <TemplateSection />}
      </S.Content>
    </Page>
  );
};

export default ProjectList;
