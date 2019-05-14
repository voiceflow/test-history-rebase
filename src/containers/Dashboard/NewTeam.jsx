import React, { Component } from "react";
import _ from "lodash";
import update from "immutability-helper/index";
import { compose } from "recompose";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Alert } from "reactstrap";

import Image from "components/Uploads/Image";
import { Spinner } from "components/Spinner/Spinner";
import SeatsCheckout from "./SeatsCheckout";

import { setError, setModal } from "ducks/modal";
import { createTeam } from "ducks/team"

import Button from 'components/Button'
import ImageOptions from 'components/Forms/ImageOptions'

const TYPE_OPTIONS = [{
  type: 'SOLO',
  text: 'Just Me',
  selected: '/images/icons/solo-active.svg',
  unselected: '/images/icons/solo.svg'
}, {
  type: 'COLLAB',
  text: 'My Team',
  selected: '/images/icons/collaborate-selected.svg',
  unselected: '/images/icons/collaborate.svg'
}]

const WrapForm = props => (
  <div className={"form-control input-wrap mt-3 form-bg"}>
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

class NewTeam extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stage: "TYPE",
      name: "",
      image_url: "",
      error: null,
      invites: [],
      free: true,
      type: null
    };

    this.renderBody = this.renderBody.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.saveTeam = this.saveTeam.bind(this);
    this.addInvite = this.addInvite.bind(this);
    this.confirmInvite = this.confirmInvite.bind(this);
    this.goBack = this.goBack.bind(this);
    this.nextStep = this.nextStep.bind(this);
  }

  componentDidUpdate(prevProps) {
    // const change = this.props.stripe_state !== prevProps.stripe_state;
    // if (this.props.stripe_state === -3 && change) {
    //   this.props.setError({
    //     message:
    //       !this.props.stripe_error ||
    //       this.props.stripe_error === "Payment Failed"
    //         ? "Unable to Create Board - Please try again later or contact support"
    //         : this.props.stripe_error
    //   });
    //   this.props.resetStripe();
    // } else if (this.props.stripe_state === 3 && change) {
    //   this.nextStep();
    // }
  }

  nextStep(team) {
    if(team && team.team_id){
      this.props.history.push(`/team/${team.team_id}`)
      this.props.setModal({
        size: 'sm',
        header: true,
        body: (<div className="text-center mb-4 pl-4 pr-4 text-muted">
          <img src="/images/icons/takeoff.svg" height={140} alt="blast off"/><br/><br/>
          Your board <b>{team.name}</b> has been
          successfully created
        </div>)
      })
    }else{
      this.props.history.push(`/dashboard`);
    }
  }

  addInvite() {
    this.setState({
      invites: update(this.state.invites, { $push: [""] })
    });
  }

  confirmInvite() {
    if (this.state.invites.length > 1) {
      this.setState({ stage: "CHECKOUT" });
    } else {
      this.setState({ stage: "CREATING" });
      this.props.createTeam({
        invites: this.state.invites,
        name: this.state.name,
        image: this.state.image_url
      })
      .then(team => this.nextStep(team))
    }
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  goBack() {
    switch (this.state.stage) {
      case "NAME":
        this.setState({ stage: "TYPE" });
        break;
      case "INVITE":
        this.setState({ stage: "NAME" });
        break;
      case "CHECKOUT":
        this.setState({ stage: "INVITE" }); // Multiplatform paywall soft-disable
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
      if(this.state.type === 'SOLO'){
        this.setState({invites: []}, () => this.confirmInvite())
      }else{
        this.setState({ stage: "INVITE" })
      }
    }
  }

  renderBody() {
    let name = this.state.name || "New Team";
    let seats = this.state.invites.length + 1;

    switch (this.state.stage) {
      case "CREATING":
        return React.createElement(Spinner, { message: "Creating Board" });
      case "CHECKOUT":
        return (
          <div className="text-center">
            <h5 className="uppercase-header">{name}</h5>
            <div className="my-5 pt-4 pb-5">
              <span className="uppercase text-muted">Upgrade Board</span>
              <div className="super-center mt-4">
                <SeatsCheckout
                  prompt="Start Free Trial"
                  invites={this.state.invites}
                  team={{
                    name: this.state.name,
                    image: this.state.image_url
                  }}
                  next={this.nextStep}
                  user={this.props.user}
                  width={400}
                />
              </div>
            </div>
          </div>
        );
      case "INVITE":
        return (
          <div className="text-center mb-5">
            <h5 className="uppercase-header">{name}</h5>
            <div className="my-5 pt-4 pb-5">
              <div>
                <span className="text-muted uppercase">
                  Invite Team Members
                </span>
                <span className="grey-box ml-2">{seats}</span>
              </div>
              {/* <small className="text-muted">up to 2 members free</small> */}
              <div className="super-center mt-4">
                <div style={{ minWidth: 400 }}>
                  <WrapForm
                    value={this.props.user.email}
                    disabled
                    className="disabled"
                  >
                    <label className="text-muted mr-3">
                      OWNER
                    </label>
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
                        className="remove"
                        onClick={() =>
                          this.setState({
                            invites: update(this.state.invites, {
                              $splice: [[i, 1]]
                            })
                          })
                        }
                      >
                      </div>
                    </div>
                  ))}
                  <Button
                    onClick={this.addInvite}
                    isClear
                    isLarge
                    className="mt-3"
                    style={{ fontWeight: 400 }}
                    block
                  >
                    <img src={'/add-step.svg'} className="mr-2 mb-1" height={15} alt="add"/> Add Teammate
                  </Button>
                </div>
              </div>
              <div className="mt-5">
                <Button isPrimary onClick={this.confirmInvite}>
                  Continue
                </Button>
              </div>
            </div>
          </div>
        );
      case "NAME":
        return (
          <div id="name-box" className="text-center">
            <div className="mb-4">
              <h5 className="uppercase-header">Create Board</h5>
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
                placeholder="Enter Board Name"
                required
              />
            </div>
            { this.state.type !== 'SOLO' &&
              <div className="super-center mt-5">
                <div className="text-center">
                  <Image
                    replace
                    className="icon-image icon-image-sm text-center icon-image-square mb-2 mx-auto"
                    path="/image/large_icon"
                    image={this.state.image_url}
                    update={url => this.setState({ image_url: url })}
                  />
                 <div className="text-muted mt-4">Drop team icon here <br></br> or browse</div>
                </div>
              </div>
            }
            <div className="mt-5">
              <Button isPrimary onClick={this.saveTeam}>
                Continue
              </Button>
            </div>
          </div>
        );
      default:
        return (
          <div id="name-box" className="text-center">
            <div className="mb-4">
              <h5 className="uppercase-header">Create Board</h5>
              <div className="mt-5 pt-4">
                <ImageOptions
                  question="Who's using this board?"
                  state={this.state.type}
                  update={(type) => this.setState({type: type})}
                  options={TYPE_OPTIONS}
                  next={()=>this.setState({stage: 'NAME'})}
                />
              </div>
            </div>
          </div>
        );
    }
  }

  render() {
    return (
      <div id="template-box-container">
        <div className="card">
          {["NAME", "INVITE", "CHECKOUT"].includes(this.state.stage) && (
            <div className="mr-3 btn-icon back-btn-large" onClick={this.goBack}/>
          )}
          <Link id="exit-template" to="/dashboard" className="btn-icon"></Link>
          <div className="container">{this.renderBody()}</div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.account,
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

const mapDispatchToProps = dispatch => ({
  createTeam: data => dispatch(createTeam(data)),
  setError: err => dispatch(setError(err)),
  setModal: confirm => dispatch(setModal(confirm))
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(NewTeam);
