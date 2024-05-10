import { Box, SvgIcon, Text } from '@voiceflow/ui';
import React from 'react';

import { cardButton } from './ExistingCard.css';

export const ExistingCardValue = {
  EXISTING: 'existing',
  NEW: 'new',
} as const;

export type ExistingCardValue = (typeof ExistingCardValue)[keyof typeof ExistingCardValue];

interface ExistingCardProps {
  last4: string;
  value: ExistingCardValue;
  onChange: (value: ExistingCardValue) => void;
}

export const ExistingCard: React.FC<ExistingCardProps> = ({ last4, value, onChange }) => {
  const options = [
    { value: ExistingCardValue.EXISTING, label: `****${last4}` },
    { value: ExistingCardValue.NEW, label: 'Card' },
  ];

  return (
    <Box.Flex gap={16} fullWidth column alignItems="flex-start">
      <Text fontWeight="600">Choose payment method</Text>
      <Box.Flex gap={16} fullWidth>
        {options.map((option) => (
          <Box.Flex
            key={option.value}
            className={cardButton({ active: option.value === value })}
            column
            gap={10}
            onClick={() => onChange(option.value)}
          >
            <SvgIcon icon="creditCard" />
            <Text>{option.label}</Text>
          </Box.Flex>
        ))}
      </Box.Flex>
    </Box.Flex>
  );
};
