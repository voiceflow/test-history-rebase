/* eslint-disable jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */

import { Button, ButtonVariant, Collapse, TippyTooltip } from '@voiceflow/ui';
import cn from 'classnames';
import React from 'react';

import GuidedStepsWrapper from './styles';

export { GuidedStepsWrapper };

interface GuidedBlock {
  title: string;

  content: JSX.Element;

  description: JSX.Element;
}

interface GuidedStepsProps {
  centred?: boolean;

  blocks: GuidedBlock[];

  step: number;

  onChangeStep: (index: number) => void;

  forceFollow?: boolean;

  disabled?: boolean;

  preventSubmit?: { message: string } | false;

  haveFooter?: boolean;

  children: (props: { disabled: boolean; submit: VoidFunction }) => JSX.Element;

  checkStep?: (index: number) => boolean;

  onComplete?: () => void;
}

const GuidedSteps: React.FC<GuidedStepsProps> = ({
  centred,

  blocks,

  forceFollow,

  disabled,

  preventSubmit,

  haveFooter,

  step = 0,

  onChangeStep,

  children,

  checkStep,

  onComplete: onFinishSteps,
}) => {
  const [stepStatus, setStepStatus] = React.useState<Record<number, boolean | null>>({});

  const [isFormValid, setFormValid] = React.useState(false);

  const validStepChange = (nextStep: number) => {
    if (!forceFollow) return true;

    if (step >= 0) return false;

    // Find the farthest the user has progressed

    let farthestBlock = blocks.length - 1;

    for (let i = 0; i < blocks.length; i++) {
      if (!stepStatus[i]) {
        farthestBlock = i;

        break;
      }
    }

    if (farthestBlock >= nextStep) return true;

    // Don't let the user skip a step

    if (nextStep > step + 1) return false;

    // Don't let the user continue if the current step is not valid

    const stepValid = checkStep ? checkStep(step) : true;

    if (nextStep === step + 1 && !stepValid) return false;

    return true;
  };

  const checkFormValidity = (statuses: Record<number, boolean | null>) => {
    if (!checkStep) return true;

    const lastStepValid = checkStep(blocks.length - 1);

    for (let i = 0; i < blocks.length; i++) {
      if (i === blocks.length - 1) return lastStepValid;

      if (statuses[i] !== true) return false;
    }

    return true;
  };

  const changeStep = (e: React.MouseEvent | null, nextStep: number) => {
    e?.preventDefault();

    if (!validStepChange(nextStep)) return;

    if (typeof step === 'number') {
      onChangeStep(nextStep);
    }

    const prevStep = step;

    // Check if the last step was a valid step, if no step check function is provided, default to true

    const stepValid = checkStep ? checkStep(prevStep) : true;

    const nextStatus = { ...stepStatus };

    if (nextStep - prevStep > 1 && checkStep) {
      // If we jumped steps we want to check all the steps inbetween

      for (let i = prevStep; i < nextStep; i++) {
        const validStep = checkStep(i);

        nextStatus[i] = validStep;
      }
    } else {
      nextStatus[prevStep] = stepValid;
    }

    if (nextStatus[nextStep] === false) {
      nextStatus[nextStep] = null;
    }

    // Check if the for is valid up until now

    const formValid = checkFormValidity(nextStatus);

    onChangeStep(nextStep);

    setStepStatus(nextStatus);

    setFormValid(formValid);
  };

  const submit = (finalStepNum: number) => {
    changeStep(null, finalStepNum);

    onFinishSteps?.();
  };

  const showPreventSubmitTooltip = preventSubmit && isFormValid && preventSubmit?.message;

  return (
    <GuidedStepsWrapper centred={centred} disabled={disabled}>
      <ul className="gs__steps-list">
        {blocks &&
          blocks.map((block, idx) => (
            <li
              key={block.title}
              className={cn(
                'gs__steps-list__list-item',

                { 'gs__is-active': step === idx },

                { 'gs__is-filled': stepStatus[idx] === true },

                { 'gs__is-error': stepStatus[idx] === false }
              )}
            >
              <div
                className={cn(
                  'gs__steps-list__title',

                  { 'gs__clickable-step': step !== idx && validStepChange(idx) },

                  { 'gs__non-clickable-step': !validStepChange(idx) },

                  { 'gs__is-constant': step !== undefined }
                )}
                onClick={() => changeStep(null, idx)}
              >
                {block.title}
              </div>

              <Collapse isOpen={step === idx}>
                <div className={cn('gs__steps-list__content')}>
                  <div className="gs__panel">
                    <div className="gs__panel-body">{block.content}</div>

                    {!haveFooter && (
                      <div className="gs__panel-footer">
                        {idx < blocks.length - 1 ? (
                          <Button variant={ButtonVariant.SECONDARY} disabled={!validStepChange(idx + 1)} onClick={(e) => changeStep(e, idx + 1)}>
                            Next
                          </Button>
                        ) : (
                          <TippyTooltip
                            offset={[0, 5]}
                            content={preventSubmit ? preventSubmit?.message : undefined}
                            disabled={!showPreventSubmitTooltip}
                            placement="top-end"
                          >
                            {children({ disabled: !isFormValid || disabled || !!preventSubmit, submit: () => submit(idx) })}
                          </TippyTooltip>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="gs__details">{block.description}</div>
                </div>
              </Collapse>
            </li>
          ))}
      </ul>
    </GuidedStepsWrapper>
  );
};

export default GuidedSteps;

export const ControlledGuidedSteps: React.FC<Omit<GuidedStepsProps, 'step' | 'onChangeStep'>> = (props) => {
  const [currentStep, setCurrentStep] = React.useState(0);

  return <GuidedSteps {...props} step={currentStep} onChangeStep={setCurrentStep} />;
};
