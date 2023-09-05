import { AttachmentType } from '@voiceflow/sdk-logux-designer';
import { SquareButton } from '@voiceflow/ui-next';
import React from 'react';
import { match } from 'ts-pattern';

import { Designer } from '@/ducks';
import { useDispatch } from '@/hooks/store.hook';

import { ResponseAttachmentPopper } from '../ResponseAttachmentPopper/ResponseAttachmentPopper.component';
import { ResponseEditAttachmentList } from '../ResponseEditAttachmentList/ResponseEditAttachmentList.component';
import { ResponseEditTextVariantSettings } from '../ResponseEditTextVariantSettings/ResponseEditTextVariantSettings.component';
import { ResponseTextVariantLayout } from '../ResponseTextVariantLayout/ResponseTextVariantLayout.component';
import type { IResponseEditTextVariant } from './ResponseEditTextVariant.interface';

export const ResponseEditTextVariant: React.FC<IResponseEditTextVariant> = ({ variant, ...props }) => {
  const patchVariant = useDispatch(Designer.Response.ResponseVariant.effect.patchOneText, variant.id);
  const createOneCard = useDispatch(Designer.Response.ResponseAttachment.effect.createOneCard, variant.id);
  const createOneMedia = useDispatch(Designer.Response.ResponseAttachment.effect.createOneMedia, variant.id);
  const replaceWithType = useDispatch(Designer.Response.ResponseVariant.effect.replaceWithType, variant.id);

  const onAttachmentSelect = ({ id, type }: { id: string; type: AttachmentType }) => {
    match(type)
      .with(AttachmentType.CARD, () => createOneCard({ cardID: id }))
      .with(AttachmentType.MEDIA, () => createOneMedia({ mediaID: id }))
      .exhaustive();
  };

  return (
    <ResponseTextVariantLayout
      {...props}
      value={variant.text}
      variantType={variant.type}
      onValueChange={(text) => patchVariant({ text })}
      onChangeVariantType={replaceWithType}
      settingsButton={<ResponseEditTextVariantSettings variant={variant} onVariantChange={patchVariant} />}
      attachmentsList={<ResponseEditAttachmentList variant={variant} />}
      attachmentButton={
        <ResponseAttachmentPopper
          onAttachmentSelect={onAttachmentSelect}
          referenceElement={({ ref, isOpen, onOpen }) => (
            <SquareButton ref={ref} size="medium" onClick={onOpen} isActive={isOpen} iconName="Attachement" />
          )}
        />
      }
    />
  );
};
