import { Box, Divider, EditorButton, InputFormControl, Popper, Scroll, Section, Text, Variable } from '@voiceflow/ui-next';
import React, { useMemo } from 'react';

import { AIGenerateUtteranceButton } from '@/components/AI/AIGenerateUtteranceButton/AIGenerateUtteranceButton.component';
import { EntitySelect } from '@/components/Entity/EntitySelect/EntitySelect.component';
import { PopperDynamicSurface } from '@/components/Popper/PopperDynamicSurface/PopperDynamicSurface.component';
import { Designer } from '@/ducks';
import { usePopperModifiers } from '@/hooks/popper.hook';
import { useSelector } from '@/hooks/store.hook';
import { isAnyResponseVariantWithDataEmpty } from '@/utils/response.util';

import { editorButtonStyle, savingEntityCapture } from './IntentRequiredEntityRepromptsPopper.css';
import type { IIntentRequiredEntityRepromptsPopper } from './IntentRequiredEntityRepromptsPopper.interface';

export const IntentRequiredEntityRepromptsPopper: React.FC<IIntentRequiredEntityRepromptsPopper> = ({
  entityID,
  children,
  reprompts,
  entityIDs,
  entityName,
  onRepromptAdd,
  onEntityReplace,
}) => {
  const entity = useSelector(Designer.Entity.selectors.oneByID, { id: entityID });

  const manualRepromptModifiers = usePopperModifiers([...Popper.DEFAULT_MODIFIERS, { name: 'offset', options: { offset: [0, 12] } }]);
  const isEmpty = useMemo(() => !reprompts.length || reprompts.every(isAnyResponseVariantWithDataEmpty), [reprompts]);

  return (
    <Popper
      placement="left-start"
      modifiers={manualRepromptModifiers}
      referenceElement={({ ref, isOpen, onOpen }) => (
        <Box ref={ref} width="100%">
          <EditorButton label={entityName} onClick={onOpen} isActive={isOpen} isWarning={isEmpty} fullWidth buttonClassName={editorButtonStyle} />
        </Box>
      )}
    >
      {({ update }) => (
        <PopperDynamicSurface width="300px" update={update}>
          <Box direction="column" py={20} px={24}>
            <InputFormControl
              caption={
                entity ? (
                  <Box align="center" mt={6} direction="row">
                    <Text variant="fieldCaption" className={savingEntityCapture}>
                      Saving entity to
                    </Text>

                    <Box ml={4}>
                      <Variable label={entity.name} />
                    </Box>
                  </Box>
                ) : undefined
              }
            >
              <EntitySelect
                entityID={entityID}
                onSelect={({ id }) => onEntityReplace({ oldEntityID: entityID, entityID: id })}
                excludeEntitiesIDs={entityIDs}
              />
            </InputFormControl>
          </Box>

          <Divider noPadding />

          <Box pt={11} direction="column" maxHeight="100%" overflowY="hidden">
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
        </PopperDynamicSurface>
      )}
    </Popper>
  );
};
