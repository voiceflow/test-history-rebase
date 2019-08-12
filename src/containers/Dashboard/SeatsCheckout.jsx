import axios from 'axios';
import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { CardElement } from 'react-stripe-elements';
import { Collapse, Input } from 'reactstrap';

import Button from '@/components/Button';
import { Spinner } from '@/components/Spinner';
import { setError } from '@/ducks/modal';
import { createTeam, removeTrial, updateMembers } from '@/ducks/team';
import StripeHandler from '@/hocs/withStripeHandler';

import { PLANS_ID } from './PLANS';
import PricingCard from './PricingCard';

const STAGES = {
  CHECKOUT: {},
  SOURCE: { loader: 'Verifying Card' },
  CREATE: { loader: 'Creating Subscription' },
  CHECK: { loader: 'Checking Source' },
};

class SeatsCheckout extends Component {
  constructor(props) {
    super(props);

    const { plan: propsPlan, team } = this.props;

    const plan = PLANS_ID[propsPlan] ? PLANS_ID[propsPlan] : undefined;
    let stage = plan ? 'CHECKOUT' : 'PLAN';

    this.calculatePrice = this.calculatePrice.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.checkout = this.checkout.bind(this);
    this.checkSource = this.checkSource.bind(this);

    if (team && team.status > 0 && team.stripe_id) {
      stage = 'CHECK';
      this.checkSource(team);
    }

    this.state = {
      coupon: '',
      coupon_toggle: false,
      loading: true,
      plan,
      stage,
    };
  }

  async checkSource(team) {
    const { setError } = this.props;
    try {
      const source = (await axios.get(`/team/${team.team_id}/source`)).data;
      if (_.isEmpty(source)) throw new Error();

      this.setState({
        loading: false,
        source,
        stage: 'CHECKOUT',
      });
    } catch (err) {
      setError('Unable to retrieve card info');
      this.setState({
        stage: 'CHECKOUT',
      });
    }
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  calculatePrice() {
    const { plan } = this.state;
    const { invites, members: planMembers } = this.props;
    const base = plan ? plan.rate : null;
    let price = 0;
    let members = 0;
    if (Array.isArray(invites)) {
      members = invites.length + 1;
      price += members * base;
    } else if (Array.isArray(planMembers)) {
      members = planMembers.length;
      price += members * base;
    }
    return { members, price };
  }

  async checkout() {
    const { source, plan, coupon } = this.state;
    const { updateMembers, members, next, stripe, team_name, user, checkChargeable, invites, createTeam, team: propsTeam, setError } = this.props;
    // A source already exists
    if (source) {
      this.setState({ stage: 'CREATE' });
      await updateMembers(members, { plan: plan.id });
      next();
      return;
    }

    try {
      this.setState({ stage: 'SOURCE' });

      const { source } = await stripe.createSource({
        type: 'card',
        metadata: {
          team: team_name,
        },
        owner: {
          name: user.name,
          email: user.email,
        },
      });

      if (!source) throw new Error('Invalid Card Information');

      await checkChargeable(source);

      this.setState({ stage: 'CREATE' });
      if (Array.isArray(invites)) {
        const team = await createTeam({
          source,
          invites,
          name: propsTeam.name,
          image: propsTeam.image,
          plan: plan.id,
          coupon,
        });

        return next(team);
      }
      if (Array.isArray(members)) {
        // use the checkout to update existing members
        await updateMembers(members, { source, plan: plan.id, coupon });
        return next();
      }
      throw new Error('Invalid Member Format');
    } catch (err) {
      if (err) setError(err);
      this.setState({ stage: 'CHECKOUT' });
    }
  }

  downgrade = () => {
    const { removeTrial, team, downgradeComplete } = this.props;

    removeTrial(team.team_id)
      .then(() => downgradeComplete())
      .catch(() => downgradeComplete());
  };

  render() {
    const { stage, loading, coupon, coupon_toggle, source } = this.state;
    const { width, collab, status, modify, prompt, team } = this.props;
    if (stage === 'PLAN') {
      return (
        <div className="d-flex align-items-start justify-content-center mb-4 mx--2 w-100">
          <PricingCard
            plan="PROFESSIONAL"
            upgrade={(plan) => this.setState({ plan, stage: 'CHECKOUT' })}
            delay={300}
            downgrade={team.expiry && (() => this.downgrade())}
          />
          <PricingCard plan="BUSINESS" upgrade={(plan) => this.setState({ plan, stage: 'CHECKOUT' })} delay={600} />
        </div>
      );
    }

    let loader;
    if (loading) {
      loader = <Spinner isEmpty />;
    } else if (STAGES[stage] && STAGES[stage].loader) {
      loader = <Spinner message={STAGES[stage].loader} />;
    }

    const { price, members } = this.calculatePrice();
    return (
      <div style={{ width: width || 400 }}>
        {loader && <div className="w-100 position-relative">{loader}</div>}
        <div style={{ visibility: loader ? 'hidden' : 'visible' }} className="text-left">
          <div>
            <div className="upgrade-plan pointer" onClick={collab}>
              <div className="super-center">
                <img alt="collab" src="/images/icons/collaborate-selected.svg" height={64} width={64} className="mr-4" />
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
          {!status && (
            <>
              <Collapse isOpen={coupon_toggle}>
                <Input name="coupon" value={coupon} onChange={this.handleChange} placeholder="Coupon Code" />
              </Collapse>
              {source ? (
                <>
                  <div className="space-between">
                    <label>Payment Details</label>
                    <small className="btn-link" onClick={modify}>
                      Modify
                    </small>
                  </div>
                  <input
                    value={`[${source.brand}] XXXX-XXXX-XXXX-${source.last4}`}
                    className="disabled form-control"
                    style={{ height: 40 }}
                    disabled
                  />
                </>
              ) : (
                <>
                  <div className="space-between">
                    <label>Payment Details</label>
                    <small className="btn-link" onClick={() => this.setState({ coupon_toggle: !coupon_toggle })}>
                      {coupon_toggle ? 'Cancel Coupon' : 'I Have Coupon'}
                    </small>
                  </div>
                  <div style={{ height: 40 }}>
                    <CardElement onReady={() => this.setState({ loading: false })} />
                  </div>
                </>
              )}
            </>
          )}
          <div className="super-center">
            <Button
              isBtn
              isPrimary
              className="mt-4 mb-4"
              onClick={(e) => {
                e.preventDefault();
                this.checkout();
              }}
            >
              {prompt || 'Start Free Trial'}
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  removeTrial: (team_id) => dispatch(removeTrial(team_id)),
  setError: (err) => dispatch(setError(err)),
  updateMembers: (members, options) => dispatch(updateMembers(members, options)),
  createTeam: (data) => dispatch(createTeam(data)),
});

export default StripeHandler(
  connect(
    null,
    mapDispatchToProps
  )(SeatsCheckout),
  500
);
