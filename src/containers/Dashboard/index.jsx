import './DashBoard.css';

import axios from 'axios';
import cn from 'classnames';
import _ from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Tooltip } from 'react-tippy';
import { Alert } from 'reactstrap';

import Button from '@/components/Button';
import RoundButton from '@/components/Button/RoundButton';
import DragLayer from '@/components/DragLayer';
import LoadingModal from '@/components/Modals/LoadingModal';
import UpdatesModal from '@/components/Modals/UpdatesModal';
import { FullSpinner } from '@/components/Spinner';
import { ScrollContextProvider } from '@/contexts';
import { unnormalize } from '@/ducks/_normalize';
import {
  addBoard,
  changeListPosition,
  changeProjectPosition,
  clearNewList,
  deleteBoard,
  fetchBoards,
  renameList,
  updateBoards,
  updateLists,
} from '@/ducks/board';
import { setConfirm, setError } from '@/ducks/modal';
import { copyProject, deleteProject, updateProjects } from '@/ducks/project';
import { getMembers, removeTrial } from '@/ducks/team';
import { useScrollHelpers } from '@/hooks/scroll';

import ExpiryButton from './ExpiryButton';
import DashboardHeader from './Header';
import { Item as ListItem } from './components/Item';
import List, { List as SimpleList } from './components/List';

const filter_projects = (projects, filter) => {
  const filtered = {};
  projects.allIds.forEach((p) => {
    if (projects.byId[p].name.toLowerCase().includes(filter)) {
      filtered[p] = projects.byId[p];
    }
  });
  return filtered;
};

export const DashBoard = (props) => {
  const [loading, toggleLoading] = useState(true);
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

  const copyProject = (project_id, board_id = null) => {
    if (props.projects.allIds.length >= props.team.projects) {
      return setTeamSetting('CHECKOUT:PROJECTS');
    }
    toggleLoadingModal(true);
    props.copyProject(project_id, props.team_id, board_id).then(() => {
      toggleLoadingModal(false);
    });
  };

  const deleteProject = (project_id, project_name) => {
    props.setConfirm({
      text: (
        <Alert color="danger" className="mb-0">
          WARNING: This action can not be undone, <i>{project_name}</i> and all flows can not be recovered
        </Alert>
      ),
      warning: true,
      confirm: () => {
        props.deleteProject(project_id);
      },
    });
  };
  let fetchBoards;
  const deleteBoard = (board_id) => {
    const board = props.boards.byId[board_id];
    props.setConfirm({
      text: (
        <Alert color="danger" className="mb-0">
          WARNING: This action can not be undone, <i>{board.name}</i> and all {!!board.projects && board.projects.length} projects can not be
          recovered
        </Alert>
      ),
      warning: true,
      confirm: () => {
        props.removeBoard(board_id);
      },
    });
  };
  const updateTeam = () => {
    props
      .getMembers(props.team_id)
      .then(() => {
        if (['LOCKED', 'WARNING'].includes(props.team.state)) {
          setTeamSetting('BILLING');
        } else {
          setTeamSetting(false);
        }
      })
      .catch(() => {
        throw new Error("Can't Retrieve Members");
      });
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

  const newProject = (id) => {
    if (props.projects.allIds.length >= props.team.projects) {
      setTeamSetting('CHECKOUT:PROJECTS');
    } else {
      props.history.push(id !== 'initial' ? `/team/template/${id}` : '/team/template');
    }
  };

  const LOCKED = props.team.state === 'LOCKED';
  const EXPIRED = props.team.state === 'EXPIRED';

  const filter = filter_text.trim().toLowerCase();

  const filtered_projects = filter ? filter_projects(props.projects, filter) : props.projects.byId;

  const saveList = () => props.updateLists(props.team_id);

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
                Upgrade Plan
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
            {props.projects.allIds.length === 0 ? (
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
                            onRemove={() => deleteBoard(board.board_id)}
                            projects={board.projects.map((p) => filtered_projects[p])}
                            onCopyProject={copyProject}
                            onDeleteProject={deleteProject}
                            createSkill={newProject}
                            onMove={props.changeListPosition}
                            onDrop={saveList}
                            onMoveProject={props.changeProjectPosition}
                            clearNewBoard={props.clearIsNewBoard}
                            onDropProject={saveList}
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
                          <Tooltip distance={10} title="Add new list" position="bottom">
                            <RoundButton
                              variant="shadow"
                              icon="addStep"
                              onClick={() => {
                                props.addBoard(props.team_id);
                              }}
                              imgSize={13}
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
  projects: state.project,
  boards: state.board,
  boards_array: unnormalize(state.board),
});

const mapDispatchToProps = (dispatch) => {
  return {
    removeTrial: (team_id) => dispatch(removeTrial(team_id)),
    fetchBoards: (team_id) => dispatch(fetchBoards(team_id)),
    addBoard: (team_id) => dispatch(addBoard(team_id)),
    deleteProject: (project_id) => dispatch(deleteProject(project_id)),
    copyProject: (project_id, team_id, board_id) => dispatch(copyProject(project_id, team_id, board_id)),
    setConfirm: (confirm) => dispatch(setConfirm(confirm)),
    getMembers: (team_id) => dispatch(getMembers(team_id)),
    setError: (err) => dispatch(setError(err)),
    updateLists: (team_id) => dispatch(updateLists(team_id)),
    removeBoard: (board_id) => dispatch(deleteBoard(board_id)),
    renameBoard: (board_id, new_name) => dispatch(renameList(board_id, new_name)),
    clearIsNewBoard: (board_id) => dispatch(clearNewList(board_id)),
    updateBoards: (boards) => dispatch(updateBoards(boards)),
    updateProjects: (projects) => dispatch(updateProjects(projects)),
    changeProjectPosition: (drag, hover) => dispatch(changeProjectPosition(drag, hover)),
    changeListPosition: (drag, hover) => dispatch(changeListPosition(drag, hover)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashBoard);
