import './DashBoard.css';

import axios from 'axios';
import cn from 'classnames';
import jwt from 'jsonwebtoken';
import _ from 'lodash';
import moment from 'moment';
import queryString from 'query-string';
import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Tooltip } from 'react-tippy';
import { Alert } from 'reactstrap';

import Button from '@/components/Button';
import RoundButton from '@/components/Button/RoundButton';
import DragLayer from '@/components/DragLayer';
import LoadingModal from '@/components/Modal/LoadingModal';
import UpdatesModal from '@/components/Modal/UpdatesModal';
import { FullSpinner } from '@/components/Spinner';
import IconButton from '@/componentsV2/IconButton';
import { ScrollContextProvider } from '@/contexts';
import { unnormalize } from '@/ducks/_normalize';
import {
  addBoard,
  changeListPosition,
  changeProjectPosition,
  clearNewList,
  deleteBoard,
  deleteBoardProject,
  fetchBoards,
  renameList,
  updateBoards,
  updateLists,
} from '@/ducks/board';
import { setConfirm, setError } from '@/ducks/modal';
import { allProjectsSelector, projectsMapSelector } from '@/ducks/project';
import { removeTrial } from '@/ducks/team';
import { useScrollHelpers } from '@/hooks/scroll';
import { copyProject, importProject } from '@/store/sideEffects';

import ExpiryButton from './ExpiryButton';
import DashboardHeader from './Header';
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
  let importToken = null;
  if (props.location && props.location.search) {
    const query = queryString.parse(props.location.search);
    importToken = query.import;
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

  const [loading, toggleLoading] = useState(true);
  const [importOpen, toggleImport] = useState(!!importToken);
  const [filter_text, handleFilterText] = useState('');
  const [showInfo, setShowInfo] = useState(false);
  const [loading_modal, toggleLoadingModal] = useState(false);
  const [show_updates_modal, toggleShowUpdatesModal] = useState(false);
  const [team_setting, setTeamSetting] = useState(null);
  const [product_updates, setProductUpdates] = useState([]);
  const { bodyRef, innerRef, scrollHelpers } = useScrollHelpers();
  const [updates_open, toggleUpdatesOpen] = useState(false);
  const [new_product_updates, setNewProductUpdates] = useState([]);
  const [updates_hover, toggleUpdatesHover] = useState(false);
  const [show_update_bubble, setShowUpdateBubble] = useState(false);

  const closeImport = () => {
    toggleImport(false);
    props.history.replace({ search: '' });
  };

  const importProject = (team_id) => {
    closeImport();
    toggleLoadingModal(true);
    props
      .importProject(team_id, importToken)
      .then(() => {
        toggleLoadingModal(false);
      })
      .catch((e) => {
        toggleLoadingModal(false);
        props.setError(e);
      });
  };

  const onCopyProject = useCallback(
    async (projectId, boardId = null) => {
      if (props.projects.length >= props.team.projects) {
        return setTeamSetting('CHECKOUT:PROJECTS');
      }
      toggleLoadingModal(true);

      await props.copyProject(projectId, props.team_id, boardId);

      toggleLoadingModal(false);
    },
    [props.projects, props.team, props.team_id, props.copyProject]
  );

  const onDeleteProject = useCallback(
    (boardID) => (projectId, projectName) => {
      props.setConfirm({
        text: <p className="mb-0">This action can not be undone, {projectName} and all flows can not be recovered</p>,
        warning: true,
        confirm: () => props.deleteBoardProject(boardID, projectId),
      });
    },
    [props.deleteBoardProject]
  );

  const onCreateProject = useCallback(
    (id) => {
      if (props.projects.length >= props.team.projects) {
        setTeamSetting('CHECKOUT:PROJECTS');
      } else {
        props.history.push(id !== 'initial' ? `/team/template/${id}` : '/team/template');
      }
    },
    [props.projects, props.team, props.history]
  );

  let fetchBoards;

  const onDeleteBoard = useCallback(
    ({ name, id, projects }) => {
      props.setConfirm({
        text: (
          <p className="mb-0">
            This action can not be undone, {name} and all {!!projects && projects.length} projects can not be recovered
          </p>
        ),
        warning: true,
        confirm: () => {
          props.removeBoard(id);
        },
      });
    },
    [props.setConfirm, props.removeBoard]
  );

  const updateTeam = () => {
    // ensure team hasn't changed
    toggleLoading(true);
    fetchBoards = props.fetchBoards(props.team_id).then(() => {
      toggleLoading(false);
      fetchBoards = null;
    });
  };

  useEffect(() => {
    updateTeam();
  }, [props.team_id]);

  const updateButtonClick = () => {
    toggleUpdatesOpen(!updates_open);
    axios.post(`/product_updates/${props.user.creator_id}`);
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const updates = await axios.get(`/product_updates/${props.user.creator_id}`);
        if (updates.data.rows.length > 0) {
          let lastCheckedTime;
          if (!updates.data.last_checked) {
            lastCheckedTime = 0;
          } else {
            lastCheckedTime = moment(updates.data.last_checked).unix();
          }
          const newUpdates = updates.data.rows.filter((update) => {
            const updateTime = Math.floor(new Date(update.created) / 1000);
            return updateTime > lastCheckedTime;
          });
          if (newUpdates && newUpdates.length > 0) {
            setNewProductUpdates(newUpdates);
            setShowUpdateBubble(true);
          }
          setProductUpdates(updates.data.rows);
        } else {
          // For when there are no updates
          setProductUpdates([
            {
              details: 'There are no new updates available.',
              type: 'empty',
              created: 0,
            },
          ]);
        }
      } catch (err) {
        console.error('there was an error getting the product updates: ', err);
      }
    }

    fetchData();
  }, []);

  const LOCKED = props.team.state === 'LOCKED';
  const EXPIRED = props.team.state === 'EXPIRED';

  const filter = filter_text.trim().toLowerCase();

  const onSaveList = useCallback(() => props.updateLists(props.team_id), [props.updateLists, props.team_id]);

  const renderUpdatesButton = () => {
    if (!show_update_bubble) {
      return <RoundButton active={updates_open} icon="notifications" onClick={updateButtonClick} imgSize={15} />;
    }
    return (
      <div className="dropdown-update-container" onMouseEnter={() => toggleUpdatesHover(true)} onMouseLeave={() => toggleUpdatesHover(false)}>
        <div className="dropdown-update-bubble" />
        {!updates_hover && !updates_open ? (
          <RoundButton active={updates_open} icon="notifications" onClick={updateButtonClick} imgSize={15} />
        ) : (
          <div className={cn('dropdown-button-numbered')} onClick={updateButtonClick}>
            <div className="update-number-circle">{new_product_updates.length}</div>
          </div>
        )}
      </div>
    );
  };

  const downgrade = () => {
    props.removeTrial(props.team.team_id);
  };

  return (
    <>
      <ExpiryButton team={props.team} upgrade={() => setTeamSetting('CHECKOUT')} />

      <LoadingModal open={loading_modal} />

      {importToken && <ImportModal open={importOpen} toggle={closeImport} importProject={importProject} token={importToken} />}

      <div id="app" className="dashboard">
        <UpdatesModal
          show_update_modal={show_updates_modal}
          toggle={() => toggleShowUpdatesModal(!props.show_updates_modl)}
          product_updates={product_updates}
        />

        <DashboardHeader
          history={props.history}
          handleFilterText={handleFilterText}
          renderUpdatesButton={renderUpdatesButton}
          updates_open={updates_open}
          toggleUpdatesOpen={toggleUpdatesOpen}
          setNewProductUpdates={setNewProductUpdates}
          setShowUpdateBubble={setShowUpdateBubble}
          product_updates={product_updates}
          new_product_updates={new_product_updates}
          showInfo={showInfo}
          setShowInfo={setShowInfo}
          teams={props.teams}
          team_id={props.team_id}
          team={props.team}
          fetchBoards={fetchBoards}
          team_setting={team_setting}
          setTeamSetting={setTeamSetting}
        />

        {LOCKED && (
          <div className="w-100 h-100 super-center position-absolute z-hard pb-5">
            <Alert color="danger" onClick={() => setTeamSetting('BILLING')} className="pointer text-center py-3">
              <h1>
                <i className="far fa-ban" />
              </h1>
              Your subscription has failed
              <br />
              Please update your payment to continue
            </Alert>
          </div>
        )}

        {EXPIRED && (
          <div className="w-100 h-100 super-center text-center position-absolute z-hard pb-5">
            <div>
              <h3>Your free trial has expired</h3>
              <div className="text-dull mt-3 mb-4">Please Upgrade to continue using Voiceflow</div>
              <Button isPrimary className="mb-4" onClick={() => setTeamSetting('CHECKOUT')}>
                Upgrade
              </Button>
              <div className="btn-link" onClick={() => downgrade()}>
                Downgrade to Personal
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <FullSpinner name="Projects" />
        ) : (
          <div
            id="dashboard"
            className={cn({ 'thanos-ed': LOCKED || EXPIRED })}
            onClickCapture={(e) => {
              // prevent all click events
              if (LOCKED || EXPIRED) {
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
                  <div className="text-muted mt-3 mb-2">This board has no projects yet, create one.</div>
                  <Link to="/team/template" className="no-underline super-center">
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
                        {_.map(props.boards_array, (board, idx) => (
                          <List
                            id={board.board_id}
                            key={board.board_id}
                            isNew={board.isNew}
                            index={idx}
                            name={board.name}
                            onRename={props.renameBoard}
                            onRemove={onDeleteBoard}
                            projects={getBoardFilteredProjects(board.projects, props.projectsMap, filter)}
                            onCopyProject={onCopyProject}
                            onDeleteProject={onDeleteProject(board.board_id)}
                            createSkill={onCreateProject}
                            onMove={props.changeListPosition}
                            onDrop={onSaveList}
                            onMoveProject={props.changeProjectPosition}
                            clearNewBoard={props.clearIsNewBoard}
                            onDropProject={onSaveList}
                            disableDragging={!!filter}
                          />
                        ))}

                        <DragLayer withMemo>
                          {(item) => {
                            if (item.dragType === 'dashboard-list') {
                              return <SimpleList {...item} />;
                            }
                            return <ListItem {...item} />;
                          }}
                        </DragLayer>

                        <div className="main-list-add">
                          <Tooltip distance={10} title="Add new list blah blah blah" position="bottom">
                            <IconButton
                              icon="addStep"
                              onClick={() => {
                                props.addBoard(props.team_id);
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
  user: state.account,
  projects: allProjectsSelector(state),
  projectsMap: projectsMapSelector(state),
  boards: state.board,
  boards_array: unnormalize(state.board),
});

const mapDispatchToProps = {
  removeTrial,
  fetchBoards,
  addBoard,
  deleteBoardProject,
  importProject,
  copyProject,
  setConfirm,
  setError,
  updateLists,
  removeBoard: deleteBoard,
  renameBoard: renameList,
  clearIsNewBoard: clearNewList,
  updateBoards,
  changeProjectPosition,
  changeListPosition,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashBoard);
