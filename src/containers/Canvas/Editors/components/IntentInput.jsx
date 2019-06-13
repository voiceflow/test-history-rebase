import cn from 'classnames'
import React, {Component} from 'react'
import {Collapse} from 'reactstrap'
import {MentionsInput, Mention} from 'react-mentions'
import {connect} from 'react-redux'
import {Tooltip} from 'react-tippy'
import {sampleUtteranceRegex} from 'services/Regex'
import {getUtterancesWithSlotNames} from '../../../../intent_util'
import {setError} from 'ducks/modal'
import Utterance from './Utterance';
import _ from 'lodash';

import './IntentInput.css';

class IntentInput extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: (this.props.intent && this.props.intent.name) ? this.props.intent.name : "",
      text: "",
      name_error: null,
      text_error: null,
      intent: this.props.intent,
    }
  };

  componentDidMount() {
    this.props.checkIntentConflict();
  };

  toggleCollapse = () => {
    this.props.intent.open = !this.props.intent.open
    this.forceUpdate()
  };

  _getSlotKeys = (input) => {
    const re = /\{\{\[[^}{[\]]+]\.([a-zA-Z0-9]+)\}\}/g;
    let m;
    const slot_keys = new Set();

    do {
      m = re.exec(input);
      if (m) {
        const key = m[1];
        slot_keys.add(key)
      }
    } while (m);

    return slot_keys
  };

  handleKeyPress = (e, i) => {
    // Enter key pressed
    // Add utterance
    if (e.charCode === 13) {
      e.preventDefault()
      this.addUtterance(i)
    }
  };

  addUtterance = () => {
    const newValue = this.state.text.trim();

    if (!newValue) {
      return
    }
    // invalid utterance
    let escaped_value = newValue.replace(/({{\[)|(\].[a-zA-Z0-9]+\}\})/g, '')
    if (escaped_value.match(sampleUtteranceRegex)) {
      return this.setState({
        text_error: 'Sample utterances can consist of only unicode characters, spaces, periods for abbreviations, underscores, possessive apostrophes, curly braces, and hyphens'
      })
    }

    if (this.props.utteranceExists(newValue)) {
      return this.props.setError('Duplicate utterances are not allowed')
    }

    const slot_keys = this._getSlotKeys(newValue)
    const utterance = {
      slots: Array.from(slot_keys),
      text: newValue
    }

    if (!Array.isArray(this.props.intent.inputs)) {
      this.props.intent.inputs = [];
    }

    this.props.intent.inputs.push(utterance)
    this.props.update()

    this.setState({text: ''})
    this.props.checkIntentConflict();
  }

  deleteUtterance = (e, i) => {
    e.preventDefault()
    this.props.intent.inputs.splice(i, 1)
    this.forceUpdate();
    this.props.update()
    this.props.checkIntentConflict();
  }

  onTextChange = (e) => {
    this.setState({
      text: e.target.value,
      text_error: null
    })
  }

  onNameChange = (e) => {
    e.preventDefault()
    const input = e.target.value.toLowerCase().replace(/\s/g, '_')
    const re = /^[_a-z]+$/g

    let name_error
    if (!re.test(input) && input.length > 0) {
      name_error = 'Intent names can only contain lowercase letters and underscores!'
    } else {
      name_error = null
    }

    this.setState({
      name: input,
      name_error: name_error
    })
  }

  onNameSave = (e) => {
    e.preventDefault()
    if (this.state.name === this.props.intent.name) {
      return
    } else if (this.state.name_error) {
      this.props.setError(this.state.name_error)
      this.setState({
        name: this.props.intent.name,
        name_error: null
      })
    } else if (!this.state.name.trim()) {
      this.setState({
        name: this.props.intent.name
      })
    } else if (this.props.nameExists(this.state.name)) {
      // save name with error callback
      this.props.setError('An intent already exists with this name')
      this.setState({
        name: this.props.intent.name
      })
    } else {
      this.props.intent.name = this.state.name
    }
  }

  editUtterance = (value, index) => {

    if (!value) {
      return;
    }

    const slot_keys = this._getSlotKeys(value);

    this.props.intent.inputs[index] = {
      slots: Array.from(slot_keys),
      text: value
    };
    this.props.update();
    this.forceUpdate()
    this.props.checkIntentConflict();
  };

  renderUtterances = (utterances) => {
    if (Array.isArray(utterances)) {
      utterances = getUtterancesWithSlotNames(utterances, this.props.slots, true, false, true);
      // Need a regex to pull the slot name out of the encoded mention
      const re = /({{\[([^[\]{}]+)]\.([\dA-Za-z]+)}})/g;
      return utterances.map((u, i) => {
        // Reset regex state
        re.lastIndex = 0;
        // get the slot name
        let slot_name = re.exec(u);
        if (slot_name && this.props.showWarning) {
          return <Utterance
            key={u}
            intent={u}
            live_mode={this.props.live_mode}
            slots={this.props.slots}
            index={i}
            editUtterance={this.editUtterance}
            deleteUtterance={this.deleteUtterance}
            utteranceExists={this.props.utteranceExists}
            showWarning={this.props.intent_warning_slots.includes(slot_name[2])}
          />
        } else {
          // If we don't have a slot name (in the case of an mention less utterance)
          return <Utterance
            key={u}
            intent={u}
            live_mode={this.props.live_mode}
            slots={this.props.slots}
            index={i}
            editUtterance={this.editUtterance}
            deleteUtterance={this.deleteUtterance}
            utteranceExists={this.props.utteranceExists}
            showWarning={false}
          />
        }
      });
    }
    return null
  };

  render() {
    let disabled = false
    if ((this.props.intent._platform === 'google' && !(this.props.platform === 'google')) || (this.props.intent._platform === 'alexa' && !(this.props.platform === 'alexa'))) {
      disabled = true
    }

    return (
      <div className={"interaction-block"}>
        <div className={cn('intent-title', {
          faded: disabled
        })}>
                    <span onClick={this.toggleCollapse}>
                        <i className={cn('fas', 'fa-caret-right', 'rotate', {
                          'fa-rotate-90': this.props.intent.open
                        })}/>
                    </span>
          <Tooltip
            className="flex-hard"
            theme="warning"
            arrow={true}
            position="bottom-start"
            open={!!(this.state.name_error)}
            distance={5}
            html={this.state.name_error}
          >
            <input placeholder="Enter Intent Name"
                   type="text"
                   value={this.state.name}
                   onChange={this.onNameChange}
                   onBlur={this.onNameSave}
                   onKeyPress={(e) => {
                     if (e.charCode === 13) {
                       e.preventDefault()
                     }
                   }}
                   className="interaction-name-input"
            />
          </Tooltip>
          <button className="close mt-1 mr-1" onClick={() => this.props.removeIntent(this.props.intent.key)}
                  disabled={this.props.live_mode}/>
        </div>
        <Collapse isOpen={this.props.intent.open}>
          {disabled && <div className='unavailable-input'>
            <div><i className="fas fa-frown"></i></div>
            This Intent is Unavailable on {(this.props.platform === 'google') ? 'Google Assistant' : 'Alexa'}</div>}
          <div className={cn({'faded': disabled})}>
            <div className="pt-2">
              {this.renderUtterances(this.props.intent.inputs)}
            </div>
            <Tooltip
              className="flex-hard"
              theme="warning"
              arrow={true}
              position="bottom-start"
              open={!!(this.state.text_error)}
              distance={5}
              html={this.state.text_error}
            >
              <MentionsInput
                className="mentions-input"
                markup='{{[__display__].__id__}}'
                displayTransform={(id, display) => {
                  return '[' + display + ']'
                }}
                value={this.state.text}
                onChange={this.onTextChange}
                onKeyPress={this.handleKeyPress}
                placeholder={this.props.intent.inputs.length ? "Enter Synonyms" : "Enter user reply"}
                allowSpaceInQuery={true}
                disabled={this.props.live_mode}>
                <Mention
                  trigger="["
                  data={this.props.slots.map((slot) => {
                    return {display: slot.name, id: slot.key.toString()}
                  })}
                  style={{backgroundColor: '#DCEEFF', outline: '1px solid #DCEEFF'}}
                />
              </MentionsInput>
            </Tooltip>
            <div className="text-center mt-2">
              <span className="key-bubble forward pointer" onClick={this.addUtterance}><i
                className="far fa-long-arrow-right"/></span>
            </div>
          </div>
        </Collapse>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  live_mode: state.skills.live_mode
})

const mapDispatchToProps = dispatch => {
  return {
    setError: err => dispatch(setError(err))
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(IntentInput);
