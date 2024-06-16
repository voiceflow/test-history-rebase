import { Utils } from '@voiceflow/common';
import { ResponseVariantType, TextResponseVariantCreate } from '@voiceflow/dtos';
import { Box, Divider, Section } from '@voiceflow/ui-next';
import React, { Fragment } from 'react';

import { AIGenerateResponseVariantButton } from '@/components/AI/AIGenerateResponseVariantButton/AIGenerateResponseVariantButton.component';
import { useAIGenerateTextResponseVariants } from '@/components/AI/hooks/ai-generate-text-response-variants.hook';
import { CMSFormListButtonRemove } from '@/components/CMS/CMSForm/CMSFormListButtonRemove/CMSFormListButtonRemove.component';
import { ResponseEditFormSectionGenerateButton } from '@/components/Response/ResponseEditForm/ResponseEditFormSectionGenerateButton/ResponseEditFormSectionGenerateButton.component';
import { SectionHeaderTitleWithLearnTooltip } from '@/components/Section/SectionHeaderTitleWithLearnTooltip/SectionHeaderTitleWithTooltip.component';
import { Designer } from '@/ducks';
import { useDebouncedCallback, useDispatch } from '@/hooks';
import { useIsAIFeaturesEnabled } from '@/hooks/ai.hook';
import { useInputAutoFocusKey } from '@/hooks/input.hook';
import { useIsListEmpty } from '@/hooks/list.hook';
import { isTextResponseVariantEmpty, responseTextVariantCreateDataFactory } from '@/utils/response.util';

import { ResponseCreateTextVariant } from '../ResponseCreateTextVariant/ResponseCreateTextVariant.component';
import { IResponseCreateForm } from './ResponseCreateForm.interface';

const initialState: Array<TextResponseVariantCreate & { tempID?: string }> = [responseTextVariantCreateDataFactory()];

export const ResponseCreateForm: React.FC<IResponseCreateForm> = ({ onResponseCreate }) => {
  const createResponse = useDispatch(Designer.Response.effect.createOne);
  const aiFeaturesEnabled = useIsAIFeaturesEnabled();
  const [loading, setLoading] = React.useState(false);
  const [variants, setResponseVariants] = React.useState(initialState);

  const [rootVariant, ...otherVariants] = variants;
  const hasVariants = otherVariants.length > 0;
  const autofocus = useInputAutoFocusKey();
  const listEmpty = useIsListEmpty(variants, (variant) => isTextResponseVariantEmpty(variant));

  const createReaponse = useDebouncedCallback(5000, async (variants: Array<TextResponseVariantCreate>) => {
    setLoading(true);

    const { id } = await createResponse({
      name: '',
      folderID: null,
      variants,
    });

    onResponseCreate(id);
  });

  const aiGenerateTextVariant = useAIGenerateTextResponseVariants({
    examples: variants,
    onGenerated: async (newVariants) => {
      setResponseVariants([
        ...variants,
        ...newVariants.map(({ text }) => responseTextVariantCreateDataFactory({ text, tempID: Utils.id.objectID() })),
      ]);
    },
    successGeneratedMessage: 'Variants generated',
  });

  const onAddVariant = () => {
    const tempID = Utils.id.objectID();

    setResponseVariants([rootVariant, responseTextVariantCreateDataFactory({ tempID }), ...otherVariants]);
    autofocus.setKey(tempID);
  };

  const onPatchVariant = async (index: number, updatedVariant: Partial<TextResponseVariantCreate>) => {
    setResponseVariants(variants.map((variant, i) => (i === index ? { ...variant, ...updatedVariant } : variant)));
  };

  const onRemoveVariant = (index: number) => setResponseVariants(variants.filter((_, i) => i !== index));

  React.useEffect(() => {
    if (JSON.stringify(variants) !== JSON.stringify(initialState)) {
      createReaponse(variants.map(({ tempID, ...variant }) => variant));
    }
  }, [JSON.stringify(variants)]);

  return (
    <>
      <Box pt={11} pr={24} pb={18} direction="column">
        <ResponseCreateTextVariant
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
            type={ResponseVariantType.TEXT}
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
                  <ResponseCreateTextVariant
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
