import './DashBoard.css';

import cn from 'classnames';
import queryString from 'query-string';
import React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Tooltip } from 'react-tippy';
import { Alert } from 'reactstrap';

import DragLayer from '@/components/DragLayer';
import IconButton from '@/components/IconButton';
import Button from '@/components/LegacyButton';
import { FullSpinner } from '@/components/Spinner';
import SvgIcon from '@/components/SvgIcon';
import { Link as Anchor } from '@/components/Text';
import { toast } from '@/components/Toast';
import { FeatureFlag } from '@/config/features';
import { Permission } from '@/config/permissions';
import { ModalType } from '@/constants';
import { ScrollContextProvider } from '@/contexts';
import * as Account from '@/ducks/account';
import * as Modal from '@/ducks/modal';
import * as Notifications from '@/ducks/notifications';
import * as Project from '@/ducks/project';
import * as ProjectList from '@/ducks/projectList';
import * as Workspace from '@/ducks/workspace';
import { connect } from '@/hocs';
import { useFeature, useModals, usePermission, useScrollHelpers, useSetup, useWorkspaceTracking } from '@/hooks';
import * as Models from '@/models';
import { copyProject } from '@/store/sideEffects';
import { copyProject as copyProjectV2 } from '@/store/sideEffectsV2';
import { ConnectedProps } from '@/types';
import * as Userflow from '@/vendors/userflow';

import DashboardHeader from './Header';
import BoardDeleteModal from './components/BoardDeleteModal';
import BoardSettingsModal from './components/BoardSettingsModal';
import { Item as ListItem } from './components/Item';
import List, { List as SimpleList } from './components/List';

const getBoardFilteredProjects = (projectsIDs: string[], projectsMap: Record<string, Models.Project>, filter: string) => {
  const filtered: Models.Project[] = [];

  projectsIDs.forEach((id) => {
    const project = projectsMap[id];

    if (project?.name.toLowerCase().includes(filter)) {
      filtered.push(project);
    }
  });

  return filtered;
};

export type DashboardProps = RouteComponentProps & {};

export const Dashboard: React.FC<DashboardProps & ConnectedDashboardProps> = (props) => {
  const query: Models.Query.Dashboard | null = props.location?.search ? queryString.parse(props.location.search) : null;

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

  const dataRefactor = useFeature(FeatureFlag.DATA_REFACTOR);
  const actionsEnv = useFeature(FeatureFlag.ACTIONS_ENV);
  const [canManageLists] = usePermission(Permission.MANAGE_PROJECT_LISTS);
  const [loading, toggleLoading] = React.useState(true);
  const [filter_text, handleFilterText] = React.useState('');
  const { bodyRef, innerRef, scrollHelpers } = useScrollHelpers();
  const { open: openCollaboratorsModal } = useModals(ModalType.COLLABORATORS);
  const { open: openProjectLimitModal } = useModals(ModalType.FREE_PROJECT_LIMIT);
  const { open: openPaymentModal } = useModals(ModalType.PAYMENT);
  const { toggle: toggleLoadingModal } = useModals(ModalType.LOADING);

  const onCopyProject = React.useCallback(
    async (projectId, boardId = null) => {
      if (props.projects.length >= props.workspace!.projects) {
        openProjectLimitModal({ projects: props.workspace!.projects });
        return;
      }
      toggleLoadingModal(true);

      if (dataRefactor.isEnabled) {
        await props.copyProjectV2(projectId, props.workspaceID!, boardId);
      } else {
        await props.copyProject(projectId, props.workspaceID!, boardId);
      }

      toggleLoadingModal(false);
    },
    [props.projects, props.workspace, props.workspaceID, props.copyProject, props.copyProjectV2]
  );

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
    (id) => {
      if (props.projects.length >= props.workspace!.projects) {
        openProjectLimitModal({ projects: props.workspace!.projects });
      } else {
        props.history.push(id !== 'initial' ? `/workspace/template/${id}` : '/workspace/template');
      }
    },
    [props.projects, props.workspace, props.history]
  );

  let loadLists;

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

  const updateWorkspace = () => {
    // ensure workspace hasn't changed
    toggleLoading(true);
    loadLists = props.loadLists(props.workspaceID!).then(() => {
      toggleLoading(false);
      loadLists = null;
    });
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

    if (document.referrer?.includes('creator.actions.voiceflow.com') && !sessionStorage.getItem('creator_return_to_actions')) {
      sessionStorage.setItem('creator_return_to_actions', 'true');

      toast.warn(
        <>
          Looking to build with Google Action Console? Get early access at{' '}
          <Anchor href="https://creator.actions.voiceflow.com" target="" rel="">
            creator.actions.voiceflow.com
          </Anchor>
        </>,
        { autoClose: false, closeButton: true }
      );
    } else if (actionsEnv.isEnabled && !sessionStorage.getItem('actions_return_to_creator')) {
      sessionStorage.setItem('actions_return_to_creator', 'true');

      toast.warn(
        <>
          This version of your workspace is for your new Google Actions Console projects only.
          <br />
          Looking for your existing projects? Return to{' '}
          <Anchor href="https://creator.voiceflow.com" target="" rel="">
            creator.voiceflow.com
          </Anchor>
        </>,
        { autoClose: false, closeButton: true }
      );
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
    <>
      <BoardDeleteModal workspace={props.workspace!} />
      <BoardSettingsModal user={props.user} workspace={props.workspace!} />

      <div id="app" className="dashboard">
        <DashboardHeader
          user={props.user}
          history={props.history}
          handleFilterText={handleFilterText}
          workspaces={props.workspaces}
          workspaceID={props.workspaceID}
          workspace={props.workspace}
          fetchBoards={loadLists}
          loadingProjects={loading}
        />

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

        {loading ? (
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
                    <img src="/create.svg" alt="skill-icon" width="80" height="80" className="mb-3" />
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
              <div className="board-container-body">
                <div className="board-container-body-inner">
                  <ScrollContextProvider value={scrollHelpers}>
                    <div ref={bodyRef} className="main-lists">
                      <div ref={innerRef} className="main-lists-inner">
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
                              onDeleteProject={onDeleteProject(list.id)}
                              createSkill={onCreateProject}
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

                        {/* TODO: REMOVE AFTER DATA REFACTOR MIGRATIONS (DUAL ENVIRONMENT FOR GOOGLE) */}
                        {canManageLists && !actionsEnv.isEnabled && (
                          <div className="main-list-add">
                            <Tooltip distance={10} title="Add new list" position="bottom">
                              <IconButton large icon="addStep" onClick={props.createNewList} size={13} />
                            </Tooltip>
                          </div>
                        )}
                      </div>
                    </div>
                  </ScrollContextProvider>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
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
  createNewList: ProjectList.createNewList,
  deleteProject: ProjectList.deleteProjectFromList,
  copyProject,
  copyProjectV2,
  setConfirm: Modal.setConfirm,
  setError: Modal.setError,
  deleteList: ProjectList.deleteProjectList,
  renameList: ProjectList.renameProjectList,
  clearNewList: ProjectList.clearNewProjectList,
  transplantProject: ProjectList.transplantProject,
  moveList: ProjectList.moveProjectList,
  fetchNotifications: Notifications.fetchNotifications,
};

type ConnectedDashboardProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
