import cn from "classnames";
import React, { Component } from "react";
import { Collapse } from "reactstrap";
import Select from "react-select";
import { Tooltip } from "react-tippy";
import { connect } from "react-redux";

import Button from 'components/Button'

import SlotSynonyms, {
  SingleValueOption,
  SlotOption,
  SlotDiabled
} from "./SlotComponents";

import { setError } from "ducks/modal";

class SlotInput extends Component {
  constructor(props) {
    super(props);

    if (!Array.isArray(this.props.slot.inputs)) {
      this.props.slot.inputs = [];
    }

    this.state = {
      text: "",
      text_error: null,
      name: this.props.slot && this.props.slot.name ? this.props.slot.name : "",
      name_error: null
    };
    this.toggleCollapse = this.toggleCollapse.bind(this);
    this.onNameSave = this.onNameSave.bind(this);
    this.onNameChange = this.onNameChange.bind(this);
    this.updateSlotType = this.updateSlotType.bind(this);
    this.update = this.update.bind(this);
  }

  update() {
    this.forceUpdate();
    this.props.update();
  }

  toggleCollapse() {
    this.props.slot.open = !this.props.slot.open;
    this.update();
  }

  onTextChange(e) {
    this.setState({
      text: e.target.value
    });
  }

  onNameChange(e) {
    const input = e.target.value.toLowerCase().replace(/\s/g, "_");
    const re = /^[_a-z]+$/g;

    let name_error;
    if (!re.test(input) && input.length > 0) {
      name_error =
        "Slot names can only contain lowercase letters and underscores";
    } else {
      name_error = null;
    }
    this.setState({
      name: input,
      name_error: name_error
    });
  }

  onNameSave(e) {
    e.preventDefault();
    if (this.state.name === this.props.slot.name) {
      return;
    } else if (this.state.name_error) {
      this.props.setError(this.state.name_error);
      this.setState({
        name: this.props.slot.name,
        name_error: null
      });
    } else if (!this.state.name.trim()) {
      this.setState({
        name: this.props.slot.name
      });
    } else if (this.props.nameExists(this.state.name)) {
      // save name with error callback
      this.props.setError("An slot already exists with this name");
      this.setState({
        name: this.props.slot.name
      });
    } else {
      this.props.slot.name = this.state.name;
    }
  }

  updateSlotType(target) {
    this.props.slot.type = target;
    this.update();
  }

  onSearchChange(e) {
    this.setState({
      search_value: e.target.value.toLowerCase()
    });
  }

  render() {
    const slot_type = this.props.slot.type.value;
    let disabled = SlotDiabled(slot_type, this.props.platform);

    return (
      <div className={`interaction-block mb-2`}>
        <div
          className={cn("intent-title", {
            faded: disabled
          })}
        >
          <span onClick={this.toggleCollapse}>
            <i
              className={cn("fas", "fa-caret-right", "rotate", {
                "fa-rotate-90": this.props.slot.open
              })}
            />
          </span>
          <Tooltip
            className="flex-hard"
            theme="warning"
            arrow={true}
            position="bottom-start"
            open={!!this.state.name_error}
            distance={5}
            html={this.state.name_error}
          >
            <input
              placeholder="Enter Slot Name"
              type="text"
              value={this.state.name}
              onChange={this.onNameChange}
              onBlur={this.onNameSave}
              onKeyPress={e => {
                if (e.charCode === 13) {
                  e.preventDefault();
                }
              }}
              className="interaction-name-input"
            />
          </Tooltip>
          <Button
            isClose
            className="mt-1"
            onClick={() => this.props.removeSlot(this.props.slot.key)}
            disabled={this.props.live_mode}
          />
        </div>
        <Collapse isOpen={this.props.slot.open}>
          {disabled && (
            <div className="unavailable-input">
              <div>
                <i className="fas fa-frown" />
              </div>
              This Slot Type is Unavailable on{" "}
              {this.props.platform === "google" ? "Google Assistant" : "Alexa"}
            </div>
          )}
          <div className={disabled ? "disabled faded" : ""}>
            <div className="super-center flex-hard choice-select">
              <Select
                placeholder="Select Slot Type"
                classNamePrefix="select-box"
                className="select-box mb-2"
                value={this.props.slot.type}
                onChange={this.updateSlotType}
                options={this.props.slot_types}
                components={{
                  Option: SlotOption,
                  SingleValue: SingleValueOption
                }}
                styles={{
                  singleValue: base => ({ ...base, width: "100%" })
                }}
                isDisabled={this.props.live_mode}
              />
            </div>
            <div
              className={`${
                this.props.slot.inputs && this.props.slot.inputs.length > 0
                  ? "mb-0"
                  : "mb-2"
              }`}
            />
            <SlotSynonyms
              inputs={this.props.slot.inputs}
              update={() => this.forceUpdate()}
            />
          </div>
        </Collapse>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  live_mode: state.skills.live_mode
});

const mapDispatchToProps = dispatch => {
  return {
    setError: err => dispatch(setError(err))
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SlotInput);
