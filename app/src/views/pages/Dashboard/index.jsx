import _ from "lodash";
import React, { Component } from "react";
// import moment from 'moment'
// import 'react-table/react-table.css'
import { Link } from "react-router-dom";
import Masonry from "react-masonry-component";
import { Tooltip } from "react-tippy";
import "./DashBoard.css";
import axios from "axios";
import UpdatesModal from "./../../components/Modals/UpdatesModal";
import VoiceCards from "views/components/Cards/VoiceCards";
import EmptyCard from "views/components/Cards/EmptyCard";
import LoadingModal from "views/components/Modals/LoadingModal";
import TeamSettings from "./TeamSettings"
import { Alert, Input, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import { setConfirm, setError } from 'ducks/modal'
import { connect } from "react-redux";
import { Members } from 'views/components/User'
import {
  fetchProjects,
  deleteProject,
  copyProject,
} from "ducks/project";
import {
  getMembers,
} from "ducks/team";
import { unnormalize } from "ducks/util"

export class DashBoard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      filter_text: "",
      loading_modal: false,
      show_updates_modal: false
    };

    this.openProject = this.openProject.bind(this);
    this.deleteProject = this.deleteProject.bind(this);
    this.toggleUpdatesModal = this.toggleUpdatesModal.bind(this);
    this.renderProjects = this.renderProjects.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.copyProject = this.copyProject.bind(this);
    this.newProject = this.newProject.bind(this)
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  copyProject(project_id) {
    if(this.props.projects_array.length >= this.props.team.projects) {
      return this.props.setError("Upgrade Plan to Create More Projects")
    }
    this.setState({ loading_modal: true });
    this.props.copyProject(project_id, this.props.team_id).then(() => {
      this.setState({ loading_modal: false });
    });
  }

  deleteProject(project_id, project_name) {
    this.props.setConfirm({
      text: (
        <Alert color="danger" className="mb-0">
          WARNING: This action can not be undone, <i>{project_name}</i> and
          all flows can not be recovered
        </Alert>
      ),
      warning: true,
      confirm: () => {
        this.props.deleteProject(project_id);
        this.setState({ confirm: null });
      }
    });
  }

  openProject(project_id, diagram) {
    let project = this.props.projects.byId[project_id]
    if(!project) return

    let skill_id = project.skill_id
    setTimeout(() => {
      this.props.history.push(`/canvas/${skill_id}/${diagram}`);
    }, 100);
  }

  componentDidUpdate(prevProps) {
    if(prevProps.team_id !== this.props.team_id){
      this.updateTeam()
    }
  }

  updateTeam() {
    this.props.getMembers(this.props.team_id)
    .then(() => {
      if(["LOCKED", "WARNING"].includes(this.props.team.state)){
        this.setState({team_settings: "BILLING"})
      } else {
        this.setState({team_settings: false})
      }
    })
    .catch(() => { throw new Error("Can't Retrieve Members") })
    // ensure team hasn't changed
    this.setState({loading: true})
    this.props.fetchProjects(this.props.team_id).then(() => {
      this.setState({loading: false})
    })
  }

  componentDidMount() {
    this.updateTeam()

    let last_update_seen = localStorage.getItem(
      "last_update_seen_" + this.props.user.id
    )

    if (!last_update_seen) {
      last_update_seen = Date.now();
    } else {
      last_update_seen = parseInt(last_update_seen);
    }

    axios
      .get(`/product_updates/${last_update_seen}`)
      .then(res => {
        if (res.data.length > 0) {
          this.setState({
            show_updates_modal: true,
            product_updates: res.data
          });
        }
        last_update_seen = Date.now();
        localStorage.setItem(
          "last_update_seen_" + this.props.user.id,
          last_update_seen
        );
      })
      .catch(err => {
        console.error(err);
      });
  }

  toggleEnv() {
    this.setState({
      openEnv: !this.state.openEnv
    });
  }

  toggleUpdatesModal() {
    this.setState(prev_state => ({
      show_updates_modal: !prev_state.show_updates_modal
    }));
  }

  newProject() {
    if(this.props.projects_array.length >= this.props.team.projects) {
      this.setState({team_settings: "BILLING"})
    } else { 
      this.props.history.push(`/team/template`)
    }
  }

  renderProjects() {
    const filtered_projects = this.state.filter_text.trim()
      ? this.props.projects_array.filter(p =>
          p.name.toLowerCase().includes(this.state.filter_text.toLowerCase())
        )
      : this.props.projects_array;
    return (
      <React.Fragment>
        <Masonry elementType="div" className="skills-container">
          {filtered_projects.map((project, i) => {
            let icon;
            let smallIcon = project.small_icon;
            let largeIcon = project.large_icon;
            if (!_.isNull(largeIcon)) {
              icon = largeIcon;
            } else if (!_.isNull(smallIcon)) {
              icon = smallIcon;
            }

            let name = project.name.match(/\b(\w)/g);
            if (name) {
              name = name.join("");
            } else {
              name = project.name;
            }
            name = name.substring(0, 3);

            return (
              <VoiceCards
                key={i}
                id={project.project_id}
                icon={icon}
                name={project.name}
                placeholder={
                  <div className="no-image card-image">
                    <h1>{name}</h1>
                  </div>
                }
                onDelete={this.deleteProject}
                onCopy={this.copyProject}
                deleteLabel="Delete Project"
                copyLabel="Copy Project"
                onClick={this.openProject}
                extension={project.diagram}
                buttonLabel="Edit Project"
              />
            );
          })}
          { this.props.projects_array.length >= this.props.team.projects ?
            <div className="empty-card update-card text-center">
              <div onClick={this.newProject} className="d-block pt-4">
              <img src={'/upgrade-projects.svg'} className="mt-4 mb-2" width="65" alt="upgrade"></img><br/>
                <label className="dark">
                  Project Limit Reached</label>
                  <div className="text-muted">Upgrade to a paid plan <br></br> for unlimited projects</div>
              </div>
            </div> :
            <EmptyCard onClick={this.newProject} />
          }
        </Masonry>
      </React.Fragment>
    );
  }

  render() {
    const LOCKED = (this.props.team.state === "LOCKED")

    return (
      <>
        <LoadingModal open={this.state.loading_modal} />
        <div id="secondary-nav">
          <div>
            {this.props.teams.allIds.map(team_id => {
              const team = this.props.teams.byId[team_id]
              if(team.team_id === this.props.team_id){
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
            {this.props.teams.allIds.length < 3 && (
              <Link className="nav-item" to="/team/new">
                <img src={'/add-board.svg'} className="mr-1 mb-1" height={15} width={15} alt="add"/> New Board
              </Link>
            )}
          </div>
          <div className="mr-4 super-center">
            {this.props.team && <>
              <Members members={this.props.team.members} update={(setting) => this.setState({team_settings: setting})}/>
              <TeamSettings
                open={this.state.team_settings}
                update={(setting) => this.setState({team_settings: setting})}
                close={() => this.setState({team_settings: false})}
              />
            </>}
          </div>
        </div>
        <div className="title-group no-select pr-2">
          <div className="subheader-right">
            <UncontrolledDropdown>
              <DropdownToggle className="ml-1 mr-4" tag="div">
                <Tooltip
                  distance={19}
                  title="Resources"
                  position="bottom"
                >
                  <button className="dropdown-button-border" type="submit">
                  </button>
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
            <button className="btn-primary ml-1" onClick={this.newProject}>
              New Project
            </button>
          </div>
        </div>
        <div id="app" className="secondary-padding dashboard">
          <UpdatesModal
            show_update_modal={this.state.show_updates_modal}
            toggle={this.toggleUpdatesModal}
            product_updates={this.state.product_updates}
          />
          <div id="navbar-top-left">
            <div className="searchBar ml-3">
              <Input
                name="filter_text"
                className="search-input form-control-2"
                placeholder="Search Projects"
                onChange={this.handleChange}
              />
            </div>
          </div>
          {this.state.loading && (
            <div id="loading-diagram">
              <div className="text-center">
                <h5 className="text-muted mb-2">Loading Projects...</h5>
                <span className="loader" />
              </div>
            </div>
          )}
          { LOCKED && <div className="w-100 h-100 super-center position-absolute z-hard">
            <Alert 
              color="danger" 
              onClick={() => this.setState({team_settings: "BILLING"})} 
              className="pointer text-center py-3">
              <h1><i className="far fa-ban"/></h1>
              Your subscription has failed<br/>
              Please update your payment to continue
            </Alert>
          </div> }
          <div 
            className={ "w-100 h-100"  + (LOCKED ? " disabled" : "")}
            onClick={(e) => {
              // prevent all click events
              if(LOCKED){
                e.preventDefault()
                return false
              }
            }}
          >
            {!this.state.loading && this.props.projects_array.length === 0 ? (
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
              <div className="pb-5 pt-4 container">{this.renderProjects()}</div>
            )}
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = state => ({
  user: state.account,
  projects_array: unnormalize(state.project),
  projects: state.project
});

const mapDispatchToProps = dispatch => {
  return {
    fetchProjects: team_id => dispatch(fetchProjects(team_id)),
    deleteProject: project_id => dispatch(deleteProject(project_id)),
    copyProject: (project_id, team_id) => dispatch(copyProject(project_id, team_id)),
    setConfirm: confirm => dispatch(setConfirm(confirm)),
    getMembers: team_id => dispatch(getMembers(team_id)),
    setError: err => dispatch(setError(err))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashBoard);
