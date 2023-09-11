import React from 'react';

import { CMSFormListButtonRemove } from '@/components/CMS/CMSForm/CMSFormListButtonRemove/CMSFormListButtonRemove.component';
import { ResponseCreateVariant } from '@/components/Response/ResponseCreateVariant/ResponseCreateVariant.component';

import { IntentRequiredEntityAutomaticRepromptPopper } from '../IntentRequiredEntityAutomaticRepromptPopper/IntentRequiredEntityAutomaticRepromptPopper.component';
import { IntentRequiredEntityRepromptsPopper } from '../IntentRequiredEntityRepromptsPopper/IntentRequiredEntityRepromptsPopper.component';
import type { IIntentCreateRequiredEntityItem } from './IntentCreateRequiredEntityItem.interface';

export const IntentCreateRequiredEntityItem: React.FC<IIntentCreateRequiredEntityItem> = ({
  entityID,
  entityIDs,
  reprompts,
  entityName,
  attachments,
  onRepromptAdd,
  onEntityReplace,
  onRepromptDelete,
  onRepromptChange,
  automaticReprompt,
  onRepromptAttachmentSelect,
  onRepromptVariantTypeChange,
  onRepromptsAttachmentRemove,
  onRepromptAttachmentDuplicate,
}) => {
  return automaticReprompt ? (
    <IntentRequiredEntityAutomaticRepromptPopper
      entityID={entityID}
      entityIDs={entityIDs}
      entityName={entityName}
      onEntityReplace={onEntityReplace}
    />
  ) : (
    <IntentRequiredEntityRepromptsPopper reprompts={reprompts} entityName={entityName} onRepromptAdd={onRepromptAdd}>
      {() =>
        reprompts.map((reprompt, index) => (
          <ResponseCreateVariant
            key={reprompt.id}
            variant={reprompt}
            removeButton={<CMSFormListButtonRemove disabled={reprompts.length === 1} onClick={() => onRepromptDelete(reprompt.id)} />}
            autoFocusIfEmpty
            textVariantProps={{
              attachments: attachments[reprompt.id] ?? [],
              placeholder: `Enter reprompt ${index + 1}`,
              variantType: reprompt.type,
              onVariantChange: (data) => onRepromptChange(reprompt.id, data),
              onAttachmentSelect: (data) => onRepromptAttachmentSelect(reprompt.id, data),
              onChangeVariantType: (type) => onRepromptVariantTypeChange(reprompt.id, type),
              onAttachmentDuplicate: (attachmentID) => onRepromptAttachmentDuplicate(reprompt.id, attachmentID),
              onResponseAttachmentRemove: (attachmentID) => onRepromptsAttachmentRemove(reprompt.id, attachmentID),
            }}
          />
        ))
      }
    </IntentRequiredEntityRepromptsPopper>
  );
};
