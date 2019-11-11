import axios from 'axios';
import _ from 'lodash';
import moment from 'moment';
import React, { Component } from 'react';
import { CardElement } from 'react-stripe-elements';

import Button from '@/components/Button';
import { Spinner } from '@/components/Spinner';
import { withStripe } from '@/hocs';

const Invoice = ({ invoice }) => {
  if (!invoice) return null;
  return (
    <div className="card px-4 py-3 mb-3">
      <span>
        {moment.unix(invoice.timestamp).format('MMMM Do YYYY')}
        {invoice.status && <b className="text-danger ml-2">({invoice.status})</b>}
      </span>
      <h2 className="my-2">${invoice.amount / 100}</h2>
      <small className="text-muted">
        {invoice.items.map((item, i) => (
          <div key={i}>{item}</div>
        ))}
      </small>
    </div>
  );
};

class Billing extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stage: 'LOADING',
    };

    this.updateSource = this.updateSource.bind(this);
  }

  componentDidMount() {
    this.fetchInvoice();
  }

  async fetchInvoice() {
    const { update, team, setError } = this.props;
    try {
      const response = await axios.get(`/team/${team.team_id}/invoice`);
      if (response.status === 204) {
        setTimeout(() => update('CHECKOUT'), 500);
        return;
      }

      this.setState({
        upcoming: response.data.upcoming,
        invoices: response.data.invoices,
      });

      const source = (await axios.get(`/team/${team.team_id}/source`)).data;
      this.setState({
        source,
        stage: 'INVOICE',
      });
    } catch (err) {
      setError(_.get(err, ['response', 'data']) || (err && JSON.stringify(err)) || 'Unable to Retrieve Information');
    }
  }

  async updateSource() {
    const { stripe, team, user, checkChargeable, updatePay, setError } = this.props;
    try {
      this.setState({ stage: 'UPDATE_SOURCE' });

      const { source } = await stripe.createSource({
        type: 'card',
        metadata: {
          team: team.name,
        },
        owner: {
          name: user.name,
          email: user.email,
        },
      });

      if (!source) throw new Error('Invalid Card Information');

      await checkChargeable(source);

      const new_source = (await axios.patch(`/team/${team.team_id}/source`, { source })).data;

      this.setState({
        source: new_source,
        stage: 'INVOICE',
      });

      updatePay();
    } catch (err) {
      setError(_.get(err, ['response', 'data']) || err || 'Unable to Retrieve Information');
      this.setState({ stage: 'STRIPE' });
    }
  }

  render() {
    const { stage, source, upcoming, invoices } = this.state;
    if (stage === 'LOADING') {
      return <Spinner message="Fetching Status" />;
    }

    return (
      <div className="mb-4">
        {source && (
          <div className="position-relative">
            <label>Payment Option</label>
            {stage === 'INVOICE' && (
              <div className="position-absolute w-100" style={{ backgroundColor: '#FFF' }}>
                <input value={`[${source.brand}] XXXX-XXXX-XXXX-${source.last4}`} className="disabled form-control" style={{ height: 40 }} disabled />
                <div className="mt-2 px-1 space-between">
                  <Button isBtn isLink onClick={() => this.setState({ stage: 'STRIPE' })}>
                    Update
                  </Button>
                </div>
              </div>
            )}
            {stage === 'UPDATE_SOURCE' && <Spinner isEmpty />}
            <div style={{ visibility: stage === 'STRIPE' ? 'visible' : 'hidden' }}>
              <div style={{ height: 40 }}>
                <CardElement />
              </div>
              <div className="space-between mt-2 px-1">
                <Button isBtn isLink onClick={() => this.setState({ stage: 'INVOICE' })}>
                  Cancel
                </Button>
                <Button isBtn isLink onClick={this.updateSource}>
                  Save
                </Button>
              </div>
            </div>
          </div>
        )}
        <hr />
        <label>Next Invoice</label>
        <Invoice invoice={upcoming} />
        <hr />
        <label>Past Invoices</label>
        {Array.isArray(invoices) && invoices.map((invoice, i) => <Invoice key={i} invoice={invoice} />)}
      </div>
    );
  }
}

export default withStripe(Billing);
