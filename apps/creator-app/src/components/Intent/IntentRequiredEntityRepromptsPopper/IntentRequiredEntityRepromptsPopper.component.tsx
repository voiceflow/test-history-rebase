import { ResponseVariantType, TextResponseVariant } from '@voiceflow/dtos';
import {
  Box,
  Divider,
  EditorButton,
  InputFormControl,
  Popper,
  Scroll,
  Section,
  Text,
  useConst,
  usePopperContext,
  Variable,
} from '@voiceflow/ui-next';
import React, { useMemo } from 'react';

import { AIGenerateResponseVariantButton } from '@/components/AI/AIGenerateResponseVariantButton/AIGenerateResponseVariantButton.component';
import { useAIGenerateRequiredEntityTextResponseVariants } from '@/components/AI/hooks/ai-generate-required-entity-text-response-variants';
import { EntitySelect } from '@/components/Entity/EntitySelect/EntitySelect.component';
import { PopperDynamicSurface } from '@/components/Popper/PopperDynamicSurface/PopperDynamicSurface.component';
import { Designer } from '@/ducks';
import { useSelector } from '@/hooks/store.hook';
import { isAnyResponseVariantWithDataEmpty } from '@/utils/response.util';
import { isUtteranceLikeEmpty } from '@/utils/utterance.util';

import { editorButtonStyle, savingEntityCapture } from './IntentRequiredEntityRepromptsPopper.css';
import type { IIntentRequiredEntityRepromptsPopper } from './IntentRequiredEntityRepromptsPopper.interface';

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
      referenceElement={({ ref, isOpen, onOpen }) => (
        <Box ref={ref} width="100%">
          <EditorButton
            label={entityName}
            onClick={onOpen}
            isActive={isOpen}
            isWarning={isRepromptsEmpty}
            fullWidth
            buttonClassName={editorButtonStyle}
          />
        </Box>
      )}
    >
      {({ update }) => (
        <PopperDynamicSurface width="300px" update={update} maxHeight={`${popperContext.portalNode.clientHeight - 32}px`} overflow="hidden">
          <Scroll>
            <Box direction="column" py={20} px={24}>
              <InputFormControl
                caption={
                  entity ? (
                    <Box align="center" mt={8} direction="row">
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

            <Box pt={11} direction="column">
              <Section.Header.Container title="Reprompts" variant="active">
                <Section.Header.Button iconName="Plus" onClick={onRepromptAdd} />
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
              />
            </Box>
          </Scroll>
        </PopperDynamicSurface>
      )}
    </Popper>
  );
};
