import cn from 'classnames';
import Button from 'components/Button';
import { updateFulfillment } from 'ducks/version';
import update from 'immutability-helper';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Tooltip } from 'react-tippy';
import { Alert, Collapse } from 'reactstrap';

import { getIntentSlots } from 'Helper';

import FulfillInput from './FulfillInput';

class Canfulfill extends PureComponent {
  constructor(props) {
    super(props);

    const { intents, slots } = this.props;

    this.state = {
      intents,
      slots,
      text: '',
      open: [],
      selected_intent: null,
    };
  }

  componentDidMount() {
    const { selected_intent, slots, fulfillment, updateFulfillment } = this.props;

    const intent_slots = getIntentSlots(selected_intent, slots);

    intent_slots.forEach((slot) => {
      const slot_config = fulfillment[selected_intent.key].slot_config[slot.key];
      if (!slot_config) {
        updateFulfillment(
          selected_intent.key,
          update(fulfillment[selected_intent.key].slot_config, {
            [slot.key]: {
              $set: [],
            },
          })
        );
      }
    });
  }

  toggleCollapse(i) {
    const { open } = this.state;
    open[i] = !open[i];
    this.setState({
      open,
    });
    this.forceUpdate();
  }

  updateSlotArray = (key, new_array) => {
    const { updateFulfillment, selected_intent, fulfillment } = this.props;
    updateFulfillment(
      selected_intent.key,
      update(fulfillment[selected_intent.key].slot_config, {
        [key]: {
          $set: new_array,
        },
      })
    );
  };

  render() {
    const { save, selected_intent, fulfillment, slots } = this.props;
    const { open } = this.state;

    if (!fulfillment[selected_intent.key]) {
      return <Alert color="danger">Slot Fulfillment not found - Check Canvas</Alert>;
    }

    const intent_slots = getIntentSlots(selected_intent, slots);

    const inputs = intent_slots.map((slot, i) => {
      const slot_config = fulfillment[selected_intent.key].slot_config[slot.key];
      return (
        <>
          {slot_config ? (
            <div className="my-2" key={i}>
              <div className="slot-box">
                <Button
                  isClear
                  isBtn
                  className="w-100 d-flex space-between nb"
                  onClick={() => {
                    this.toggleCollapse(i);
                  }}
                >
                  <span className="slot-fulfillment">
                    <i
                      className={cn('fas mr-2', {
                        'fa-caret-down': open[i],
                        'fa-caret-right': !open[i],
                      })}
                    />
                    {slot.name}
                  </span>
                  {slot_config.length === 0 && (
                    <Tooltip
                      target="tooltip"
                      theme="menu"
                      position="bottom"
                      title="You have not entered any slot fulfillment values for this slot. All slot values in a CanFulfillIntent request will be understood by your skill by default."
                    >
                      <span className="badge badge-info all-badge">ALL</span>
                    </Tooltip>
                  )}
                </Button>
                <Collapse className="slot-collapse" isOpen={open[i]}>
                  <FulfillInput
                    onInputUpdate={() => {
                      this.forceUpdate();
                      save();
                    }}
                    slot={slot}
                    slot_config={slot_config}
                    updateSlotConfig={(new_arr) => this.updateSlotArray(slot.key, new_arr)}
                  />
                </Collapse>
              </div>
            </div>
          ) : null}
        </>
      );
    });

    return (
      <div>
        <Alert>
          Setting Slot Fulfillment For Intent <b>{selected_intent.name}</b>
        </Alert>
        {inputs}
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateFulfillment: (intent_key, slot_config) => dispatch(updateFulfillment(intent_key, slot_config)),
  };
};
export default connect(
  null,
  mapDispatchToProps
)(Canfulfill);
