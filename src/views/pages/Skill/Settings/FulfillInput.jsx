
import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import Textarea from 'react-textarea-autosize';
import { setError } from 'actions/modalActions'
import update from 'immutability-helper'

class FulfillInput extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      slot: this.props.slot,
      slot_config: this.props.slot_config,
      text: ''
    }

    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.onTextChange = this.onTextChange.bind(this)
    this.addValue = this.addValue.bind(this)
    this.slotValues = this.slotValues.bind(this)
    this.onRemoveSlotFulfillment = this.onRemoveSlotFulfillment.bind(this)
  }

  handleKeyPress(e) {
    // Enter key pressed
    if (e.charCode === 13) {
      e.preventDefault();
      this.addValue()
    }
  }

  onTextChange(e) {
    this.setState({
      text: e.target.value
    })
  }

  addValue = async () => {
    const slot_config = this.props.slot_config
    const newValue = this.state.text;

    if (!Array.isArray(slot_config)) {
      throw new Error('Slot Array Doesn\'t Exist!')
    }

    if (slot_config.includes(newValue)) {
      return this.props.setError('Duplicate value in slot')
    }

    if (newValue) {
      const newSlotConfig = update(this.props.slot_config, {
        $push: [newValue]
      })
      this.setState({
        text: ''
      })
      await this.props.updateSlotConfig(newSlotConfig)
    }
    this.props.onInputUpdate()
  }


  slotValues() {
    const slot_values = this.props.slot_config
    if (slot_values) {
      return slot_values.map((value, i) => {
        return (
          < div className="fulfill-value interaction-utterance" key={i} >
            <div>{value}</div>
            <i onClick={(e) => { this.onRemoveSlotFulfillment(i) }} className="fas fa-backspace trash-icon"></i>
          </div >
        )
      })
    }
    return null
  }

  onRemoveSlotFulfillment = async (i) => {
    const newSlotConfig = update(this.props.slot_config, {
      $splice: [[i, 1]]
    })
    await this.props.updateSlotConfig(newSlotConfig)
    this.props.onInputUpdate()
  }

  render() {

    const slot = this.props.slot

    return <div>
      <div>
        {this.slotValues()}
      </div>
      <Textarea
        className="slot-input"
        name="inputs"
        value={this.state.text}
        onKeyPress={this.handleKeyPress}
        onChange={this.onTextChange}
        placeholder="Enter Slot Fulfillment Value"
      />
      <div className="text-center mt-2">
        <span className="key-bubble forward pointer" onClick={() => { this.addValue(slot.key) }}><i className="far fa-long-arrow-right" /></span>
      </div>
    </div>
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setError: err => dispatch(setError(err))
  }
}
export default connect(null, mapDispatchToProps)(FulfillInput)
