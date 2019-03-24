import _ from "lodash";
import React, { Component } from "react";
// import moment from 'moment'
// import 'react-table/react-table.css'
import { Link } from "react-router-dom";
import Masonry from "react-masonry-component";
import { Tooltip } from "react-tippy";
import "./DashBoard.css";
import axios from "axios";
import ConfirmModal from "./../../components/Modals/ConfirmModal";
import WarningModal from "./../../components/Modals/WarningModal";
import UpdatesModal from "./../../components/Modals/UpdatesModal";
import VoiceCards from "views/components/Cards/VoiceCards";
import EmptyCard from "views/components/Cards/EmptyCard";
import LoadingModal from "views/components/Modals/LoadingModal";
import { Alert, Input } from "reactstrap";
import { setConfirm, setError } from 'actions/modalActions'
import { connect } from "react-redux";
import {
  fetchProjects,
  fetchTeams,
  deleteProject,
  copyProject,
  updateTeam
} from "actions/projectsActions";

// const FILTER_OPTIONS = ["All", "Published", "Development"];

const getTeamFromURL = (computedMatch) => {
  return computedMatch && computedMatch.params && computedMatch.params.team_id
}

class DashBoard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      confirm: false,
      error: null,
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
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  copyProject(project_id) {
    this.setState({ loading_modal: true });
    this.props.copyProject(project_id).then(() => {
      this.setState({ loading_modal: false });
    });
  }

  deleteProject(skill_id, project_name) {
    let project = this.props.projects.find(p => p.skill_id === skill_id)
    if(!project) return
    console.log("FOUND")
    let project_id = project.project_id
    this.setState({
      confirm: {
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
      }
    });
  }

  openProject(project, diagram) {
    setTimeout(() => {
      this.props.history.push(`/canvas/${project}/${diagram}`);
    }, 100);
  }

  componentDidUpdate() {
    const new_team = getTeamFromURL(this.props.computedMatch)
    if(this.props.team_id !== new_team){
      this.props.updateTeam(new_team)
    }
  }

  componentDidMount() {
    this.props.fetchTeams().then(() => {
      if(this.props.teams.length > 0){
        this.props.updateTeam(getTeamFromURL(this.props.computedMatch) || this.props.teams[0].team_id)
      }
    })

    let last_update_seen = localStorage.getItem(
      "last_update_seen_" + window.user_detail.id
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
          "last_update_seen_" + window.user_detail.id,
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

  renderProjects() {
    const filtered_projects = this.state.filter_text.trim()
      ? this.props.projects.filter(p =>
          p.name.toLowerCase().contains(this.state.filter_text.toLowerCase())
        )
      : this.props.projects;
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
                id={project.skill_id}
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
          <EmptyCard onClick={() => this.props.history.push(`/templates`)} />
        </Masonry>
      </React.Fragment>
    );
  }

  render() {
    return (
      <>
        <LoadingModal open={this.state.loading_modal} />
        <div id="secondary-nav">
          <div>
            <div className="nav-item">Personal</div>
            {this.props.teams.map(team => {
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
            {this.props.teams.length < 3 && (
              <Link className="nav-item" to="/team/new">
                <i className="fal fa-plus" /> New Team
              </Link>
            )}
          </div>
        </div>
        <div id="app" className="secondary-padding dashboard">
          <UpdatesModal
            show_update_modal={this.state.show_updates_modal}
            toggle={this.toggleUpdatesModal}
            product_updates={this.state.product_updates}
          />
          <div id="navbar-top-left">
            <div className="searchBar ml-4">
              <Input
                name="filter_text"
                className="search-input form-control-2"
                placeholder="Search Projects"
                onChange={this.handleChange}
              />
            </div>
          </div>
          <div className="title-group no-select pr-2">
            <div className="subheader-right">
              <Tooltip
                distance={16}
                title="Join the Voiceflow forum for help and updates"
                position="bottom"
                className="ml-1 mr-4"
              >
                <form action="https://forum.getvoiceflow.com">
                  <button className="nav-btn" type="submit">
                    <i className="fas fa-info-circle" />
                  </button>
                </form>
              </Tooltip>
              <Link to="/templates" className="no-underline ml-1">
                <button varient="contained" className="btn purple-btn">
                  New Project
                </button>
              </Link>
            </div>
          </div>
          <ConfirmModal
            confirm={this.state.confirm}
            toggle={() => this.setState({ confirm: null })}
          />
          <WarningModal
            error={this.state.error}
            dismiss={() => this.setState({ error: null })}
          />
          {this.props.loading && (
            <div id="loading-diagram">
              <div className="text-center">
                <h5 className="text-muted mb-2">Loading Projects</h5>
                <span className="loader" />
              </div>
            </div>
          )}
          {!this.props.loading && this.props.projects.length === 0 ? (
            <div className="h-100 d-flex justify-content-center">
              <div className="align-self-center">
                <div className="super-center w-100 text-muted d-flex">
                  <div className="horizontal-center align-self-center mb-5">
                    <div className="">
                      <div className="card-body p-4">
                        <div className="pl-4">
                          <img
                            src="/create.svg"
                            alt="skill-icon"
                            width="130"
                            className="mb-3"
                          />
                        </div>
                        <br />
                        <Link
                          to="/templates"
                          className="no-underline super-center"
                        >
                          <button
                            varient="contained"
                            className="purple-btn"
                            id="createskill"
                          >
                            New Project
                          </button>
                        </Link>
                        <small>
                          <a
                            href="https://intercom.help/vfu"
                            className="text-muted super-center mt-3"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <b>Voiceflow University</b>
                            <i className="fal fa-long-arrow-right ml-1" />
                          </a>
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-5 mt-4 container">{this.renderProjects()}</div>
          )}
        </div>
      </>
    );
  }
}

const mapStateToProps = state => ({
  team: state.projects.team,
  teams: state.projects.teams,
  projects: state.projects.projects,
  loading: state.projects.loading
});

const mapDispatchToProps = dispatch => {
  return {
    fetchProjects: team_id => dispatch(fetchProjects(team_id)),
    fetchTeams: () => dispatch(fetchTeams()),
    updateTeam: team_id => dispatch(updateTeam(team_id)),
    deleteProject: project_id => dispatch(deleteProject(project_id)),
    copyProject: project_id => dispatch(copyProject(project_id)),
    setConfirm: (confirm) => dispatch(setConfirm(confirm)),
    setError: (err) => dispatch(setError(err))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DashBoard);
