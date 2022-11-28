import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Button, ButtonVariant, StrengthGauge, useLocalStorageState } from '@voiceflow/ui';
import React from 'react';

import { Permission } from '@/config/permissions';
import { NluViewConflictsLimitDetails } from '@/config/planLimits/nluConflicts';
import { ModalType } from '@/constants';
import { useFeature, useModals, usePermission } from '@/hooks';
import { EditorTabs } from '@/pages/NLUManager/constants';
import { useNLUManager } from '@/pages/NLUManager/context';
import { NLUIntent } from '@/pages/NLUManager/types';
import { FadeDownContainer } from '@/styles/animations';
import { getIntentClarityStrengthLevel, getIntentConfidenceStrengthLevel, isBuiltInIntent } from '@/utils/intent';

import { Card } from './components';
import { getClarityMeta, getConfidenceMeta } from './constants';
import * as S from './styles';

interface CardListProps {
  intent: NLUIntent;
}

const CardList: React.FC<CardListProps> = ({ intent }) => {
  const nluManager = useNLUManager();
  const intentID = intent.id;
  const confidence = intent.confidence || 0;
  const clarityStrengthLevel = getIntentClarityStrengthLevel(intent.clarity || 0);
  const confidenceStrengthLevel = getIntentConfidenceStrengthLevel(confidence);
  const confidenceMeta = getConfidenceMeta()[confidenceStrengthLevel];
  const clarityMeta = getClarityMeta(intent)[clarityStrengthLevel];
  const isBuiltIn = isBuiltInIntent(intentID);
  // Temporary storage behavior
  const [dismissedNotifications, setDismissedNotifications] = useLocalStorageState(
    'nlu-clarify-dismissed-notifications',
    {} as Record<string, { clarity?: boolean; confidence?: boolean }>
  );
  const dismissedIntentNotifications = dismissedNotifications[intentID];
  const isConflictsPageOpen = nluManager.isEditorTabActive(EditorTabs.INTENT_CONFLICTS);
  const showClarityMessage = !dismissedIntentNotifications?.clarity && clarityMeta.message && intent.hasConflicts;
  const showConfidenceMessage = !dismissedIntentNotifications?.confidence && confidenceMeta.message;

  const [permissionToViewConflicts] = usePermission(Permission.NLU_CONFLICTS);
  const { open: openUpgradeModal } = useModals(ModalType.UPGRADE_MODAL);

  const { isEnabled: isConflictsViewEnabled } = useFeature(Realtime.FeatureFlag.NLU_MANAGER_CONFLICTS_VIEW);

  const triggerConflictsSlider = () => {
    if (isConflictsPageOpen) {
      nluManager.closeEditorTab();
      return;
    }

    if (!permissionToViewConflicts) {
      openUpgradeModal({ planLimitDetails: NluViewConflictsLimitDetails });
      return;
    }

    nluManager.openEditorTab(EditorTabs.INTENT_CONFLICTS);
  };

  const handleCloseNotification = (notificationID: 'clarity' | 'confidence') => {
    setDismissedNotifications({ ...dismissedNotifications, [intentID]: { ...dismissedIntentNotifications, [notificationID]: true } });
  };

  if (isBuiltIn) return null;
  if (!showClarityMessage && !showConfidenceMessage) return null;

  const confidencePoints = confidence >= 10 ? 100 : confidence * 10;

  return (
    <FadeDownContainer>
      <S.Container>
        {showConfidenceMessage && (
          <Card
            color={StrengthGauge.StrengthColor[confidenceStrengthLevel]}
            title={
              <>
                <b style={{ display: 'contents' }}>Confidence: {confidencePoints}</b> of 100pts
              </>
            }
            onClose={() => handleCloseNotification('confidence')}
          >
            {confidenceMeta.message}
          </Card>
        )}

        {showClarityMessage && (
          <Card
            color={StrengthGauge.StrengthColor[clarityStrengthLevel]}
            title={
              <>
                <b style={{ display: 'contents' }}>Clarity: {Math.round(intent.clarity * 100)}</b> of 100pts
              </>
            }
            onClose={() => handleCloseNotification('clarity')}
          >
            <Box mb={isConflictsViewEnabled ? 16 : 0}>{clarityMeta.message}</Box>
            {isConflictsViewEnabled && (
              <Button onClick={triggerConflictsSlider} variant={ButtonVariant.SECONDARY}>
                {isConflictsPageOpen ? 'Hide Conflicts' : 'View Conflicts'}
              </Button>
            )}
          </Card>
        )}
      </S.Container>
    </FadeDownContainer>
  );
};

export default CardList;
