import React, { Component } from "react";
import axios from "axios";
import moment from "moment";
import StripeHandler from "views/HOC/StripeHandler";
import { CardElement } from "react-stripe-elements";

const Invoice = props => {
  if (!props.invoice) return null;
  return (
    <>
      <span>{moment.unix(props.invoice.timestamp).format("MMMM Do YYYY")}</span>
      <h2 className="my-2">${props.invoice.amount / 100}</h2>
      <span className="text-muted">
        {props.invoice.items.map((item, i) => (
          <div key={i}>{item}</div>
        ))}
      </span>
    </>
  );
};

class Billing extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stage: "LOADING",
    };

    this.updateSource = this.updateSource.bind(this)
  }

  componentDidMount() {
    this.fetchInvoice()
  }

  async fetchInvoice() {
    try {
      const response = await axios.get(`/team/${this.props.team.team_id}/invoice`)
      if(response.status === 204){
        this.props.update("CHECKOUT")
        return
      }

      this.setState({
        upcoming: response.data.upcoming,
        invoices: response.data.invoices
      })

      const source = (await axios.get(`/team/${this.props.team.team_id}/source`)).data
      this.setState({
        source: source,
        stage: "INVOICE"
      })
    } catch(err) {
      this.props.setError(
        (err && err.response && err.response.data) || 
        (err && JSON.stringify(err)) || 
        'Unable to Retrieve Information'
      )
    }
  }

  async updateSource() {
    try {
      this.setState({stage: "UPDATE_SOURCE"})
      
      const { source } = await this.props.stripe.createSource({
        type: "card",
        metadata: {
          team: this.props.team.name
        },
        owner: {
          name: this.props.user.name,
          email: this.props.user.email
        }
      });

      if(!source) throw new Error("Invalid Card Information")

      await this.props.checkChargeable(source);

      const new_source = (await axios.patch(`/team/${this.props.team.team_id}/source`, { source })).data

      this.setState({
        source: new_source,
        stage: "INVOICE"
      })

    } catch (err) {
      this.props.setError(
        (err && err.response && err.response.data) || err || 'Unable to Retrieve Information'
      )
      this.setState({ stage: 'STRIPE' })
    }
  }

  render() {
    switch(this.state.stage) {
      case "LOADING":
        return <div className="text-center my-5 py-5">
          <span className="loader text-lg mb-3"/>
          <div>Fetching Status</div>
        </div>
      default:
        return (
          <div className="mb-4">
            {this.state.source && (
              <div className="position-relative">
                <label>Payment Option</label>
                {this.state.stage === "INVOICE" && 
                  <div className="position-absolute w-100">
                    <input
                      value={`[${this.state.source.brand}] XXXX-XXXX-XXXX-${this.state.source.last4}`}
                      className="disabled form-control"
                      style={{ height: 40 }}
                      disabled
                    />
                    <div className="mt-2 px-1">
                      <button className="btn btn-link" onClick={() => this.setState({stage: "STRIPE"})}>Update</button>
                    </div>
                  </div>
                }
                {this.state.stage === 'UPDATE_SOURCE' && 
                  <div className="text-center position-absolute py-2 w-100">
                    <span className="loader text-lg"/>
                  </div>
                }
                <div style={{ visibility: this.state.stage === "STRIPE" ? "visible" : "hidden" }}>
                  <div style={{ height: 40 }}>
                    <CardElement/>
                  </div>
                  <div className="space-between mt-2 px-1">
                    <button className="btn btn-link" onClick={() => this.setState({stage: "INVOICE"})}>Cancel</button>
                    <button className="btn btn-link" onClick={this.updateSource}>
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}
            <hr />
            <label>Next Invoice</label>
            <Invoice invoice={this.state.upcoming} />
            <hr />
            <label>Past Invoices</label>
            {Array.isArray(this.state.invoices) &&
              this.state.invoices.map((invoice, i) => (
                <Invoice key={i} invoice={invoice} />
              ))}
          </div>
        );
    }
  }
}

export default StripeHandler(Billing);
