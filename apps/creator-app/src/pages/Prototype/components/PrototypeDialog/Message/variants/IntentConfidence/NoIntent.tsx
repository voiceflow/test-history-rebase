import * as Platform from '@voiceflow/platform-config';
import { Flex, stopPropagation, System, useDidUpdateEffect } from '@voiceflow/ui';
import React from 'react';

import IntentSelect from '@/components/IntentSelect';
import { ModalType } from '@/constants';
import * as IntentV2 from '@/ducks/intentV2';
import * as Tracking from '@/ducks/tracking';
import * as Transcript from '@/ducks/transcript';
import { useDispatch, useModals, useSelector, useTrackingEvents } from '@/hooks';

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
  const [trackingEvents] = useTrackingEvents();

  const [targetIntentID, setTargetIntentID] = React.useState<string | null>(null);
  const [initialUtterances, setInitialUtterances] = React.useState<Platform.Base.Models.Intent.Input[] | null>(null);

  const transcript = useSelector(Transcript.currentTranscriptSelector);
  const getIntentByID = useSelector(IntentV2.getPlatformIntentByIDSelector);
  const dispatchAddUtteranceToIntent = useDispatch(Transcript.setUtteranceAddedTo);

  const { open: openEditIntentModal, isOpened: editIntentModalOpened } = useModals(ModalType.INTENT_EDIT);

  const { utteranceAddedTo: utteranceAddedToIntentID, utteranceAddedCount } = transcript?.annotations?.[turnID] ?? {};

  const addedIntent = utteranceAddedToIntentID ? getIntentByID({ id: utteranceAddedToIntentID }) : null;

  const resetStates = () => {
    setTargetIntentID(null);
    setInitialUtterances(null);
  };

  const handleOpenIntentEditModal = (intentID: string) => {
    const targetIntent = getIntentByID({ id: intentID });

    setInitialUtterances(targetIntent?.inputs ?? []);
    openEditIntentModal({ id: intentID, newUtterance: utterance, utteranceCreationType: Tracking.CanvasCreationType.QUICKVIEW });
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
    if (!editIntentModalOpened && targetIntentID && initialUtterances) {
      handleAddedUtteranceModalClose(targetIntentID, initialUtterances);
    }
  }, [targetIntentID, initialUtterances, editIntentModalOpened]);

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
