import { EmptyPage, Surface } from '@voiceflow/ui-next';
import React from 'react';

import { CMS_INTENT_LEARN_MORE } from '@/constants/link.constant';
import { useIntentCreateModalV2 } from '@/hooks/modal.hook';

import type { IIntentMenuEmpty } from './IntentMenuEmpty.interface';

export const IntentMenuEmpty: React.FC<IIntentMenuEmpty> = ({ width, onCreated }) => {
  const createModal = useIntentCreateModalV2();

  const onCreate = async () => {
    try {
      const intent = await createModal.open({ folderID: null });

      onCreated?.(intent);
    } catch {
      // closed
    }
  };

  return (
    <Surface px={24} pt={24} pb={8} width={width ? `${width}px` : undefined} justify="center" minWidth="fit-content">
      <EmptyPage
        title="No intents exist"
        button={{ label: 'Create intent', onClick: () => onCreate }}
        description="Intents are reusable collections of user says that aim to capture a users intention. "
        illustration="NoContent"
        learnMoreLink={CMS_INTENT_LEARN_MORE}
      />
    </Surface>
  );
};
