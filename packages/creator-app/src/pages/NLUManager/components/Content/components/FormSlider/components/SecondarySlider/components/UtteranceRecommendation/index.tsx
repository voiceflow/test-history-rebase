import { Box, IconButton, IconButtonVariant, TippyTooltip, toast } from '@voiceflow/ui';
import React from 'react';

import * as Intent from '@/ducks/intent';
import * as IntentV2 from '@/ducks/intentV2';
import { useDispatch, useSelector } from '@/hooks';
import { SliderHeader } from '@/pages/NLUManager/components/Content/components/FormSlider/components';
import { NLUManagerContext } from '@/pages/NLUManager/context';
import { validateUtterance } from '@/utils/intent';

import { BodyContainer } from '..';
import Recommendation from './components/Recommendation';

interface UtteranceRecommendationProps {
  recommendedUtteranances?: string[];
  intentID: string;
}

const dummyRecommendations = ['I would like a pizza', 'I want to order a pizza', 'Give me a pie'];

const UtteranceRecommendation: React.FC<UtteranceRecommendationProps> = ({ intentID, recommendedUtteranances = dummyRecommendations }) => {
  const customIntents = useSelector(IntentV2.allCustomIntentsSelector);
  const intent = useSelector(IntentV2.intentByIDSelector, { id: intentID });

  const patchIntent = useDispatch(Intent.patchIntent);
  const { setShowUtteranceRecos } = React.useContext(NLUManagerContext);
  const [utterances, setUtterances] = React.useState(recommendedUtteranances);

  const removeRecoFromList = (index: number) => {
    const newUtterances = utterances.slice();
    newUtterances.splice(index, 1);
    setUtterances(newUtterances);
  };

  const handleAddUtterance = (text: string, index: number) => {
    const error = validateUtterance(text, intentID, customIntents);
    if (error) {
      toast.error(error);
    } else {
      const newInput = { text, slots: [] };
      patchIntent(intentID, { inputs: [newInput, ...intent!.inputs] });
      removeRecoFromList(index);
    }
  };

  const handleDecline = (index: number) => {
    removeRecoFromList(index);
  };

  if (!intent) return null;

  return (
    <Box>
      <SliderHeader>
        <Box fontWeight={600} fontSize={18} margin="-2px 0">
          Recommendations
        </Box>
        <Box display="flex">
          <TippyTooltip title="Refresh" style={{ display: 'flex' }} distance={20}>
            <IconButton icon="publishSpin" inline style={{ marginRight: 14 }} variant={IconButtonVariant.BASIC} />
          </TippyTooltip>
          <IconButton onClick={() => setShowUtteranceRecos(false)} icon="close" inline variant={IconButtonVariant.BASIC} />
        </Box>
      </SliderHeader>
      <BodyContainer>
        {utterances.map((utterance, index) => {
          return (
            <Recommendation
              key={index}
              text={utterance}
              onAccept={(text) => handleAddUtterance(text, index)}
              onDecline={() => handleDecline(index)}
            />
          );
        })}
      </BodyContainer>
    </Box>
  );
};

export default UtteranceRecommendation;
