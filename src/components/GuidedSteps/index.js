import cn from 'classnames';
import _ from 'lodash';
import React from 'react';

import Button from '../Button';
import SingleStep from './SingleStep';
import GuidedStepsWrapper from './styles';

class GuidedSteps extends React.Component {
  state = {
    stepNumber: 0,
    stepStatus: {},
    formValid: false,
  };

  changeStep = (e, nextStep) => {
    e ? e.preventDefault() : null;
    const prevStep = this.state.stepNumber;
    const stepValid = this.props.checkStep(prevStep);
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
    for (let i = 0; i < this.props.blocks.length; i++) {
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
      <GuidedStepsWrapper>
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
                  className={cn('gs__steps-list__title', { 'gs__clickable-step': this.state.stepNumber !== idx })}
                  onClick={() => this.changeStep(null, idx)}
                >
                  {block.title}
                </div>
                <SingleStep active={this.state.stepNumber === idx}>
                  <div className={cn('gs__steps-list__content')}>
                    <div className="gs__panel">
                      <div className="gs__panel-body">{block.content}</div>
                      <div className="gs__panel-footer">
                        {idx < this.props.blocks.length - 1 ? (
                          <Button isSecondary onClick={(e) => this.changeStep(e, idx + 1)}>
                            Next
                          </Button>
                        ) : (
                          <Button isPrimary disabled={!this.state.formValid} onClick={(e) => this.submit(e, idx)}>
                            {this.props.submitText}
                          </Button>
                        )}
                      </div>
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

export default GuidedSteps;
