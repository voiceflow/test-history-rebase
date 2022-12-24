import React from 'react';

import BaseGenerateButton, { BaseGenerateButtonProps } from './Base';

export interface HoverButtonProps extends Omit<BaseGenerateButtonProps, 'options'> {
  label: string;
  onGenerate: (options: { quantity: number }) => void;
  quantities?: number[];
  pluralLabel: string;
}

const PromptButton: React.FC<HoverButtonProps> = ({ label, children, quantities = [1, 3, 5], onGenerate, pluralLabel, ...props }) => (
  <BaseGenerateButton
    {...props}
    onClick={() => onGenerate({ quantity: quantities[0] })}
    options={quantities.map((quantity) => ({
      label: `Generate ${quantity} ${quantity === 1 ? label : pluralLabel}`,
      onClick: () => onGenerate({ quantity }),
    }))}
    hoverOpen
  >
    {children ?? 'Generate'}
  </BaseGenerateButton>
);

export default PromptButton;
