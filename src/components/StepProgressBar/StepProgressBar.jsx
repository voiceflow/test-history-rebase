import React, { Component } from 'react';

class StepProgressBar extends Component {
  constructor(props) {
    super(props);

    this.renderMultiSteps = this.renderMultiSteps.bind(this);
  }

  renderMultiSteps() {
    const steps = [];
    for (let i = 0; i < this.props.num_stages; i++) {
      steps.push(<div key={i} className={`multi-step-bar${i <= this.props.stage ? ' multi-step-active' : ' multi-step-inactive'}`} />);
    }
    return steps;
  }

  render() {
    return <div className={`multi-step-total-bar w-100 ${this.props.classes}`}>{this.renderMultiSteps()}</div>;
  }
}
export default StepProgressBar;
