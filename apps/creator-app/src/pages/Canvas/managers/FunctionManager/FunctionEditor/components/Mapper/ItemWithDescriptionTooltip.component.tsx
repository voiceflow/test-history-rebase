import { Box, Text, Tokens, Tooltip } from '@voiceflow/ui-next';
import React from 'react';

const modifiers = [{ name: 'offset', options: { offset: [20, 10] } }];

interface IItemWithDescriptionTooltip {
  description?: string;
  children: React.ReactNode;
}

export const ItemWithDescriptionTooltip: React.FC<IItemWithDescriptionTooltip> = ({ description, children }) => {
  return (
    <Tooltip
      placement="left"
      width={247}
      modifiers={modifiers}
      referenceElement={({ ref, onOpen, onClose }) => (
        <Box ref={ref} onMouseEnter={description ? onOpen : undefined} onMouseLeave={onClose}>
          {children}
        </Box>
      )}
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
};
