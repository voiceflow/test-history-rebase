import { Button } from '@voiceflow/ui';
import React from 'react';

const NextStepButton = ({ openNextStep }) => (
  <div className="text-center mt-3">
    <Button onClick={() => openNextStep()}>Next</Button>
  </div>
);

export default NextStepButton;
