import React, { PureComponent } from 'react'
import cn from 'classnames'
import update from 'immutability-helper/index';
import { connect } from "react-redux";
import { Collapse, Alert } from 'reactstrap';
import { Tooltip } from "react-tippy";

import Button from 'components/Button'

import { getIntentSlots } from 'Helper'
import FulfillInput from './FulfillInput'

import { updateFulfillment } from 'ducks/version'

class Canfulfill extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      intents: this.props.intents,
      slots: this.props.slots,
      text: '',
      open: [],
      selected_intent: null
    }
  }

  componentDidMount() {
    const intent_slots = getIntentSlots(this.props.selected_intent, this.props.slots)

    intent_slots.forEach(slot => {
      let slot_config = this.props.fulfillment[this.props.selected_intent.key].slot_config[slot.key]
      if (!slot_config) {
        this.props.updateFulfillment(this.props.selected_intent.key, update(this.props.fulfillment[this.props.selected_intent.key].slot_config, {
          [slot.key]: {
            $set: []
          }
        }))
      }
    })

  }

  toggleCollapse(i) {
    const open = this.state.open
    open[i] = !open[i]
    this.setState({
      open: open
    })
    this.forceUpdate()
  }

  updateSlotArray = (key, new_array) => {
    this.props.updateFulfillment(this.props.selected_intent.key, update(this.props.fulfillment[this.props.selected_intent.key].slot_config, {
      [key]: {
        $set: new_array
      }
    }))
  }

  render() {
    if (!this.props.fulfillment[this.props.selected_intent.key]) {
      return <Alert color="danger">Slot Fulfillment not found - Check Canvas</Alert>
    }

    const intent_slots = getIntentSlots(this.props.selected_intent, this.props.slots)

    const inputs = intent_slots.map((slot, i) => {
      let slot_config = this.props.fulfillment[this.props.selected_intent.key].slot_config[slot.key]
      return (<>
          {slot_config ? <div className="my-2" key={i}>
            <div className="slot-box">
              <Button isClear isBtn className="w-100 d-flex space-between nb" onClick={() => { this.toggleCollapse(i) }}>
                <span className="slot-fulfillment">
                  <i className={cn('fas mr-2', {
                    'fa-caret-down': this.state.open[i],
                    'fa-caret-right': !this.state.open[i]
                  })} />
                  {slot.name}
                </span>
                {slot_config.length === 0 && <Tooltip
                  target="tooltip"
                  theme="menu"
                  position="bottom"
                  title='You have not entered any slot fulfillment values for this slot. All slot values in a CanFulfillIntent request will be understood by your skill by default.'
                >
                  <span className="badge badge-info all-badge">ALL</span>
                </Tooltip>}

              </Button>
              <Collapse className="slot-collapse" isOpen={this.state.open[i]}>
                <FulfillInput onInputUpdate={() => { this.forceUpdate(); this.props.save() }} slot={slot} slot_config={slot_config} updateSlotConfig={(new_arr) => this.updateSlotArray(slot.key, new_arr)} />
              </Collapse>
            </div>
          </div> : null}
        </>
      )
    })

    return (<div>
      <Alert>Setting Slot Fulfillment For Intent <b>{this.props.selected_intent.name}</b></Alert>
      {inputs}
    </div>)
  }
}

const mapDispatchToProps = dispatch => {
  return {
    updateFulfillment: (intent_key, slot_config) => dispatch(updateFulfillment(intent_key, slot_config))
  }
}
export default connect(null, mapDispatchToProps)(Canfulfill)
