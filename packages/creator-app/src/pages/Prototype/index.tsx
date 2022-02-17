import { useDidUpdateEffect } from '@voiceflow/ui';
import React from 'react';
import { useLocation } from 'react-router-dom';

import * as PrototypeDuck from '@/ducks/prototype';
import { compose } from '@/hocs';
import removeIntercom from '@/hocs/removeIntercom';
import { useTeardown } from '@/hooks';
import { Identifier } from '@/styles/constants';
import * as Query from '@/utils/query';

import { ChatDisplay, Container, Input, Start, UserSaysContainer } from './components';
import { usePrototype, useResetPrototype, useStartPrototype } from './hooks';
import { BotMessageTypes, Message, MessageType, PMStatus, PrototypeAllTypes } from './types';

export interface PrototypeProps {
  debug: boolean;
  atTop: boolean;
  // TODO: remove when public prototype v2 released
  isPublic?: boolean;
  setAtTop?: (val: boolean) => void;
  isModelTraining?: boolean;
  locale: string;
}

const Prototype: React.FC<PrototypeProps & PrototypeAllTypes> = ({
  actions,
  state,
  atTop,
  debug,
  locale,
  config,
  isPublic,
  setAtTop,
  isModelTraining,
}) => {
  const startPrototype = useStartPrototype();
  const resetPrototype = useResetPrototype();

  const { buttons, durationMilliseconds, autoplay, showButtons, prototypeColor, prototypeAvatar } = config;
  const { updatePrototype } = actions;
  const { status } = state;

  const {
    status: prototypeMachineStatus,
    onPlay,
    messages,
    onStepBack,
    interactions,
    onInteraction,
    onStepForward,
    prototypeTool,
  } = usePrototype({
    actions,
    state,
    debug,
    config,
    isPublic,
    prototypeStatus: status,
    globalDelayInMilliseconds: durationMilliseconds,
  });

  const location = useLocation();
  const checkPMStatus = React.useCallback((...args: PMStatus[]) => args.includes(prototypeMachineStatus as PMStatus), [prototypeMachineStatus]);
  const isLoading = checkPMStatus(PMStatus.FETCHING_CONTEXT, PMStatus.DIALOG_PROCESSING, PMStatus.FAKE_LOADING);
  const initialLoadFinished = React.useRef(false);
  const isBubbleMessageShown = React.useMemo(
    () => messages.some((message) => BotMessageTypes.includes(message.type) || message.type === MessageType.USER),
    [messages]
  );
  const { nodeID } = Query.parse(location?.search);

  const setShowButtons = (val: boolean) => {
    updatePrototype({ showButtons: val });
  };

  const onMessageDoubleClick = (message: Message) => {
    prototypeTool.navigateToStep(message.id);
  };

  React.useEffect(() => {
    initialLoadFinished.current = true;

    if ((nodeID || autoplay) && !!initialLoadFinished.current) {
      startPrototype(null, nodeID ?? null);
    }
  }, [initialLoadFinished.current]);

  useDidUpdateEffect(() => {
    if (autoplay) {
      startPrototype(null, nodeID ?? null);
    }
  }, [autoplay]);

  useTeardown(() => resetPrototype(), []);

  if (!initialLoadFinished.current) {
    return null;
  }

  if (status === PrototypeDuck.PrototypeStatus.IDLE && !autoplay) {
    return <Start config={config} debug={debug} isModelTraining={isModelTraining} isPublic={isPublic} onStart={startPrototype} />;
  }

  return (
    <Container id={Identifier.PROTOTYPE} isPublic={isPublic}>
      <ChatDisplay
        pmStatus={prototypeMachineStatus}
        atTop={atTop}
        setAtTop={setAtTop}
        color={prototypeColor}
        isPublic={isPublic}
        avatarURL={prototypeAvatar}
        buttons={buttons}
        // to show loader until first bubble message is up or "waiting for user interaction"
        isLoading={isLoading || (!isBubbleMessageShown && prototypeMachineStatus !== PMStatus.WAITING_USER_INTERACTION)}
        messages={messages}
        onPlay={onPlay}
        interactions={showButtons ? interactions : []}
        status={status}
        onInteraction={onInteraction}
        stepBack={onStepBack}
        onMessageDoubleClick={onMessageDoubleClick}
      />

      <UserSaysContainer>
        <Input
          stepBack={onStepBack}
          stepForward={onStepForward}
          locale={locale}
          setShowButtons={setShowButtons}
          showButtons={showButtons}
          disabled={checkPMStatus(PMStatus.FETCHING_CONTEXT, PMStatus.IDLE, PMStatus.DIALOG_PROCESSING, PMStatus.FAKE_LOADING)}
          onUserInput={(request) => onInteraction({ request })}
        />
      </UserSaysContainer>
    </Container>
  );
};

export default compose(removeIntercom)(Prototype);
