import * as Realtime from '@voiceflow/realtime-sdk';
import { Box } from '@voiceflow/ui';
import * as Normal from 'normal-store';
import React from 'react';

import { AssistantCard } from '@/components/AssistantCard';
import Page from '@/components/Page';
import SearchBar from '@/components/SearchBar';
import TrialExpiredPage from '@/components/TrialExpiredPage';
import { Permission } from '@/constants/permissions';
import * as Account from '@/ducks/account';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Router from '@/ducks/router';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useDispatch, useFeature, usePermission, useSelector } from '@/hooks';
import { ProjectIdentityProvider } from '@/pages/Project/contexts/ProjectIdentityContext';

import { Sidebar } from '../../components';
import { getProjectStatusAndMembers } from '../../utils';
import { Banner, EmptySearch, EmptyWorkspace, Header, TemplateSection } from './components';
import { SortByOptions, SortOptionType } from './constants';
import * as S from './styles';
import { getProjectSortFunction } from './utils';

const ProjectList: React.FC = () => {
  const [search, setSearch] = React.useState('');
  const [sortBy, setSortBy] = React.useState<SortOptionType>(SortByOptions[0]);
  const [canCreateAssistant] = usePermission(Permission.PROJECT_EDIT);
  const proReverseTrial = useFeature(Realtime.FeatureFlag.PRO_REVERSE_TRIAL);

  const userID = useSelector(Account.userIDSelector)!;
  const projects = useSelector(ProjectV2.allProjectsSelector);
  const awarenessViewers = useSelector(ProjectV2.awarenessViewersSelector);
  const getMemberByIDSelector = useSelector(WorkspaceV2.active.getMemberByIDSelector);
  const isTrialExpired = useSelector(WorkspaceV2.active.organizationTrialExpiredSelector);

  const goToCanvasWithVersionID = useDispatch(Router.goToCanvasWithVersionID);
  const goToAssistantOverview = useDispatch(Router.goToAssistantOverview);

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

  const hasProjects = !!projectToRender.length;
  const emptySearch = !!search && !hasProjects;
  const emptyWorkspace = !search && !hasProjects;
  const showTemplates = !emptySearch && canCreateAssistant && projects.length < 3;

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
    <>
      {proReverseTrial.isEnabled && isTrialExpired && <TrialExpiredPage />}
      <Page white renderHeader={() => <Header />} renderSidebar={() => <Sidebar />}>
        <S.Content fullHeight={emptySearch}>
          {!search && <Banner />}

          <Box.FlexApart fullWidth mb={10}>
            <SearchBar value={search} onSearch={setSearch} placeholder="Search assistants" noBorder animateIn={false} />
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
              showDropdownColorOnActive
              inline
              isSecondaryInput
              syncOptionsOnRender
            />
          </Box.FlexApart>

          {emptySearch && <EmptySearch onClear={() => setSearch('')} />}

          {hasProjects && (
            <S.Grid>
              {projectToRender.map((item) => (
                <ProjectIdentityProvider key={item.id} projectID={item.id} activeRole={Normal.getOne(item.members, String(userID))?.role ?? null}>
                  <AssistantCard
                    {...getProjectStatusAndMembers({ project: item, activeViewers: activeViewersPerProject[item.id], getMemberByIDSelector })}
                    project={item}
                    onClickCard={() => goToAssistantOverview(item.versionID)}
                    onClickDesigner={() => goToCanvasWithVersionID(item.versionID)}
                  />
                </ProjectIdentityProvider>
              ))}
            </S.Grid>
          )}

          {showTemplates && <TemplateSection />}
        </S.Content>
      </Page>
    </>
  );
};

export default ProjectList;
