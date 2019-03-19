import React, { Component } from "react";
import axios from "axios";
import { Alert, Button } from "reactstrap";
import { Link } from "react-router-dom";
import _ from "lodash";
import Image from "views/components/Uploads/Image";
import update from "immutability-helper";
import { Spinner } from "views/components/Spinner";
import moment from "moment";
// import StripeCheckout from "react-stripe-checkout";

const MAX_POLL_COUNT = 15;
const POLL_INTERVAL = 1000;

// SECRET
const STRIPE_KEY =
  process.env.NODE_ENV === "production"
    ? "pk_live_9QXjJjWc0sjk8VSwbQT3viub"
    : "pk_test_G3o7CC0pvrW2cIbIU1bLkMSR";

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

class NewTeam extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stage: 0,
      name: "",
      image_url: "",
      error: null,
      invites: [],
      free: true,
      stripe_load: true
    };

    this.renderBody = this.renderBody.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.saveTeam = this.saveTeam.bind(this);
    this.addInvite = this.addInvite.bind(this);
    this.confirmInvite = this.confirmInvite.bind(this);
    this.onSource = this.onSource.bind(this);
    this.goBack = this.goBack.bind(this);
    this.openStripe = this.openStripe.bind(this)
  }

  componentDidMount() {
    const CONFIG = {
      name:"Voiceflow", 
      description:"Team Plan Monthly",
      image:"https://s3.amazonaws.com/com.getstoryflow.api.images/logo.png",
      email: window.user_detail.email,
      zipCode: true,
      key: STRIPE_KEY,
      source: this.onSource
    }

    if(!window.StripeCheckout){
      const script = document.createElement('script')
      script.src = 'https://checkout.stripe.com/checkout.js'
      script.onload = () => {
        this.stripeHandler = window.StripeCheckout.configure(CONFIG)
        this.setState({ stripe_load: false })
      }
      document.body.appendChild(script)
      this.script = script
    }else{
      this.stripeHandler = window.StripeCheckout.configure(CONFIG)
    }
  }

  componentWillUnmount() {
    if(this.stripeHandler) this.stripeHandler.close()
    if(this.script) document.body.removeChild(this.script)
  }

  openStripe(e) {
    e.preventDefault()
    if(this.stripeHandler && !this.state.stripe_load){
      this.setState({stripe_load: true})
      this.stripeHandler.open({
        closed: () => {
          this.setState({stripe_load: false})
          let gtfo = document.getElementsByClassName("stripe_checkout_app")
          if(gtfo && gtfo.length !== 0) gtfo[0].parentNode.removeChild(gtfo[0])
        }
      })
    }
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

  resetError() {
    if (this.timeout) clearTimeout(this.timeout);
    this.timeout = setTimeout(() => this.setState({ error: null }), 3000);
  }

  saveTeam() {
    if (this.state.name.length > 32) {
      this.setState({ error: "Team Name Too Long - 32 Characters Max" });
      this.resetError();
    } else if (!this.state.name.trim()) {
      this.setState({ error: "Please Fill in Team Name" });
      this.resetError();
    } else {
      this.setState({ stage: 1 });
    }
  }

  onSource(source) {
    console.log(source)
    // axios
    //   .post("/team/checkout", {
    //     source: source,
    //     invites: this.state.invites,
    //     name: this.state.name,
    //     image_url: this.state.image_url
    //   })
    //   .then(() => {
    //     console.log("I GOT BACK")
    //   });
  }

  async handlePayment(source = null) {
    this.setState({ stage: 2 });
    let body = {
      plan: this.props.selected
    };
    if (source) {
      body.source = source;
    }
    if (
      typeof this.state.promo === "string" &&
      this.state.promo.length === 12 &&
      !this.promo_invalid
    ) {
      body.promo = this.state.promo;
    }
    axios
      .post("/customer/subscription", body)
      .then(res => {
        let that = this;
        if (source) {
          that.setState({ stage: 3 });
          let pollCount = 0;
          let pollForSourceStatus = () => {
            that.props.stripe
              .retrieveSource({
                id: source.id,
                client_secret: source.client_secret
              })
              .then(result => {
                // Depending on the Charge status, show your customer the relevant message.
                var temp_source = result.source;
                if (temp_source.status === "chargeable") {
                  setTimeout(() => that.setState({ stage: 4 }), 5000);
                } else if (
                  temp_source.status === "pending" &&
                  pollCount < MAX_POLL_COUNT
                ) {
                  // Try again in a second, if the Source is still `pending`:
                  pollCount += 1;
                  setTimeout(pollForSourceStatus, POLL_INTERVAL);
                } else {
                  that.setState({
                    error: `Payment is deferred - You will receieve an email and will be 
                                    updated when the charge comes through`
                  });
                }
              });
          };
          pollForSourceStatus();
        } else {
          setTimeout(() => that.setState({ stage: 4 }), 5000);
        }
      })
      .catch(err => {
        console.log(err);
        let error = "Payment Failed";
        if (err.response && err.response.data && err.response.data.message) {
          console.log(err.response.data);
          error = err.response.data.message;
        }
        this.setState({ error: error });
      });
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
                className="space-between mx-auto mt-4 py-4 px-5 border rounded"
                style={{
                  maxWidth: 600
                }}
              >
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
              <Button className="purple-btn mt-5 mb-4" onClick={this.openStripe} style={{width: 144}} disabled={ this.state.stripe_load }>
                { this.state.stripe_load ? <span className="loader"/> : 'Start Free Trial' }
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

export default NewTeam;
