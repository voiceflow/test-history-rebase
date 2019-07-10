import './IntentInputs.css';

import { utils } from '@voiceflow/common';
import { setConfirm } from 'ducks/modal';
import _ from 'lodash';
import converter from 'number-to-words';
import randomstring from 'randomstring';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Alert, Input } from 'reactstrap';

import IntentInput from './IntentInput';

const { getUtterancesWithSlotNames } = utils.intent;

const getIndex = (index) =>
  converter
    .toWords(index)
    .replace(/\s/g, '_')
    .replace(/,/g, '')
    .replace(/-/g, '_');

class IntentInputs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      search_value: '',
      intent_errors: [],
      intent_warning_slots: [],
    };
  }

  checkIntentConflict = () => {
    // This will be a dictionary of slotType -> [intent_ids] (intent ids being all intents that may have this warning)
    const warningDictionary = {};
    // This is a list of all the intents we need to show a warning for
    let showWarningInIntents = [];
    // This is a list of all the slots we need to show a warning for
    let showWarningSlots = [];

    if (this.props.slots) {
      const types = this.props.slots.map((slot) => slot.type.value);
      // Check if the slots are all unique
      if (_.uniq(types).length !== types.length) {
        // This will be general across all intents
        // Get all the slot types that have duplicate values
        const duplicateSlotTypes = _.filter(types, (val, i, iteratee) => _.includes(iteratee, val, i + 1));
        // Convert from the types to all the actual slot objects
        let duplicateSlots = this.props.slots.filter((slot) => _.includes(duplicateSlotTypes, slot.type.value));
        // We just want the name of the slot
        duplicateSlots = duplicateSlots.map((slot) => slot.name);

        this.props.intents.forEach((intent) => {
          // For each intent, we need to see if we need to flag a certain slot type
          // Check if any utterance contains just the slot name
          const utterances = getUtterancesWithSlotNames(intent.inputs, this.props.slots, true);
          utterances.forEach((utterance) => {
            const filtered = utterance.replace(/['[\]]+/g, '');
            if (_.includes(duplicateSlots, filtered.trim())) {
              // We need to show a warning here for type: slot.type
              this.props.slots.forEach((slot) => {
                if (slot.name === filtered.trim()) {
                  // We need to add to the list of slots that we need to show errors for because
                  // the warning is shown underneath the utterance, not the intent block
                  // This just narrows specificity
                  showWarningSlots.push(slot);
                  // If we don't need to initialize the array first
                  if (warningDictionary[slot.type.value] && warningDictionary[slot.type.value].length > 0) {
                    warningDictionary[slot.type.value].push(intent.key);
                  } else {
                    // This is the first time this slot has shown up, so we want to initialize an array for
                    // all the intents that have this slot problem
                    warningDictionary[slot.type.value] = [];
                    warningDictionary[slot.type.value].push(intent.key);
                  }
                }
              });
            }
          });
        });

        // Need to scan through the warningDictionary and add any intents that show up in a type with more than one intent showWarningInIntents
        _.keys(warningDictionary).forEach((errorSlotType) => {
          // If we have a warning for a type
          if (warningDictionary[errorSlotType].length > 1) {
            showWarningInIntents.push(...warningDictionary[errorSlotType]);
            // make sure there are only unique intents here, not really necessary step
            showWarningInIntents = showWarningInIntents.filter((v, i, a) => a.indexOf(v) === i);
          } else {
            // Otherwise we want to clear the type
            warningDictionary[errorSlotType] = [];
            // We also want to clear the stored slots of the same type
            showWarningSlots = showWarningSlots.filter((slot) => {
              return slot.type.value !== errorSlotType;
            });
          }
        });
        showWarningSlots = showWarningSlots.map((slot) => slot.name);

        this.setState({
          intent_errors: showWarningInIntents,
          intent_warning_slots: showWarningSlots,
        });
      }
    }
  };

  handleAddIntent = () => {
    let name = `intent_${getIndex(this.props.intents.length + 1)}`;

    const find = (name) => this.props.intents.find((e) => e.name === name);
    while (find(name)) {
      name = `new_${name}`;
    }

    this.props.intents.push({ name, inputs: [], key: randomstring.generate(12), open: true });

    this.props.update();
    this.setState({
      search: '',
    });
  };

  handleRemoveIntent = (key) => {
    this.props.setConfirm({
      text: (
        <Alert color="warning" className="mb-0">
          Make sure this Intent isn't used in any Command or Intent blocks
          <br />-<br />
          Deleting may cause unexpected behavior
        </Alert>
      ),
      confirm: () => {
        const i = this.props.intents.findIndex((i) => i.key === key);
        if (i !== -1) {
          this.props.intents.splice(i, 1);
          this.props.setCanFulfill(key, false);
          this.props.update();
          this.forceUpdate();
        }
      },
    });
  };

  checkUtterances = (utterance) => {
    const all_utterances = [];
    this.props.intents.forEach((intent) => {
      intent.inputs.forEach((input) => {
        all_utterances.push(input.text.toLowerCase());
      });
    });

    return all_utterances.includes(utterance.toLowerCase());
  };

  checkName = (name) => {
    return this.props.intents.some((i) => i.name === name);
  };

  onSearchChange = (e) => {
    this.setState({
      search_value: e.target.value.toLowerCase(),
    });
  };

  render() {
    let length = 0;
    let reverse;
    if (Array.isArray(this.props.intents)) {
      length = this.props.intents.length;
      reverse = [];
      for (let i = length - 1; i >= 0; i--) {
        const intent = this.props.intents[i];

        if (intent.name.includes(this.state.search_value)) {
          reverse.push(
            <IntentInput
              key={intent.key}
              intent_id={intent.key}
              slots={this.props.slots}
              intent={intent}
              utteranceExists={this.checkUtterances}
              nameExists={this.checkName}
              removeIntent={this.handleRemoveIntent}
              update={this.props.update}
              platform={this.props.platform}
              live_mode={this.props.live_mode}
              checkIntentConflict={this.checkIntentConflict}
              showWarning={this.state.intent_errors.includes(intent.key)}
              intent_warning_slots={this.state.intent_warning_slots}
            />
          );
        }
      }
    }

    return (
      <div className="w-100">
        {length > 4 && (
          <Input
            type="search"
            onChange={this.onSearchChange}
            id="searchIntents"
            className="form-control-border mb-3 search-input"
            placeholder="Search Intents"
            value={this.state.search_value}
          />
        )}
        {length < 251 && (
          <button className="btn btn-clear btn-lg btn-block mb-3" onClick={this.handleAddIntent} disabled={this.props.live_mode}>
            <i className="far fa-plus mr-2" /> Add Intent
          </button>
        )}
        {reverse}
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    setConfirm: (confirm) => dispatch(setConfirm(confirm)),
  };
};
export default connect(
  null,
  mapDispatchToProps
)(IntentInputs);
