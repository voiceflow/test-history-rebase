import React from 'react';

import { PrototypeStatus, prototypeStatusSelector, resetPrototype, startPrototype } from '@/ducks/prototype';
import { recentprototypeSelector } from '@/ducks/recent';
import { activeLocalesSelector } from '@/ducks/skill';
import * as Slot from '@/ducks/slot';
import { connect } from '@/hocs';
import removeIntercom from '@/hocs/removeIntercom';
import { useTrackingEvents } from '@/hooks';
import { Identifier } from '@/styles/constants';
import { ConnectedProps, MergeArguments } from '@/types';
import { compose } from '@/utils/functional';

import { Container, Dialog, Input, Reset, Start } from './components';
import { usePrototype } from './hooks';
import { PMStatus } from './types';

export type PrototypeProps = {
  debug: boolean;
  isPublic?: boolean;
};

const Prototype: React.FC<PrototypeProps & ConnectedPrototypeProps> = ({
  locale,
  status,
  isPublic,
  startPrototype,
  resetPrototype,
  debug,
  slots,
}) => {
  const [, trackEventsWrapper] = useTrackingEvents();
  const [prototypeMachineStatus, messages, interactions, onInteraction, onPlay] = usePrototype(status, debug, slots);

  const checkPMStatus = React.useCallback((...args: PMStatus[]) => args.includes(prototypeMachineStatus as PMStatus), [prototypeMachineStatus]);

  if (status === PrototypeStatus.IDLE) {
    return (
      <Container id={Identifier.PROTOTYPE} isPublic={isPublic}>
        <Start start={() => (isPublic ? startPrototype() : trackEventsWrapper(startPrototype, 'trackActiveProjectPrototypeTestStart')())} />
      </Container>
    );
  }

  return (
    <Container id={Identifier.PROTOTYPE} isPublic={isPublic}>
      <Dialog
        isLoading={checkPMStatus(PMStatus.FETCHING_CONTEXT, PMStatus.DIALOG_PROCESSING)}
        messages={messages}
        interactions={interactions}
        onInteraction={onInteraction}
        onPlay={onPlay}
        debug={debug}
      />

      {prototypeMachineStatus === PMStatus.ENDED ? (
        <Reset onClick={resetPrototype} />
      ) : (
        <Input
          locale={locale}
          isPublic={isPublic}
          disabled={checkPMStatus(PMStatus.FETCHING_CONTEXT, PMStatus.IDLE, PMStatus.DIALOG_PROCESSING)}
          onUserInput={onInteraction}
        />
      )}
    </Container>
  );
};

const mapStateToProps = {
  status: prototypeStatusSelector,
  locales: activeLocalesSelector,
  settings: recentprototypeSelector,
  slots: Slot.allSlotsSelector,
};

const mapDispatchProps = {
  startPrototype,
  resetPrototype,
};

const mergeProps = (...[{ locales }]: MergeArguments<typeof mapStateToProps, typeof mapDispatchProps>) => ({ locale: locales[0] });

type ConnectedPrototypeProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchProps, typeof mergeProps>;

export default compose(removeIntercom, connect(mapStateToProps, mapDispatchProps, mergeProps))(Prototype);
