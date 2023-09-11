import React from 'react';

import { AIGenerateHoverableButton } from '../AIGenerateHoverableButton/AIGenerateHoverableButton.component';
import type { IAIGenerateUtteranceButton } from './AIGenerateUtteranceButton.interface';

export const AIGenerateUtteranceButton: React.FC<IAIGenerateUtteranceButton> = ({ disabled, hasExtraContext, ...props }) => (
  <AIGenerateHoverableButton {...props} label="utterance" disabled={disabled || !hasExtraContext} quantities={[5, 10, 20]} pluralLabel="utterances" />
);
