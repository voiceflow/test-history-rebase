import React, { Component } from "react";
import { injectStripe, Elements, StripeProvider } from "react-stripe-elements";

// SECRET
const STRIPE_KEY =
  process.env.NODE_ENV === "production"
    ? "pk_live_9QXjJjWc0sjk8VSwbQT3viub"
    : "pk_test_G3o7CC0pvrW2cIbIU1bLkMSR";

const StripeHandler = WrappedComponent => {
  WrappedComponent = injectStripe(WrappedComponent);

  return class extends Component {
    constructor(props) {
      super(props);

      this.state = {
        stripe_load: false,
        stripe: null
      };
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
            <WrappedComponent {...this.props}/>
          </Elements>
        </StripeProvider>
      );
    }
  }
};

export default StripeHandler;
