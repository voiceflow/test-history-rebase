import * as Platform from '@voiceflow/platform-config';
import { ClickableText, Flex, useDidUpdateEffect } from '@voiceflow/ui';
import React from 'react';

import IntentSelect from '@/components/IntentSelect';
import { ModalType } from '@/constants';
import * as IntentV2 from '@/ducks/intentV2';
import * as Tracking from '@/ducks/tracking';
import * as Transcript from '@/ducks/transcript';
import { useDispatch, useModals, useSelector, useTrackingEvents } from '@/hooks';

import * as S from './styles';

interface NoIntentProps {
  utterance: string;
  turnID: string;
  setChildDropdownIsOpened: (val: boolean) => void;
  focused: boolean;
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

const NoIntent: React.OldFC<NoIntentProps> = ({ turnID, focused, setChildDropdownIsOpened, utterance }) => {
  const [trackingEvents] = useTrackingEvents();
  const { annotations } = useSelector(Transcript.currentTranscriptSelector) ?? {};
  const { utteranceAddedTo: utteranceAddedToIntentID, utteranceAddedCount } = annotations?.[turnID] ?? {};
  const [initialUtterances, setInitialUtterances] = React.useState<Platform.Base.Models.Intent.Input[] | null>(null);
  const [targetIntentID, setTargetIntentID] = React.useState<string | null>(null);
  const getIntentByID = useSelector(IntentV2.getIntentByIDSelector);
  const activeTranscriptID = useSelector(Transcript.currentTranscriptIDSelector);
  const dispatchAddUtteranceToIntent = useDispatch(Transcript.setUtteranceAddedTo);
  const [isDropdownOpened, setIsDropdownOpened] = React.useState(false);
  const { open: openEditIntentModal, isOpened: editIntentModalOpened } = useModals(ModalType.INTENT_EDIT);

  useDidUpdateEffect(() => {
    setChildDropdownIsOpened(isDropdownOpened);
  }, [isDropdownOpened]);

  const addedIntent = utteranceAddedToIntentID ? getIntentByID({ id: utteranceAddedToIntentID }) : null;

  const resetStates = () => {
    setInitialUtterances(null);
    setTargetIntentID(null);
  };

  const handleOpenIntentEditModal = (intentID: string) => {
    const targetIntent = getIntentByID({ id: intentID });
    setInitialUtterances(targetIntent?.inputs ?? []);
    openEditIntentModal({ id: intentID, newUtterance: utterance, utteranceCreationType: Tracking.CanvasCreationType.QUICKVIEW });
  };

  // We have to put this in a useEffect because on intentSelect, if it is builtIn, the intentSelect needs to create the intent first, and there can be race conditions with the inner code
  useDidUpdateEffect(() => {
    if (targetIntentID) {
      handleOpenIntentEditModal(targetIntentID);
    }
  }, [targetIntentID]);

  const handleAddedUtteranceModalClose = async (intentID: string, initialUtterancesArray: Platform.Base.Models.Intent.Input[]) => {
    if (!activeTranscriptID) return;

    const targetIntent = getIntentByID({ id: intentID });
    if (!targetIntent) return;

    const updatedUtterances = targetIntent.inputs;

    const netNewUtterances = determineNewUtterances(initialUtterancesArray, updatedUtterances);

    if (netNewUtterances.length) {
      await dispatchAddUtteranceToIntent(netNewUtterances.length, targetIntent.name, targetIntent.id, activeTranscriptID, turnID);
      trackingEvents.trackConversationUtteranceSaved();
    }

    resetStates();
  };

  const renderTrigger = ({ opened, ...props }: { opened: boolean }) => {
    setIsDropdownOpened(opened);

    return (
      <Flex {...props}>
        <S.TextContainer onClick={(e) => e.stopPropagation()}>
          <S.StatusIcon icon="information" size={12} color="#E5B813" />
          No Match - &nbsp;
        </S.TextContainer>
        <ClickableText>Add utterance to intent</ClickableText>
      </Flex>
    );
  };

  useDidUpdateEffect(() => {
    if (!editIntentModalOpened && targetIntentID && initialUtterances) {
      handleAddedUtteranceModalClose(targetIntentID, initialUtterances);
    }
  }, [targetIntentID, initialUtterances, editIntentModalOpened]);

  return !utteranceAddedToIntentID ? (
    <S.Container focused={focused}>
      <IntentSelect
        intent={null}
        onChange={({ intent }) => setTargetIntentID(intent)}
        alwaysShowCreate
        inDropdownSearch
        renderTrigger={renderTrigger}
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
