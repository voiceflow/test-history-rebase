import React from 'react';

import { AIGenerateBaseButton } from '../AIGenerateBaseButton/AIGenerateBaseButton.component';
import type { IAIGenerateHoverableButton } from './AIGenerateHoverableButton.interface';

export const AIGenerateHoverableButton: React.FC<IAIGenerateHoverableButton> = ({
  label,
  quantities = [1, 3, 5],
  onGenerate,
  pluralLabel,
  ...props
}) => {
  const options = quantities.map((quantity) => ({
    id: String(quantity),
    label: `Generate ${quantity} ${quantity === 1 ? label : pluralLabel}`,
    onClick: () => onGenerate({ quantity }),
  }));

  return (
    <AIGenerateBaseButton
      {...props}
      onClick={() => onGenerate({ quantity: quantities[0] })}
      options={options}
      hoverOpen
    />
  );
};
