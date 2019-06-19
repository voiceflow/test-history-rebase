import './Stepper.css';

import cn from 'classnames';
// eslint-disable-next-line import/no-extraneous-dependencies
import pluralize from 'pluralize';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import React, { Component } from 'react';

export default class Stepper extends Component {
  static propTypes = {
    steps: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.any.isRequired,
        label: PropTypes.string.isRequired,
        errorsCount: PropTypes.number,
      })
    ).isRequired,
    isFilledAll: PropTypes.bool,
    activeStepId: PropTypes.string,
    onChangeStep: PropTypes.func,
    showErrorsCount: PropTypes.bool,
    lastStepIsFilled: PropTypes.bool,
  };

  static defaultProps = {
    showErrorsCount: true,
  };

  static getDerivedStateFromProps(props, state = {}) {
    if (state.activeStepId === null || props.activeStepId !== state.propActiveStepId) {
      return {
        prevStepId: state.activeStepId,
        activeStepId: props.activeStepId || props.steps[0].id,
        propActiveStepId: props.activeStepId,
      };
    }

    return null;
  }

  state = {
    filledSteps: this.props.steps.reduce((obj, s) => ({ ...obj, [s.id]: this.props.isFilledAll }), {}),
    activeStepId: this.props.activeStepId,
  };

  onChangeStep = (stepId) => {
    const { onChangeStep } = this.props;

    onChangeStep && onChangeStep(stepId);
  };

  onNextStep = (nextActiveStepId) => {
    const { onChangeStep } = this.props;

    this.setState(({ filledSteps, activeStepId }) => ({
      filledSteps: { ...filledSteps, [activeStepId]: true },
    }));

    onChangeStep && onChangeStep(nextActiveStepId);
  };

  render() {
    const { filledSteps, activeStepId } = this.state;
    const { steps, isFilledAll, showErrorsCount, lastStepIsFilled } = this.props;

    const lastStepId = steps[steps.length - 1].id;

    return (
      <ul className="steps-list">
        {steps.map((step, i) => {
          const { id, label, errorsCount } = step;

          const isActive = id === activeStepId;
          const isFilled = !errorsCount && (isFilledAll || filledSteps[id] || (lastStepId === id && lastStepIsFilled));
          const prevStep = steps[i - 1];
          const nextStep = steps[i + 1];
          const isNextStepLast = nextStep ? nextStep.id === lastStepId : false;
          const isPrevStepFilled = prevStep ? filledSteps[prevStep.id] : true;
          // eslint-disable-next-line no-nested-ternary
          const isNextStepFilled = nextStep ? (isNextStepLast ? lastStepIsFilled : filledSteps[nextStep.id]) : true;
          const isNextStepHasIssue = nextStep ? nextStep.errorsCount : false;

          return (
            // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
            <li
              key={id}
              onClick={() => this.onChangeStep(id)}
              className={cn('steps-list__list-item', {
                '__is-active': isActive,
                '__is-filled': isFilled,
                '__next-step-has-issues': isNextStepHasIssue || !isNextStepFilled,
              })}
            >
              {!isActive && (isFilled || isPrevStepFilled) ? (
                <a className="steps-list__title" href="title">
                  {label}
                </a>
              ) : (
                <div className="steps-list__title">{label}</div>
              )}

              {showErrorsCount && !!errorsCount && id !== activeStepId && (
                <div className="steps-list__issues text-danger">{pluralize('Issue', errorsCount, true)}</div>
              )}
            </li>
          );
        })}
      </ul>
    );
  }
}
