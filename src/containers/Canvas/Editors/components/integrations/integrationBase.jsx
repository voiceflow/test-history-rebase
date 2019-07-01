import { Component } from 'react';

class IntegrationBase extends Component {
  constructor(props) {
    super(props);
    const { node } = this.props;

    this.state = {
      node: node,
    };

    this.showSection = this.showSection.bind(this);
  }

  showSection(initialSection) {
    const { active_section } = this.state;
    let section = initialSection;

    if (active_section === section) section = null;

    this.setState({
      active_section: section,
    });
  }
}

export default IntegrationBase;
