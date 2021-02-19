import _isEmpty from 'lodash/isEmpty';
import React, { useEffect } from 'react';

import client from '@/client';
import { Content } from '@/pages/Canvas/components/Editor';

import TestDropdown from '../Steps/components/TestDropdown';
import SetupDropdown from '../Steps/Zapier/Setup/SetupDropdown';
import StartTrigger from '../Steps/Zapier/StartTrigger/StartTriggerDropdown';
import WithMessage from '../Steps/Zapier/WithMessage/WithMessageDropdown';
import DropdownStepEditor from './components/DropdownStepEditor';

const Step = {
  START_TRIGGER: 'start trigger',
  WITH_MESSAGE: 'with message',
  SETUP: 'setup',
  TEST: 'test',
};

function ZapierEditor({ data, onChange, currentStep, toggleStep, setStep }) {
  const [token, setToken] = React.useState(null);

  useEffect(() => {
    async function fetchToken() {
      const response = await client.integrations.getZapierToken();
      setToken(response.key);
    }
    fetchToken();
  }, []);

  const hasSelectedTrigger = data.user && !_isEmpty(data.user);

  return (
    <Content>
      <StartTrigger
        data={data}
        onChange={onChange}
        isOpened={currentStep === Step.START_TRIGGER}
        toggleStep={toggleStep(Step.START_TRIGGER)}
        openNextStep={setStep(Step.WITH_MESSAGE)}
      />
      {hasSelectedTrigger && (
        <>
          <WithMessage
            data={data}
            onChange={onChange}
            isOpened={currentStep === Step.WITH_MESSAGE}
            toggleStep={toggleStep(Step.WITH_MESSAGE)}
            openNextStep={setStep(Step.SETUP)}
          />
          <SetupDropdown
            apiKey={token}
            data={data}
            onChange={onChange}
            isOpened={currentStep === Step.SETUP}
            toggleStep={toggleStep(Step.SETUP)}
            openNextStep={setStep(Step.TEST)}
          />
          <TestDropdown data={data} onChange={onChange} isOpened={currentStep === Step.TEST} toggleStep={toggleStep(Step.TEST)} />
        </>
      )}
    </Content>
  );
}

const ZapierEditorWithSteps = DropdownStepEditor(ZapierEditor, Step.START_TRIGGER);

export default ZapierEditorWithSteps;
