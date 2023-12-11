import * as Realtime from '@voiceflow/realtime-sdk';
import { Animations, Box, Button, ButtonVariant, StrengthGauge } from '@voiceflow/ui';
import React from 'react';

import { useFeature } from '@/hooks/feature';
import { useUpgradeModal } from '@/hooks/modal.hook';
import { EditorTabs } from '@/pages/NLUManager/constants';
import { useNLUManager } from '@/pages/NLUManager/context';
import { NLUIntent } from '@/pages/NLUManager/types';
import { getIntentClarityStrengthLevel, getIntentConfidenceStrengthLevel } from '@/utils/intent';
import { isIntentBuiltIn } from '@/utils/intent.util';

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
  const isBuiltIn = isIntentBuiltIn(intentID);

  const isConflictsPageOpen = nluManager.isEditorTabActive(EditorTabs.INTENT_CONFLICTS);

  const upgradeModal = useUpgradeModal();

  const { isEnabled: isConflictsViewEnabled } = useFeature(Realtime.FeatureFlag.NLU_MANAGER_CONFLICTS_VIEW);

  const handleConflictsButtonClick = () => {
    if (isConflictsPageOpen) {
      nluManager.closeEditorTab();
      return;
    }

    nluManager.openEditorTab(EditorTabs.INTENT_CONFLICTS);
  };

  if (isBuiltIn) return null;

  const confidencePoints = confidence >= 10 ? 100 : confidence * 10;

  return (
    <Animations.FadeDown>
      <S.Container>
        <Card
          color={StrengthGauge.StrengthColor[confidenceStrengthLevel]}
          title={
            <>
              <b style={{ display: 'contents' }}>Confidence: {confidencePoints}</b> of 100pts
            </>
          }
          level={confidencePoints / 100}
        >
          {confidenceMeta.message}
        </Card>

        <Card
          color={StrengthGauge.StrengthColor[clarityStrengthLevel]}
          title={
            nluManager.isFetchingClarity ? (
              <b style={{ display: 'contents' }}>Clarity: Updating ...</b>
            ) : (
              <>
                <b style={{ display: 'contents' }}>Clarity: {Math.round(intent.clarity * 100)}</b> of 100pts
              </>
            )
          }
          level={StrengthGauge.LINE_MULTIPLIER_MAP[intent.clarityLevel]}
          isLoading={nluManager.isFetchingClarity}
          expandedProp={upgradeModal.opened || isConflictsPageOpen}
        >
          {clarityMeta.message && !nluManager.isFetchingClarity ? (
            <>
              <Box mb={isConflictsViewEnabled ? 16 : 0}>{clarityMeta.message}</Box>
              {isConflictsViewEnabled && (
                <Button onClick={handleConflictsButtonClick} variant={ButtonVariant.WHITE}>
                  {isConflictsPageOpen ? 'Close Conflicts' : 'View Conflicts'}
                </Button>
              )}
            </>
          ) : (
            <Box>Intent is sufficiently differentiated from others in the model, very low chance of conflicts.</Box>
          )}
        </Card>
      </S.Container>
    </Animations.FadeDown>
  );
};

export default CardList;
