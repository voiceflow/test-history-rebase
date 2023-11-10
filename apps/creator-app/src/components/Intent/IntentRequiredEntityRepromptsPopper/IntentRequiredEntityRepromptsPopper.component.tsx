import { Box, EditorButton, Popper, Scroll, Section, Surface } from '@voiceflow/ui-next';
import React, { useMemo } from 'react';

import { AIGenerateUtteranceButton } from '@/components/AI/AIGenerateUtteranceButton/AIGenerateUtteranceButton.component';
import { usePopperModifiers } from '@/hooks/popper.hook';
import { isAnyResponseVariantWithDataEmpty } from '@/utils/response.util';

import { editorButtonStyle } from './IntentRequiredEntityRepromptsPopper.css';
import type { IIntentRequiredEntityRepromptsPopper } from './IntentRequiredEntityRepromptsPopper.interface';

export const IntentRequiredEntityRepromptsPopper: React.FC<IIntentRequiredEntityRepromptsPopper> = ({
  children,
  reprompts,
  entityName,
  onRepromptAdd,
}) => {
  const manualRepromptModifiers = usePopperModifiers([{ name: 'offset', options: { offset: [86, 12] } }]);
  const isEmpty = useMemo(() => !reprompts.length || reprompts.every(isAnyResponseVariantWithDataEmpty), [reprompts]);

  return (
    <Popper
      placement="left"
      modifiers={manualRepromptModifiers}
      referenceElement={({ ref, isOpen, onOpen }) => (
        <Box ref={ref} width="100%">
          <EditorButton label={entityName} onClick={onOpen} isActive={isOpen} isWarning={isEmpty} fullWidth buttonClassName={editorButtonStyle} />
        </Box>
      )}
    >
      {() => (
        <Surface>
          <Box gap={5} pt={10} direction="column" maxHeight="100%" width="300px" overflowY="hidden">
            <Section.Header.Container title="Reprompts" variant="active">
              <Section.Header.Button iconName="Plus" onClick={onRepromptAdd} />
            </Section.Header.Container>

            <Scroll gap={12} pr={24} maxHeight="300px">
              {children}
            </Scroll>

            <Box px={20} pt={16} pb={16}>
              <AIGenerateUtteranceButton isLoading={false} onGenerate={() => null} hasExtraContext={true} />
            </Box>
          </Box>
        </Surface>
      )}
    </Popper>
  );
};
