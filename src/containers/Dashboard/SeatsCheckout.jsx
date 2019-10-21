import axios from 'axios';
import countryRegionData from 'country-region-data';
import _ from 'lodash';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Select from 'react-select';
import { CardElement } from 'react-stripe-elements';
import { Alert, Collapse, Input } from 'reactstrap';

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

    if (team && team.status > 0 && team.stripe_id) {
      stage = 'CHECK';
      this.checkSource(team);
    }

    this.state = {
      couponInputTimeout: null,
      freeCoupon: false,
      coupon: '',
      coupon_toggle: false,
      loading: true,
      plan,
      stage,
      country: null,
      region: null,
      postalCode: null,
      invalid: false,
      invalidMessage: null,
      countryOptions: countryRegionData.map((countryObject) => {
        return {
          value: countryObject.countryShortCode,
          label: countryObject.countryName,
          regions: countryObject.regions.map((region) => {
            return {
              value: region.name,
              label: region.name,
            };
          }),
        };
      }),
      regionsOptions: [],
    };
  }

  checkSource = async (team) => {
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
  };

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  couponHandler = (event) => {
    const { plan } = this.state;
    const coupon = event.target && event.target.value;

    this.setState({
      invalid: false,
      coupon,
    });

    clearTimeout(this.state.couponInputTimeout);

    if (!coupon) return;

    const newTimeout = setTimeout(() => {
      axios
        .get(`/team/coupons/${coupon}`)
        .then(({ data }) => {
          if (plan.id === data.plan) {
            this.setState({
              invalid: !data.valid,
              invalidMessage: !data.valid ? 'This coupon is invalid' : null,
              freeCoupon: data.valid && !data.stripeCoupon,
            });
          } else {
            this.setState({
              invalid: true,
              freeCoupon: false,
              invalidMessage: 'This coupon is valid for a different plan.',
            });
          }
        })
        .catch(() => {
          this.setState({
            freeCoupon: false,
          });
        });
    }, 150);

    this.setState({
      couponInputTimeout: newTimeout,
    });
  };

  updateRegion = (val) => {
    this.setState({
      region: val,
    });
  };

  updateCountry = (val) => {
    this.setState({
      country: val,
      regionsOptions: val.regions,
      region: null,
    });
  };

  calculatePrice = () => {
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

    if (this.state.freeCoupon === true) {
      price = 0;
    }
    return { members, price };
  };

  resetInvalidity = () => {
    this.setState({
      invalid: false,
      invalidMessage: null,
    });
  };

  isInvalid = () => {
    if ((!this.state.country || !this.state.region || !this.state.postalCode) && !this.state.source) {
      return true;
    }
    return false;
  };

  checkout = async () => {
    const { source, plan, coupon, country } = this.state;
    const { updateMembers, members, next, stripe, team_name, user, checkChargeable, invites, createTeam, team: propsTeam, setError } = this.props;
    this.resetInvalidity();

    if (this.state.freeCoupon === false) {
      if (this.isInvalid()) {
        this.setState({
          invalid: true,
          invalidMessage: 'Please fill all required fields (*).',
        });
        return;
      }

      // A source already exists
      if (source) {
        this.setState({ stage: 'CREATE' });
        await updateMembers(members, { plan: plan.id, country });
        next();
        return;
      }
    }

    try {
      let locationData = null;
      let newSource = null;
      if (this.state.freeCoupon === false) {
        this.setState({ stage: 'SOURCE' });

        const { source: stripeSource } = await stripe.createSource({
          type: 'card',
          metadata: {
            team: team_name,
          },
          owner: {
            name: user.name,
            email: user.email,
          },
        });
        newSource = stripeSource;

        locationData = {
          countryCode: this.state.country.value,
          region: this.state.region.value,
          postalCode: this.state.postalCode,
        };

        if (!newSource) throw new Error('Invalid Card Information');

        await checkChargeable(newSource);
      }

      this.setState({ stage: 'CREATE' });
      if (Array.isArray(invites)) {
        const team = await createTeam({
          source: newSource,
          invites,
          name: propsTeam.name,
          image: propsTeam.image,
          plan: plan.id,
          coupon,
          locationData,
        });

        return next(team);
      }
      if (Array.isArray(members)) {
        // use the checkout to update existing members
        await updateMembers(members, { source: newSource, plan: plan.id, coupon, locationData });
        return next();
      }
      throw new Error('Invalid Member Format');
    } catch (err) {
      if (err) setError(err);
      this.setState({ stage: 'CHECKOUT' });
    }
  };

  downgrade = () => {
    const { removeTrial, team, downgradeComplete } = this.props;

    removeTrial(team.team_id)
      .then(() => downgradeComplete())
      .catch(() => downgradeComplete());
  };

  render() {
    const { stage, loading, coupon, coupon_toggle, source, freeCoupon } = this.state;
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
                <div className="upgrade-plan-price-sum__period">/ mo + tax</div>
              </div>
            </div>
          </div>
          {!status && (
            <>
              {!source && !freeCoupon && (
                <>
                  <label>Address</label>
                  <Select
                    classNamePrefix="select-box"
                    className="mb-3"
                    placeholder="Select your Country"
                    name="country"
                    onChange={this.updateCountry}
                    value={this.state.country}
                    options={this.state.countryOptions}
                  ></Select>
                  <Select
                    classNamePrefix="select-box"
                    className="mb-3"
                    placeholder="Select your Region"
                    name="region"
                    onChange={this.updateRegion}
                    value={this.state.region}
                    options={this.state.regionsOptions}
                  ></Select>
                  <Input name="postalCode" onChange={this.handleChange} className="mb-3" placeholder="Zip/Postal Code" />
                </>
              )}
              {!freeCoupon && (
                <>
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
                        <small
                          className="btn-link"
                          onClick={() =>
                            this.setState({
                              coupon_toggle: !coupon_toggle,
                              coupon: '',
                            })
                          }
                        >
                          {coupon_toggle ? 'Cancel Coupon' : 'I Have a Coupon'}
                        </small>
                      </div>
                      <div style={{ height: 40 }}>
                        <CardElement onReady={() => this.setState({ loading: false })} />
                      </div>
                    </>
                  )}
                </>
              )}
              <Collapse isOpen={coupon_toggle}>
                <div className="space-between">
                  <label>Coupon Code</label>
                </div>
                <Input name="coupon" value={coupon} onChange={this.couponHandler} placeholder="Coupon Code" style={{ marginBottom: '5px' }} />
              </Collapse>
            </>
          )}
          {this.state.invalid === true && (
            <Alert color="danger" style={{ marginTop: '5px', marginBottom: '0px' }}>
              {this.state.invalidMessage}
            </Alert>
          )}
          <div className="super-center">
            <Button
              isBtn
              isPrimary
              disabled={this.state.invalid}
              className="mt-2 mb-2"
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

const mapDispatchToProps = {
  removeTrial,
  setError,
  updateMembers,
  createTeam,
};

export default StripeHandler(
  connect(
    null,
    mapDispatchToProps
  )(SeatsCheckout),
  500
);
