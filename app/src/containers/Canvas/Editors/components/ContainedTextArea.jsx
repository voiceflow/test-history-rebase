import React, { PureComponent } from 'react'
import Textarea from 'react-textarea-autosize'

class ContainedTextarea extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      value: props.value
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
  }

  componentDidMount() {
    if (this.props.autoFocus) {
      this.textInput.focus()
    }
  }

  handleKeyPress(e){
    // Enter key pressed
    if (e.charCode === 13) {
      e.preventDefault();
      this.props.onChange(this.state.value)
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
      onBlur={()=>this.props.onChange(this.state.value)}
      onKeyPress={this.handleKeyPress}
      inputRef={(input) => { this.textInput = input; }} 
    />
  }
}

export default ContainedTextarea
