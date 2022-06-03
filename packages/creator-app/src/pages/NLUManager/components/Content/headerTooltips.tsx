import { TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import { DOCS_BASE_LINK } from '@/config/documentation';

export const ConfidenceTooltip = () => {
  return (
    <TippyTooltip.FooterButton
      buttonText="More"
      onClick={() => {
        window.open(DOCS_BASE_LINK);
      }}
    >
      Confidence is a measure of a specific intents data robustness.
    </TippyTooltip.FooterButton>
  );
};

export const ClarityTooltip = () => {
  return (
    <TippyTooltip.FooterButton
      buttonText="More"
      onClick={() => {
        window.open(DOCS_BASE_LINK);
      }}
    >
      Clarity is a measure of an intents ability to be recognized, relative to the rest of your model.{' '}
    </TippyTooltip.FooterButton>
  );
};
