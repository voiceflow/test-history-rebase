import { Box, Button, ButtonVariant, StrengthGauge } from '@voiceflow/ui';
import React from 'react';

import * as IntentV2 from '@/ducks/intentV2';
import { useSelector } from '@/hooks';
import { Card, CardsContainer } from '@/pages/NLUManager/components/Content/components/FormSlider/components/IntentSlider/components';
import { FadeDownContainer } from '@/styles/animations';
import { getIntentStrengthLevel, isBuiltInIntent } from '@/utils/intent';

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

interface CardsProps {
  intentID: string;
}

const Cards: React.FC<CardsProps> = ({ intentID }) => {
  const intent = useSelector(IntentV2.getIntentByIDSelector)({ id: intentID });
  const strengthLevel = getIntentStrengthLevel(intent?.inputs.length || 0);
  const confidenceMeta = CONFIDENCE_META[strengthLevel];
  const clarityMeta = CLARITY_META[strengthLevel];
  const isBuiltIn = isBuiltInIntent(intentID);

  const triggerConflictsSlider = () => {
    alert('placeholder');
  };

  if (isBuiltIn) return null;

  // Just temporary dummy data / conditions
  return [StrengthGauge.Level.WEAK, StrengthGauge.Level.MEDIUM, StrengthGauge.Level.NOT_SET].includes(strengthLevel) ? (
    <FadeDownContainer>
      <CardsContainer>
        <Card
          color={StrengthGauge.StrengthColor[strengthLevel]}
          title={
            <span>
              <b>Confidence: {confidenceMeta.points}</b> of 100pts
            </span>
          }
          body={<>{confidenceMeta.message}</>}
          handleClose={() => {}}
        />
        <Box mt={12}>
          <Card
            color={StrengthGauge.StrengthColor[strengthLevel]}
            title={
              <span>
                <b>Clarity: {clarityMeta.points}</b> of 100pts
              </span>
            }
            body={
              <>
                <Box mb={16}>{clarityMeta.message}</Box>
                <Button onClick={triggerConflictsSlider} flat squareRadius variant={ButtonVariant.SECONDARY}>
                  View conflicts
                </Button>
              </>
            }
            handleClose={() => {}}
          />
        </Box>
      </CardsContainer>
    </FadeDownContainer>
  ) : null;
};

export default Cards;
