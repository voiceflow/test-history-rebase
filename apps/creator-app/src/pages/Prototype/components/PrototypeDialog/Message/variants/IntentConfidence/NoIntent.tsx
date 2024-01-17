import { Markup, Utterance } from '@voiceflow/dtos';
import * as Platform from '@voiceflow/platform-config';
import { Flex, stopPropagation, System, useDidUpdateEffect } from '@voiceflow/ui';
import React from 'react';

import IntentSelect from '@/components/IntentSelect';
import * as Transcript from '@/ducks/transcript';
import { useDispatch, useSelector, useTrackingEvents } from '@/hooks';
import { useGetOnePlatformIntentWithUtterancesByIDSelector } from '@/hooks/intent.hook';
import { useIntentEditModal } from '@/hooks/modal.hook';
import { utteranceTextToString } from '@/utils/utterance.util';

import * as S from './styles';

interface NoIntentProps {
  turnID: string;
  focused: boolean;
  utterance: string;
  onToggleIntentSelect: (opened: boolean) => void;
}

const determineNewUtterances = (
  previousInputArray: Array<Platform.Base.Models.Intent.Input | Utterance>,
  newInputArray: Array<Platform.Base.Models.Intent.Input | Utterance>
) => {
  const previousUtteranceArray = new Set(
    previousInputArray.map(({ text }) => (typeof text === 'string' ? text : utteranceTextToString.fromDB(text, { entitiesMapByID: {} })))
  );
  const newUtteranceArray = newInputArray.map(({ text }) => text);
  const netNewUtterances: Array<string | Markup> = [];

  newUtteranceArray.forEach((utterance) => {
    if (!previousUtteranceArray.has(typeof utterance === 'string' ? utterance : utteranceTextToString.fromDB(utterance, { entitiesMapByID: {} }))) {
      netNewUtterances.push(utterance);
    }
  });

  return netNewUtterances;
};

const NoIntent: React.FC<NoIntentProps> = ({ turnID, focused, utterance, onToggleIntentSelect }) => {
  const [trackingEvents] = useTrackingEvents();

  const [targetIntentID, setTargetIntentID] = React.useState<string | null>(null);
  const [initialUtterances, setInitialUtterances] = React.useState<Array<Platform.Base.Models.Intent.Input | Utterance> | null>(null);

  const transcript = useSelector(Transcript.currentTranscriptSelector);
  const getIntentByID = useGetOnePlatformIntentWithUtterancesByIDSelector();
  const dispatchAddUtteranceToIntent = useDispatch(Transcript.setUtteranceAddedTo);

  const editModal = useIntentEditModal();

  const { utteranceAddedTo: utteranceAddedToIntentID, utteranceAddedCount } = transcript?.annotations?.[turnID] ?? {};

  const addedIntent = utteranceAddedToIntentID ? getIntentByID({ id: utteranceAddedToIntentID }) : null;

  const resetStates = () => {
    setTargetIntentID(null);
    setInitialUtterances(null);
  };

  const handleOpenIntentEditModal = (intentID: string) => {
    const targetIntent = getIntentByID({ id: intentID });

    if (!targetIntent) {
      setInitialUtterances([]);
    } else {
      setInitialUtterances(targetIntent.utterances ?? []);
    }

    editModal.openVoid({ intentID, newUtterances: [utteranceTextToString.toDB(utterance, { entitiesMapByName: {} })] });
  };

  const handleAddedUtteranceModalClose = async (intentID: string, initialUtterancesArray: Array<Platform.Base.Models.Intent.Input | Utterance>) => {
    if (!transcript) return;

    const targetIntent = getIntentByID({ id: intentID });
    if (!targetIntent) return;

    const updatedUtterances = targetIntent.utterances ?? [];

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
    if (!editModal.opened && targetIntentID && initialUtterances) {
      handleAddedUtteranceModalClose(targetIntentID, initialUtterances);
    }
  }, [targetIntentID, initialUtterances, editModal.opened]);

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
