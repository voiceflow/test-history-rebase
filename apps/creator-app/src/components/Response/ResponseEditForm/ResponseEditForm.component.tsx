import { Utils } from '@voiceflow/common';
import { ResponseVariantType } from '@voiceflow/dtos';
import { Box, Divider, Section, Tooltip } from '@voiceflow/ui-next';
import React, { Fragment } from 'react';

import { AIGenerateResponseVariantButton } from '@/components/AI/AIGenerateResponseVariantButton/AIGenerateResponseVariantButton.component';
import { useAIGenerateTextResponseVariants } from '@/components/AI/hooks/ai-generate-text-response-variants.hook';
import { CMSFormListButtonRemove } from '@/components/CMS/CMSForm/CMSFormListButtonRemove/CMSFormListButtonRemove.component';
import { TooltipContentLearn } from '@/components/Tooltip/TooltipContentLearn/TooltipContentLearn.component';
import { Designer } from '@/ducks';
import { useInputAutoFocusKey } from '@/hooks/input.hook';
import { useIsListEmpty } from '@/hooks/list.hook';
import { usePopperModifiers } from '@/hooks/popper.hook';
import { useDispatch } from '@/hooks/store.hook';
import { popperPaddingModifierFactory } from '@/utils/popper.util';
import { isTextResponseVariant, isTextResponseVariantEmpty } from '@/utils/response.util';

import { ResponseEditVariant } from '../ResponseEditVariant/ResponseEditVariant.component';
import { useResponseVariants } from './ResponseEditForm.hook';
import type { IResponseEditForm } from './ResponseEditForm.interface';
import { ResponseEditFormSectionGenerateButton } from './ResponseEditFormSectionGenerateButton/ResponseEditFormSectionGenerateButton.component';

export const ResponseEditForm: React.FC<IResponseEditForm> = ({ responseID }) => {
  const deleteVariant = useDispatch(Designer.Response.ResponseVariant.effect.deleteOne);
  const createVariant = useDispatch(Designer.Response.ResponseVariant.effect.createOneEmpty);
  const createManyTextVariants = useDispatch(Designer.Response.ResponseVariant.effect.createManyText);

  const autofocus = useInputAutoFocusKey();
  const { variants, discriminatorID } = useResponseVariants({ responseID });

  const aiGenerateTextVariant = useAIGenerateTextResponseVariants({
    examples: variants,
    onGenerated: (newVariants) =>
      discriminatorID &&
      createManyTextVariants(
        discriminatorID,
        variants.length ? newVariants.map((variant) => ({ ...variant, attachmentOrder: variants[0].attachmentOrder })) : newVariants
      ),
  });

  const listEmpty = useIsListEmpty(variants, (variant) => (isTextResponseVariant(variant) ? isTextResponseVariantEmpty(variant) : true));

  const titleModifiers = usePopperModifiers([{ name: 'offset', options: { offset: [-12, 0] } }, popperPaddingModifierFactory({ padding: 27 })]);

  if (!variants.length || discriminatorID === null) return null;

  const [rootVariant, ...otherVariants] = variants;

  const onAddVariant = async () => {
    const res = await createVariant(discriminatorID, rootVariant.type);

    autofocus.setKey(res.id);
  };

  const hasVariants = otherVariants.length > 0;

  return (
    <>
      <Box pt={11} pr={24} pb={18} direction="column">
        <ResponseEditVariant variant={rootVariant} autoFocusIfEmpty={!hasVariants} textVariantProps={{ onValueEmpty: listEmpty.container(0) }} />
      </Box>

      <Divider />

      <Box pt={11} pb={hasVariants ? 0 : 11}>
        <Section.Header.Container
          title={(className) => (
            <Tooltip
              width={200}
              inline
              placement="left-start"
              modifiers={titleModifiers}
              referenceElement={({ ref, onOpen, onClose, popper }) => (
                <span ref={ref} className={className} onMouseEnter={onOpen} onMouseLeave={onClose}>
                  {popper}
                  Variants
                </span>
              )}
            >
              {() => (
                <TooltipContentLearn
                  label={
                    <Box gap={8} direction="column">
                      <span>Variant responses will be selected randomly when you run your agent.</span>
                      {/* TODO: uncomment when conditions are supported */}
                      {/* <span>
                          If you add a condition to a variant, it will become a ‘conditional response’. This means if
                          the attached condition is true, the agent will delivery that specific variant.
                        </span> */}
                    </Box>
                  }
                  // TODO: add link to docs
                  onLearnClick={Utils.functional.noop}
                />
              )}
            </Tooltip>
          )}
          variant="active"
        >
          {!hasVariants && (
            <ResponseEditFormSectionGenerateButton
              type={rootVariant.type}
              onClick={() => aiGenerateTextVariant.onGenerate({ quantity: 3 })}
              loading={aiGenerateTextVariant.fetching}
            />
          )}

          <Section.Header.Button iconName="Plus" onClick={onAddVariant} disabled={aiGenerateTextVariant.fetching} />
        </Section.Header.Container>
      </Box>

      {!hasVariants ? (
        <Divider />
      ) : (
        <>
          {otherVariants.map((variant, index) => (
            <Fragment key={variant.id}>
              <Box pt={index === 0 ? 0 : 12} pb={20} pr={24} direction="column">
                <ResponseEditVariant
                  variant={variant}
                  autoFocus={autofocus.key === variant.id}
                  textVariantProps={{ onValueEmpty: listEmpty.container(index + 1) }}
                  removeButton={<CMSFormListButtonRemove onClick={() => deleteVariant(variant.id)} />}
                />
              </Box>

              {otherVariants.length !== index + 1 && <Divider />}
            </Fragment>
          ))}

          {rootVariant.type === ResponseVariantType.TEXT && (
            <Box px={16} pb={16}>
              <AIGenerateResponseVariantButton
                isLoading={aiGenerateTextVariant.fetching}
                onGenerate={aiGenerateTextVariant.onGenerate}
                hasExtraContext={!listEmpty.value}
              />
            </Box>
          )}

          <Divider />
        </>
      )}
    </>
  );
};
