import { Utils } from '@voiceflow/common';
import { ResponseMessageCreate } from '@voiceflow/dtos';
import { Box, Divider, Section } from '@voiceflow/ui-next';
import React, { Fragment } from 'react';

import { AIGenerateResponseVariantButton } from '@/components/AI/AIGenerateResponseVariantButton/AIGenerateResponseVariantButton.component';
import { useAIGenerateResponseMessages } from '@/components/AI/hooks/ai-generate-response-messages.hook';
import { CMSFormListButtonRemove } from '@/components/CMS/CMSForm/CMSFormListButtonRemove/CMSFormListButtonRemove.component';
import { ResponseEditFormSectionGenerateButton } from '@/components/ResponseV2/ResponseEditForm/ResponseEditFormSectionGenerateButton/ResponseEditFormSectionGenerateButton.component';
import { SectionHeaderTitleWithLearnTooltip } from '@/components/Section/SectionHeaderTitleWithLearnTooltip/SectionHeaderTitleWithTooltip.component';
import { Designer } from '@/ducks';
import { useDebouncedCallback, useDispatch } from '@/hooks';
import { useIsAIFeaturesEnabled } from '@/hooks/ai.hook';
import { useInputAutoFocusKey } from '@/hooks/input.hook';
import { useIsListEmpty } from '@/hooks/list.hook';
import { responseMessageCreateDataFactory } from '@/utils/response.util';

import { ResponseCreateMessage } from '../MessageCreateTextVariant/MessageCreateTextVariant.component';
import { IResponseCreateForm } from './MessageCreateForm.interface';

const initialState: Array<ResponseMessageCreate & { tempID?: string }> = [responseMessageCreateDataFactory()];

export const ResponseCreateForm: React.FC<IResponseCreateForm> = ({ onResponseCreate }) => {
  const createResponse = useDispatch(Designer.Response.effect.createOne);
  const aiFeaturesEnabled = useIsAIFeaturesEnabled();
  const [loading, setLoading] = React.useState(false);
  const [messages, setResponseVariants] = React.useState(initialState);

  const [rootVariant, ...otherVariants] = messages;
  const hasVariants = otherVariants.length > 0;
  const autofocus = useInputAutoFocusKey();
  const listEmpty = useIsListEmpty(messages, () => true);

  const createReaponse = useDebouncedCallback(5000, async (messages: Array<ResponseMessageCreate>) => {
    setLoading(true);

    const { id } = await createResponse({
      folderID: null,
      variants: [],
      messages,
      name: '',
    });

    onResponseCreate(id);
  });

  const aiGenerateTextVariant = useAIGenerateResponseMessages({
    examples: messages,
    onGenerated: async (newVariants) => {
      setResponseVariants([
        ...messages,
        ...newVariants.map(({ text }) => responseMessageCreateDataFactory({ text, tempID: Utils.id.objectID() })),
      ]);
    },
    successGeneratedMessage: 'Variants generated',
  });

  const onAddVariant = () => {
    const tempID = Utils.id.objectID();

    setResponseVariants([rootVariant, responseMessageCreateDataFactory({ tempID }), ...otherVariants]);
    autofocus.setKey(tempID);
  };

  const onPatchVariant = async (index: number, updatedVariant: Partial<ResponseMessageCreate>) => {
    setResponseVariants(messages.map((variant, i) => (i === index ? { ...variant, ...updatedVariant } : variant)));
  };

  const onRemoveVariant = (index: number) => setResponseVariants(messages.filter((_, i) => i !== index));

  React.useEffect(() => {
    if (JSON.stringify(messages) !== JSON.stringify(initialState)) {
      createReaponse(messages.map(({ tempID, ...variant }) => variant));
    }
  }, [JSON.stringify(messages)]);

  return (
    <>
      <Box pt={11} pr={24} pb={18} direction="column">
        <ResponseCreateMessage
          onVariantChange={(updatedVariant) => onPatchVariant(0, updatedVariant)}
          textVariant={rootVariant}
          readOnly={loading}
          disabled={loading}
          autoFocusIfEmpty
        />
      </Box>

      <Divider />

      <Section.Header.Container
        pt={11}
        pb={hasVariants ? 0 : 11}
        variant="active"
        title={(className) => (
          <SectionHeaderTitleWithLearnTooltip
            title="Variants"
            className={className}
            onLearnClick={Utils.functional.noop}
          >
            <Box gap={8} direction="column">
              <span>Variant responses will be selected randomly when you run your agent.</span>
              {/* TODO: uncomment when conditions are supported */}
              {/* <span>
                          If you add a condition to a variant, it will become a ‘conditional response’. This means if
                          the attached condition is true, the agent will delivery that specific variant.
                        </span> */}
            </Box>
          </SectionHeaderTitleWithLearnTooltip>
        )}
      >
        {!hasVariants && (
          <ResponseEditFormSectionGenerateButton
            onClick={() => aiGenerateTextVariant.onGenerate({ quantity: 3 })}
            loading={aiGenerateTextVariant.fetching}
            disabled={loading}
          />
        )}

        <Section.Header.Button
          iconName="Plus"
          onClick={onAddVariant}
          disabled={aiGenerateTextVariant.fetching || loading}
        />
      </Section.Header.Container>

      {!hasVariants ? (
        <Divider />
      ) : (
        <>
          {otherVariants.map((variant, i) => {
            const index = i + 1;

            return (
              <Fragment key={variant.tempID}>
                <Box pt={index === 1 ? 0 : 12} pb={20} pr={24} direction="column">
                  <ResponseCreateMessage
                    removeButton={<CMSFormListButtonRemove onClick={() => onRemoveVariant(index)} />}
                    onVariantChange={(updatedVariant) => onPatchVariant(index, updatedVariant)}
                    autoFocus={autofocus.key === variant.tempID}
                    onValueEmpty={listEmpty.container(index)}
                    textVariant={variant}
                    readOnly={loading}
                    disabled={loading}
                  />
                </Box>

                {otherVariants.length !== index && <Divider />}
              </Fragment>
            );
          })}

          {aiFeaturesEnabled && (
            <Box px={16} pb={16}>
              <AIGenerateResponseVariantButton
                isLoading={aiGenerateTextVariant.fetching}
                onGenerate={aiGenerateTextVariant.onGenerate}
                hasExtraContext
                disabled={loading}
              />
            </Box>
          )}

          <Divider />
        </>
      )}
    </>
  );
};
