import { ClickableText, Flex, useDidUpdateEffect } from '@voiceflow/ui';
import React from 'react';
import { useHistory } from 'react-router-dom';

import { PREFILLED_UTTERANCE_PARAM } from '@/components/IntentForm/components/Custom/components/UtteranceManager';
import IntentSelect from '@/components/IntentSelect';
import { ModalType } from '@/constants';
import * as IntentV2 from '@/ducks/intentV2';
import * as Transcript from '@/ducks/transcript';
import { useDispatch, useModals, useSelector, useTrackingEvents } from '@/hooks';
import { IntentInput } from '@/models';

import { Container, StatusIcon, TextContainer } from './index';

interface NoIntentProps {
  utterance: string;
  turnID: string;
  setChildDropdownIsOpened: (val: boolean) => void;
  focused: boolean;
}

const determineNewUtterances = (previousInputArray: IntentInput[], newInputArray: IntentInput[]) => {
  const previousUtteranceArray = previousInputArray.map(({ text }) => text);
  const newUtteranceArray = newInputArray.map(({ text }) => text);
  const netNewUtterances: string[] = [];

  newUtteranceArray.forEach((utterance) => {
    if (!previousUtteranceArray.includes(utterance)) {
      netNewUtterances.push(utterance);
    }
  });

  return netNewUtterances;
};

const NoIntent: React.FC<NoIntentProps> = ({ turnID, focused, setChildDropdownIsOpened, utterance }) => {
  const history = useHistory();
  const [trackingEvents] = useTrackingEvents();
  const { annotations } = useSelector(Transcript.currentTranscriptSelector) ?? {};
  const { utteranceAddedTo: utteranceAddedToIntentID, utteranceAddedCount } = annotations?.[turnID] ?? {};
  const { open: openIMM, isOpened: isOpenedIMM } = useModals(ModalType.INTERACTION_MODEL);
  const [initialUtterances, setInitialUtterances] = React.useState<IntentInput[] | null>(null);
  const [targetIntentID, setTargetIntentID] = React.useState<string | null>(null);
  const selectIntentByID = useSelector(IntentV2.getIntentByIDSelector);
  const activeTranscriptID = useSelector(Transcript.currentTranscriptIDSelector);
  const dispatchAddUtteranceToIntent = useDispatch(Transcript.setUtteranceAddedTo);
  const [isDropdownOpened, setIsDropdownOpened] = React.useState(false);

  useDidUpdateEffect(() => {
    setChildDropdownIsOpened(isDropdownOpened);
  }, [isDropdownOpened]);

  const addedIntent = utteranceAddedToIntentID ? selectIntentByID(utteranceAddedToIntentID) : null;

  const resetStates = () => {
    setInitialUtterances(null);
    setTargetIntentID(null);
  };

  const handleOpenIMM = (intentID: string) => {
    const params = new URLSearchParams();

    const targetIntent = selectIntentByID(intentID);
    setInitialUtterances(targetIntent?.inputs ?? []);

    params.append(PREFILLED_UTTERANCE_PARAM, utterance);
    history.replace({
      search: params.toString(),
    });

    openIMM({ initialSelectedID: targetIntentID, newUtterance: utterance });
  };

  // We have to put this in a useEffect because on intentSelect, if it is builtIn, the intentSelect needs to create the intent first, and there can be race conditions with the inner code
  useDidUpdateEffect(() => {
    if (targetIntentID) {
      handleOpenIMM(targetIntentID);
    }
  }, [targetIntentID]);

  const handleIntentSelectCreate = (id: string) => {
    setTargetIntentID(id);
  };

  const handleIMMClose = async (intentID: string, initialUtterancesArray: IntentInput[]) => {
    if (!activeTranscriptID) return;

    const targetIntent = selectIntentByID(intentID);
    if (!targetIntent) return;

    const updatedUtterances = targetIntent.inputs;

    const netNewUtterances = determineNewUtterances(initialUtterancesArray, updatedUtterances);

    if (netNewUtterances.length) {
      await dispatchAddUtteranceToIntent(netNewUtterances.length, targetIntent.name, targetIntent.id, activeTranscriptID, turnID);
      trackingEvents.trackConversationUtteranceSaved();
    }

    resetStates();
  };

  const triggerRenderer = ({ opened, ...props }: { opened: boolean }) => {
    setIsDropdownOpened(opened);
    return (
      <Flex {...props}>
        <TextContainer onClick={(e) => e.stopPropagation()}>
          <StatusIcon icon="info" size={14} color="#E5B813" />
          No Match - &nbsp;
        </TextContainer>
        <ClickableText>Add utterance to intent</ClickableText>
      </Flex>
    );
  };

  useDidUpdateEffect(() => {
    if (!isOpenedIMM && targetIntentID && initialUtterances) {
      handleIMMClose(targetIntentID, initialUtterances);
    }
  }, [isOpenedIMM, targetIntentID, initialUtterances]);

  return !utteranceAddedToIntentID ? (
    <Container focused={focused}>
      <IntentSelect
        alwaysShowCreate
        inDropdownSearch
        intent={null}
        onChange={({ intent }: { intent: string }) => handleIntentSelectCreate(intent)}
        triggerRenderer={triggerRenderer as any}
      />
    </Container>
  ) : (
    <Container utteranceAdded>
      <Flex>
        <StatusIcon icon="check2" size={14} color="#3e9e3e" />
      </Flex>
      {utteranceAddedCount === 1 ? '1 utterance' : `${utteranceAddedCount ?? ''} utterances`} added to&nbsp;<span>{addedIntent?.name}</span>
      &nbsp;intent
    </Container>
  );
};

export default NoIntent;
