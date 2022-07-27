import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Button, ButtonVariant, StrengthGauge, useLocalStorageState } from '@voiceflow/ui';
import React from 'react';

import { Permission } from '@/config/permissions';
import { NluViewConflictsLimitDetails } from '@/config/planLimits/nluConflicts';
import { ModalType } from '@/constants';
import * as IntentV2 from '@/ducks/intentV2';
import { useModals, usePermission, useSelector } from '@/hooks';
import { EditorTabs } from '@/pages/NLUManager/constants';
import { useNLUManager } from '@/pages/NLUManager/context';
import { FadeDownContainer } from '@/styles/animations';
import { getIntentStrengthLevel, isBuiltInIntent } from '@/utils/intent';

import { Card } from './components';
import * as S from './styles';

// Temporary dummy data
const CONFIDENCE_META = {
  [StrengthGauge.Level.NOT_SET]: {
    points: 0,
    message: 'No utterances set, you will need to add utterances to trigger this intent',
  },
  [StrengthGauge.Level.WEAK]: {
    points: 20,
    message: 'More utterances needed. Intents with too few utterances leads to poor accuracy.',
  },
  [StrengthGauge.Level.MEDIUM]: {
    points: 64,
    message: 'The number of utterances is sufficient. Adding more will increase intent accuracy.',
  },
  [StrengthGauge.Level.STRONG]: {
    points: 81,
    message: 'Intent contains a sufficent number of utterances to maintain a high level of accuracy.',
  },
  [StrengthGauge.Level.VERY_STRONG]: {
    points: 100,
    message: '',
  },
};

const CLARITY_META = {
  [StrengthGauge.Level.NOT_SET]: {
    points: 0,
    message: '',
  },
  [StrengthGauge.Level.WEAK]: {
    points: 20,
    message: '2 utterances in this intent are too similar to those included in 1 other intent.',
  },
  [StrengthGauge.Level.MEDIUM]: {
    points: 50,
    message: '1 utterance in this intent is too similar to those included in 1 other intent.',
  },
  [StrengthGauge.Level.STRONG]: {
    points: 75,
    message: 'Nice',
  },
  [StrengthGauge.Level.VERY_STRONG]: {
    points: 100,
    message: '',
  },
};

interface CardListProps {
  intentID: string;
}

const CardList: React.FC<CardListProps> = ({ intentID }) => {
  const intent = useSelector(IntentV2.getIntentByIDSelector)({ id: intentID });
  const strengthLevel = getIntentStrengthLevel(intent?.inputs.length || 0);
  const confidenceMeta = CONFIDENCE_META[strengthLevel];
  const clarityMeta = CLARITY_META[strengthLevel];
  const isBuiltIn = isBuiltInIntent(intentID);
  // Temporary storage behavior
  const [dismissedNotifications, setDismissedNotifications] = useLocalStorageState(
    'nlu-clarify-dismissed-notifications',
    {} as Record<string, { clarity?: boolean; confidence?: boolean }>
  );
  const dismissedIntentNotifications = dismissedNotifications[intentID];
  const nluManager = useNLUManager<Realtime.Intent>();
  const isConflictsPageOpen = nluManager.isEditorTabActive(EditorTabs.INTENT_CONFLICTS);

  const [permissionToViewConflicts] = usePermission(Permission.NLU_CONFLICTS);
  const { open: openUpgradeModal } = useModals(ModalType.UPGRADE_MODAL);

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
  if (dismissedIntentNotifications?.confidence && dismissedIntentNotifications?.clarity) return null;

  // Just temporary dummy data / conditions
  return [StrengthGauge.Level.WEAK, StrengthGauge.Level.MEDIUM, StrengthGauge.Level.NOT_SET].includes(strengthLevel) ? (
    <FadeDownContainer>
      <S.Container>
        {!dismissedIntentNotifications?.confidence && (
          <Card
            color={StrengthGauge.StrengthColor[strengthLevel]}
            title={
              <>
                <b style={{ display: 'contents' }}>Confidence: {confidenceMeta.points}</b> of 100pts
              </>
            }
            onClose={() => handleCloseNotification('confidence')}
          >
            {confidenceMeta.message}
          </Card>
        )}

        {!dismissedIntentNotifications?.clarity && (
          <Card
            color={StrengthGauge.StrengthColor[strengthLevel]}
            title={
              <>
                <b style={{ display: 'contents' }}>Clarity: {clarityMeta.points}</b> of 100pts
              </>
            }
            onClose={() => handleCloseNotification('clarity')}
          >
            <Box mb={16}>{clarityMeta.message}</Box>
            <Button onClick={triggerConflictsSlider} flat squareRadius variant={ButtonVariant.SECONDARY}>
              {isConflictsPageOpen ? 'Hide conflicts' : 'View conflicts'}
            </Button>
          </Card>
        )}
      </S.Container>
    </FadeDownContainer>
  ) : null;
};

export default CardList;
