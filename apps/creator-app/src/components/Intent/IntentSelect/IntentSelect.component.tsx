import { Dropdown } from '@voiceflow/ui-next';
import React from 'react';

import { Designer } from '@/ducks';
import { useIntentEditModal } from '@/hooks/modal.hook';
import { useSelector } from '@/hooks/store.hook';

import { IntentMenu } from '../IntentMenu/IntentMenu.component';
import type { IIntentSelect } from './IntentSelect.interface';

export const IntentSelect: React.FC<IIntentSelect> = ({ editable = true, intentID, onSelect }) => {
  const intentName = useSelector(Designer.Intent.selectors.nameByID, { id: intentID });
  const editModal = useIntentEditModal();

  return (
    <Dropdown
      value={intentName}
      placeholder="Select intent"
      prefixIconName={editable && !!intentID ? 'EditS' : undefined}
      onPrefixIconClick={() => intentID && editModal.openVoid({ intentID })}
    >
      {({ onClose, referenceRef }) => <IntentMenu width={referenceRef.current?.clientWidth ?? 252} onClose={onClose} onSelect={onSelect} />}
    </Dropdown>
  );
};
