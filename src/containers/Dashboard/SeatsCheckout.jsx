import React, { Component } from "react";
import axios from "axios"
import _ from "lodash"
import { CardElement } from "react-stripe-elements";
import { Collapse, Input } from "reactstrap";
import { connect } from 'react-redux';

import StripeHandler from "hocs/withStripeHandler";

import { setError } from 'ducks/modal'
import { updateMembers, createTeam } from 'ducks/team';

import Button from 'components/Button'
import PricingCard from "./PricingCard"
import { PLANS_ID } from "./PLANS"

const STAGES = {
  "CHECKOUT": {},
  "SOURCE": { loader: 'Verifying Card'},
  "CREATE": { loader: 'Creating Subscription'},
  "CHECK": { loader: 'Checking Source'}
}

class SeatsCheckout extends Component {
  constructor(props) {
    super(props);

    let plan = PLANS_ID[props.plan] ? PLANS_ID[props.plan] : undefined;
    let stage = !!plan ? "CHECKOUT" : "PLAN"

    this.calculatePrice = this.calculatePrice.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.checkout = this.checkout.bind(this);
    this.checkSource = this.checkSource.bind(this);

    if(props.team && props.team.status > 0 && props.team.stripe_id) {
      stage = "CHECK"
      this.checkSource(props.team)
    }

    this.state = {
      coupon: "",
      coupon_toggle: false,
      loading: true,
      plan,
      stage
    };
  }

  async checkSource(team) {
    try {
      const source = (await axios.get(`/team/${team.team_id}/source`)).data
      if(_.isEmpty(source)) throw new Error()

      this.setState({
        loading: false,
        source: source,
        stage: "CHECKOUT"
      })
    } catch(err) {
      this.props.setError("Unable to retrieve card info")
      this.setState({
        stage: "CHECKOUT"
      })
    }
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  calculatePrice() {
    const base = this.state.plan ? this.state.plan.rate : null
    let price = 0;
    let members = 0;
    if (Array.isArray(this.props.invites)) {
      members = (this.props.invites.length + 1)
      price += members * base;
    } else if (Array.isArray(this.props.members)) {
      members = this.props.members.length
      price += members * base;
    }
    return {members, price}
  }

  async checkout(e) {
    // A source already exists
    if(this.state.source) {
      this.setState({stage: "CREATE"})
      await this.props.updateMembers(this.props.members, {plan: this.state.plan.id})
      this.props.next()
      return;
    }

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
          image: this.props.team.image,
          plan: this.state.plan.id
        })

        this.props.next(team);
      } else if (Array.isArray(this.props.members)) {
        // use the checkout to update existing members
        await this.props.updateMembers(this.props.members, {source, plan: this.state.plan.id})
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
    if(this.state.stage === 'PLAN'){
      return <div className="d-flex align-items-start justify-content-center mb-4 mx--2 w-100">
        <PricingCard plan="PROFESSIONAL" upgrade={(plan) => this.setState({plan, stage: 'CHECKOUT'})} delay={300}/>
        <PricingCard plan="BUSINESS" upgrade={(plan) => this.setState({plan, stage: 'CHECKOUT'})} delay={600}/>
      </div>
    }

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
      <div style={{width: this.props.width || 400}}>
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
          { !this.props.status && <>
            <Collapse isOpen={this.state.coupon_toggle}>
              <Input
                name="coupon"
                value={this.state.coupon}
                onChange={this.handleChange}
                placeholder="Coupon Code"
              />
            </Collapse>
            { this.state.source ? <>
              <div className="space-between">
                <label>Payment Details</label>
                <small
                  className="btn-link"
                  onClick={this.props.modify}
                >
                  Modify
                </small>
              </div>
              <input
                value={`[${this.state.source.brand}] XXXX-XXXX-XXXX-${this.state.source.last4}`}
                className="disabled form-control"
                style={{ height: 40 }}
                disabled
              />
            </> : <>
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
            </> }
          </>}
          <div className="super-center">
            <Button
              isBtn
              isPrimary
              className="mt-4 mb-4"
              onClick={(e) => {e.preventDefault(); this.checkout()}}
            >
              {this.props.prompt || "Start Free Trial"}
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  setError: err => dispatch(setError(err)),
  updateMembers: (members, options) => dispatch(updateMembers(members, options)),
  createTeam: (data) => dispatch(createTeam(data))
});

export default StripeHandler(connect(null, mapDispatchToProps)(SeatsCheckout), 500);
