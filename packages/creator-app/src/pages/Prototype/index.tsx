import { useDidUpdateEffect } from '@voiceflow/ui';
import React from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import * as PrototypeDuck from '@/ducks/prototype';
import * as Recent from '@/ducks/recent';
import * as VersionV2 from '@/ducks/versionV2';
import { compose, connect } from '@/hocs';
import removeIntercom from '@/hocs/removeIntercom';
import { useTeardown } from '@/hooks';
import { Identifier } from '@/styles/constants';
import { ConnectedProps, MergeArguments } from '@/types';
import * as Query from '@/utils/query';

import { ChatDisplay, Container, Input, Start, UserSaysContainer } from './components';
import { usePrototype, useResetPrototype, useStartPrototype } from './hooks';
import { BotMessageTypes, MessageType, PMStatus } from './types';

export interface PrototypeProps {
  debug: boolean;
  atTop: boolean;
  // TODO: remove when public prototype v2 released
  isPublic?: boolean;
  setAtTop?: (val: boolean) => void;
  isModelTraining?: boolean;
}

const Prototype: React.FC<PrototypeProps & ConnectedPrototypeProps> = ({
  atTop,
  debug,
  locale,
  config,
  status,
  buttons,
  isPublic,
  autoplay,
  setAtTop,
  showButtons,
  updatePrototype,
  isModelTraining,
  prototypeColor,
  prototypeAvatar,
}) => {
  const startPrototype = useStartPrototype();
  const resetPrototype = useResetPrototype();
  const durationMilliseconds = useSelector(VersionV2.active.general.messageDelaySelector);

  const {
    status: prototypeMachineStatus,
    messages,
    interactions,
    onInteraction,
    onPlay,
    onStepBack,
    onStepForward,
  } = usePrototype({
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

  React.useEffect(() => {
    if ((nodeID || autoplay) && !!initialLoadFinished.current) {
      startPrototype(null, nodeID ?? null);
    }
    initialLoadFinished.current = true;
  }, [initialLoadFinished.current]);

  useTeardown(() => {
    resetPrototype();
  }, []);

  useDidUpdateEffect(() => {
    if (autoplay) {
      startPrototype(null, nodeID ?? null);
    }
  }, [autoplay]);

  const setShowButtons = (val: boolean) => {
    updatePrototype({ showButtons: val });
  };

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

const mapStateToProps = {
  buttons: PrototypeDuck.prototypeButtonsSelector,
  status: PrototypeDuck.prototypeStatusSelector,
  locales: VersionV2.active.localesSelector,
  autoplay: PrototypeDuck.prototypeAutoplaySelector,
  showButtons: PrototypeDuck.prototypeShowButtonsSelector,
  config: Recent.recentPrototypeSelector,
  prototypeColor: PrototypeDuck.prototypeBrandColorSelector,
  prototypeAvatar: PrototypeDuck.prototypeAvatarSelector,
};

const mapDispatchProps = {
  updatePrototype: PrototypeDuck.updatePrototype,
};

const mergeProps = (...[{ locales }]: MergeArguments<typeof mapStateToProps, typeof mapDispatchProps>) => ({ locale: locales[0] });

type ConnectedPrototypeProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchProps, typeof mergeProps>;

export default compose(removeIntercom, connect(mapStateToProps, mapDispatchProps, mergeProps))(Prototype);
