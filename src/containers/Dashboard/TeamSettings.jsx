import React, { Component } from "react";
import cn from "classnames";
import { connect } from "react-redux";
import { cloneDeep } from "lodash";
import update from "immutability-helper";
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

import Button from 'components/Button'
import { ModalHeader } from "components/Modals/ModalHeader";
import { User } from "components/User/User";
import Image from "components/Uploads/Image";
import SeatsCheckout from "./SeatsCheckout";
import Billing from "./Billing";
import { PLANS_ID } from "./PLANS";
import CheckMark from "components/CheckMark";
import PricingCard from "./PricingCard";

import {
  updateMembers,
  deleteTeam,
  leaveTeam,
  updateCurrentTeamItem
} from "ducks/team";
import { setConfirm, setError } from "ducks/modal";

// SETTING STATES: MEMBERS, SETTINGS, DELETE
const STAGES = {
  PLAN: { title: "Board Plans", fullscreen: true },
  CHECKOUT: { title: "Upgrade Board", fullscreen: true },
  "CHECKOUT:PROJECTS": { title: "Upgrade Board", fullscreen: true },
  MEMBERS: { title: "Manage Members" },
  UPDATING_MEMBERS: { title: "Manage Members" },
  SETTINGS: { title: "Board Settings" },
  DELETE: { title: "Delete Board" },
  BILLING: { title: "Billing" },
  SUCCESS: { title: "Update Success" }
};

const Contact = (
  <Alert className="text-center py-3 mt-2">
    <img src={"/contact-owner.svg"} alt="owner" width={65} />
    Contact the owner of this board to upgrade
  </Alert>
);

const MemberRow = props => {
  const m = props.member;
  const IS_ADMIN = props.admin === props.user;

  var info, type, remove_action;
  if (m.creator_id) {
    type = "FILLED";
    remove_action = () =>
      props.confirm({
        text: "Are you sure you want to remove this member?",
        confirm: () =>
          props.update({ creator_id: null, email: null, invite: "" })
      });
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
    type = "INVITE";
    // ONLY HAS EMAIL: INVITE SENT OUT BUT NOT ACCEPTED
    remove_action = () =>
      props.confirm({
        text: "Are you sure you want to cancel this invite?",
        confirm: () => props.update({ email: null, invite: "" })
      });
    info = (
      <>
        <div className="member-icon lg solid">
          <img
            src={"/pending.svg"}
            width="17"
            style={{ marginTop: -5 }}
            alt="pending"
          />
        </div>
        <div className="ml-3">
          <span>{m.email}</span>
          <br />
          <small className="text-muted">Pending Confirmation</small>
        </div>
      </>
    );
  } else {
    if (!IS_ADMIN) return null;
    // NO INVITE: EMPTY SEAT
    type = "EMPTY";
    remove_action = props.remove;
    info = (
      <>
        <div className="member-icon lg solid">
          <img
            src={"/add-teammate.svg"}
            width="18"
            style={{ marginTop: -4 }}
            alt="add"
          />
        </div>
        <div className="ml-3">
          <Input
            className="w-300 form-bg"
            placeholder="Email"
            value={m.invite || ""}
            type="email"
            onChange={e => props.update({ invite: e.target.value })}
          />
        </div>
      </>
    );
  }

  return (
    <div className="member-row">
      <div className="w-100 space-between">
        <div className="horizontal-center">{info}</div>
        {IS_ADMIN && props.user !== m.creator_id && (
          <UncontrolledDropdown inNavbar>
            <DropdownToggle tag="div" className="dropdown-button">
              <i className="far fa-ellipsis-h" />
            </DropdownToggle>
            <DropdownMenu right className="no-select py-1">
              {type === "FILLED" && (
                <DropdownItem onClick={remove_action}>
                  Remove Member
                </DropdownItem>
              )}
              {type === "INVITE" && (
                <DropdownItem onClick={remove_action}>
                  Cancel Invite
                </DropdownItem>
              )}
              {type === "EMPTY" && (
                <DropdownItem onClick={remove_action}>Remove Seat</DropdownItem>
              )}
            </DropdownMenu>
          </UncontrolledDropdown>
        )}
        {props.member.status === 100 && (
          <label className="text-muted mr-2">OWNER</label>
        )}
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
      members: [],
      diff: [],
      is_diff: false
    };

    this.renderBody = this.renderBody.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.deleteTeam = this.deleteTeam.bind(this);
    this.addMember = this.addMember.bind(this);
    this.priceEstimate = this.priceEstimate.bind(this);
    this.applyChanges = this.applyChanges.bind(this);
    this.teamUpdate = this.teamUpdate.bind(this);
    this.leaveTeam = this.leaveTeam.bind(this);
    this.upgrade = this.upgrade.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      !prevProps.open &&
      this.props.open &&
      typeof this.props.open === "string"
    ) {
      this.setState({
        name: this.props.team.name,
        stage: this.props.open,
        update_pay: false,
        is_diff: false,
        members: cloneDeep(this.props.team.members),
        diff: cloneDeep(this.props.team.members)
      });
    }

    if (
      prevState.members !== this.state.members &&
      prevState.diff === this.state.diff
    ) {
      this.checkDiff();
    }
  }

  checkDiff() {
    const { diff, members } = this.state;
    const empty = m => !m.creator_id && !m.email;

    const empty_diff = diff.filter(empty);
    const empty_members = members.filter(empty);

    // 3 conditions to check for: total length of members changed, number of invites changed, invites updated
    if (
      diff.length !== members.length ||
      empty_diff.length !== empty_members.length ||
      empty_members.filter(m => !!m.invite).length !== 0
    ) {
      this.setState({ is_diff: true });
    } else {
      this.setState({ is_diff: false });
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
    e.preventDefault();
    if (!this.IS_ADMIN) return false;

    if (this.props.team.status === 0 && this.state.members.length > 2) {
      this.setState({ stage: "CHECKOUT" });
    } else {
      this.setState({ stage: "UPDATING_MEMBERS" });
      this.props
        .updateMembers(this.state.members)
        .then(this.teamUpdate)
        .catch(this.teamUpdate);
    }

    return false;
  }

  teamUpdate() {
    this.setState({
      stage: "MEMBERS",
      update_pay: true,
      is_diff: false,
      members: cloneDeep(this.props.team.members),
      diff: cloneDeep(this.props.team.members)
    });

    if (this.check) this.check();
  }

  upgrade(plan) {
    if (plan <= this.props.team.status) return null;

    return () => {
      this.checkout_plan = plan;
      this.setState({ stage: "CHECKOUT" });
    };
  }

  leaveTeam() {
    this.props.setConfirm({
      text: "Are you sure you want to leave this team?",
      confirm: () => this.props.leaveTeam(this.props.team.team_id)
    });
  }

  renderBody() {
    switch (this.state.stage) {
      case "PLAN":
        if (!this.IS_ADMIN) return Contact;
        return (
          <div className="d-flex align-items-start justify-content-center mx--2 mt-5">
            <PricingCard plan="HOBBY" delay={300} team={this.props.team} />
            <PricingCard
              plan="PROFESSIONAL"
              delay={600}
              team={this.props.team}
              upgrade={this.upgrade(1)}
            />
            <PricingCard
              plan="BUSINESS"
              delay={900}
              team={this.props.team}
              upgrade={this.upgrade(2)}
            />
          </div>
        );
      case "SUCCESS":
        return (
          <div className="py-5 my-5 text-center">
            <img src="/images/icons/reciept.svg" alt="reciept" width={80} />
            <br />
            <br />
            <span className="text-muted">
              Your subscription has been activated.
              <br />
              Thank you.
            </span>
          </div>
        );
      case "CHECKOUT:PROJECTS":
      case "CHECKOUT":
        if (!this.IS_ADMIN) return Contact;
        let plan;
        // reset the checkout plan when consumed
        if (this.checkout_plan) {
          plan = this.checkout_plan;
          this.checkout_plan = undefined;
        }
        return (
          <div className="my-5 pt-4 pb-5 text-center">
            {this.state.stage.endsWith("PROJECTS") && (
              <Alert color="danger" className="absolute-top">
                Project Limit Reached, upgrade to create more projects
              </Alert>
            )}
            <div className="uppercase text-muted">Upgrade Board</div>
            <div className="super-center mt-4">
              <SeatsCheckout
                prompt="Upgrade"
                members={this.state.members}
                team={this.props.team}
                next={() => this.setState({ stage: "SUCCESS" })}
                user={this.props.user}
                plan={plan}
                collab={() => this.setState({ stage: "MEMBERS" })}
                modify={() => this.setState({ stage: "BILLING" })}
                width={400}
              />
            </div>
          </div>
        );
      case "DELETING":
        return (
          <div className="text-center p-5">
            <span className="loader text-lg" />
            <br />
            Deleting Board
          </div>
        );
      case "DELETE":
        let equal =
          this.state.input.trim().toLowerCase() ===
          this.props.team.name.trim().toLowerCase();
        return (
          <div>
            <Alert color="danger" className="mt-2">
              <b>Are you sure you want to delete this?</b>
              <br />
              Deleting a Board will Permenantly Delete all of its Projects and
              Live Voice Applications
            </Alert>
            <label>Enter this board's name to confirm</label>
            <Input
              name="input"
              onChange={this.handleChange}
              value={this.state.input}
              placeholder="Board Name"
            />
            <div className="my-3 text-center">
              <Button
                isBtn
                isWarning
                disabled={!equal}
                onClick={this.deleteTeam}
              >
                Delete Board
              </Button>
            </div>
          </div>
        );
      case "BILLING":
        if (!this.IS_ADMIN) return Contact;
        return (
          <Billing
            stage={this.state.stage}
            setError={this.props.setError}
            user={this.props.user}
            team={this.props.team}
            update_pay={() => this.setState({ update_pay: true })}
            update={stage => this.setState({ stage: stage })}
          />
        );
      case "SETTINGS":
        if (!this.IS_ADMIN) break;
        return (
          <div className="mb-3">
            <label>Board Icon</label>
            {this.props.team.status === 0 ? (
              <div className="mb-3">
                <img
                  src="/images/icons/vf_logo.png"
                  alt="Voiceflow"
                  width={80}
                  className="py-2 mb-1 no-select"
                />
                <br />
                <small className="text-muted">
                  Upgrade this board under billing to add a custom image
                </small>
              </div>
            ) : (
              <Image
                tiny
                className="icon-image icon-image-sm icon-image-square mb-3"
                path={`/team/${this.props.team.team_id}/picture`}
                image={this.props.team.image}
                update={url => this.props.updateTeam({ image: url })}
                replace
              />
            )}
            <label>Name</label>
            <Input
              name="name"
              placeholder="Board Name"
              // onChange={this.handleChange}
              value={this.state.name}
              disabled
            />
            <hr />
            <label>Billing</label>
            <Button
              isBtn
              isLinkLarge
              onClick={() => this.setState({ stage: "BILLING" })}
            >
              Invoices
            </Button>
            <br />
            <small className="text-muted">
              View invoices, update your payment options
            </small>
            <hr />
            <label>Privacy</label>
            <Button
              isBtn
              isLinkLarge
              onClick={() => this.setState({ stage: "DELETE", input: "" })}
            >
              Delete Board
            </Button>
            <br />
            <small className="text-muted">
              This action is irreversible. All team and project data will be
              removed
            </small>
          </div>
        );
      default:
        const UPDATING = this.state.stage === "UPDATING_MEMBERS";
        const DISABLED = UPDATING || !this.state.is_diff;
        return (
          <div
            className={UPDATING ? "disabled" : ""}
          >
            {this.IS_ADMIN && (
              <small className="d-flex text-muted mt-2 mb-2">
                <span className="badge mr-2">
                  {this.props.team.seats}
                </span>{" "}
                current seats
              </small>
            )}
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
                  remove={() =>
                    this.setState({
                      members: update(this.state.members, {
                        $splice: [[i, 1]]
                      })
                    })
                  }
                  confirm={this.props.setConfirm}
                />
              );
            })}
            {this.IS_ADMIN && (
              <div className="my-3">
                <div className="text-center mb-3">
                  <Button
                    isBtn
                    isLinkLarge
                    className="pointer mt-4"
                    onClick={this.addMember}
                  >
                    Add teammates
                  </Button>
                </div>
                <div className="text-center mt-3 position-relative">
                  <Button
                    isBtn
                    isPrimary
                    type="submit"
                    disabled={DISABLED}
                    style={{ width: 150 }}
                    onClick={this.applyChanges}
                  >
                    {UPDATING ? (
                      <span className="loader" />
                    ) : (
                      "Apply Changes"
                    )}
                  </Button>
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: "69%"
                    }}
                  >
                    <CheckMark
                      show={show => (this.check = show)}
                      timeout={1500}
                    />
                  </div>
                </div>
                {this.props.team.status > 0 && this.priceEstimate()}
              </div>
            )}
          </div>
        );
    }
  }

  priceEstimate() {
    if (this.props.team.seats < this.state.members.length) {
      const rate = PLANS_ID[this.props.team.status]
        ? PLANS_ID[this.props.team.status].rate
        : 29;
      return (
        <div className="text-center text-muted mt-2">
          +${(this.state.members.length - this.props.team.seats) * rate}/mo
        </div>
      );
    } else if (this.props.team.seats > this.state.members.length) {
      return null;
    } else {
      return null;
    }
  }

  render() {
    if (!this.props.team) return null;
    this.IS_ADMIN = this.props.user.creator_id === this.props.team.creator_id;

    const fullscreen =
      this.state.stage in STAGES && STAGES[this.state.stage].fullscreen;

    return (
      <>
        <UncontrolledDropdown inNavbar>
          <DropdownToggle tag="div" className="pointer">
            <img src={"/cog.svg"} className="mr-3 ml-3" width={17} alt="cog" />
          </DropdownToggle>
          <DropdownMenu right className="no-select">
            <DropdownItem onClick={() => this.props.update("MEMBERS")}>
              {this.IS_ADMIN ? "Manage Members" : "Team Members"}
            </DropdownItem>
            {this.IS_ADMIN ? (
              <>
                <DropdownItem onClick={() => this.props.update("SETTINGS")}>
                  Board Settings
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem onClick={() => this.props.update("PLAN")}>
                  Board Plan
                </DropdownItem>
              </>
            ) : (
              <>
                <DropdownItem divider />
                <DropdownItem onClick={this.leaveTeam}>
                  Leave Board
                </DropdownItem>
              </>
            )}
          </DropdownMenu>
        </UncontrolledDropdown>
        <Modal
          isOpen={!!this.props.open}
          toggle={this.props.close}
          className={cn("upgrade-modal", {
            "modal-fullscreen": fullscreen
          })}
        >
          <ModalHeader
            toggle={this.props.close}
            className="pb-2"
            header={
              (STAGES[this.state.stage] && STAGES[this.state.stage].title) ||
              "Board Settings"
            }
          />
          <ModalBody className="px-45 pt-0 overflow-hidden">
            {["WARNING", "LOCKED"].includes(this.props.team.state) &&
              (this.state.update_pay ? (
                <Alert>Please refresh your page to see updates</Alert>
              ) : (
                <>
                  {this.props.team.state === "WARNING" && (
                    <Alert
                      color="danger"
                      onClick={() => this.setState({ stage: "BILLING" })}
                    >
                      We were unable to charge your last invoice
                      <br />
                      <br />
                      If there is an issue with your current card please update
                      your payment option
                    </Alert>
                  )}
                  {this.props.team.state === "LOCKED" && (
                    <Alert
                      color="danger"
                      onClick={() => this.setState({ stage: "BILLING" })}
                    >
                      Your subscription failed
                      <br />
                      Please update your payment option to continue
                    </Alert>
                  )}
                </>
              ))}
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
    updateMembers: (members, options) =>
      dispatch(updateMembers(members, options)),
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
