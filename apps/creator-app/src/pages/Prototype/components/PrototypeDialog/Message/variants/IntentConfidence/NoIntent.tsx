import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Flex, stopPropagation, System, useDidUpdateEffect } from '@voiceflow/ui';
import React from 'react';

import IntentSelect from '@/components/IntentSelect';
import { Designer } from '@/ducks';
import * as IntentV2 from '@/ducks/intentV2';
import * as Tracking from '@/ducks/tracking';
import * as Transcript from '@/ducks/transcript';
import { useDispatch, useSelector, useTrackingEvents } from '@/hooks';
import { useFeature } from '@/hooks/feature';
import { useEditIntentModal, useIntentEditModalV2 } from '@/ModalsV2/hooks';
import { utteranceTextToString } from '@/utils/utterance.util';

import * as S from './styles';

interface NoIntentProps {
  turnID: string;
  focused: boolean;
  utterance: string;
  onToggleIntentSelect: (opened: boolean) => void;
}

const determineNewUtterances = (previousInputArray: Platform.Base.Models.Intent.Input[], newInputArray: Platform.Base.Models.Intent.Input[]) => {
  const previousUtteranceArray = new Set(previousInputArray.map(({ text }) => text));
  const newUtteranceArray = newInputArray.map(({ text }) => text);
  const netNewUtterances: string[] = [];

  newUtteranceArray.forEach((utterance) => {
    if (!previousUtteranceArray.has(utterance)) {
      netNewUtterances.push(utterance);
    }
  });

  return netNewUtterances;
};

const NoIntent: React.FC<NoIntentProps> = ({ turnID, focused, utterance, onToggleIntentSelect }) => {
  const v2CMS = useFeature(Realtime.FeatureFlag.V2_CMS);
  const [trackingEvents] = useTrackingEvents();

  const [targetIntentID, setTargetIntentID] = React.useState<string | null>(null);
  const [initialUtterances, setInitialUtterances] = React.useState<Platform.Base.Models.Intent.Input[] | null>(null);

  const transcript = useSelector(Transcript.currentTranscriptSelector);
  const getIntentByID = useSelector(IntentV2.getPlatformIntentByIDSelector);
  const entitiesMapByID = useSelector(Designer.Entity.selectors.map);
  const entitiesMapByName = useSelector(Designer.Entity.selectors.mapByName);
  const dispatchAddUtteranceToIntent = useDispatch(Transcript.setUtteranceAddedTo);

  const editIntentModal = useEditIntentModal();
  const intentEditModalV2 = useIntentEditModalV2();

  const { utteranceAddedTo: utteranceAddedToIntentID, utteranceAddedCount } = transcript?.annotations?.[turnID] ?? {};

  const addedIntent = utteranceAddedToIntentID ? getIntentByID({ id: utteranceAddedToIntentID }) : null;

  const resetStates = () => {
    setTargetIntentID(null);
    setInitialUtterances(null);
  };

  const handleOpenIntentEditModal = (intentID: string) => {
    const targetIntent = getIntentByID({ id: intentID });

    setInitialUtterances(targetIntent?.inputs ?? []);

    if (v2CMS.isEnabled) {
      intentEditModalV2.open({
        intentID,
        initialUtterance: utteranceTextToString.toDB(utterance, {
          regexp: /{{\[[^ .[\]{}]*?]\.([^ .[\]{}]*?)}}/g,
          entitiesMapByID,
          entitiesMapByName,
        }),
      });
    } else {
      editIntentModal.open({ intentID, newUtterance: utterance, utteranceCreationType: Tracking.CanvasCreationType.QUICKVIEW });
    }
  };

  const handleAddedUtteranceModalClose = async (intentID: string, initialUtterancesArray: Platform.Base.Models.Intent.Input[]) => {
    if (!transcript) return;

    const targetIntent = getIntentByID({ id: intentID });
    if (!targetIntent) return;

    const updatedUtterances = targetIntent.inputs;

    const netNewUtterances = determineNewUtterances(initialUtterancesArray, updatedUtterances);

    if (netNewUtterances.length) {
      await dispatchAddUtteranceToIntent(netNewUtterances.length, targetIntent.name, targetIntent.id, transcript.id, turnID);

      trackingEvents.trackConversationUtteranceSaved();
    }

    resetStates();
  };

  // We have to put this in a useEffect because on intentSelect, if it is builtIn, the intentSelect needs to create the intent first, and there can be race conditions with the inner code
  useDidUpdateEffect(() => {
    if (targetIntentID) {
      handleOpenIntentEditModal(targetIntentID);
    }
  }, [targetIntentID]);

  useDidUpdateEffect(() => {
    if (!editIntentModal.opened && targetIntentID && initialUtterances) {
      handleAddedUtteranceModalClose(targetIntentID, initialUtterances);
    }
  }, [targetIntentID, initialUtterances, editIntentModal.opened]);

  return !utteranceAddedToIntentID ? (
    <S.Container focused={focused}>
      <IntentSelect
        intent={null}
        onOpen={() => onToggleIntentSelect(true)}
        onClose={() => onToggleIntentSelect(false)}
        onChange={({ intent }) => setTargetIntentID(intent)}
        alwaysShowCreate
        inDropdownSearch
        renderTrigger={({ opened, ...props }: { opened: boolean }) => (
          <Flex {...props}>
            <S.TextContainer onClick={stopPropagation()}>
              <S.StatusIcon icon="information" size={12} color="#E5B813" />
              No Match - &nbsp;
            </S.TextContainer>

            <System.Link.Button>Add utterance to intent</System.Link.Button>
          </Flex>
        )}
      />
    </S.Container>
  ) : (
    <S.Container utteranceAdded>
      <Flex>
        <S.StatusIcon icon="check2" size={14} color="#449127" />
      </Flex>
      {utteranceAddedCount === 1 ? '1 utterance' : `${utteranceAddedCount ?? ''} utterances`} added to&nbsp;<span>{addedIntent?.name}</span>
      &nbsp;intent
    </S.Container>
  );
};

export default NoIntent;
