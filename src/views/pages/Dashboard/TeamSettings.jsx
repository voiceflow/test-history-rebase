import React, { Component } from "react";
import { connect } from "react-redux";
import { updateCurrentTeamItem, deleteTeam } from "ducks/team";
import { Modal, ModalBody, Alert, Input, ModalHeader } from "reactstrap"
import { User } from 'views/components/User'
import Image from "views/components/Uploads/Image";

// SETTING STATES: MEMBERS, SETTINGS, DELETE
const STATES = {
  "MEMBERS": {title: "Manage Members"},
  "SETTINGS": {title: "Team Settings"},
  "DELETE": {title: "Delete Team"}
}

class TeamSettings extends Component {
  constructor(props){
    super(props)

    this.state = {
      state: "MEMBERS",
      input: "",
      name: ""
    }

    this.reset = this.reset.bind(this)
    this.renderBody = this.renderBody.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.deleteTeam = this.deleteTeam.bind(this)
  }

  componentDidUpdate(prevProps) {
    if(!prevProps.open && this.props.open && typeof this.props.open === 'string'){
      this.setState({state: this.props.open})
    }
  }

  handleChange(event) {
    this.setState({
        [event.target.name]: event.target.value
    })
  }

  reset() {
    this.setState({
      state: "MEMBERS",
      name: this.props.team.name
    })
  }

  deleteTeam() {
    this.setState({state: 'DELETING'})
    this.props.deleteTeam(this.props.team.team_id)
    .then(() => {
      this.props.close()
    })
    .catch(() => {
      this.props.close()
    })
  }

  renderBody() {
    switch(this.state.state){
      case "DELETE":
        let equal = (this.state.input.trim().toLowerCase() === this.props.team.name.trim().toLowerCase())
        return <>
          <b>Are you sure you want to delete this?</b>
          <Alert color="danger">Deleting a Team will Permenantly Delete all of its Projects and Live Voice Applications</Alert>
          <label>Enter this team's name to confirm</label>
          <Input name="input" onChange={this.handleChange} value={this.state.input}/>
          <button className={"btn btn-danger" + (equal ? "" : " disabled")} disabled={!equal} onClick={this.deleteTeam}>
            Permenantly Delete Team
          </button>
        </>
      case "SETTINGS":
        return <div className="my-3">
          <div className="super-center">
            <Image
              tiny
              className='icon-image icon-image-sm'
              path={`/team/${this.props.team.team_id}/picture`}
              image={this.props.team.image}
              update={(url) => this.props.updateTeam({image: url})}
              replace
            />
          </div>
          <label>Name</label>
          <Input name="name" placeholder="Team Name" onChange={this.handleChange} value={this.state.name}/>
          <hr/>
          <label>Privacy</label>
          <button className="btn btn-link" onClick={()=>this.setState({state: "DELETE", input: ""})}>Delete Team</button>
          <br/>
          <small className="text-muted">This action is irreversible. All team and project data will be removed</small>
        </div>
      default:
        return <>
          {this.props.team.members.map(m => {
            return <div key={m.creator_id} className="member-row">
              <div className="d-flex">
                <User user={m} className="lg"/>
                <div className="ml-3">
                  <span>{m.name}</span><br/>
                  <small className="text-muted">{m.email}</small>
                </div>
              </div>
            </div>
          })}
          <div className="text-center mt-3 mb-2">
            <button className="btn purple-btn">Apply Changes</button>
          </div>
        </>
    }
  }

  render() {
    if(!this.props.team) return null

    return <Modal isOpen={!!this.props.open} onClosed={this.reset} toggle={this.props.close}>
      <ModalHeader toggle={this.props.close} className="pb-2">{STATES[this.state.state] && STATES[this.state.state].title}</ModalHeader>
      <ModalBody className="px-45 pt-0">
        {this.renderBody()}
      </ModalBody>
    </Modal>
  }
}

const mapStateToProps = state => ({
  team: state.team.byId[state.team.team_id]
});

const mapDispatchToProps = dispatch => {
  return {
    updateTeam: payload => dispatch(updateCurrentTeamItem(payload)),
    deleteTeam: team_id => dispatch(deleteTeam(team_id)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TeamSettings);
