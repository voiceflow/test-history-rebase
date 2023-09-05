import { EmptyPage, Surface } from '@voiceflow/ui-next';
import React from 'react';

import { CMS_INTENT_LEARN_MORE } from '@/constants/link.constant';
import { useIntentCreateModalV2 } from '@/ModalsV2';

import type { IIntentMenuEmpty } from './IntentMenuEmpty.interface';

export const IntentMenuEmpty: React.FC<IIntentMenuEmpty> = ({ width }) => {
  const createModal = useIntentCreateModalV2();

  return (
    <Surface px={24} pt={24} pb={8} width={width ? `${width}px` : undefined} justify="center" minWidth="fit-content">
      <EmptyPage
        title="No intents exist"
        button={{ label: 'Create intent', onClick: () => createModal.openVoid({ folderID: null }) }}
        description="Intents are reusable collections of user says that aim to capture a users intention. "
        illustration="NoContent"
        learnMoreLink={CMS_INTENT_LEARN_MORE}
      />
    </Surface>
  );
};
