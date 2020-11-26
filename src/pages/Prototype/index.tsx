import React from 'react';
import { useLocation } from 'react-router-dom';

import { FlexCenter } from '@/components/Flex';
import { Link } from '@/components/Text';
import { FeatureFlag } from '@/config/features';
import * as PrototypeDuck from '@/ducks/prototype';
import * as Recent from '@/ducks/recent';
import * as Skill from '@/ducks/skill';
import * as Slot from '@/ducks/slot';
import { connect } from '@/hocs';
import removeIntercom from '@/hocs/removeIntercom';
import { useDidUpdateEffect, useFeature, useTeardown, useTrackingEvents } from '@/hooks';
import { useDebouncedCallback } from '@/hooks/callback';
import { TAudio } from '@/pages/Prototype/PrototypeTool/Audio';
import { Interactions } from '@/pages/Prototype/components/PrototypeDialog/components';
import { FadeDownContainer } from '@/styles/animations';
import { Identifier } from '@/styles/constants';
import { ConnectedProps, MergeArguments } from '@/types';
import { compose } from '@/utils/functional';
import * as Query from '@/utils/query';

import { Container, Dialog, InnerChatContainer, Input, OutterChatContainer, Reset, Start, UserSaysContainer } from './components';
import { usePrototype, useResetPrototype, useStartPrototype } from './hooks';
import { PMStatus } from './types';

const PrototypingHelpLink = 'https://docs.voiceflow.com/#/platform/prototyping';

export type PrototypeProps = {
  debug: boolean;
  isPublic?: boolean;
  atTop: boolean;
  setAtTop: (val: boolean) => void;
};

const Prototype: React.FC<PrototypeProps & ConnectedPrototypeProps> = ({
  locale,
  status,
  isPublic,
  debug,
  showChips,
  updatePrototype,
  atTop,
  setAtTop,
  autoplay,
  slots,
  mode,
  display,
}) => {
  const [, trackEventsWrapper] = useTrackingEvents();
  const startPrototype = useStartPrototype();
  const resetPrototype = useResetPrototype();
  const { status: prototypeMachineStatus, messages, interactions, onInteraction, onPlay, audioInstance, onStepBack, onStepForward } = usePrototype(
    status,
    debug,
    slots
  );
  const location = useLocation();
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [updatedAudioInstance, setUpdatedAudioInstance] = React.useState<TAudio | null>(audioInstance);
  const [forceAudioUpdate, setForceAutoUpdate] = React.useState(0);
  const manualNavigation = useFeature(FeatureFlag.MANUAL_NAVIGATION);
  const checkPMStatus = React.useCallback((...args: PMStatus[]) => args.includes(prototypeMachineStatus as PMStatus), [prototypeMachineStatus]);
  const isLoading = checkPMStatus(PMStatus.FETCHING_CONTEXT, PMStatus.DIALOG_PROCESSING);
  const chatScrollRef = React.useRef<HTMLDivElement>(null);
  const intialLoadFinished = React.useRef(false);

  const { nodeID } = Query.parse(location?.search);

  React.useEffect(() => {
    setUpdatedAudioInstance(audioInstance);
  }, [messages, audioInstance, forceAudioUpdate]);

  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  React.useEffect(() => {
    scrollToBottom();
  }, [messages.length, interactions]);

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

  const onScrollHandler = useDebouncedCallback(
    30,
    () => {
      if (chatScrollRef?.current?.scrollTop === 0) {
        return setAtTop(true);
      }
      return setAtTop(false);
    },
    []
  );

  if (!intialLoadFinished.current) {
    return null;
  }

  if (status === PrototypeDuck.PrototypeStatus.IDLE && !autoplay) {
    return (
      <Container id={Identifier.PROTOTYPE} isPublic={isPublic}>
        <FadeDownContainer style={{ height: '100%' }}>
          <Start
            start={() => {
              if (isPublic) {
                startPrototype();
              } else {
                trackEventsWrapper(startPrototype, 'trackActiveProjectPrototypeTestStart', { debug, mode, display })();
              }
            }}
          />
          <FlexCenter style={{ paddingBottom: '30px', color: '#62778c', background: '#fdfdfd' }}>
            New to prototyping?
            <Link href={PrototypingHelpLink} style={{ marginLeft: '6px' }}>
              Learn More
            </Link>
          </FlexCenter>
        </FadeDownContainer>
      </Container>
    );
  }

  return (
    <Container id={Identifier.PROTOTYPE} isPublic={isPublic}>
      <OutterChatContainer>
        <InnerChatContainer onScroll={onScrollHandler} ref={chatScrollRef} atTop={atTop}>
          <Dialog
            isPublic={isPublic}
            isLoading={isLoading}
            messages={messages}
            onInteraction={onInteraction}
            onPlay={onPlay}
            debug={debug}
            audioInstance={updatedAudioInstance}
            setForceAutoUpdate={setForceAutoUpdate}
            bottomScrollRef={scrollRef}
          />
          {showChips && <Interactions interactions={interactions} onInteraction={onInteraction} />}
        </InnerChatContainer>
      </OutterChatContainer>
      <UserSaysContainer>
        {prototypeMachineStatus === PMStatus.ENDED && !manualNavigation.isEnabled ? (
          <Reset onClick={resetPrototype} />
        ) : (
          <Input
            stepBack={onStepBack}
            stepForward={onStepForward}
            locale={locale}
            setShowChips={setShowChips}
            showChips={showChips}
            disabled={checkPMStatus(PMStatus.FETCHING_CONTEXT, PMStatus.IDLE, PMStatus.DIALOG_PROCESSING)}
            onUserInput={onInteraction}
          />
        )}
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
  mode: PrototypeDuck.prototypeModeSelector,
  display: PrototypeDuck.prototypeDisplaySelector,
};

const mapDispatchProps = {
  updatePrototype: PrototypeDuck.updatePrototype,
};

const mergeProps = (...[{ locales }]: MergeArguments<typeof mapStateToProps, typeof mapDispatchProps>) => ({ locale: locales[0] });

type ConnectedPrototypeProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchProps, typeof mergeProps>;

export default compose(removeIntercom, connect(mapStateToProps, mapDispatchProps, mergeProps))(Prototype);
