import React, { Component } from 'react'
import Textarea from 'react-textarea-autosize'

class ContainedTextarea extends Component {
  constructor(props) {
    super(props)

    this.state = {
      value: props.value
    }
    this.handleChange = this.handleChange.bind(this)
  }

  shouldComponentUpdate(newProps, newState) {
    if (newProps.value !== this.state.value) {
      this.state.value = newProps.value
      return true
    } else if (newState.value !== this.state.value) {
      return true
    }
    return false
  }

  componentDidMount() {
    if (this.props.autoFocus) {
      this.textInput.focus()
    }
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
      onKeyPress={(e) => this.props.onKeyPress && this.props.onKeyPress(e, this.state.value)}
      onBlur={()=>this.props.onChange(this.state.value)}
      inputRef={(input) => { this.textInput = input; }} 
    />
  }
}

module.exports = ContainedTextarea