import cn from 'classnames';
import _ from 'lodash';
import React from 'react';

import Button from '@/componentsV2/Button';

import SingleStep from './SingleStep';
import GuidedStepsWrapper from './styles';

class GuidedSteps extends React.Component {
  state = {
    stepNumber: 0,
    stepStatus: {},
    formValid: false,
  };

  static getDerivedStateFromProps(props, state) {
    if (props.step >= 0 && props.step !== state.stepNumber) {
      return {
        stepNumber: props.step,
        stepStatus: {
          ...state.stepStatus,
          [state.stepNumber]: true,
        },
      };
    }
  }

  validStepChange = (nextStep) => {
    if (!this.props.forceFollow) return true;

    if (this.props.step >= 0) return false;

    // Find the farthest the user has progressed
    let farthestBlock = this.props.blocks.length - 1;
    for (let i = 0; i < this.props.blocks.length; i++) {
      if (!this.state.stepStatus[i]) {
        farthestBlock = i;
        break;
      }
    }
    if (farthestBlock >= nextStep) return true;
    // Don't let the user skip a step
    if (nextStep > this.state.stepNumber + 1) return false;

    // Don't let the user continue if the current step is not valid
    const stepValid = this.props.checkStep ? this.props.checkStep(this.state.stepNumber) : true;
    if (nextStep === this.state.stepNumber + 1 && !stepValid) return false;

    return true;
  };

  changeStep = (e, nextStep) => {
    e ? e.preventDefault() : null;

    if (!this.validStepChange(nextStep)) return;

    if (this.props.step) {
      return this.props.setStage(nextStep);
    }

    const prevStep = this.state.stepNumber;
    // Check if the last step was a valid step, if no step check function is provided, default to true
    const stepValid = this.props.checkStep ? this.props.checkStep(prevStep) : true;

    const stepStatus = _.cloneDeep(this.state.stepStatus);
    stepStatus[prevStep] = stepValid;

    if (stepStatus[nextStep] === false) stepStatus[nextStep] = null;

    // Check if the for is valid up until now
    const formValid = this.checkFormValidity(stepStatus);

    this.setState({
      stepNumber: nextStep,
      stepStatus,
      formValid,
    });
  };

  checkFormValidity = (statuses) => {
    const { checkStep, blocks } = this.props;

    if (!checkStep) return true;
    const lastStepValid = checkStep(blocks.length - 1);
    for (let i = 0; i < blocks.length; i++) {
      if (i === blocks.length - 1) return lastStepValid;
      if (statuses[i] !== true) {
        return false;
      }
    }
    return true;
  };

  submit = (e, finalStepNum) => {
    this.changeStep(e, finalStepNum);
    this.props.onFinishSteps();
  };

  render() {
    return (
      <GuidedStepsWrapper noDetail={this.props.noDetail}>
        <ul className="gs__steps-list">
          {this.props.blocks &&
            this.props.blocks.map((block, idx) => (
              <li
                key={block.title}
                className={cn(
                  'gs__steps-list__list-item',
                  { 'gs__is-active': this.state.stepNumber === idx },
                  { 'gs__is-filled': this.state.stepStatus[idx] === true },
                  { 'gs__is-error': this.state.stepStatus[idx] === false }
                )}
              >
                <div
                  className={cn(
                    'gs__steps-list__title',
                    { 'gs__clickable-step': this.state.stepNumber !== idx && this.validStepChange(idx) },
                    { 'gs__non-clickable-step': !this.validStepChange(idx) },
                    { 'gs__is-constant': this.props.step !== undefined }
                  )}
                  onClick={() => this.changeStep(null, idx)}
                >
                  {block.title}
                </div>
                <SingleStep active={this.state.stepNumber === idx}>
                  <div className={cn('gs__steps-list__content')}>
                    <div className="gs__panel">
                      <div className="gs__panel-body">{block.content}</div>
                      {!this.props.haveFooter && (
                        <div className="gs__panel-footer">
                          {idx < this.props.blocks.length - 1 ? (
                            <Button variant="secondary" disabled={!this.validStepChange(idx + 1)} onClick={(e) => this.changeStep(e, idx + 1)}>
                              Next
                            </Button>
                          ) : (
                            <Button variant="primary" disabled={!this.state.formValid} onClick={(e) => this.submit(e, idx)}>
                              {this.props.submitText}
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="gs__details">{block.description}</div>
                  </div>
                </SingleStep>
              </li>
            ))}
        </ul>
      </GuidedStepsWrapper>
    );
  }
}

export { GuidedStepsWrapper };
export default GuidedSteps;
