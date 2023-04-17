import React from 'react';

function withDropdownSteps(WrappedComponent, defaultStep) {
  return class StepEditor extends React.Component {
    constructor(props) {
      super(props);

      let isNew;
      const { selectedAction } = this.props.data;
      if (!selectedAction) isNew = true;
      else isNew = false;

      this.state = {
        currentStep: isNew ? defaultStep : null,
      };
    }

    toggleStep = (targetStep) => () => this.setCurrentStep(targetStep === this.state.currentStep ? null : targetStep);

    setStep = (targetStep) => () => this.setCurrentStep(targetStep);

    setCurrentStep = (step) => {
      this.setState({
        currentStep: step,
      });
    };

    render() {
      return <WrappedComponent toggleStep={this.toggleStep} currentStep={this.state.currentStep} setStep={this.setStep} {...this.props} />;
    }
  };
}

export default withDropdownSteps;
