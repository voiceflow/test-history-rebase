import { Dropdown } from '@voiceflow/ui-next';
import React from 'react';

import { Designer } from '@/ducks';
import { useIntentEditModal } from '@/hooks/modal.hook';
import { useSelector } from '@/hooks/store.hook';

import { IntentMenu } from '../IntentMenu/IntentMenu.component';
import type { IIntentSelect } from './IntentSelect.interface';

export const IntentSelect: React.FC<IIntentSelect> = ({ editable = true, intentID, onSelect, excludeIDs }) => {
  const intent = useSelector(Designer.Intent.selectors.oneByID, { id: intentID });
  const editModal = useIntentEditModal();

  return (
    <Dropdown
      value={intent?.name ?? null}
      testID="intent-select"
      placeholder="Select intent"
      prefixIconName={editable && !!intent ? 'EditS' : undefined}
      onPrefixIconClick={() => intentID && editModal.openVoid({ intentID })}
    >
      {({ onClose, referenceRef }) => (
        <IntentMenu
          width={referenceRef.current?.clientWidth ?? 252}
          onClose={onClose}
          onSelect={onSelect}
          excludeIDs={excludeIDs}
        />
      )}
    </Dropdown>
  );
};
