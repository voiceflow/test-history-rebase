import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { PrototypeStatus } from '@/constants/prototype';
import * as VariableState from '@/ducks/variableState';
import { useDispatch, useEventualEngine, useHideVoiceflowAssistant, useSetup, useTeardown } from '@/hooks';
import { Identifier } from '@/styles/constants';
import * as Query from '@/utils/query';

import { ChatDisplay, Container, Input, Start, UserSaysContainer } from './components';
import { usePrototype, useResetPrototype, useStartPrototype } from './hooks';
import type { Message, PrototypeAllTypes } from './types';
import { BotMessageTypes, MessageType, PMStatus } from './types';

export interface PrototypeProps {
  debug: boolean;
  atTop: boolean;
  // TODO: remove when public prototype v2 released
  isPublic?: boolean;
  setAtTop?: (val: boolean) => void;
  isModelTraining?: boolean;
  renderingPromise?: Promise<void>;
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
  renderingPromise,
  isModelTraining,
}) => {
  useHideVoiceflowAssistant();

  const initializeVariableState = useDispatch(VariableState.initializeVariableState);

  const startPrototype = useStartPrototype();
  const resetPrototype = useResetPrototype();

  const { buttons, durationMilliseconds, autoplay, showButtons, prototypeColor, prototypeAvatar, isMuted } = config;
  const { updatePrototype } = actions;
  const { status } = state;

  const {
    status: prototypeMachineStatus,
    onPause,
    messages,
    onContinue,
    onStepBack,
    interactions,
    onInteraction,
    onStepForward,
    prototypeTool,
    audioController,
  } = usePrototype({
    actions,
    state,
    debug,
    config,
    isPublic,
    prototypeStatus: status,
    globalDelayInMilliseconds: durationMilliseconds,
  });

  const checkPMStatus = React.useCallback(
    (...args: PMStatus[]) => args.includes(prototypeMachineStatus as PMStatus),
    [prototypeMachineStatus]
  );
  const isLoading = checkPMStatus(PMStatus.FETCHING_CONTEXT, PMStatus.FAKE_LOADING);

  const isBubbleMessageShown = React.useMemo(
    () => messages.some((message) => BotMessageTypes.includes(message.type) || message.type === MessageType.USER),
    [messages]
  );

  const setShowButtons = (val: boolean) => {
    updatePrototype({ showButtons: val });
  };

  const onMessageDoubleClick = (message: Message) => {
    prototypeTool.navigateToStep(message.id);
  };

  useSetup(() => {
    initializeVariableState();
    resetPrototype();
  }, []);
  useTeardown(() => resetPrototype({ redirect: false }), []);

  const start = async () => {
    actions.updatePrototypeStatus?.(PrototypeStatus.LOADING);
    await renderingPromise;
    startPrototype();
  };

  React.useEffect(() => {
    if (autoplay) start();
  }, [autoplay]);

  React.useEffect(() => {
    audioController.mute();
  }, [isMuted]);

  const history = useHistory();
  const location = useLocation();
  const { nodeID } = Query.parse(location?.search);

  const getEngine = useEventualEngine();
  const engine = getEngine();

  React.useEffect(() => {
    if (!nodeID) return;
    if (!engine?.isSynced()) return;

    history.push({ search: '' });
    // force selection + centering without toggle
    const focusNode = engine.getNodeByID(nodeID)?.parentNode ?? nodeID;
    engine.centerNode(focusNode);
    engine.selection.replaceNode([focusNode]);
  }, [nodeID, engine]);

  if (status === PrototypeStatus.IDLE && !autoplay) {
    return (
      <Start config={config} debug={debug} isModelTraining={isModelTraining} isPublic={isPublic} onStart={start} />
    );
  }

  return (
    <Container id={Identifier.PROTOTYPE} isPublic={isPublic}>
      <ChatDisplay
        audio={audioController.audio}
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
        onPause={onPause}
        onContinue={onContinue}
        interactions={showButtons ? interactions : []}
        status={status}
        onInteraction={onInteraction}
        stepBack={onStepBack}
        onMessageDoubleClick={onMessageDoubleClick}
      />

      <UserSaysContainer>
        <Input
          locale={locale}
          stepBack={onStepBack}
          disabled={checkPMStatus(PMStatus.FETCHING_CONTEXT, PMStatus.IDLE)}
          onUserInput={(request) => onInteraction({ request })}
          stepForward={onStepForward}
          showButtons={showButtons}
          setShowButtons={setShowButtons}
        />
      </UserSaysContainer>
    </Container>
  );
};

export default Prototype;
