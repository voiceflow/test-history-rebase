import { Box, Input, Section, Text, Tooltip, usePopperModifiers } from '@voiceflow/ui-next';
import React from 'react';

import { TooltipContentLearn } from '@/components/Tooltip/TooltipContentLearn/TooltipContentLearn.component';
import { VARIABLE_DEFAULT_VALUE_LINK } from '@/constants/link.constant';
import { useInput } from '@/hooks/input.hook';
import { stopPropagation } from '@/utils/handler.util';
import { popperPaddingModifierFactory } from '@/utils/popper.util';
import { onOpenInternalURLInANewTabFactory } from '@/utils/window';

import type { IVariableDefaultValueSection } from './VariableDefaultValueSection.interface';

export const VariableDefaultValueSection: React.FC<IVariableDefaultValueSection> = ({ value, disabled, onValueChange }) => {
  const modifiers = usePopperModifiers([popperPaddingModifierFactory({ padding: 3 })]);

  const input = useInput({
    value: value ?? '',
    onSave: onValueChange,
    disabled,
    autoFocus: !value,
  });

  const hasValue = value !== null;

  return (
    <>
      <Tooltip
        inline
        width={200}
        modifiers={modifiers}
        placement="left-start"
        referenceElement={({ ref, popper, onOpen, onClose, isOpen }) => (
          <Box ref={ref} pt={11} pb={hasValue ? 0 : 11} onMouseEnter={hasValue ? undefined : onOpen} onMouseLeave={onClose}>
            <Section.Header.Container
              title={(className) => (
                <Text className={className} onMouseEnter={hasValue ? onOpen : undefined}>
                  Default value
                </Text>
              )}
              variant={isOpen || hasValue ? 'active' : 'basic'}
              onHeaderClick={hasValue ? undefined : () => onValueChange('')}
            >
              <Section.Header.Button
                onClick={stopPropagation(() => (hasValue ? onValueChange(null) : onValueChange('')))}
                iconName={hasValue ? 'Minus' : 'Plus'}
                disabled={disabled}
              />
              {popper}
            </Section.Header.Container>
          </Box>
        )}
      >
        {() => (
          <TooltipContentLearn
            label="Set the default value of the variable to something specific. Variables without a default value are set to 0 by default."
            onLearnClick={onOpenInternalURLInANewTabFactory(VARIABLE_DEFAULT_VALUE_LINK)}
          />
        )}
      </Tooltip>

      {hasValue && (
        <Box pt={7} px={24} pb={24} direction="column">
          <Input placeholder="Enter default value" {...input.attributes} />
        </Box>
      )}
    </>
  );
};
