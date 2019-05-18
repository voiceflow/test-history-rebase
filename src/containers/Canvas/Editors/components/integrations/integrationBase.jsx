import { Component } from 'react'
class IntegrationBase extends Component {

  constructor(props) {
    super(props)

    this.state = {
      node: this.props.node
    }

    this.showSection = this.showSection.bind(this)
  }

  showSection(section) {
    if (this.state.active_section === section) section = null

    this.setState({
      active_section: section
    })
  }
}

export default IntegrationBase