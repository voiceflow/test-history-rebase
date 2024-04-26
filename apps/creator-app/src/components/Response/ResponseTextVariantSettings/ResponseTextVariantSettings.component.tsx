import { AttachmentType, CardLayout } from '@voiceflow/dtos';
import {
  Box,
  Button,
  Collapsible,
  CollapsibleHeader,
  CollapsibleHeaderButton,
  Divider,
  Popper,
  RadioGroup,
  Slider,
  Surface,
  Text,
} from '@voiceflow/ui-next';
import React, { useMemo } from 'react';

import { usePopperModifiers } from '@/hooks/popper.hook';
import { useLinkedState } from '@/hooks/state.hook';

import type { IResponseTextVariantSettings } from './ResponseTextVariantSettings.interface';

export const ResponseTextVariantSettings: React.FC<IResponseTextVariantSettings> = ({
  variant,
  attachments,
  onVariantChange,
}) => {
  const [speed, setSpeed] = useLinkedState(variant.speed ?? 0);

  const hasCard = useMemo(
    () => attachments.some((attachment) => attachment.type === AttachmentType.CARD),
    [attachments]
  );

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
              onValueChange={setSpeed}
              onAfterChange={(value) => onVariantChange({ speed: value })}
            />
          </Box>

          {hasCard && (
            <>
              <Divider />

              <Collapsible
                isOpen
                showDivider={false}
                header={
                  <CollapsibleHeader label="Card layout">
                    {({ isOpen }) => <CollapsibleHeaderButton isOpen={isOpen} />}
                  </CollapsibleHeader>
                }
              >
                <Box pb={16}>
                  <RadioGroup
                    label=""
                    value={variant.cardLayout}
                    layout="vertical"
                    options={[
                      { id: CardLayout.CAROUSEL, value: CardLayout.CAROUSEL, label: 'Carousel' },
                      { id: CardLayout.LIST, value: CardLayout.LIST, label: 'List' },
                    ]}
                    onValueChange={(value) => onVariantChange({ cardLayout: value })}
                  />
                </Box>
              </Collapsible>
            </>
          )}
        </Surface>
      )}
    </Popper>
  );
};
