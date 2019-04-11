import React, { Component } from "react";
import { connect } from "react-redux";
import { updateMembers, deleteTeam, leaveTeam, updateCurrentTeamItem } from "ducks/team";
import {
  Modal,
  ModalBody,
  Alert,
  Input,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";
import { ModalHeader } from 'views/components/Modals/ModalHeader'
import { User } from "views/components/User";
import Image from "views/components/Uploads/Image";
import { cloneDeep } from "lodash";
import update from "immutability-helper";
import SeatsCheckout from "./SeatsCheckout";
import { setConfirm, setError } from 'ducks/modal'
import Billing from "./Billing"

// SETTING STATES: MEMBERS, SETTINGS, DELETE
const STAGES = {
  CHECKOUT: { title: "Upgrade Board" },
  MEMBERS: { title: "Manage Members" },
  UPDATING_MEMBERS: { title: "Manage Members" },
  SETTINGS: { title: "Board Settings" },
  DELETE: { title: "Delete Team" },
  BILLING: { title: "Billing" }
};

const Contact = <Alert className="text-center py-3 mt-2">
  <h1><i className="fas fa-comment-plus"/></h1>
  Contact the administrators of this board to upgrade
</Alert>

const MemberRow = props => {
  const m = props.member;
  const IS_ADMIN = props.admin === props.user

  var info, type, remove_action;
  if (m.creator_id) {
    type = 'FILLED'
    remove_action = () => props.confirm({
      text: 'Are you sure you want to remove this member?',
      confirm: () => props.update({creator_id: null, email: null, invite: ''})
    })
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
    type = 'INVITE'
    // ONLY HAS EMAIL: INVITE SENT OUT BUT NOT ACCEPTED
    remove_action = () => props.confirm({
      text: 'Are you sure you want to cancel this invite?',
      confirm: () => props.update({email: null, invite: ''})
    })
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
    type = 'EMPTY'
    remove_action = props.remove
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
              {type === 'FILLED' && 
                <DropdownItem onClick={remove_action}>
                  Remove Member
                </DropdownItem>
              }
              {type === 'INVITE' && 
                <DropdownItem onClick={remove_action}>
                  Cancel Invite
                </DropdownItem>
              }
              {type === 'EMPTY' &&
                <DropdownItem onClick={remove_action}>
                  Remove Seat
                </DropdownItem>
              }
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
      stage: "MEMBERS",
      input: "",
      name: "",
      members: []
    };

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
        name: this.props.team.name,
        stage: this.props.open,
        update_pay: false,
        members: cloneDeep(this.props.team.members)
      });
    }
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  deleteTeam() {
    this.setState({ stage: "DELETING" });
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
      this.setState({stage: 'CHECKOUT'})
    }else{
      this.setState({stage: 'UPDATING_MEMBERS'})
      this.props.updateMembers(this.state.members)
      .then(this.teamUpdate)
      .catch(this.teamUpdate)
    }
  }

  teamUpdate() {
    this.setState({
      stage: "MEMBERS",
      update_pay: true,
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
    switch (this.state.stage) {
      case "CHECKOUT":
        if(!this.IS_ADMIN) return Contact
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
            collab={() => this.setState({stage: "MEMBERS"})}
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
      case "BILLING":
        if(!this.IS_ADMIN) return Contact
        return <Billing
          stage={this.state.stage}
          setError={this.props.setError}
          user={this.props.user}
          team={this.props.team}
          update_pay={() => this.setState({update_pay: true})}
          update={(stage) => this.setState({stage: stage})}
        />
      case "SETTINGS":
        if(!this.IS_ADMIN) break;
        return (
          <div className="mb-3">
            <label>Team Icon</label>
            { this.props.team.status === 0 ?
              <div className="mb-3">
                <img src='/images/icons/vf_logo.png' alt="Voiceflow" width={100} className="py-2 mb-1 no-select"/><br/>
                <small className="text-muted">
                  Update this board under <b>Billing</b> to add custom icons
                </small>
              </div> :
              <Image
                tiny
                className="icon-image icon-image-sm icon-image-square mb-3"
                path={`/team/${this.props.team.team_id}/picture`}
                image={this.props.team.image}
                update={url => this.props.updateTeam({ image: url })}
                replace
              />
            }
            <label>Name</label>
            <Input
              name="name"
              placeholder="Team Name"
              // onChange={this.handleChange}
              value={this.state.name}
              disabled
            />
            <hr />
            <button
              className="btn btn-link"
              onClick={() => this.setState({ stage: "BILLING" })}
            >
              Billing
            </button><br/>
            <small className="text-muted">
              View invoices, update your payment options
            </small>
            <hr />
            <label>Privacy</label>
            <button
              className="btn btn-link"
              onClick={() => this.setState({ stage: "DELETE", input: "" })}
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
        const UPDATING = this.state.stage === 'UPDATING_MEMBERS'
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
                  confirm={this.props.setConfirm}
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
                <button className="btn btn-primary" onClick={this.applyChanges} disabled={ UPDATING } style={{width: 150}}>
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
          toggle={this.props.close}
        >
          <ModalHeader toggle={this.props.close} className="pb-2">
            {(STAGES[this.state.stage] && STAGES[this.state.stage].title) || "Team Settings"}
          </ModalHeader>
          <ModalBody className="px-45 pt-0 overflow-hidden">
            {["WARNING", "LOCKED"].includes(this.props.team.state) && (this.state.update_pay ? 
              <Alert>
                Please refresh your page to see updates
              </Alert> : 
              <>
                {this.props.team.state === "WARNING" && <Alert color="danger" onClick={() => this.setState({stage: "BILLING"})}>
                  We were unable to charge your last invoice<br/><br/>
                  If there is an issue with your current card please update your payment option
                </Alert>}
                {this.props.team.state === "LOCKED" && <Alert color="danger" onClick={() => this.setState({stage: "BILLING"})}>
                  Your subscription failed<br/>
                  Please update your payment option to continue
                </Alert>}
              </>
            )}
            {this.renderBody()}
          </ModalBody>
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
    setConfirm: confirm => dispatch(setConfirm(confirm)),
    updateTeam: payload => dispatch(updateCurrentTeamItem(payload)),
    setError: error => dispatch(setError(error))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TeamSettings);
