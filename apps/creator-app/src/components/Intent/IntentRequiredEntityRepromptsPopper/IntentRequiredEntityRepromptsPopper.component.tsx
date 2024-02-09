import { ResponseVariantType, TextResponseVariant } from '@voiceflow/dtos';
import { tid } from '@voiceflow/style';
import { Box, Divider, EditorButton, InputFormControl, Popper, Scroll, Section, useConst, usePopperContext } from '@voiceflow/ui-next';
import React, { useMemo } from 'react';

import { AIGenerateResponseVariantButton } from '@/components/AI/AIGenerateResponseVariantButton/AIGenerateResponseVariantButton.component';
import { useAIGenerateRequiredEntityTextResponseVariants } from '@/components/AI/hooks/ai-generate-required-entity-text-response-variants';
import { EntitySelect } from '@/components/Entity/EntitySelect/EntitySelect.component';
import { PopperDynamicSurface } from '@/components/Popper/PopperDynamicSurface/PopperDynamicSurface.component';
import { Designer } from '@/ducks';
import { useSelector } from '@/hooks/store.hook';
import { stopPropagation } from '@/utils/handler.util';
import { isAnyResponseVariantWithDataEmpty } from '@/utils/response.util';
import { isUtteranceLikeEmpty } from '@/utils/utterance.util';

import { editorButtonStyle } from './IntentRequiredEntityRepromptsPopper.css';
import type { IIntentRequiredEntityRepromptsPopper } from './IntentRequiredEntityRepromptsPopper.interface';

const TEST_ID = 'required-entity';
const REPROMPT_SETTINGS_TEST_ID = 'reprompt-settings';

export const IntentRequiredEntityRepromptsPopper: React.FC<IIntentRequiredEntityRepromptsPopper> = ({
  entityID,
  children,
  reprompts,
  entityIDs,
  utterances,
  entityName,
  intentName,
  onRepromptAdd,
  onEntityReplace,
  onRepromptsGenerated,
}) => {
  const entity = useSelector(Designer.Entity.selectors.oneByID, { id: entityID });
  const popperContext = usePopperContext();

  const textReprompts = useMemo(
    () =>
      reprompts.filter(
        (response): response is Pick<TextResponseVariant, 'id' | 'text' | 'type' | 'attachmentOrder' | 'speed' | 'cardLayout'> =>
          response.type === ResponseVariantType.TEXT
      ),
    [reprompts]
  );

  const aiGenerateTextVariant = useAIGenerateRequiredEntityTextResponseVariants({
    entity,
    examples: textReprompts,
    intentName,
    utterances,
    onGenerated: onRepromptsGenerated,
    successGeneratedMessage: 'Reprompts generated',
  });

  const modifiers = useConst([
    { name: 'preventOverflow', options: { boundary: popperContext.portalNode, padding: 16 } },
    { name: 'offset', options: { offset: [0, 13] } },
  ]);
  const isRepromptsEmpty = useMemo(() => !reprompts.length || reprompts.every(isAnyResponseVariantWithDataEmpty), [reprompts]);
  const isUtterancesEmpty = useMemo(() => !utterances.length || utterances.every(isUtteranceLikeEmpty), [utterances]);

  return (
    <Popper
      placement="left-start"
      modifiers={modifiers}
      testID={REPROMPT_SETTINGS_TEST_ID}
      referenceElement={({ ref, isOpen, onOpen }) => (
        <Box ref={ref} width="100%">
          <EditorButton
            label={entityName}
            onClick={onOpen}
            isActive={isOpen}
            isWarning={isRepromptsEmpty}
            fullWidth
            buttonClassName={editorButtonStyle}
            warningTooltipContent="Missing reprompt"
            testID={tid(TEST_ID, 'input')}
          />
        </Box>
      )}
    >
      {({ update }) => (
        <PopperDynamicSurface
          width="300px"
          update={update}
          overflow="hidden"
          maxHeight={`${popperContext.portalNode.clientHeight - 32}px`}
          onPointerDown={stopPropagation()}
        >
          <Scroll>
            <Box direction="column" py={20} px={24}>
              <InputFormControl>
                <EntitySelect
                  entityID={entityID}
                  onSelect={({ id }) => onEntityReplace({ oldEntityID: entityID, entityID: id })}
                  excludeEntitiesIDs={entityIDs}
                  testID={tid(REPROMPT_SETTINGS_TEST_ID, 'entity')}
                />
              </InputFormControl>
            </Box>

            <Divider noPadding />

            <Box pt={11} direction="column">
              <Section.Header.Container title="Reprompts" variant="active" testID={tid(REPROMPT_SETTINGS_TEST_ID, ['reprompts', 'header'])}>
                <Section.Header.Button iconName="Plus" onClick={onRepromptAdd} testID={tid(REPROMPT_SETTINGS_TEST_ID, ['reprompts', 'add'])} />
              </Section.Header.Container>
            </Box>

            <Box gap={12} pr={24} direction="column">
              {children}
            </Box>

            <Box px={20} pt={16} pb={16}>
              <AIGenerateResponseVariantButton
                isLoading={aiGenerateTextVariant.fetching}
                onGenerate={aiGenerateTextVariant.onGenerate}
                hasExtraContext={!!entity?.name || !!entity?.classifier || !!intentName || !isUtterancesEmpty}
                testID={tid(REPROMPT_SETTINGS_TEST_ID, ['reprompts', 'ai-generate'])}
              />
            </Box>
          </Scroll>
        </PopperDynamicSurface>
      )}
    </Popper>
  );
};
