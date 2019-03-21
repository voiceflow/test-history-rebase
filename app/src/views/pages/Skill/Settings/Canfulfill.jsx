import React, { PureComponent } from 'react'
import { Collapse, Alert } from 'reactstrap';
// import Select from 'react-select'
import { Tooltip } from 'react-tippy'
import { getIntentSlots } from 'Helper'
import _ from 'lodash'
import FulfillInput from './FulfillInput'

class Canfulfill extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      intents: this.props.intents,
      slots: this.props.slots,
      text: '',
      open: [],
      selected_intent: null,
      fulfillment: null
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (!state.selected_intent || (props.selected_intent && state.selected_intent.key !== props.selected_intent.key) || !_.isEqual(state.fulfillment, props.fulfillment)) {

      const intent_slots = getIntentSlots(props.selected_intent, props.slots)

      return {
        selected_intent: props.selected_intent,
        open: state.open ? state.open : _.fill(Array(intent_slots.length), false),
        intent_slots: intent_slots,
        fulfillment: _.clone(props.fulfillment)
      }
    } else {
      return null
    }
  }

  toggleCollapse(i) {
    const open = this.state.open
    open[i] = !open[i]
    this.setState({
      open: open
    })
    this.forceUpdate()
  }

  render() {
    if(!this.props.fulfillment[this.state.selected_intent.key]){
      return <Alert color="danger">Slot Fulfillment not found - Check Canvas</Alert>
    }

    const inputs = this.state.intent_slots.map((slot, i) => {
      let slot_config = this.props.fulfillment[this.state.selected_intent.key].slot_config[slot.key]
      if (!slot_config) {
        this.props.fulfillment[this.state.selected_intent.key].slot_config[slot.key] = []
        slot_config = this.props.fulfillment[this.state.selected_intent.key].slot_config[slot.key]
      }
      return (
        <div className="my-2" key={i}>
          <div className="slot-box">
            <button className="btn btn-clear w-100 d-flex space-between nb" onClick={() => { this.toggleCollapse(i) }}>
              <span className="slot-fulfillment"><i className={`fas ${this.state.open[i] ? "fa-caret-down" : "fa-caret-right"} mr-2`}></i>{slot.name}</span>
              {slot_config.length === 0 && <Tooltip
                target="tooltip"
                theme="menu"
                position="bottom"
                title='You have not entered any slot fulfillment values for this slot. All slot values in a CanFulfillIntent request will be understood by your skill by default.'
              >
                <span className="badge badge-info all-badge">ALL</span>
              </Tooltip>}

            </button>
            <Collapse className="slot-collapse" isOpen={this.state.open[i]}>
              <FulfillInput onInputUpdate={() => {this.forceUpdate(); this.props.save()}} slot={slot} slot_config={slot_config} />
            </Collapse>
          </div>
        </div>
      )
    })

    return (<div>
      <Alert>Setting Slot Fulfillment For Intent <b>{this.state.selected_intent.name}</b></Alert>
      {inputs}
    </div>)
  }
}

export default Canfulfill
