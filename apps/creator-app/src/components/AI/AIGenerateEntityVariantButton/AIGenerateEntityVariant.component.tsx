import React from 'react';

import { AIGenerateHoverableButton } from '../AIGenerateHoverableButton/AIGenerateHoverableButton.component';
import type { IAIGenerateEntityVariant } from './AIGenerateEntityVariant.interface';

export const AIGenerateEntityVariant: React.FC<IAIGenerateEntityVariant> = ({ disabled, hasExtraContext, ...props }) => (
  <AIGenerateHoverableButton {...props} label="value" disabled={disabled || !hasExtraContext} quantities={[5, 10, 20]} pluralLabel="values" />
);
