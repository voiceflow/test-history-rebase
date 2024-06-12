import { Box, PopperModifiers, Text, Tokens, Tooltip } from '@voiceflow/ui-next';
import React from 'react';

interface IItemWithDescriptionTooltip {
  children: React.ReactNode;
  modifiers: PopperModifiers<'offset'>;
  description: string | null;
}

export const ItemWithDescriptionTooltip: React.FC<IItemWithDescriptionTooltip> = ({
  children,
  modifiers,
  description,
}) => {
  return (
    <Tooltip
      placement="left-start"
      width={247}
      modifiers={modifiers}
      referenceElement={({ ref, onOpen, onClose }) => (
        <Box ref={ref} mt={-5} align="center" onMouseEnter={description ? onOpen : undefined} onMouseLeave={onClose}>
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
