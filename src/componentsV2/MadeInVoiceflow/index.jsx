import React from 'react';

import { Label, Logo, Wrapper } from './components';

function MadeInVoiceflow() {
  return (
    <Wrapper href="https://voiceflow.com" target="_blank" rel="noopener noreferrer">
      <Logo src="/favicon.png" alt="Voiceflow" />
      <Label>Made In Voiceflow</Label>
    </Wrapper>
  );
}

export default MadeInVoiceflow;
