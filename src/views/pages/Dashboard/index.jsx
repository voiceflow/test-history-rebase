import _ from "lodash";
import React, { useState, useEffect } from "react";
import { ScrollContextProvider } from "contexts";
// import moment from 'moment'
import { useScrollHelpers } from 'hooks/scroll';
// import 'react-table/react-table.css'
import Header from "components/Header";
import { Link } from "react-router-dom";
import { Tooltip } from "react-tippy";
import "./DashBoard.css";
import axios from "axios";
import UpdatesModal from "./../../components/Modals/UpdatesModal";
import LoadingModal from "views/components/Modals/LoadingModal";
import TeamSettings from "./TeamSettings"
import UpdatesPopover from './UpdatesPopover'
import { Alert, Input, Popover, PopoverBody } from "reactstrap";
import { setConfirm, setError } from 'ducks/modal'
import { connect } from "react-redux";
import { Members } from 'views/components/User'
import ExpiryButton from './ExpiryButton'
import List from './components/List'

import {
  fetchProjects,
  deleteProject,
  copyProject,
  updateProjects
} from "ducks/project";
import {
    fetchBoards,
    addBoard,
    updateBoards,
    updateLists,
    deleteBoard,
    renameList,
} from 'ducks/board';
import {
  getMembers,
} from "ducks/team";
import cn from 'classnames'
import { unnormalize } from "ducks/_normalize"

export const DashBoard = props => {
  const [loading, toggleLoading]  = useState(true)
  const [filter_text, handleFilterText] = useState("")
  const [loading_modal, toggleLoadingModal] = useState(false)
  const [show_updates_modal, toggleShowUpdatesModal] = useState(false)
  const [team_setting, setTeamSetting] = useState(null)
  const [product_updates, setProductUpdates] = useState([])
  const { bodyRef, innerRef, scrollHelpers } = useScrollHelpers();
  const [updates_open, toggleUpdatesOpen] = useState(false)

  const copyProject = (project_id, board_id=null) => {
    if(props.projects_array.length >= props.team.projects) {
      return props.setError("Upgrade Plan to Create More Projects")
    }
    toggleLoadingModal(true)
    props.copyProject(project_id, props.team_id, board_id).then(() => {
      toggleLoadingModal(false)
    });
  }

  const deleteProject = (project_id, project_name) => {
    props.setConfirm({
      text: (
        <Alert color="danger" className="mb-0">
          WARNING: This action can not be undone, <i>{project_name}</i> and
          all flows can not be recovered
        </Alert>
      ),
      warning: true,
      confirm: () => {
        props.deleteProject(project_id);
      }
    });
  }

  const deleteBoard = (board_id) => {
      let board = props.boards.byId[board_id]
      props.setConfirm({
          text: (
            <Alert color="danger" className="mb-0">
            WARNING: This action can not be undone, <i>{board.name}</i> and
            all {board.projects.length} projects can not be recovered
            </Alert>
        ),
        warning: true,
        confirm: () => {
            props.removeBoard(board_id);
        }
      })
  }
  useEffect(() => {
      updateTeam()
  }, [props.team_id])

  const updateTeam = () => {
    props.getMembers(props.team_id)
    .then(() => {
      if(["LOCKED", "WARNING"].includes(props.team.state)){
        setTeamSetting("BILLING")
      } else {
        setTeamSetting(false)
      }
    })
    .catch(() => { throw new Error("Can't Retrieve Members") })
    // ensure team hasn't changed
    toggleLoading(true)
    props.fetchProjects(props.team_id).then(() => {
      props.fetchBoards(props.team_id).then(() => {
          toggleLoading(false)
      })
    })
  }

  useEffect(() => {
      updateTeam()

    axios
      .get(`/product_updates`)
      .then(res => {
        if (res.data.length > 0) {
          setProductUpdates(res.data)
        }
      })
      .catch(err => {
        console.error(err);
      });
  }, [])

  useEffect(() => {
        return () => {
            props.updateLists(props.team_id)
        }
    }, [])

  const newProject = (id) => {
    if(props.projects_array.length >= props.team.projects) {
      setTeamSetting("CHECKOUT")
    } else { 
        props.history.push(id ? `/team/template/${id}` : '/team/template')
    }
  }

  const reorder = (dragIndex, hoverIndex, dragId, hoverId) => {
      if (dragId && hoverId) {
          const projects = props.projects.allIds;
          const dragIdx = _.findIndex(projects, p => p === dragId)
          const hoverIdx = _.findIndex(projects, p => p === hoverId)
          const drag = projects[dragIdx]
          projects.splice(dragIdx, 1);
          projects.splice(hoverIdx, 0, drag);
          props.updateProjects(props.projects);
      } else {
          const projects = props.projects.allIds
          const drag = projects[dragIndex]

          projects.splice(dragIndex, 1)
          projects.splice(hoverIndex, 0, drag)
          props.updateProjects(props.projects);
      }
    }

    const reorderList = (dragIndex, hoverIndex) => {
        const lists = props.boards.allIds
        const drag = lists[dragIndex]

        lists.splice(dragIndex, 1)
        lists.splice(hoverIndex, 0, drag);
        props.updateBoards(props.boards)
        props.updateLists(props.team_id);
    }

    const LOCKED = (props.team.state === "LOCKED")
    const EXPIRED = (props.team.state === "EXPIRED")
      const filtered_projects = filter_text.trim()
          ? props.projects_array.filter(p =>
              p.name.toLowerCase().includes(filter_text.toLowerCase())
          )
          : props.projects_array;
      let board_projects = [];
      _.forEach(props.boards_array, board => {
          board_projects = board_projects.concat(board.projects)
      })
      const default_projects = _.filter(filtered_projects, project => {
          return !_.includes(board_projects, project.project_id)
      })
    return (
      <>
        <ExpiryButton team={props.team} upgrade={()=>setTeamSetting('CHECKOUT')}/>
        <LoadingModal open={loading_modal} />
        <div id="app" className="dashboard">
          <UpdatesModal
            show_update_modal={show_updates_modal}
            toggle={() => toggleShowUpdatesModal(!props.show_updates_modl)}
            product_updates={product_updates}
          />
          <Header
            history={props.history}
            leftRenderer={() => (
                <>
                    <Link to="/dashboard" className="mx-2">
                        <img className='voiceflow-logo mt-1' src={'/favicon.png'} alt='logo'
                            height="30" width="40"
                        />
                    </Link>
                    <div className="searchBar ml-3">
                        <Input
                            name="filter_text"
                            className="search-input form-control-2"
                            placeholder="Search Projects"
                            onChange={e => handleFilterText(e.target.value)}
                        />
                    </div>
                </>
            )}
            rightRenderer={() => (
                <div className="title-group no-select pr-2">
                    <div className="subheader-right mr-2">
                      <button className="dropdown-button-border" id="update-popup" type="button" onClick={() => toggleUpdatesOpen(!updates_open)}>
                        <i className="fas fa-bell"></i>
                      </button>
                      <Popover 
                        className="updates-popover-container" 
                        placement="bottom" 
                        isOpen={updates_open} 
                        target="update-popup" 
                        toggle={() => toggleUpdatesOpen(!updates_open)}>
                        <PopoverBody>
                          <UpdatesPopover product_updates={product_updates}/>
                        </PopoverBody>
                      </Popover>
                    </div>
                    <div className="subheader-right ml-2">
                        <Tooltip
                            distance={16}
                            title="Join the Voiceflow forum for help and updates"
                            position="bottom"
                            className="ml-1 mr-4"
                        >
                            <form action="https://forum.getvoiceflow.com">
                                <button id="icon-resources" className="nav-btn-border mt-1" type="submit"></button>
                            </form>
                        </Tooltip>
                    </div>
                </div>
            )}
            subHeaderRenderer={() => (
                <div id="secondary-nav">
                    <div>
                        {props.teams.allIds.map(team_id => {
                        const team = props.teams.byId[team_id]
                        if(team.team_id === props.team_id){
                            return <div key={team.team_id} className="nav-item active">
                            {team.name}
                            </div>
                        }
                        return (
                            <Link
                            key={team.team_id}
                            className="nav-item"
                            to={`/team/${team.team_id}`}
                            >
                            {team.name}
                            </Link>
                        );
                        })}
                        {props.teams.allIds.length < 3 && (
                        <Link className="nav-item" to="/team/new">
                            <img src={'/add-board.svg'} className="mr-1 mb-1" height={15} width={15} alt="add"/> New Board
                        </Link>
                        )}
                    </div>
                    <div className="mr-4 super-center">
                        {props.team && <>
                        <Members members={props.team.members} update={(setting) => setTeamSetting(setting)}/>
                        <TeamSettings
                            open={team_setting}
                            update={(setting) => setTeamSetting(setting)}
                            close={() => setTeamSetting(false)}
                        />
                        </>}
                    </div>
                </div>
            )}
        />
          {loading && (
            <div id="loading-diagram">
              <div className="text-center">
                <h5 className="text-muted mb-2">Loading Projects...</h5>
                <span className="loader" />
              </div>
            </div>
          )}
          { LOCKED && <div className="w-100 h-100 super-center position-absolute z-hard pb-5">
            <Alert 
              color="danger" 
              onClick={() => setTeamSetting("BILLING")} 
              className="pointer text-center py-3">
              <h1><i className="far fa-ban"/></h1>
              Your subscription has failed<br/>
              Please update your payment to continue
            </Alert>
          </div> }
          { EXPIRED && <div className="w-100 h-100 super-center text-center position-absolute z-hard pb-5">
            <div>
              <h3>Your free trial has expired</h3>
              <div className="text-dull mt-3 mb-4">Please Upgrade to continue using Voiceflow</div>
              <button className="btn-primary mb-5" onClick={()=>this.setState({team_settings: 'CHECKOUT'})}>Upgrade Plan</button>
            </div>
          </div>}
          <div 
            className={cn("w-100 h-100", {"thanos-ed": (LOCKED || EXPIRED)})}
            onClickCapture={(e) => {
              // prevent all click events
              if(LOCKED || EXPIRED){
                e.preventDefault()
                e.stopPropagation()
                return false
              }
            }}
          >
            {!loading && props.projects_array.length === 0 ? (
              <div className="h-100 d-flex justify-content-center">
                <div className="align-self-center">
                  <div className="text-center">
                    <img
                      src="/create.svg"
                      alt="skill-icon"
                      width="100"
                      height="127"
                      className="mb-1"
                    />
                  </div>
                  <label className="dark text-center">No Projects Found</label>
                  <div className="text-muted mt-3 mb-2">This board has no projects yet, create one.</div>
                  <Link
                    to={`/team/template`}
                    className="no-underline super-center"
                  >
                    <button
                      className="btn-primary mt-3"
                      id="createskill"
                    >
                      New Project
                    </button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="board-container-body">
                    <div className="board-container-body-inner">
                    <ScrollContextProvider value={scrollHelpers}>
                        <div ref={bodyRef} className="main-lists">
                            <div ref={innerRef} className="main-lists-inner">
                                <List
                                    disableDragging
                                    name="Default List"
                                    projects={default_projects}
                                    onDuplicateSkill={copyProject}
                                    onRemoveSkill={deleteProject}
                                    onRenameSkill={() => { }}
                                    createSkill={newProject}
                                    itemReorder={reorder}
                                />
                                {_.map(props.boards_array, (board, idx) => {
                                    return (
                                        <List
                                            id={board.board_id}
                                            key={board.board_id}
                                            index={idx}
                                            name={board.name}
                                            onRename={props.renameBoard}
                                            onRemove={() => deleteBoard(board.board_id)}
                                            projects={_.filter(filtered_projects, p => _.includes(board.projects, p.project_id))}
                                            onDuplicateSkill={copyProject}
                                            onRemoveSkill={deleteProject}
                                            onRenameSkill={() => {}}
                                            createSkill={newProject}
                                            reorder={reorderList}
                                            itemReorder={reorder}
                                        />
                                    );
                                })}
                                <div className="main-list-add">
                                    <Tooltip
                                        distance={16}
                                        title="Add new list"
                                        position="bottom"
                                        className="ml-1 mr-4"
                                    >
                                        <button
                                            onClick={() => {
                                                props.addBoard(props.team_id)
                                            }}
                                            className="nav-btn-border mt-1 add-button"
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
        </div>
      </>
    );
}

const mapStateToProps = state => ({
  user: state.account,
  projects_array: unnormalize(state.project),
  projects: state.project,
  boards: state.board,
  boards_array: unnormalize(state.board),
});

const mapDispatchToProps = dispatch => {
  return {
    fetchProjects: team_id => dispatch(fetchProjects(team_id)),
    fetchBoards: team_id => dispatch(fetchBoards(team_id)),
    addBoard: team_id => dispatch(addBoard(team_id)),
    deleteProject: project_id => dispatch(deleteProject(project_id)),
    copyProject: (project_id, team_id, board_id) => dispatch(copyProject(project_id, team_id, board_id)),
    setConfirm: confirm => dispatch(setConfirm(confirm)),
    getMembers: team_id => dispatch(getMembers(team_id)),
    setError: err => dispatch(setError(err)),
    updateLists: (team_id) => dispatch(updateLists(team_id)),
    removeBoard: (board_id) => dispatch(deleteBoard(board_id)),
    renameBoard: (board_id, new_name) => dispatch(renameList(board_id, new_name)),
    updateBoards: (boards) => dispatch(updateBoards(boards)),
    updateProjects: projects => dispatch(updateProjects(projects))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashBoard);
