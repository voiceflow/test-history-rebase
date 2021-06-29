import './DashBoard.css';

import { Alert, AlertVariant, BoxFlex, BoxFlexCenter, FullSpinner, IconButton, SvgIcon, TippyTooltip } from '@voiceflow/ui';
import cn from 'classnames';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import DragLayer from '@/components/DragLayer';
import EmptyScreen from '@/components/EmptyScreen';
import SeoHelmet from '@/components/SeoHelmet';
import { Permission } from '@/config/permissions';
import { Path } from '@/config/routes';
import { ModalType } from '@/constants';
import { SeoPage } from '@/constants/seo';
import { ScrollContextProvider } from '@/contexts';
import * as Modal from '@/ducks/modal';
import * as Notifications from '@/ducks/notifications';
import * as Project from '@/ducks/project';
import * as ProjectList from '@/ducks/projectList';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import * as Workspace from '@/ducks/workspace';
import { WorkspaceFeatureLoadingGate } from '@/gates';
import { connect, withBatchLoadingGate } from '@/hocs';
import { useAsyncEffect, useModals, usePermission, useScrollHelpers, useSetup, useWorkspaceTracking } from '@/hooks';
import * as Models from '@/models';
import perf, { PerfAction } from '@/performance';
import { DashboardClassName } from '@/styles/constants';
import { ConnectedProps } from '@/types';
import { compose } from '@/utils/functional';
import * as Query from '@/utils/query';
import * as Userflow from '@/vendors/userflow';

import { Item as ListItem } from './components/Item';
import List, { List as SimpleList } from './components/List';
import { DashboardGate } from './gates';
import DashboardHeader from './Header';

const getBoardFilteredProjects = (projectsIDs: string[], projectsMap: Record<string, Models.AnyProject>, filter: string) => {
  const filtered: Models.AnyProject[] = [];

  projectsIDs.forEach((id) => {
    const project = projectsMap[id];

    if (project?.name.toLowerCase().includes(filter)) {
      filtered.push(project);
    }
  });

  return filtered;
};

export type DashboardProps = RouteComponentProps;

export const Dashboard: React.FC<DashboardProps & ConnectedDashboardProps> = ({
  location,
  activeWorkspaceID,
  workspace,
  projects,
  projectsMap,
  projectLists,
  hasTemplatesWorkspace,
  setConfirm,
  setError,
  clearSearch,
  transplantProject,
  createList,
  renameList,
  clearNewList,
  moveList,
  deleteList,
  loadLists,
  fetchNotifications,
  goToNewIntroProject,
  goToNewProject,
}) => {
  const query = location?.search ? Query.parse(location.search) : null;

  const { open: openImportModal } = useModals(ModalType.IMPORT_PROJECT);

  const [canManageLists] = usePermission(Permission.MANAGE_PROJECT_LISTS);
  const [loading, toggleLoading] = React.useState(true);
  const [filterText, handleFilterText] = React.useState('');
  const { bodyRef, innerRef, scrollHelpers } = useScrollHelpers<HTMLDivElement, HTMLDivElement>();
  const { open: openCollaboratorsModal } = useModals(ModalType.COLLABORATORS);
  const { open: openProjectLimitModal } = useModals(ModalType.FREE_PROJECT_LIMIT);
  const { open: openPaymentModal } = useModals(ModalType.PAYMENT);

  const onCreateProject = React.useCallback(
    (id: string) => {
      if (projects.length >= workspace!.projects) {
        openProjectLimitModal({ projects: workspace!.projects });
      } else if (id === 'initial') {
        goToNewIntroProject();
      } else {
        goToNewProject(id);
      }
    },
    [projects, workspace]
  );

  const onDeleteBoard = React.useCallback(({ name, id, projects }) => {
    setConfirm({
      text: (
        <p className="mb-0">
          This action can not be undone, {name} and all {!!projects && projects.length} projects can not be recovered
        </p>
      ),
      warning: true,
      confirm: () => deleteList(id).catch((err) => setError(err.message)),
    });
  }, []);

  const onMove = React.useCallback((drag, hover) => moveList(drag.id, hover.id), []);

  const onMoveProject = React.useCallback(
    (drag, hover) => transplantProject({ listID: drag.listId, projectID: drag.id }, { listID: hover.listId, projectID: hover.id }),
    []
  );

  useAsyncEffect(async () => {
    if (!activeWorkspaceID) return;

    toggleLoading(true);
    await loadLists(activeWorkspaceID);
    toggleLoading(false);
  }, [activeWorkspaceID]);

  useSetup(() => {
    perf.action(PerfAction.DASHBOARD_RENDERED);
    fetchNotifications();

    if (query?.import) {
      clearSearch();
      openImportModal({ projectID: query?.import });
    } else if (query?.invite_collaborators) {
      openCollaboratorsModal();
    } else if (query?.upgrade_workspace) {
      openPaymentModal();
    }

    if (hasTemplatesWorkspace) {
      Userflow.track(Userflow.Event.DASHBOARD_VISITED);
    }
  });

  useWorkspaceTracking();

  const isLocked = workspace?.state === 'LOCKED';

  const filter = filterText.trim().toLowerCase();

  return (
    <div id="app" className={DashboardClassName.DASHBOARD}>
      <DashboardHeader handleFilterText={handleFilterText} workspace={workspace} loadingProjects={loading} />
      <SeoHelmet page={SeoPage.DASHBOARD} />

      {isLocked && (
        <BoxFlexCenter height="100%" width="100%" position="absolute" zIndex={10}>
          {/* TODO: flush out subscription failed logic */}
          <Alert variant={AlertVariant.DANGER} className="pointer text-center">
            <SvgIcon icon="ban" size={32} inline />
            <br />
            Your subscription has failed
            <br />
            Please update your payment to continue
          </Alert>
        </BoxFlexCenter>
      )}

      {/* using loading gate here instead of hock to escape header blinking  */}
      <WorkspaceFeatureLoadingGate>
        {() =>
          loading ? (
            <FullSpinner name="Projects" />
          ) : (
            <div
              id="dashboard"
              className={cn({ 'thanos-ed': isLocked })}
              onClickCapture={(e) => {
                // prevent all click events
                if (isLocked) {
                  e.preventDefault();
                  e.stopPropagation();
                }
              }}
            >
              {projects.length === 0 ? (
                <EmptyScreen
                  title="No Projects Found"
                  body="This workspace has no projects, create one."
                  buttonText="New Project"
                  link={Path.NEW_INTRO_PROJECT}
                />
              ) : (
                <div className={DashboardClassName.LISTS_CONTAINER}>
                  <div className={DashboardClassName.LISTS_CONTAINER_INNER}>
                    <ScrollContextProvider value={scrollHelpers}>
                      <div ref={bodyRef} className={DashboardClassName.LISTS}>
                        <div ref={innerRef} className={DashboardClassName.LISTS_INNER}>
                          {projectLists.map((list, idx) => {
                            const projects = getBoardFilteredProjects(list.projects, projectsMap, filter);
                            if (filter && !projects.length) {
                              return null;
                            }
                            return (
                              <List
                                id={list.id}
                                key={list.id}
                                isNew={list.isNew}
                                index={idx}
                                name={list.name}
                                onRename={renameList}
                                onRemove={onDeleteBoard}
                                projects={projects}
                                createProject={onCreateProject}
                                onMove={onMove}
                                onMoveProject={onMoveProject}
                                clearNewBoard={clearNewList}
                                disableDragging={!!filter}
                              />
                            );
                          })}

                          <DragLayer withMemo>
                            {(item: any) => {
                              if (item.dragType === 'dashboard-list') {
                                return <SimpleList {...item} />;
                              }

                              if (item.dragType === 'dashboard-item') {
                                return <ListItem {...item} />;
                              }

                              return null;
                            }}
                          </DragLayer>

                          {canManageLists && (
                            <BoxFlex
                              className={DashboardClassName.ADD_LIST_BUTTON}
                              style={{ flex: '0 0 auto', alignSelf: 'flex-start', margin: '15px 27px', minWidth: '0' }}
                            >
                              <TippyTooltip distance={8} title="Add new list" position="bottom">
                                <IconButton large icon="addStep" onClick={createList} size={13} />
                              </TippyTooltip>
                            </BoxFlex>
                          )}
                        </div>
                      </div>
                    </ScrollContextProvider>
                  </div>
                </div>
              )}
            </div>
          )
        }
      </WorkspaceFeatureLoadingGate>
    </div>
  );
};

const mapStateToProps = {
  projects: Project.allProjectsSelector,
  projectsMap: Project.projectsMapSelector,
  projectLists: ProjectList.allProjectListsSelector,
  workspace: Workspace.activeWorkspaceSelector,
  activeWorkspaceID: Session.activeWorkspaceIDSelector,
  hasTemplatesWorkspace: Workspace.hasTemplatesWorkspaceSelector,
};

const mapDispatchToProps = {
  loadLists: ProjectList.loadProjectLists,
  createList: ProjectList.createProjectList,
  setConfirm: Modal.setConfirm,
  setError: Modal.setError,
  deleteList: ProjectList.deleteProjectList,
  renameList: ProjectList.renameProjectList,
  clearNewList: ProjectList.clearNewProjectList,
  transplantProject: ProjectList.transplantProject,
  moveList: ProjectList.moveProjectList,
  fetchNotifications: Notifications.fetchNotifications,
  goToNewProject: Router.goToNewProject,
  goToNewIntroProject: Router.goToNewIntroProject,
  clearSearch: Router.clearSearch,
};

type ConnectedDashboardProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default compose(withBatchLoadingGate(DashboardGate), connect(mapStateToProps, mapDispatchToProps))(Dashboard);
