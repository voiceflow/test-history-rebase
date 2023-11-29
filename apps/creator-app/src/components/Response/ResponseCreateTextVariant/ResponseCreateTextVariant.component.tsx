// import { SquareButton } from '@voiceflow/ui-next';
import React from 'react';

import { ResponseAttachmentList } from '../ResponseAttachmentList/ResponseAttachmentList.component';
// import { ResponseAttachmentPopper } from '../ResponseAttachmentPopper/ResponseAttachmentPopper.component';
import { ResponseTextVariantLayout } from '../ResponseTextVariantLayout/ResponseTextVariantLayout.component';
// import { ResponseTextVariantSettings } from '../ResponseTextVariantSettings/ResponseTextVariantSettings.component';
import { IResponseCreateTextVariant } from './ResponseCreateTextVariant.interface';

export const ResponseCreateTextVariant: React.FC<IResponseCreateTextVariant> = ({
  variant,
  attachments,
  onVariantChange,
  onAttachmentSelect,
  onAttachmentDuplicate,
  onResponseAttachmentRemove,
  ...props
}) => (
  <ResponseTextVariantLayout
    {...props}
    value={variant.text}
    onValueChange={(text) => onVariantChange({ text })}
    // TODO: add settings button when settings are supported by runtime
    // settingsButton={<ResponseTextVariantSettings variant={variant} attachments={attachments} onVariantChange={onVariantChange} />}
    settingsButton={null}
    attachmentsList={
      <ResponseAttachmentList
        onRemove={onResponseAttachmentRemove}
        attachments={attachments}
        onAttachmentSelect={onAttachmentSelect}
        onAttachmentDuplicate={onAttachmentDuplicate}
      />
    }
    // TODO: add attachment button when attachments are supported by runtime
    attachmentButton={null}
    // attachmentButton={
    //   <ResponseAttachmentPopper
    //     onAttachmentSelect={onAttachmentSelect}
    //     referenceElement={({ ref, isOpen, onOpen }) => (
    //       <SquareButton ref={ref} size="medium" onClick={onOpen} isActive={isOpen} iconName="Attachement" />
    //     )}
    //   />
    // }
  />
);
