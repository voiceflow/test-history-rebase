import React, { Component } from "react";
import StripeHandler from "views/HOC/StripeHandler";
import { CardElement } from "react-stripe-elements";
import { Collapse, Input } from "reactstrap";
import { connect } from 'react-redux';
import { setError } from 'ducks/modal'
import { updateMembers, createTeam } from 'ducks/team';
import moment from "moment";

const STAGES = {
  "CHECKOUT": {},
  "SOURCE": { loader: 'Verifying Card'},
  "CREATE": { loader: 'Creating Subscription'}
}

class SeatsCheckout extends Component {
  constructor(props) {
    super(props);

    this.state = {
      coupon: "",
      coupon_toggle: false,
      support: false,
      loading: true,
      stage: "CHECKOUT"
    };

    this.calculatePrice = this.calculatePrice.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.checkout = this.checkout.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  calculatePrice() {
    let price = 0;
    let members = 0;
    if (this.state.support) {
      price += 249;
    }
    if (Array.isArray(this.props.invites)) {
      members = (this.props.invites.length + 1)
      price += members * 29;
    } else if (Array.isArray(this.props.members)) {
      members = this.props.members.length
      price += members * 29;
    }
    return {members, price}
  }

  async checkout(e) {
    try {
      this.setState({ stage: "SOURCE" });

      const { source } = await this.props.stripe.createSource({
        type: "card",
        metadata: {
          team: this.props.team_name
        },
        owner: {
          name: this.props.user.name,
          email: this.props.user.email
        }
      });

      if(!source) throw new Error("Invalid Card Information")

      await this.props.checkChargeable(source);

      this.setState({ stage: "CREATE" });
      if (Array.isArray(this.props.invites)) {
        const team = await this.props.createTeam({
          source,
          invites: this.props.invites,
          name: this.props.team.name,
          image: this.props.team.image
        })

        this.props.next(team);
      } else if (Array.isArray(this.props.members)) {
        // use the checkout to update existing members
        await this.props.updateMembers(this.props.members, {source})
        this.props.next();
      } else {
        throw new Error("Invalid Member Format")
      }
    } catch (err) {
      if(err) this.props.setError(err)
      this.setState({ stage: 'CHECKOUT' })
    }
  }

  render() {
    var loader
    if(this.state.loading){
      loader = <span className="loader text-lg"/>
    }else if(STAGES[this.state.stage] && STAGES[this.state.stage].loader){
      loader = <>
        <span className="loader text-lg mb-3"/><br/>
        {STAGES[this.state.stage].loader}
      </>
    }

    const {price, members} = this.calculatePrice()
    return (
      <>
        {loader && <div className="w-100 position-relative">
          <div className="text-center mt-5 position-absolute w-100">
            {loader}
          </div>
        </div>}
        <div
          style={{ visibility: !!loader ? "hidden" : "visible" }}
          className="text-left"
        >
          <div>
            <div className="upgrade-plan pointer" onClick={this.props.collab}>
              <div className="super-center">
                <img
                  alt="collab"
                  src="/images/icons/collaborate-selected.svg"
                  height={64}
                  width={64}
                  className="mr-4"
                />
                <div>
                  <span>{members} Collaborators</span>
                  <br />
                  <small className="text-muted">Billed Monthly</small>
                </div>
              </div>
              <div className="d-flex">
                <div className="upgrade-plan-price-sum__symbol">$</div>
                <div className="upgrade-plan-price-sum__cost">{price}</div>
                <div className="upgrade-plan-price-sum__period">/ mo</div>
              </div>
            </div>
          </div>
          <Collapse isOpen={this.state.coupon_toggle}>
            <Input
              name="coupon"
              value={this.state.coupon}
              onChange={this.handleChange}
              placeholder="Coupon Code"
            />
          </Collapse>
          <div className="space-between">
            <label>Payment Details</label>
            <small
              className="btn-link"
              onClick={() =>
                this.setState({ coupon_toggle: !this.state.coupon_toggle })
              }
            >
              {this.state.coupon_toggle ? "Cancel Coupon" : "I Have Coupon"}
            </small>
          </div>
          <div style={{height: 40}}>
            <CardElement onReady={() => this.setState({ loading: false })} />
          </div>
          <div className="super-center">
            <button
              className="btn btn-primary mt-4 mb-4"
              onClick={(e) => {e.preventDefault(); this.checkout()}}
            >
              {this.props.prompt || "Start Free Trial"}
            </button>
          </div>
          {this.props.trial && (
            <div className="text-center">
              <div className="text-muted text-sm">
                Your 14-day free trial will end on{" "}
                <span className="text-dark">
                  {moment()
                    .add(14, "days")
                    .format("MMMM Do, YYYY")}
                </span>
                <br />
                at which point you will be charged{" "}
                <span className="text-dark">${price}/mo</span>
              </div>
            </div>
          )}
        </div>
      </>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  setError: err => dispatch(setError(err)),
  updateMembers: (members, options) => dispatch(updateMembers(members, options)),
  createTeam: (data) => dispatch(createTeam(data))
});

export default StripeHandler(connect(null, mapDispatchToProps)(SeatsCheckout));
