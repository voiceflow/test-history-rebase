import React, { PureComponent } from 'react'
import Textarea from 'react-textarea-autosize'

class ContainedTextarea extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      value: props.value
    }
    this.handleChange = this.handleChange.bind(this)
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
      onBlur={()=>this.props.onChange(this.state.value)}
      inputRef={(input) => { this.textInput = input; }} 
    />
  }
}

export default ContainedTextarea
