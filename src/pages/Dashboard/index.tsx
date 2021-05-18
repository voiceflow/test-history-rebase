import './DashBoard.css';

import { ProjectPrivacy } from '@voiceflow/api-sdk';
import cn from 'classnames';
import React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Alert } from 'reactstrap';

import { createGraphic } from '@/assets';
import { Flex } from '@/components/Box';
import DragLayer from '@/components/DragLayer';
import IconButton from '@/components/IconButton';
import Button from '@/components/LegacyButton';
import SeoHelmet from '@/components/SeoHelmet';
import { FullSpinner } from '@/components/Spinner';
import SvgIcon from '@/components/SvgIcon';
import TippyTooltip from '@/components/TippyTooltip';
import { toast } from '@/components/Toast';
import { Permission } from '@/config/permissions';
import { ModalType } from '@/constants';
import { SeoPage } from '@/constants/seo';
import { ScrollContextProvider } from '@/contexts';
import * as Account from '@/ducks/account';
import * as Modal from '@/ducks/modal';
import * as Notifications from '@/ducks/notifications';
import * as Project from '@/ducks/project';
import * as ProjectList from '@/ducks/projectList';
import * as Workspace from '@/ducks/workspace';
import { WorkspaceFeatureLoadingGate } from '@/gates';
import { connect } from '@/hocs';
import { useModals, usePermission, useScrollHelpers, useSetup, useTrackingEvents, useWorkspaceTracking } from '@/hooks';
import * as Models from '@/models';
import { copyProject } from '@/store/sideEffects';
import { DashboardClassName } from '@/styles/constants';
import { ConnectedProps } from '@/types';
import { copy } from '@/utils/clipboard';
import * as Query from '@/utils/query';
import * as Userflow from '@/vendors/userflow';

import { Item as ListItem } from './components/Item';
import List, { List as SimpleList } from './components/List';
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

export const Dashboard: React.FC<DashboardProps & ConnectedDashboardProps> = (props) => {
  const query = props.location?.search ? Query.parse(props.location.search) : null;

  const { open: openImportModal } = useModals(ModalType.IMPORT_PROJECT);

  React.useEffect(() => {
    if (query) {
      const importProjectID = query.import;

      props.history.replace({ search: '' });

      if (!importProjectID) {
        return;
      }

      openImportModal({ projectID: importProjectID });
    }
  }, []);

  const [canManageLists] = usePermission(Permission.MANAGE_PROJECT_LISTS);
  const [canShareProject] = usePermission(Permission.SHARE_PROJECT);
  const [loading, toggleLoading] = React.useState(true);
  const [filter_text, handleFilterText] = React.useState('');
  const { bodyRef, innerRef, scrollHelpers } = useScrollHelpers<HTMLDivElement, HTMLDivElement>();
  const { open: openCollaboratorsModal } = useModals(ModalType.COLLABORATORS);
  const { open: openProjectLimitModal } = useModals(ModalType.FREE_PROJECT_LIMIT);
  const { open: openPaymentModal } = useModals(ModalType.PAYMENT);
  const { toggle: toggleLoadingModal } = useModals(ModalType.LOADING);
  const { open: openProjectDownloadModal } = useModals(ModalType.PROJECT_DOWNLOAD);

  const [trackingEvents] = useTrackingEvents();

  const onCopyProject = React.useCallback(
    async (projectId, boardId = null) => {
      if (props.projects.length >= props.workspace!.projects) {
        openProjectLimitModal({ projects: props.workspace!.projects });
        return;
      }
      toggleLoadingModal(true);

      await props.copyProject(projectId, props.workspaceID!, boardId);

      toggleLoadingModal(false);
    },
    [props.projects, props.workspace, props.workspaceID, props.copyProject]
  );

  const onDownloadProject = React.useCallback(async (projectID) => {
    if (canShareProject) {
      try {
        copy(`${window.location.origin}/dashboard?import=${projectID}`);
        toast.success('Copied to clipboard');
        trackingEvents.trackActiveProjectDownloadLinkShare();
        props.saveProjectPrivacy(projectID, ProjectPrivacy.PUBLIC);
      } catch {
        toast.error('Error getting import link');
      }
    } else {
      openProjectDownloadModal();
    }
  }, []);

  const onDeleteProject = React.useCallback(
    (boardID: string) => (projectId: string, projectName: string) => {
      props.setConfirm({
        text: <p className="mb-0">This action can not be undone, {projectName} and all flows can not be recovered</p>,
        warning: true,
        confirm: () => props.deleteProject(boardID, projectId).catch((err) => props.setError(err.message)),
      });
    },
    [props.deleteProject]
  );

  const onCreateProject = React.useCallback(
    (id: string) => {
      if (props.projects.length >= props.workspace!.projects) {
        openProjectLimitModal({ projects: props.workspace!.projects });
      } else {
        props.history.push(id !== 'initial' ? `/workspace/template/${id}` : '/workspace/template');
      }
    },
    [props.projects, props.workspace, props.history]
  );

  const onDeleteBoard = React.useCallback(
    ({ name, id, projects }) => {
      props.setConfirm({
        text: (
          <p className="mb-0">
            This action can not be undone, {name} and all {!!projects && projects.length} projects can not be recovered
          </p>
        ),
        warning: true,
        confirm: () => props.deleteList(id).catch((err) => props.setError(err.message)),
      });
    },
    [props.setConfirm, props.deleteList]
  );

  const updateWorkspace = async () => {
    // ensure workspace hasn't changed
    toggleLoading(true);
    await props.loadLists(props.workspaceID!);
    toggleLoading(false);
  };

  const onMove = React.useCallback((drag, hover) => props.moveList(drag.id, hover.id), [props.moveList]);

  const onMoveProject = React.useCallback(
    (drag, hover) => props.transplantProject({ listID: drag.listId, projectID: drag.id }, { listID: hover.listId, projectID: hover.id }),
    [props.transplantProject]
  );

  React.useEffect(() => {
    updateWorkspace();
  }, [props.workspaceID]);

  React.useEffect(() => {
    props.fetchNotifications();

    if (query?.invite_collaborators) {
      openCollaboratorsModal();
    } else if (query?.upgrade_workspace) {
      openPaymentModal();
    }
  }, []);

  useSetup(() => {
    if (props.hasTemplatesWorkspace) {
      Userflow.track(Userflow.Event.DASHBOARD_VISITED);
    }
  });

  useWorkspaceTracking();

  const LOCKED = props.workspace!.state === 'LOCKED';

  const filter = filter_text.trim().toLowerCase();

  return (
    <div id="app" className={DashboardClassName.DASHBOARD}>
      <DashboardHeader handleFilterText={handleFilterText} workspaces={props.workspaces} workspace={props.workspace} loadingProjects={loading} />
      <SeoHelmet page={SeoPage.DASHBOARD} />

      {LOCKED && (
        <div className="w-100 h-100 super-center position-absolute z-hard pb-5">
          {/* TODO: flush out subscription failed logic */}
          <Alert color="danger" className="pointer text-center py-3">
            <SvgIcon icon="ban" size={32} inline />
            <br />
            Your subscription has failed
            <br />
            Please update your payment to continue
          </Alert>
        </div>
      )}

      {/* using loading gate here instead of hock to escape header blinking  */}
      <WorkspaceFeatureLoadingGate>
        {() =>
          loading ? (
            <FullSpinner name="Projects" />
          ) : (
            <div
              id="dashboard"
              className={cn({ 'thanos-ed': LOCKED })}
              onClickCapture={(e) => {
                // prevent all click events
                if (LOCKED) {
                  e.preventDefault();
                  e.stopPropagation();
                }
              }}
            >
              {props.projects.length === 0 ? (
                <div className="h-100 d-flex justify-content-center">
                  <div className="align-self-center">
                    <div className="text-center">
                      <img src={createGraphic} alt="skill-icon" width="80" height="80" className="mb-3" />
                    </div>
                    <label className="dark text-center mb-3">No Projects Found</label>
                    <div className="text-muted mb-2">This workspace has no projects, create one.</div>
                    <Link to="/workspace/template" className="no-underline super-center">
                      <Button isPrimary className="mt-3" id="createskill">
                        New Project
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className={DashboardClassName.LISTS_CONTAINER}>
                  <div className={DashboardClassName.LISTS_CONTAINER_INNER}>
                    <ScrollContextProvider value={scrollHelpers}>
                      <div ref={bodyRef} className={DashboardClassName.LISTS}>
                        <div ref={innerRef} className={DashboardClassName.LISTS_INNER}>
                          {props.projectLists.map((list, idx) => {
                            const projects = getBoardFilteredProjects(list.projects, props.projectsMap, filter);
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
                                onRename={props.renameList}
                                onRemove={onDeleteBoard}
                                projects={projects}
                                onCopyProject={onCopyProject}
                                onDownloadProject={onDownloadProject}
                                onDeleteProject={onDeleteProject(list.id)}
                                createProject={onCreateProject}
                                onMove={onMove}
                                onMoveProject={onMoveProject}
                                clearNewBoard={props.clearNewList}
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
                            <Flex
                              className={DashboardClassName.ADD_LIST_BUTTON}
                              style={{ flex: '0 0 auto', alignSelf: 'flex-start', margin: '15px 27px', minWidth: '0' }}
                            >
                              <TippyTooltip distance={8} title="Add new list" position="bottom">
                                <IconButton large icon="addStep" onClick={props.createList} size={13} />
                              </TippyTooltip>
                            </Flex>
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
  user: Account.userSelector,
  projects: Project.allProjectsSelector,
  projectsMap: Project.projectsMapSelector,
  projectLists: ProjectList.allProjectListsSelector,
  workspace: Workspace.activeWorkspaceSelector,
  workspaceID: Workspace.activeWorkspaceIDSelector,
  workspaces: Workspace.allWorkspacesSelector,
  hasTemplatesWorkspace: Workspace.hasTemplateWorkspaceSelector,
};

const mapDispatchToProps = {
  loadLists: ProjectList.loadProjectLists,
  createList: ProjectList.createProjectList,
  deleteProject: ProjectList.deleteProjectFromList,
  copyProject,
  setConfirm: Modal.setConfirm,
  setError: Modal.setError,
  deleteList: ProjectList.deleteProjectList,
  renameList: ProjectList.renameProjectList,
  clearNewList: ProjectList.clearNewProjectList,
  transplantProject: ProjectList.transplantProject,
  moveList: ProjectList.moveProjectList,
  fetchNotifications: Notifications.fetchNotifications,
  saveProjectPrivacy: Project.saveProjectPrivacy,
};

type ConnectedDashboardProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
