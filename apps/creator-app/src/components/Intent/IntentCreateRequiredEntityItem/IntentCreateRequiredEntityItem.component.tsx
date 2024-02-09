import { tid } from '@voiceflow/style';
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
  intentName,
  utterances,
  attachments,
  onRepromptAdd,
  onEntityReplace,
  onRepromptDelete,
  onRepromptChange,
  automaticReprompt,
  onRepromptsGenerated,
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
    <IntentRequiredEntityRepromptsPopper
      entityID={entityID}
      entityIDs={entityIDs}
      reprompts={reprompts}
      utterances={utterances}
      intentName={intentName}
      entityName={entityName}
      onRepromptAdd={onRepromptAdd}
      onEntityReplace={onEntityReplace}
      onRepromptsGenerated={onRepromptsGenerated}
    >
      {reprompts.map((reprompt, index) => (
        <div key={reprompt.id}>
          <ResponseCreateVariant
            variant={reprompt}
            removeButton={
              <CMSFormListButtonRemove
                disabled={reprompts.length === 1}
                onClick={() => onRepromptDelete(reprompt.id)}
                testID={tid('required-entity', ['reprompt', 'remove'])}
              />
            }
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
            testID={tid('required-entity', 'reprompt')}
          />
        </div>
      ))}
    </IntentRequiredEntityRepromptsPopper>
  );
};
