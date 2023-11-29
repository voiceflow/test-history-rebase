import { Utils } from '@voiceflow/common';
import { Dropdown } from '@voiceflow/ui-next';
import React from 'react';

import { Designer } from '@/ducks';
import { useIntentEditModalV2 } from '@/hooks/modal.hook';
import { useSelector } from '@/hooks/store.hook';

import { IntentMenu } from '../IntentMenu/IntentMenu.component';
import type { IIntentDropdown } from './IntentDropdown.interface';

export const IntentDropdown: React.FC<IIntentDropdown> = ({ editable = true, intentID, onIntentSelect }) => {
  const intentName = useSelector(Designer.Intent.selectors.nameByID, { id: intentID });
  const editModal = useIntentEditModalV2();

  return (
    <Dropdown
      value={intentName}
      placeholder="Select intent"
      prefixIconName={editable && !!intentID ? 'EditS' : undefined}
      onPrefixIconClick={() => intentID && editModal.openVoid({ intentID })}
    >
      {({ onClose, referenceRef }) => (
        <IntentMenu width={referenceRef.current?.clientWidth ?? 252} onIntentSelect={Utils.functional.chain(onIntentSelect, onClose)} />
      )}
    </Dropdown>
  );
};
