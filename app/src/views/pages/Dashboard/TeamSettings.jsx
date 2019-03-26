import React, { Component } from "react";
import { connect } from "react-redux";
import { updateTeam, deleteTeam } from "ducks/team";
import { Modal, ModalBody, Alert, Input } from "reactstrap"

// SETTING STATES: GENERAL, DELETE

class TeamSettings extends Component {
  constructor(props){
    super(props)

    this.state = {
      state: "GENERAL",
      input: ""
    }

    this.reset = this.reset.bind(this)
    this.renderBody = this.renderBody.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.deleteTeam = this.deleteTeam.bind(this)
  }

  handleChange(event) {
    this.setState({
        [event.target.name]: event.target.value
    })
  }

  reset() {
    this.setState({state: "GENERAL"})
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
      default:
        return <>
          <h1>{this.props.team.name}</h1>
          {this.props.team.members.map(m => {
            return <div key={m.creator_id}>{m.name}</div>
          })}
          <button className="btn btn-danger" onClick={()=>this.setState({state: "DELETE", input: ""})}>Delete Team</button>
        </>
    }
  }

  render() {
    if(!this.props.team) return null

    return <Modal isOpen={this.props.open} onClosed={this.reset} toggle={this.props.close}>
      <ModalBody>
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
    updateTeam: (team_id, payload) => dispatch(updateTeam(team_id, payload)),
    deleteTeam: team_id => dispatch(deleteTeam(team_id)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TeamSettings);
