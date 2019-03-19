import React, { Component } from "react"
import axios from 'axios'

const MAX_POLL_COUNT = 15;
const POLL_INTERVAL = 1000;

// SECRET
const STRIPE_KEY =
  process.env.NODE_ENV === "production"
    ? "pk_live_9QXjJjWc0sjk8VSwbQT3viub"
    : "pk_test_G3o7CC0pvrW2cIbIU1bLkMSR";

const StripeHandler = (WrappedComponent) =>

class extends Component {
  constructor(props) {
    super(props)

    this.state = {
      stripe_load: false,
      stripe_state: 0,
      stripe_error: null
    }

    this.onSource = this.onSource.bind(this);
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

  async onSource(source) {
    try{
      if(!this.payload) throw new Error('No Payload')
      this.setState({stripe_state: 1})
      let result = await axios.request(this.payload(source))
      if(typeof this.source_cb === 'function') this.source_cb(result.data)

      this.checkSource(source)
    }catch(err){
      this.setError(err, -3)
    }
  }

  openStripe(payload, cb) {
    if(this.stripeHandler && !this.state.stripe_load){
      this.setState({stripe_load: true})
      this.payload = payload
      this.source_cb = cb
      this.stripeHandler.open({
        closed: () => {
          this.setState({stripe_load: false})
          let gtfo = document.getElementsByClassName("stripe_checkout_app")
          if(gtfo && gtfo.length !== 0) gtfo[0].parentNode.removeChild(gtfo[0])
        }
      })
    }
  }

  checkSource(source){
    this.setState({stripe_state: 2})

    let pollCount = 0
    const pollForSourceStatus = () => {
      axios.get(`https://api.stripe.com/v1/sources/${source.id}`, {
        params: {
          client_secret: source.client_secret,
          key: STRIPE_KEY
        }
      })
      .then(result => {
          // Depending on the Charge status, show your customer the relevant message.
          var temp_source = result.data
          if (temp_source.status === "chargeable") {
            this.setState({stripe_state: 3})
          } else if (
            temp_source.status === "pending" &&
            pollCount < MAX_POLL_COUNT
          ) {
            // Try again in a second, if the Source is still `pending`:
            pollCount += 1;
            setTimeout(pollForSourceStatus, POLL_INTERVAL);
          } else {
            this.setState({
              stripe_state: -2
            })
          }
      })
    }

    try {
      pollForSourceStatus()
    } catch(err) {
      this.setError(err, -3)
    }
  }

  setError(err, status=-1) {
    let error = 'Payment Failed'
    if (err.response && err.response.data && err.response.data.message) {
        error = err.response.data.message
    }
    this.setState({
      stripe_error: error.toString(),
      stripe_state: status,
    })
  }

  render() {
    return <WrappedComponent
      {...this.props}
      resetStripe={()=>{this.setState({stripe_state: 0, stripe_error: null})}}
      openStripe={this.openStripe}
      stripe_state={this.state.stripe_state}
      stripe_load={this.state.stripe_load}
      stripe_error={this.state.stripe_error}
    />
  }
}

export default StripeHandler