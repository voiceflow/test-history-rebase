import React, { Component } from "react";
import { connect } from "react-redux";
import { updateMembers, deleteTeam, leaveTeam } from "ducks/team";
import {
  Modal,
  ModalBody,
  Alert,
  Input,
  ModalHeader,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";
import { User } from "views/components/User";
import Image from "views/components/Uploads/Image";
import { cloneDeep } from "lodash";
import update from "immutability-helper";
import SeatsCheckout from "./SeatsCheckout";
import { setConfirm } from 'ducks/modal'

// SETTING STATES: MEMBERS, SETTINGS, DELETE
const STATES = {
  CHECKOUT: { title: "Upgrade Workspace" },
  MEMBERS: { title: "Manage Members" },
  SETTINGS: { title: "Team Settings" },
  DELETE: { title: "Delete Team" }
};

const MemberRow = props => {
  const m = props.member;
  const IS_ADMIN = props.admin === props.user

  var info;
  if (m.creator_id) {
    // HAS CREATOR ID ASSOCIATED: ACCEPTED INVITE FULL MEMBERSHIP
    info = (
      <>
        <User user={m} className="lg" />
        <div className="ml-3">
          <span>{m.name}</span>
          <br />
          <small className="text-muted">{m.email}</small>
        </div>
      </>
    );
  } else if (m.email) {
    // ONLY HAS EMAIL: INVITE SENT OUT BUT NOT ACCEPTED
    info = (
      <>
        <div className="member-icon lg solid">
          <i className="far fa-paper-plane" style={{ marginLeft: -3 }} />
        </div>
        <div className="ml-3">
          <span>{m.email}</span>
          <br />
          <small className="text-muted">Pending Confirmation</small>
        </div>
      </>
    );
  } else {
    if(!IS_ADMIN) return null
    // NO INVITE: EMPTY SEAT
    info = (
      <>
        <div className="member-icon lg solid">
          <i className="far fa-user" />
        </div>
        <div className="ml-3 mt-1">
          <Input
            placeholder="Email"
            value={m.invite}
            onChange={e => props.update({ invite: e.target.value })}
          />
          <small className="text-muted">Invite New Member</small>
        </div>
      </>
    );
  }

  return (
    <div className="member-row">
      <div className="w-100 space-between">
        <div className="horizontal-center">
          {info}
        </div>
        {IS_ADMIN && props.user !== m.creator_id &&
          <UncontrolledDropdown inNavbar>
            <DropdownToggle tag="div" className="dropdown-button">
              <i className="far fa-ellipsis-v"/>
            </DropdownToggle>
            <DropdownMenu right className="no-select py-1">
              <DropdownItem
                onClick={props.remove}
              >
                Remove Seat
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        }
      </div>
    </div>
  );
};

class TeamSettings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      state: "MEMBERS",
      input: "",
      name: "",
      members: []
    };

    this.reset = this.reset.bind(this);
    this.renderBody = this.renderBody.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.deleteTeam = this.deleteTeam.bind(this);
    this.addMember = this.addMember.bind(this);
    this.priceEstimate = this.priceEstimate.bind(this)
    this.applyChanges = this.applyChanges.bind(this)
    this.teamUpdate = this.teamUpdate.bind(this)
    this.leaveTeam = this.leaveTeam.bind(this)
  }

  componentDidUpdate(prevProps) {
    if (
      !prevProps.open &&
      this.props.open &&
      typeof this.props.open === "string"
    ) {
      this.setState({
        state: this.props.open,
        members: cloneDeep(this.props.team.members)
      });
    }
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  reset() {
    this.setState({ name: this.props.team.name });
  }

  deleteTeam() {
    this.setState({ state: "DELETING" });
    this.props
      .deleteTeam(this.props.team.team_id)
      .then(() => {
        this.props.close();
      })
      .catch(() => {
        this.props.close();
      });
  }

  addMember() {
    this.setState({
      members: update(this.state.members, { $push: [{}] })
    });
  }

  applyChanges(e) {
    e.preventDefault()
    if (this.props.team.status === 0 && this.state.members.length > 2) {
      this.setState({state: 'CHECKOUT'})
    }else{
      this.setState({state: 'UPDATING_MEMBERS'})
      this.props.updateMembers(this.state.members)
      .then(this.teamUpdate)
      .catch(this.teamUpdate)
    }
  }

  teamUpdate() {
    this.setState({
      state: "MEMBERS",
      members: cloneDeep(this.props.team.members)
    })
  }

  leaveTeam() {
    this.props.setConfirm({
      text: 'Are you sure you want to leave this team?',
      confirm: () => this.props.leaveTeam(this.props.team.team_id)
    })
  }

  renderBody() {
    switch (this.state.state) {
      case "CHECKOUT":
        return <>
          <div className="mt-4">
            <div className="mb-1"><b>Team Plan</b> Includes:</div>
            <ul>
              <li>Team collaboration</li>
              <li>Unlimited projects</li>
              <li>Priority Support</li>
            </ul>
          </div>
          <SeatsCheckout
            prompt="Upgrade"
            members={this.state.members}
            team={this.props.team}
            next={this.teamUpdate}
            user={this.props.user}
          />
        </>
      case "DELETING":
        return <div className="text-center p-5">
          <span className="loader text-lg"/>
          <br/>
          Deleting Team
        </div>
      case "DELETE":
        let equal =
          this.state.input.trim().toLowerCase() ===
          this.props.team.name.trim().toLowerCase();
        return (
          <>
            <Alert color="danger" className="mt-2">
              <b>Are you sure you want to delete this?</b>
              <br />
              Deleting a Team will Permenantly Delete all of its Projects and
              Live Voice Applications
            </Alert>
            <label>Enter this team's name to confirm</label>
            <Input
              name="input"
              onChange={this.handleChange}
              value={this.state.input}
              placeholder="Team Name"
            />
            <div className="my-3 text-center">
              <button
                className={"btn btn-danger" + (equal ? "" : " disabled")}
                disabled={!equal}
                onClick={this.deleteTeam}
              >
                Delete Team
              </button>
            </div>
          </>
        );
      case "SETTINGS":
        return (
          <div className="my-3">
            <div className="super-center">
              <Image
                tiny
                className="icon-image icon-image-sm"
                path={`/team/${this.props.team.team_id}/picture`}
                image={this.props.team.image}
                update={url => this.props.updateTeam({ image: url })}
                replace
              />
            </div>
            <label>Name</label>
            <Input
              name="name"
              placeholder="Team Name"
              onChange={this.handleChange}
              value={this.state.name}
            />
            <hr />
            <label>Privacy</label>
            <button
              className="btn btn-link"
              onClick={() => this.setState({ state: "DELETE", input: "" })}
            >
              Delete Team
            </button>
            <br />
            <small className="text-muted">
              This action is irreversible. All team and project data will be
              removed
            </small>
          </div>
        );
      default:
        const UPDATING = this.state.state === 'UPDATING_MEMBERS'
        return (
          <div className={ UPDATING ? "disabled" : ""}>
            { this.IS_ADMIN && <small className="d-flex text-muted"><span className="badge mr-1">{this.props.team.seats}</span> current seats</small> }
            {this.state.members.map((m, i) => {
              return (
                <MemberRow
                  key={i}
                  user={this.props.user.creator_id}
                  admin={this.props.team.creator_id}
                  member={m}
                  update={payload =>
                    this.setState({
                      members: update(this.state.members, {
                        [i]: { $merge: payload }
                      })
                    })
                  }
                  remove={() => this.setState({
                    members: update(this.state.members, {
                      $splice: [[i, 1]]
                    })
                  })}
                />
              );
            })}
            { this.IS_ADMIN && <div className="my-3">
              <div className="text-center mb-3">
                <div className="btn-link pointer" onClick={this.addMember}>
                  Add more teammates
                </div>
              </div>
              <div className="text-center mt-4">
                <button className="btn purple-btn" onClick={this.applyChanges} disabled={ UPDATING } style={{width: 145}}>
                  { UPDATING ? <span className="loader"/> : "Apply Changes"} 
                </button>
              </div>
              {this.props.team.status === 1 && this.priceEstimate()}
            </div>}
          </div>
        );
    }
  }

  priceEstimate() {
    if (this.props.team.seats < this.state.members.length) {
      return <div className="text-center text-muted mt-2">+${(this.state.members.length - this.props.team.seats) * 29}/mo</div>
    } else if(this.props.team.seats > this.state.members.length){
      return null
    } else {
      return null
    }
  }

  render() {
    if (!this.props.team) return null;
    this.IS_ADMIN = this.props.user.creator_id === this.props.team.creator_id

    return (
      <>
        <UncontrolledDropdown inNavbar>
          <DropdownToggle tag="div" className="dropdown-button">
            <i className="fas fa-cog"/>
          </DropdownToggle>
          <DropdownMenu right className="no-select">
            <DropdownItem onClick={()=>this.props.update('MEMBERS')}>
              { this.IS_ADMIN ? "Manage Members" : "Team Members" }
            </DropdownItem>
            { this.IS_ADMIN ? 
              <DropdownItem onClick={()=>this.props.update('SETTINGS')}>
                Team Settings
              </DropdownItem> : <>
              <DropdownItem divider />
              <DropdownItem onClick={this.leaveTeam}>
                Leave Team
              </DropdownItem>
            </>}
          </DropdownMenu>
        </UncontrolledDropdown>
        <Modal
          isOpen={!!this.props.open}
          onClosed={this.reset}
          toggle={this.props.close}
        >
          <ModalHeader toggle={this.props.close} className="pb-2">
            {STATES[this.state.state] && STATES[this.state.state].title}
          </ModalHeader>
          <ModalBody className="px-45 pt-0 overflow-hidden">{this.renderBody()}</ModalBody>
        </Modal>
      </>
    );
  }
}

const mapStateToProps = state => ({
  user: state.account,
  team: state.team.byId[state.team.team_id]
});

const mapDispatchToProps = dispatch => {
  return {
    updateMembers: (members, options) => dispatch(updateMembers(members, options)),
    deleteTeam: team_id => dispatch(deleteTeam(team_id)),
    leaveTeam: team_id => dispatch(leaveTeam(team_id)),
    setConfirm: confirm => dispatch(setConfirm(confirm))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TeamSettings);
