import React from 'react';
import { useLocation } from 'react-router-dom';

import * as PrototypeDuck from '@/ducks/prototype';
import * as Recent from '@/ducks/recent';
import * as Skill from '@/ducks/skill';
import * as Slot from '@/ducks/slot';
import { connect } from '@/hocs';
import removeIntercom from '@/hocs/removeIntercom';
import { useDidUpdateEffect, useTeardown } from '@/hooks';
import { Interactions } from '@/pages/Prototype/components/PrototypeDialog/components';
import { Identifier } from '@/styles/constants';
import { ConnectedProps, MergeArguments } from '@/types';
import { compose } from '@/utils/functional';
import * as Query from '@/utils/query';

import { ChatDisplay, Container, Input, Start, UserSaysContainer } from './components';
import { usePrototype, useResetPrototype, useStartPrototype } from './hooks';
import { PMStatus } from './types';

export type PrototypeProps = {
  debug: boolean;
  isPublic?: boolean;
  atTop: boolean;
  setAtTop?: (val: boolean) => void;
  isModelTraining?: boolean;
};

const Prototype: React.FC<PrototypeProps & ConnectedPrototypeProps> = ({
  atTop,
  debug,
  locale,
  status,
  isPublic,
  autoplay,
  setAtTop,
  showChips,
  updatePrototype,
  isModelTraining,
}) => {
  const startPrototype = useStartPrototype();
  const resetPrototype = useResetPrototype();

  const { status: prototypeMachineStatus, messages, interactions, onInteraction, onPlay, audioInstance, onStepBack, onStepForward } = usePrototype({
    debug,
    isPublic,
    prototypeStatus: status,
  });
  const location = useLocation();
  const checkPMStatus = React.useCallback((...args: PMStatus[]) => args.includes(prototypeMachineStatus as PMStatus), [prototypeMachineStatus]);
  const isLoading = checkPMStatus(PMStatus.FETCHING_CONTEXT, PMStatus.DIALOG_PROCESSING);
  const intialLoadFinished = React.useRef(false);

  const { nodeID } = Query.parse(location?.search);

  React.useEffect(() => {
    if ((nodeID || autoplay) && !!intialLoadFinished.current) {
      startPrototype(null, nodeID!);
    }
    intialLoadFinished.current = true;
  }, [intialLoadFinished.current]);

  useTeardown(() => {
    resetPrototype();
  }, []);

  useDidUpdateEffect(() => {
    if (autoplay) {
      startPrototype(null, nodeID!);
    }
  }, [autoplay]);

  const setShowChips = (val: boolean) => {
    updatePrototype({ showChips: val });
  };

  if (!intialLoadFinished.current) {
    return null;
  }

  if (status === PrototypeDuck.PrototypeStatus.IDLE && !autoplay) {
    return <Start debug={debug} isModelTraining={isModelTraining} isPublic={isPublic} onStart={startPrototype} />;
  }

  return (
    <Container id={Identifier.PROTOTYPE} isPublic={isPublic}>
      <ChatDisplay
        atTop={atTop}
        setAtTop={setAtTop}
        isPublic={isPublic}
        isLoading={isLoading}
        messages={messages}
        onInteraction={onInteraction}
        onPlay={onPlay}
        debug={debug}
        audioInstance={audioInstance}
        interactions={interactions}
        status={status}
      >
        {showChips && <Interactions interactions={interactions} onInteraction={onInteraction} />}
      </ChatDisplay>
      <UserSaysContainer>
        <Input
          stepBack={onStepBack}
          stepForward={onStepForward}
          locale={locale}
          setShowChips={setShowChips}
          showChips={showChips}
          disabled={checkPMStatus(PMStatus.FETCHING_CONTEXT, PMStatus.IDLE, PMStatus.DIALOG_PROCESSING)}
          onUserInput={onInteraction}
        />
      </UserSaysContainer>
    </Container>
  );
};

const mapStateToProps = {
  status: PrototypeDuck.prototypeStatusSelector,
  locales: Skill.activeLocalesSelector,
  settings: Recent.recentPrototypeSelector,
  slots: Slot.allSlotsSelector,
  showChips: PrototypeDuck.prototypeShowChipsSelector,
  autoplay: PrototypeDuck.prototypeAutoplaySelector,
};

const mapDispatchProps = {
  updatePrototype: PrototypeDuck.updatePrototype,
};

const mergeProps = (...[{ locales }]: MergeArguments<typeof mapStateToProps, typeof mapDispatchProps>) => ({ locale: locales[0] });

type ConnectedPrototypeProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchProps, typeof mergeProps>;

export default compose(removeIntercom, connect(mapStateToProps, mapDispatchProps, mergeProps))(Prototype);
