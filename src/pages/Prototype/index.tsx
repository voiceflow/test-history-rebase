import React from 'react';

import { FlexCenter } from '@/components/Flex';
import { Link } from '@/components/Text';
import {
  PrototypeStatus,
  prototypeDisplaySelector,
  prototypeModeSelector,
  prototypeShowChipsSelector,
  prototypeStatusSelector,
  resetPrototype,
  startPrototype,
  updatePrototype,
} from '@/ducks/prototype';
import { recentprototypeSelector } from '@/ducks/recent';
import { activeLocalesSelector } from '@/ducks/skill';
import * as Slot from '@/ducks/slot';
import { connect } from '@/hocs';
import removeIntercom from '@/hocs/removeIntercom';
import { useTrackingEvents } from '@/hooks';
import { useDebouncedCallback } from '@/hooks/callback';
import { TAudio } from '@/pages/Prototype/PrototypeTool/Audio';
import { Interactions } from '@/pages/Prototype/components/PrototypeDialog/components';
import { Identifier } from '@/styles/constants';
import { ConnectedProps, MergeArguments } from '@/types';
import { compose } from '@/utils/functional';

import { Container, Dialog, InnerChatContainer, Input, OutterChatContainer, Reset, Start, UserSaysContainer } from './components';
import { usePrototype } from './hooks';
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
  startPrototype,
  resetPrototype,
  debug,
  showChips,
  updatePrototype,
  atTop,
  setAtTop,
  slots,
  mode,
  display,
}) => {
  const [, trackEventsWrapper] = useTrackingEvents();
  const [prototypeMachineStatus, messages, interactions, onInteraction, onPlay, audioInstance] = usePrototype(status, debug, slots);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [updatedAudioInstance, setUpdatedAudioInstance] = React.useState<TAudio | null>(audioInstance);
  const [forceAudioUpdate, setForceAutoUpdate] = React.useState(0);
  const checkPMStatus = React.useCallback((...args: PMStatus[]) => args.includes(prototypeMachineStatus as PMStatus), [prototypeMachineStatus]);
  const isLoading = checkPMStatus(PMStatus.FETCHING_CONTEXT, PMStatus.DIALOG_PROCESSING);
  const chatScrollRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    setUpdatedAudioInstance(audioInstance);
  }, [messages, audioInstance, forceAudioUpdate]);

  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  React.useEffect(() => {
    scrollToBottom();
  }, [messages.length, interactions]);

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

  if (status === PrototypeStatus.IDLE) {
    return (
      <Container id={Identifier.PROTOTYPE} isPublic={isPublic}>
        <Start
          start={() =>
            isPublic ? startPrototype() : trackEventsWrapper(startPrototype, 'trackActiveProjectPrototypeTestStart', { debug, mode, display })()
          }
        />
        <FlexCenter style={{ paddingBottom: '30px', color: '#62778c', background: '#fdfdfd' }}>
          <>
            New to prototyping?
            <Link href={PrototypingHelpLink} style={{ marginLeft: '6px' }}>
              Learn More
            </Link>
          </>
        </FlexCenter>
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
        {prototypeMachineStatus === PMStatus.ENDED ? (
          <Reset onClick={resetPrototype} />
        ) : (
          <Input
            locale={locale}
            setShowChips={setShowChips}
            showChips={showChips}
            isPublic={isPublic}
            disabled={checkPMStatus(PMStatus.FETCHING_CONTEXT, PMStatus.IDLE, PMStatus.DIALOG_PROCESSING)}
            onUserInput={onInteraction}
          />
        )}
      </UserSaysContainer>
    </Container>
  );
};

const mapStateToProps = {
  status: prototypeStatusSelector,
  locales: activeLocalesSelector,
  settings: recentprototypeSelector,
  slots: Slot.allSlotsSelector,
  showChips: prototypeShowChipsSelector,
  mode: prototypeModeSelector,
  display: prototypeDisplaySelector,
};

const mapDispatchProps = {
  startPrototype,
  resetPrototype,
  updatePrototype,
};

const mergeProps = (...[{ locales }]: MergeArguments<typeof mapStateToProps, typeof mapDispatchProps>) => ({ locale: locales[0] });

type ConnectedPrototypeProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchProps, typeof mergeProps>;

export default compose(removeIntercom, connect(mapStateToProps, mapDispatchProps, mergeProps))(Prototype);
