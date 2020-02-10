import './DashBoard.css';

import cn from 'classnames';
import jwt from 'jsonwebtoken';
import _ from 'lodash';
import queryString from 'query-string';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Tooltip } from 'react-tippy';
import { Alert } from 'reactstrap';

import DragLayer from '@/components/DragLayer';
import IconButton from '@/components/IconButton';
import Button from '@/components/LegacyButton';
import LoadingModal from '@/components/LegacyModal/LoadingModal';
import { FullSpinner } from '@/components/Spinner';
import { MODALS } from '@/constants';
import { ScrollContextProvider } from '@/contexts';
import { useModals } from '@/contexts/ModalsContext';
import { unnormalize } from '@/ducks/_normalize';
import * as Account from '@/ducks/account';
import * as Lists from '@/ducks/lists';
import * as Modal from '@/ducks/modal';
import * as Notifications from '@/ducks/notifications';
import * as Project from '@/ducks/project';
import * as Workspace from '@/ducks/workspace';
import { useScrollHelpers } from '@/hooks/scroll';
import { copyProject, importProject } from '@/store/sideEffects';

import DashboardHeader from './Header';
import BoardDeleteModal from './components/BoardDeleteModal';
import BoardSettingsModal from './components/BoardSettingsModal';
import ImportModal from './components/ImportModal';
import { Item as ListItem } from './components/Item';
import List, { List as SimpleList } from './components/List';

const getBoardFilteredProjects = (projectsIds, projectsMap, filter) => {
  const filtered = [];

  projectsIds.forEach((id) => {
    const project = projectsMap[id];

    if (project?.name.toLowerCase().includes(filter)) {
      filtered.push(project);
    }
  });

  return filtered;
};

export const DashBoard = (props) => {
  const [team_setting, setTeamSetting] = React.useState(null);
  const query = props.location?.search && queryString.parse(props.location.search);
  let importToken = null;

  if (query) {
    importToken = query.import;

    if (importToken) {
      try {
        const result = jwt.decode(importToken);
        if (!result.projectId || !result.projectName) {
          throw new Error('Unexpected JWT content');
        }
      } catch (e) {
        importToken = null;
        props.history.replace({ search: '' });
        props.setError('Bad Import Link');
      }
    }
    if (query.plan) {
      props.history.replace({ search: '' });
      setTimeout(() => setTeamSetting('PLAN'), 100);
    }
  }

  const [loading, toggleLoading] = React.useState(true);
  const [importOpen, toggleImport] = React.useState(!!importToken);
  const [filter_text, handleFilterText] = React.useState('');
  const [showInfo, setShowInfo] = React.useState(false);
  const [loading_modal, toggleLoadingModal] = React.useState(false);
  const { bodyRef, innerRef, scrollHelpers } = useScrollHelpers();
  const { open: openCollaboratorsModal } = useModals(MODALS.COLLABORATORS);

  const closeImport = () => {
    toggleImport(false);
    props.history.replace({ search: '' });
  };

  const importProject = (workspaceID) => {
    closeImport();
    toggleLoadingModal(true);
    props
      .importProject(workspaceID, importToken)
      .then(() => {
        toggleLoadingModal(false);
      })
      .catch((e) => {
        toggleLoadingModal(false);
        props.setError(e);
      });
  };

  const onCopyProject = React.useCallback(
    async (projectId, boardId = null) => {
      if (props.projects.length >= props.workspace.projects) {
        //  TODO: implement flimsy project limit
      }
      toggleLoadingModal(true);

      await props.copyProject(projectId, props.workspaceID, boardId);

      toggleLoadingModal(false);
    },
    [props.projects, props.workspace, props.workspaceID, props.copyProject]
  );

  const onDeleteProject = React.useCallback(
    (boardID) => (projectId, projectName) => {
      props.setConfirm({
        text: <p className="mb-0">This action can not be undone, {projectName} and all flows can not be recovered</p>,
        warning: true,
        confirm: () => props.deleteBoardProject(boardID, projectId).catch((err) => props.setError(err.message)),
      });
    },
    [props.deleteBoardProject]
  );

  const onCreateProject = React.useCallback(
    (id) => {
      if (props.projects.length >= props.workspace.projects) {
        //  TODO: implement flimsy project limit
      } else {
        props.history.push(id !== 'initial' ? `/workspace/template/${id}` : '/workspace/template');
      }
    },
    [props.projects, props.workspace, props.history]
  );

  let fetchLists;

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
    fetchLists = props.fetchLists(props.workspaceID).then(() => {
      toggleLoading(false);
      fetchLists = null;
    });
  };

  React.useEffect(() => {
    updateWorkspace();
  }, [props.workspaceID]);

  React.useEffect(() => {
    props.fetchNotifications();

    if (query.invite_collaborators) {
      openCollaboratorsModal();
    }
  }, []);

  const LOCKED = props.workspace.state === 'LOCKED';

  const filter = filter_text.trim().toLowerCase();

  const onSaveList = React.useCallback(() => props.updateLists(props.workspaceID), [props.updateLists, props.workspaceID]);

  return (
    <>
      <LoadingModal open={loading_modal} />

      {importToken && <ImportModal open={importOpen} toggle={closeImport} importProject={importProject} token={importToken} />}

      <BoardDeleteModal workspace={props.workspace} />
      <BoardSettingsModal user={props.user} workspace={props.workspace} />

      <div id="app" className="dashboard">
        <DashboardHeader
          user={props.user}
          history={props.history}
          handleFilterText={handleFilterText}
          showInfo={showInfo}
          setShowInfo={setShowInfo}
          workspaces={props.workspaces}
          workspaceID={props.workspaceID}
          workspace={props.workspace}
          fetchBoards={fetchLists}
          team_setting={team_setting}
          setTeamSetting={setTeamSetting}
        />

        {LOCKED && (
          <div className="w-100 h-100 super-center position-absolute z-hard pb-5">
            {/* TODO: flush out subscription failed logic */}
            <Alert color="danger" className="pointer text-center py-3">
              <h1>
                <i className="far fa-ban" />
              </h1>
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
                return false;
              }
            }}
          >
            {props.projects.length === 0 ? (
              <div className="h-100 d-flex justify-content-center">
                <div className="align-self-center">
                  <div className="text-center">
                    <img src="/create.svg" alt="skill-icon" width="100" height="127" className="mb-1" />
                  </div>
                  <label className="dark text-center">No Projects Found</label>
                  <div className="text-muted mt-3 mb-2">This workspace has no projects yet, create one.</div>
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
                        {_.map(props.listsArray, (list, idx) => {
                          const projects = getBoardFilteredProjects(list.projects, props.projectsMap, filter);
                          if (filter && !projects.length) {
                            return null;
                          }
                          return (
                            <List
                              id={list.board_id}
                              key={list.board_id}
                              isNew={list.isNew}
                              index={idx}
                              name={list.name}
                              onRename={props.renameList}
                              onRemove={onDeleteBoard}
                              projects={projects}
                              onCopyProject={onCopyProject}
                              onDeleteProject={onDeleteProject(list.board_id)}
                              createSkill={onCreateProject}
                              onMove={props.changeListPosition}
                              onDrop={onSaveList}
                              onMoveProject={props.changeProjectPosition}
                              clearNewBoard={props.clearNewList}
                              onDropProject={onSaveList}
                              disableDragging={!!filter}
                            />
                          );
                        })}

                        <DragLayer withMemo>
                          {(item) => {
                            if (item.dragType === 'dashboard-list') {
                              return <SimpleList {...item} />;
                            }

                            if (item.dragType === 'dashboard-item') {
                              return <ListItem {...item} />;
                            }

                            return null;
                          }}
                        </DragLayer>

                        <div className="main-list-add">
                          <Tooltip distance={10} title="Add new list" position="bottom">
                            <IconButton
                              large
                              icon="addStep"
                              onClick={() => {
                                props.addList(props.workspaceID);
                              }}
                              size={13}
                            />
                          </Tooltip>
                        </div>
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

const mapStateToProps = (state) => ({
  user: Account.userSelector(state),
  projects: Project.allProjectsSelector(state),
  projectsMap: Project.projectsMapSelector(state),
  lists: state.list,
  listsArray: unnormalize(state.list),
  workspace: Workspace.activeWorkspaceSelector(state),
  workspaceID: Workspace.activeWorkspaceIDSelector(state),
  workspaces: Workspace.allWorkspacesSelector(state),
});

const mapDispatchToProps = {
  fetchLists: Lists.fetchLists,
  addList: Lists.addList,
  deleteBoardProject: Lists.deleteBoardProject,
  importProject,
  copyProject,
  setConfirm: Modal.setConfirm,
  setError: Modal.setError,
  updateLists: Lists.updateLists,
  deleteList: Lists.deleteList,
  renameList: Lists.renameList,
  clearNewList: Lists.clearNewList,
  updateBoards: Lists.updateBoards,
  changeProjectPosition: Lists.changeProjectPosition,
  changeListPosition: Lists.changeListPosition,
  fetchNotifications: Notifications.fetchNotifications,
};

export default connect(mapStateToProps, mapDispatchToProps)(DashBoard);
