import { Box, Text, Tokens, Tooltip } from '@voiceflow/ui-next';
import React from 'react';

const modifiers = [{ name: 'offset', options: { offset: [20, 10] } }];

interface IItemWithDescriptionTooltip {
  description?: string;
  children: React.ReactNode;
}

export const ItemWithDescriptionTooltip: React.FC<IItemWithDescriptionTooltip> = ({ description, children }) => (
  <Tooltip
    placement="left"
    width={247}
    modifiers={modifiers}
    referenceElement={({ ref, onOpen, onClose }) => {
      const onOpenTrigger = description ? onOpen : undefined;
      return (
        <div ref={ref} onMouseEnter={onOpenTrigger} onMouseLeave={onClose}>
          {children}
        </div>
      );
    }}
  >
    {() => (
      <Box direction="column" px={8} pt={4} pb={5}>
        <Box mb={4}>
          <Text variant="caption" weight="semiBold" color={Tokens.colors.neutralLight.neutralsLight400}>
            Builder note
          </Text>
        </Box>
        <Text variant="caption">{description}</Text>
      </Box>
    )}
  </Tooltip>
);
