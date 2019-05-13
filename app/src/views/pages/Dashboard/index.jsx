import _ from "lodash";
import React, { useState, useEffect } from "react";
import { ScrollContextProvider } from "contexts";
import cn from 'classnames';
import { Link } from "react-router-dom";
import { Tooltip } from "react-tippy";
import axios from "axios";
import {
    Alert,
    Input,
    Popover,
    PopoverBody,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from "reactstrap";
import { connect } from "react-redux";

import { useScrollHelpers } from 'hooks/scroll';

import Header from "components/Header";
import List, { List as SimpleList } from "./components/List";
import { Item as ListItem } from "./components/Item";
import { Members } from 'views/components/User'
import UpdatesModal from "./../../components/Modals/UpdatesModal";
import LoadingModal from "views/components/Modals/LoadingModal";
import Button from 'components/Button'
import DragLayer from 'components/DragLayer';
import ExpiryButton from './ExpiryButton'

import TeamSettings from "./TeamSettings"
import UpdatesPopover from './UpdatesPopover'

import {
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
    changeProjectPosition,
    changeListPosition
} from 'ducks/board';
import {
  getMembers,
} from "ducks/team";
import { setConfirm, setError } from 'ducks/modal'
import { unnormalize } from "ducks/_normalize"

import "./DashBoard.css";
const filter_projects = (projects, filter) => {
  const filtered = {}
  projects.allIds.forEach(p => {
    if(projects.byId[p].name.toLowerCase().includes(filter)){
      filtered[p] = projects.byId[p]
    }
  })
  return filtered
}

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
    if(props.projects.allIds.length >= props.team.projects) {
      return setTeamSetting("CHECKOUT:PROJECTS")
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
  let fetchBoards;
  const deleteBoard = (board_id) => {
      let board = props.boards.byId[board_id]
      props.setConfirm({
          text: (
            <Alert color="danger" className="mb-0">
            WARNING: This action can not be undone, <i>{board.name}</i> and
            all {!!board.projects && board.projects.length} projects can not be recovered
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
    fetchBoards = props.fetchBoards(props.team_id).then(() => {
        toggleLoading(false)
        fetchBoards = null;
    })
  }

  useEffect(() => {
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

  const newProject = (id) => {
    if(props.projects.allIds.length >= props.team.projects) {
      setTeamSetting("CHECKOUT:PROJECTS")
    } else { 
      props.history.push(id !== 'initial' ? `/team/template/${id}` : '/team/template')
    }
  }

    const LOCKED = (props.team.state === "LOCKED")
    const EXPIRED = (props.team.state === "EXPIRED")

    const filter = filter_text.trim().toLowerCase()

    const filtered_projects = filter
        ? filter_projects(props.projects, filter)
        : props.projects.byId;

    const saveList = () => props.updateLists(props.team_id)

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
            withLogo
            history={props.history}
            leftRenderer={() => (
                <div className="searchBar ml-3">
                    <Input
                        name="filter_text"
                        className="search-input form-control-2"
                        placeholder="Search Projects"
                        onChange={e => handleFilterText(e.target.value)}
                    />
                </div>
            )}
            rightRenderer={() => (
                <div className="title-group no-select pr-2">
                    <div className="subheader-right mr-2">
                      <Button className={cn("dropdown-button-border", {active: updates_open})} id="update-popup" type="button" onClick={() => toggleUpdatesOpen(!updates_open)} />
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
                        <UncontrolledDropdown>
                            <DropdownToggle className="ml-1" tag="div">
                                <Tooltip
                                    distance={19}
                                    title="Resources"
                                    position="bottom"
                                >
                                    <Button className="dropdown-button-border info" type="submit" />
                                </Tooltip>
                            </DropdownToggle>
                            <DropdownMenu className="mt-2">
                                <a href="https://university.getvoiceflow.com/" target='_blank' rel='noopener noreferrer'>
                                    <DropdownItem>University</DropdownItem>
                                </a>
                                <a href="https://www.youtube.com/channel/UCbqUIYQ7J2rS6C_nk4cNTxQ/videos" target='_blank' rel='noopener noreferrer'>
                                    <DropdownItem>Youtube</DropdownItem>
                                </a>
                                <a href="https://www.facebook.com/groups/voiceflowgroup/" target='_blank' rel='noopener noreferrer'>
                                    <DropdownItem>Community</DropdownItem>
                                </a>
                                <a href="https://forum.getvoiceflow.com/" target='_blank' rel='noopener noreferrer'>
                                    <DropdownItem>Forums</DropdownItem>
                                </a>
                            </DropdownMenu>
                        </UncontrolledDropdown>
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
                            onClick={() => fetchBoards && fetchBoards.abort()}
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
              <Button isPrimary className="mb-5" onClick={()=>this.setState({team_settings: 'CHECKOUT'})}>Upgrade Plan</Button>
            </div>
          </div>}
          <div 
            id="dashboard"
            className={cn({"thanos-ed": (LOCKED || EXPIRED)})}
            onClickCapture={(e) => {
              // prevent all click events
              if(LOCKED || EXPIRED){
                e.preventDefault()
                e.stopPropagation()
                return false
              }
            }}
          >
            {!loading && props.projects.allIds.length === 0 ? (
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
                    <Button
                      isPrimary
                      className="mt-3"
                      id="createskill"
                    >
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
                                    index={idx}
                                    name={board.name}
                                    onRename={props.renameBoard}
                                    onRemove={() => deleteBoard(board.board_id)}
                                    projects={board.projects.map(p => filtered_projects[p])}
                                    onCopyProject={copyProject}
                                    onDeleteProject={deleteProject}
                                    createSkill={newProject}
                                    onMove={props.changeListPosition}
                                    onDrop={saveList}
                                    onMoveProject={props.changeProjectPosition}
                                    onDropProject={saveList}
                                    disableDragging={!!filter}
                                  />
                                ))}
                                <DragLayer withMemo>
                                  {item => {
                                    if (item.dragType === 'dashboard-list') {
                                      return <SimpleList {...item} />;
                                    }
                                    return <ListItem {...item} />;
                                  }}
                                </DragLayer>
                                <div className="main-list-add">
                                    <Tooltip
                                        distance={16}
                                        title="Add new list"
                                        position="bottom"
                                        className="ml-1 mr-4"
                                    >
                                        <Button
                                            onClick={() => {
                                                props.addBoard(props.team_id)
                                            }}
                                            isNavBordered
                                            className="mt-1 add-button"
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
  projects: state.project,
  boards: state.board,
  boards_array: unnormalize(state.board),
});

const mapDispatchToProps = dispatch => {
  return {
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
    updateProjects: projects => dispatch(updateProjects(projects)),
    changeProjectPosition: (drag, hover) => dispatch(changeProjectPosition(drag, hover)),
    changeListPosition: (drag, hover) => dispatch(changeListPosition(drag, hover))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashBoard);
