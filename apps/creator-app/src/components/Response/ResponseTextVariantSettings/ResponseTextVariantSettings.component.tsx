import { Box, Button, Popper, Slider, Surface, Text } from '@voiceflow/ui-next';
import React from 'react';

import { usePopperModifiers } from '@/hooks/popper.hook';
import { useLinkedState } from '@/hooks/state.hook';

import type { IResponseTextVariantSettings } from './ResponseTextVariantSettings.interface';

export const ResponseTextVariantSettings: React.FC<IResponseTextVariantSettings> = ({
  variant,
  disabled,
  onVariantChange,
}) => {
  const [speed, setSpeed] = useLinkedState(variant.speed ?? 0);

  const modifiers = usePopperModifiers([{ name: 'offset', options: { offset: [0, 24] } }]);

  return (
    <Popper
      placement="left-start"
      modifiers={modifiers}
      referenceElement={({ ref, isOpen, onToggle }) => (
        <Button ref={ref} variant="tertiary" iconName="More" size="small" onClick={onToggle} isActive={isOpen} />
      )}
    >
      {() => (
        <Surface width="240px" pt={11}>
          <Box pt={8} px={24} pb={16} gap={8} direction="column" width="100%">
            <Text weight="semiBold">Emulate typing</Text>

            <Slider
              value={speed}
              endLabel="Fast"
              startLabel="Slow"
              disabled={disabled}
              onValueChange={setSpeed}
              onAfterChange={(value) => onVariantChange({ speed: value })}
            />
          </Box>
        </Surface>
      )}
    </Popper>
  );
};
