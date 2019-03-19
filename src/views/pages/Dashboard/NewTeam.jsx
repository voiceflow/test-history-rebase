import React, { Component } from "react";
import axios from "axios";
import { Alert, Button } from "reactstrap";
import { Link } from "react-router-dom";
import _ from "lodash";
import Image from "views/components/Uploads/Image";
import update from "immutability-helper";
import { Spinner } from "views/components/Spinner";
import moment from "moment";
import StripeHandler from "views/HOC/StripeHandler";

import { compose } from "recompose";
import { connect } from "react-redux";
import { setError, setConfirm } from "actions/modalActions";

const WrapForm = props => (
  <div className={"form-control input-wrap " + (props.className || "")}>
    <input
      onChange={props.onChange}
      value={props.value}
      disabled={props.disabled}
      placeholder={props.placeholder}
      className="flex-hard"
      type={props.type}
      name={props.type + "--" + props.index}
    />
    {props.children}
  </div>
);

const PurchaseStatus = props => (
  <div>
    {props.loading && (
      <div className="mb-2">
        <span className="loader text-lg" />
      </div>
    )}
    {props.children}
  </div>
);

class NewTeam extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stage: 0,
      name: "",
      image_url: "",
      error: null,
      invites: [],
      free: true
    };

    this.renderBody = this.renderBody.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.saveTeam = this.saveTeam.bind(this);
    this.addInvite = this.addInvite.bind(this);
    this.confirmInvite = this.confirmInvite.bind(this);
    this.goBack = this.goBack.bind(this);
    this.renderBox = this.renderBox.bind(this);
    this.nextStep = this.nextStep.bind(this)
  }

  componentDidUpdate(prevProps) {
    const change = this.props.stripe_state !== prevProps.stripe_state;
    if (this.props.stripe_state === -3 && change) {
      this.props.setError({
        message:
          ( !this.props.stripe_error || this.props.stripe_error === "Payment Failed" )
            ? "Unable to Create Team - Please try again later or contact support"
            : this.props.stripe_error
      });
      this.props.resetStripe();
    } else if (this.props.stripe_state === 3 && change) {
      this.nextStep()
    }
  }

  nextStep() {
    this.team_id
    ? this.props.history.push(`/team/${this.team_id}`)
    : this.props.history.push(`/dashboard`);
  }

  addInvite() {
    this.setState({
      invites: update(this.state.invites, { $push: [""] })
    });
  }

  confirmInvite() {
    if (this.state.invites.length > 1) {
      this.setState({ stage: 2 });
    } else {
      this.setState({ stage: 3 });
      axios
        .post("/team", {
          invites: this.state.invites,
          name: this.state.name,
          image_url: this.state.image_url
        })
        .then(() => {});
    }
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  goBack() {
    switch (this.state.stage) {
      case 1:
        this.setState({ stage: 0 });
        break;
      case 2:
        this.setState({ stage: 1 }); // Multiplatform paywall soft-disable
        break;
      default:
        break;
    }
  }

  saveTeam() {
    const resetError = () => {
      if (this.timeout) clearTimeout(this.timeout);
      this.timeout = setTimeout(() => this.setState({ error: null }), 3000);
    };
    if (this.state.name.length > 32) {
      this.setState({ error: "Team Name Too Long - 32 Characters Max" });
      resetError();
    } else if (!this.state.name.trim()) {
      this.setState({ error: "Please Fill in Team Name" });
      resetError();
    } else {
      this.setState({ stage: 1 });
    }
  }

  renderBox(seats, price) {
    switch (this.props.stripe_state) {
      case 1:
        return <PurchaseStatus loading>Creating Team</PurchaseStatus>;
      case 2:
        return <PurchaseStatus loading>Verifying Payment</PurchaseStatus>;
      case 3:
        return <Alert className="h-100 w-100 super-center mb-0">Success</Alert>;
      case -2:
        return (
          <div className="px-4">
            <Alert color="danger" className="small">
              Payment is deferred - You will receive an email when the charge comes through
            </Alert>
            <Button onClick={this.nextStep}>Continue Anyways</Button>
          </div>
        );
      default:
        return (
          <div className="space-between w-100 px-5">
            <div className="text-left">
              <div>
                <span className="grey-box mr-1">{seats}</span> <b>Seats</b>{" "}
                billed monthly
              </div>
              {/* <div className="mt-3">> Unlimited Projects</div> */}
            </div>
            <div className="price">
              <span className="text-pricing">${price}</span>/
              {this.state.period || "mo"}
            </div>
          </div>
        );
    }
  }

  renderBody() {
    let name = this.state.name || "New Team";
    let seats = this.state.invites.length + 1;

    switch (this.state.stage) {
      case 3:
        return React.createElement(Spinner, { message: "Creating Team" });
      case 2:
        let price = seats * 29;
        return (
          <div className="text-center">
            <h5 className="text-dark">{name}</h5>
            <div className="my-5 pt-4 pb-5">
              <span className="text-skinny text-muted">Confirm Team Plan</span>
              <div
                className="super-center mx-auto mt-4 border rounded"
                style={{
                  maxWidth: 600,
                  height: 140
                }}
              >
                {this.renderBox(seats, price)}
              </div>
              {this.props.stripe_state === 0 && (
                <>
                  <Button
                    className="purple-btn mt-5 mb-4"
                    onClick={e => {
                      e.preventDefault();
                      this.props.openStripe(
                        source => ({
                          method: "POST",
                          url: "/team/checkout",
                          data: {
                            source: source,
                            invites: this.state.invites,
                            name: this.state.name,
                            image_url: this.state.image_url
                          }
                        }),
                        team_id => (this.team_id = team_id)
                      );
                    }}
                    style={{ width: 144 }}
                    disabled={this.props.stripe_load}
                  >
                    {this.props.stripe_load ? (
                      <span className="loader" />
                    ) : (
                      "Start Free Trial"
                    )}
                  </Button>
                  <div className="text-muted text-sm">
                    Your trial will end on{" "}
                    <span className="text-dark">
                      {moment()
                        .add(14, "days")
                        .format("MMMM Qo, YYYY")}
                    </span>
                    <br />
                    at which point you will be charged{" "}
                    <span className="text-dark">${price}/mo</span>
                  </div>
                </>
              )}
            </div>
          </div>
        );
      case 1:
        return (
          <div className="text-center mb-5">
            <h5 className="text-dark">{name}</h5>
            <div className="my-5 pt-4 pb-5">
              <div>
                <span className="text-skinny text-muted">
                  Invite Team Members
                </span>
                <span className="grey-box ml-2">{seats}</span>
              </div>
              <small className="text-muted">up to 2 members free</small>
              <div className="super-center mt-4">
                <div style={{ minWidth: 400 }}>
                  <WrapForm
                    value={window.user_detail.email}
                    disabled
                    className="disabled"
                  >
                    <span className="text-dark font-weight-bold mr-2">
                      OWNER
                    </span>
                  </WrapForm>
                  {this.state.invites.map((invite, i) => (
                    <div key={i} className="input-wrap-wrap">
                      <WrapForm
                        value={invite}
                        className="mt-3"
                        placeholder="Enter Email"
                        type="email"
                        index={i}
                        onChange={e =>
                          this.setState({
                            invites: update(this.state.invites, {
                              [i]: { $set: e.target.value }
                            })
                          })
                        }
                      />
                      <div
                        className="close"
                        onClick={() =>
                          this.setState({
                            invites: update(this.state.invites, {
                              $splice: [[i, 1]]
                            })
                          })
                        }
                      >
                        &times;
                      </div>
                    </div>
                  ))}
                  <Button
                    onClick={this.addInvite}
                    color="clear"
                    className="border-none btn-lg mt-2"
                    style={{ fontWeight: 300 }}
                    block
                  >
                    <i className="fal fa-plus" /> Add Team Member
                  </Button>
                </div>
              </div>
              <div className="mt-5">
                <Button className="purple-btn" onClick={this.confirmInvite}>
                  Continue
                </Button>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div id="name-box" className="text-center">
            <div className="mb-4">
              <h5 className="text-dark">Create Team</h5>
              <div style={{ minHeight: 45 }} className="mt-3 super-center">
                {this.state.error && (
                  <Alert color="danger small" className="m-0">
                    {this.state.error}
                  </Alert>
                )}
              </div>
              <input
                id="skill-name"
                className="input-underline mt-0"
                type="text"
                name="name"
                value={this.state.name}
                onChange={this.handleChange}
                placeholder="Enter Your Team Name"
                required
              />
            </div>
            <div className="super-center mt-5">
              <div className="text-center">
                <Image
                  className="icon-image icon-image-sm text-center mb-2"
                  path="/large_icon"
                  image={this.state.image_url}
                  update={url => this.setState({ image_url: url })}
                />
                <small className="text-muted">Add Team Icon</small>
              </div>
            </div>
            <div className="mt-5">
              <Button className="purple-btn" onClick={this.saveTeam}>
                Continue
              </Button>
            </div>
          </div>
        );
    }
  }

  render() {
    return (
      <div id="template-box-container">
        <div className="card">
          {[1, 2].includes(this.state.stage) && (
            <div onClick={this.goBack}>
              <img src={"/back.svg"} alt="back" className="mr-3 back-arrow" />
            </div>
          )}
          <Link id="exit-template" to="/dashboard" className="close">
            &times;
          </Link>
          <div className="container">{this.renderBody()}</div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    skill: state.skills.skill,
    diagram_id: state.skills.skill.diagram,
    diagrams: state.diagrams.diagrams,
    diagram_error: state.diagrams.error,
    root_id: state.diagrams.root_id,
    error: state.skills.error,
    variables: state.variables.localVariables,
    diagram_set: new Set(state.diagrams.diagrams.map(d => d.id)),
    diagram: _.find(
      state.diagrams.diagrams,
      d => d.id === state.skills.skill.diagram
    ),
    canvasError: state.userSetting.canvasError
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setError: err => dispatch(setError(err)),
    setConfirm: confirm => dispatch(setConfirm(confirm))
  };
};

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  StripeHandler
)(NewTeam);
