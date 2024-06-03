// import { SquareButton } from '@voiceflow/ui-next';
import React from 'react';

// import { ResponseAttachmentPopper } from '../ResponseAttachmentPopper/ResponseAttachmentPopper.component';
import { ResponseTextVariantLayout } from '../ResponseTextVariantLayout/ResponseTextVariantLayout.component';
import { ResponseTextVariantSettings } from '../ResponseTextVariantSettings/ResponseTextVariantSettings.component';
import { IResponseCreateTextVariant } from './ResponseCreateTextVariant.interface';

export const ResponseCreateTextVariant: React.FC<IResponseCreateTextVariant> = ({
  textResponseVariant,
  attachments,
  onVariantChange,
  ...props
}) => (
  <ResponseTextVariantLayout
    {...props}
    value={textResponseVariant.text}
    onValueChange={(text) => onVariantChange({ text })}
    // TODO: add settings button when settings are supported by runtime
    settingsButton={<ResponseTextVariantSettings variant={textResponseVariant} onVariantChange={onVariantChange} />}
  />
);
