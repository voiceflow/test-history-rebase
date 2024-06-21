import { FeatureFlag } from '@voiceflow/realtime-sdk';
import { tid } from '@voiceflow/style';
import { Header } from '@voiceflow/ui-next';
import React from 'react';

import { useFeature } from '@/hooks/feature.hook';
import { useModal } from '@/hooks/modal.hook';
import { Modals } from '@/ModalsV2';
import { HEADER_TEST_ID } from '@/pages/AssistantCMS/AssistantCMS.constant';

import { CMSHeader } from '../../../../components/CMSHeader/CMSHeader.component';
import { useOnIntentCreate } from '../../CMSIntent.hook';

export const CMSIntentHeader: React.FC = () => {
  const onCreate = useOnIntentCreate();
  const previewModal = useModal(Modals.Intent.Preview);
  const settingsModal = useModal(Modals.Intent.ClassificationSettings);
  const intentClassification = useFeature(FeatureFlag.INTENT_CLASSIFICATION);

  return (
    <CMSHeader
      searchPlaceholder="Search intents"
      rightActions={
        <>
          {intentClassification && (
            <>
              <Header.Button.IconSecondary
                testID={tid(HEADER_TEST_ID, 'settings')}
                iconName="Settings"
                onClick={() => settingsModal.openVoid()}
              />

              <Header.Button.Secondary
                label="Preview"
                testID={tid(HEADER_TEST_ID, 'preview')}
                iconName="PlayS"
                onClick={() => previewModal.openVoid()}
              />
            </>
          )}

          <Header.Button.Primary
            label="New intent"
            testID={tid(HEADER_TEST_ID, 'new-intent')}
            onClick={() => onCreate()}
          />
        </>
      }
    />
  );
};
