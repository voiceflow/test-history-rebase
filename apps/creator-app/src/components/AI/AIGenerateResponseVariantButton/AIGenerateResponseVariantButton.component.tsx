import React from 'react';

import { AIGenerateHoverableButton } from '../AIGenerateHoverableButton/AIGenerateHoverableButton.component';
import type { IAIGenerateResponseVariantButton } from './AIGenerateResponseVariantButton.interface';

export const AIGenerateResponseVariantButton: React.FC<IAIGenerateResponseVariantButton> = ({
  disabled,
  hasExtraContext,
  ...props
}) => (
  <AIGenerateHoverableButton
    {...props}
    label="variant"
    disabled={disabled || !hasExtraContext}
    quantities={[1, 3, 5]}
    pluralLabel="variants"
  />
);
