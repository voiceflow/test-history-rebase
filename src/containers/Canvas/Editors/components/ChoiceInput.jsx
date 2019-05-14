import cn from 'classnames'
import React, { Component, PureComponent } from 'react'
import { Tooltip } from 'react-tippy'
import { sampleUtteranceRegex } from 'services/Regex'
import Textarea from 'react-textarea-autosize'
import { Collapse } from 'reactstrap'
import randomstring from 'randomstring'

import Button from 'components/Button'

// so we don't need to rerender the entire choiceinput component
class ContainedTextarea extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      value: props.value
    }
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(e){
    this.setState({value: e.target.value.replace('\n', '').substring(0,800)})
  }

  render(){
    return <Textarea
      placeholder={this.props.placeholder}
      className={this.props.className}
      value={this.state.value}
      onChange={this.handleChange}
      onBlur={()=>this.props.onChange(this.state.value)}
    />
  }
}

class ChoiceInput extends Component {
    constructor(props) {
        super(props)

        this.state = {
          samples: this.props.input.split('\n').filter(e=>e.trim()).map(t => ({text: t, key: randomstring.generate(5)})),
          text: ""
        }
        this.sample_length = this.state.samples.length
        this.handleKeyPress = this.handleKeyPress.bind(this)
        this.onTextChange = this.onTextChange.bind(this)
        this.addUtterance = this.addUtterance.bind(this)
        this.deleteUtterance = this.deleteUtterance.bind(this)
        this.renderUtterances = this.renderUtterances.bind(this)
        this.updateSample = this.updateSample.bind(this)
        this.updateInput = this.updateInput.bind(this)
        this.toggleOpen = this.toggleOpen.bind(this)
    }

    shouldComponentUpdate(props, state) {
      if(this.sample_length !== state.samples.length || this.props.index !== props.index){
        this.sample_length = state.samples.length
        return true
      }else if(this.state.text !== state.text){
        return true
      }
      return false
    }

    handleKeyPress(e) {
        // Enter key pressed
        // Add utterance
        if(e.charCode===13){
            e.preventDefault()
            this.addUtterance()
        }
    }

    componentWillUnmount(){
      if(this.state.samples.length === 0 && this.state.text.trim()){
        this.props.onChange(this.state.text.trim())
      }
    }

    addUtterance(){
        const newValue = this.state.text.trim()

        if(!newValue){
            return
        }
        // invalid utterance
        let escaped_value = newValue.replace(/({{\[)|(\].[a-zA-Z0-9]+\}\})/g, '')
        if(escaped_value.match(sampleUtteranceRegex)){
            return this.setState({
                text_error: 'Sample choices can consist of only unicode characters, spaces, periods for abbreviations, underscores, possessive apostrophes, curly braces, and hyphens'
            })
        }

        const utterance = {
            text: newValue,
            key: randomstring.generate(5)
        }

        this.state.samples.push(utterance)
        this.updateInput()
        this.setState({text: ''})
    }

    deleteUtterance(e, i) {
        e.preventDefault()
        this.state.samples.splice(i, 1)
        this.forceUpdate()
        this.updateInput()
    }

    updateInput() {
      this.props.onChange(this.state.samples.map(s => s.text).join('\n'))
    }

    onTextChange(e) {
        this.setState({
            text: e.target.value,
            text_error: null
        })
    }

    updateSample(text, i){
      let samples = this.state.samples
      samples[i].text = text
      this.setState({samples: samples})
      this.updateInput()
    }

    renderUtterances = (utterances) => {
        if (Array.isArray(utterances)) {
            return utterances.map( (u, i) => {
                if(i === 0) return null
                i = utterances.length - i
                return <div className="choice-utterance" key={utterances[i].key}>
                  <ContainedTextarea value={utterances[i].text} onChange={(text) => this.updateSample(text, i)}/>
                  <i onClick={(e) => {this.deleteUtterance(e, i)}} className="fas fa-backspace trash-icon mt-2"></i>
                </div>
            });
        }
        return null
    }

    toggleOpen() {
      this.props.choice.open = !this.props.choice.open
      this.forceUpdate()
    }

    render() {
      const has_entry = this.state.samples.length > 0
      return (
          <div className="interaction-block">
            <div className="choice-title">
              <span>{this.props.index+1}</span>
              <Button className="close" onClick={()=>this.props.remove()} disabled={this.props.live_mode} />
            </div>
            {has_entry && <div>
              <ContainedTextarea
                placeholder='Enter user reply'
                className="form-control user-input mb-2"
                value={this.state.samples[0].text}
                onChange={(text) => this.updateSample(text, 0)}/>
              <div className="space-between pointer ml-1 mb-1" onClick={this.toggleOpen}>
                <div className="section-title">Synonyms ({this.state.samples.length - 1})</div>
                <i className={cn('text-muted', 'fas', 'fa-caret-down', 'rotate', {
                    'fa-rotate-90': !this.props.choice.open
                })}/>
              </div>
            </div>}
            <Collapse isOpen={this.props.choice.open || !has_entry}>
              <Tooltip
                  className="flex-hard"
                  theme="warning"
                  arrow={true}
                  position="bottom-start"
                  open={!!(this.state.text_error)}
                  distance={5}
                  html={this.state.text_error}
              >
                <Textarea
                  className={cn('form-control', {
                    'mb-1': this.state.samples.length === 1
                  })}
                  value={this.state.text}
                  onChange={this.onTextChange}
                  placeholder={this.state.samples.length ? "Enter synonyms of the user reply" : "Enter user reply"}
                  disabled={this.props.live_mode}
                  onKeyPress={this.handleKeyPress}
                />
              </Tooltip>
              {!has_entry && <div className="space-between my-2 pl-1">
                <small className="text-muted">Press <b>'Enter'</b> to add</small>
                <span className="key-bubble forward pointer" onClick={this.addUtterance}><i className="far fa-long-arrow-right"/></span>
              </div>}
              {has_entry && this.renderUtterances(this.state.samples)}
            </Collapse>
          </div>
      )
  }
}

export default ChoiceInput;
