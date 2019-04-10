import React, { Component } from "react";
import { injectStripe, Elements, StripeProvider } from "react-stripe-elements";

const MAX_POLL_COUNT = 30;
const POLL_INTERVAL = 1000;

// SECRET
const STRIPE_KEY =
  process.env.NODE_ENV === "production"
    ? "pk_live_9QXjJjWc0sjk8VSwbQT3viub"
    : "pk_test_G3o7CC0pvrW2cIbIU1bLkMSR";

const StripeHandler = WrappedComponent => {
  WrappedComponent = injectStripe(WrappedComponent)

  return class extends Component {
    constructor(props) {
      super(props);

      this.state = {
        stripe_load: false,
        stripe: null
      };

      this.checkChargeable = this.checkChargeable.bind(this)
    }

    componentDidMount() {
      if (window.stripe) {
        this.setState({ stripe: window.stripe });
      } else {
        const script = document.createElement("script");
        script.src = "https://js.stripe.com/v3/";
        script.onload = () => {
          window.stripe = window.Stripe(STRIPE_KEY);
          this.setState({
            stripe: window.stripe,
            stripe_load: false
          });
        };
        document.body.appendChild(script);
        this.script = script;
      }
    }

    componentWillUnmount() {
      if (this.script) document.body.removeChild(this.script);
    }

    checkChargeable(source) {
      return new Promise((resolve, reject) => {
        let pollCount = 0;
        const pollForSourceStatus = () => {
          this.state.stripe
            .retrieveSource({
              id: source.id,
              client_secret: source.client_secret
            })
            .then(result => {
              // Depending on the Charge status, show your customer the relevant message.
              var temp_source = result.source;
              if (temp_source.status === "chargeable") {
                resolve();
              } else if (
                temp_source.status === "pending" &&
                pollCount < MAX_POLL_COUNT
              ) {
                // Try again in a second, if the Source is still `pending`:
                pollCount += 1;
                setTimeout(pollForSourceStatus, POLL_INTERVAL);
              } else {
                reject('Payment not valid - unable to verify card');
              }
            });
        };
        pollForSourceStatus();
      });
    }

    setError(err, status = -1) {
      let error = "Payment Failed";
      if (err.response && err.response.data && err.response.data.message) {
        error = err.response.data.message;
      }
      this.setState({
        stripe_error: error.toString(),
        stripe_state: status
      });
    }

    render() {
      return (
        <StripeProvider stripe={this.state.stripe}>
          <Elements>
            <WrappedComponent {...this.props} checkChargeable={this.checkChargeable}/>
          </Elements>
        </StripeProvider>
      );
    }
  }
};

export default StripeHandler;
