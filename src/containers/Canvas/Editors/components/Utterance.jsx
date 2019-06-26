import "./Utterance.css";

import cn from "classnames";
import React from "react";
import { Mention, MentionsInput } from "react-mentions";
import { Tooltip } from "react-tippy";
import { sampleUtteranceRegex } from "services/Regex";

class Utterance extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      text: props.intent,
      text_error: ""
    };
  }

  handleKeyPress = e => {
    // Enter key pressed
    // Add utterance
    if (e.charCode === 13) {
      e.preventDefault();
      this.onEdit(e);
    }
  };

  onTextChange = e => {
    const newValue = e.target.value.trim();
    const escaped_value = newValue.replace(/({{\[)|(].[\dA-Za-z]+}})/g, "");
    if (escaped_value.match(sampleUtteranceRegex)) {
      return this.setState({
        text: e.target.value,
        text_error:
          "Sample utterances can consist of only unicode characters, spaces, periods for abbreviations, underscores, possessive apostrophes, curly braces, and hyphens"
      });
    }
    this.setState({
      text: e.target.value,
      text_error: null
    });
  };

  onEdit = (targetInput = null) => {
    const newValue = this.state.text.trim();
    if (this.props.intent.trim() === newValue) return;
    if (this.props.utteranceExists(newValue)) {
      return this.setState({
        text_error: "Duplicate utterances are not allowed"
      });
    }
    if (targetInput) targetInput.target.blur();
    this.props.editUtterance(newValue, this.props.index);
  };

  render() {
    return (
      <div>
        <div
          className={cn("interaction-utterance", {
            u__utterance_warning: this.props.showWarning
          })}
        >
          <Tooltip
            className="flex-hard"
            theme="warning"
            arrow={true}
            position="bottom-start"
            open={!!this.state.text_error}
            distance={5}
            html={this.state.text_error}
          >
            <MentionsInput
              className="mentions-input"
              markup="{{[__display__].__id__}}"
              displayTransform={(id, display) => {
                return `[${display}]`;
              }}
              value={this.state.text}
              onChange={this.onTextChange}
              onBlur={this.onEdit}
              onKeyPress={this.handleKeyPress}
              placeholder="Enter Synonyms"
              allowSpaceInQuery={true}
              disabled={this.props.live_mode}
            >
              <Mention
                trigger="["
                data={this.props.slots.map(slot => {
                  return { display: slot.name, id: slot.key.toString() };
                })}
                style={{
                  backgroundColor: "#DCEEFF",
                  outline: "1px solid #DCEEFF"
                }}
              />
            </MentionsInput>
            {this.props.showWarning && (
              <Tooltip
                className="flex-hard ii__exclamation-triangle"
                theme="warning"
                arrow={true}
                position="bottom-end"
                html={
                  "Having slots with the same type in different intents and using them in an utterance " +
                  "without any context (other words) may confuse your virtual assistant. Proceed with caution."
                }
              >
                <i className="fas fa-exclamation-triangle" />
              </Tooltip>
            )}
          </Tooltip>
          <i
            onClick={e => {
              this.props.deleteUtterance(e, this.props.index);
            }}
            className="fas fa-minus-circle trash-icon ii__trash"
          />
        </div>
      </div>
    );
  }
}

export default Utterance;
