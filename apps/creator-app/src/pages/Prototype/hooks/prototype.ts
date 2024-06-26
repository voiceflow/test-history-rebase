import { Utils } from '@voiceflow/common';
import type { BaseRequest } from '@voiceflow/dtos';
import React from 'react';

import { PrototypeStatus } from '@/constants/prototype';
import type { IDSelectorParam } from '@/ducks/utils/crudV2';
import { useTrackingEvents } from '@/hooks';
import { useEventualEngine } from '@/hooks/engine.hook';

import type { PrototypeToolProps } from '../PrototypeTool';
import PrototypeTool from '../PrototypeTool';
import type { Interaction, Message, PrototypeAllTypes } from '../types';
import { PMStatus } from '../types';

interface Options extends PrototypeAllTypes {
  debug: boolean;
  isPublic?: boolean;
  waitVisuals?: boolean;
  prototypeStatus: PrototypeStatus;
  globalDelayInMilliseconds?: number;
}

const usePrototype = ({
  debug,
  config,
  state,
  actions,
  isPublic,
  waitVisuals = true,
  prototypeStatus,
  globalDelayInMilliseconds,
}: Options) => {
  const { isMuted } = config;
  const {
    activeDiagramID = null,
    flowIDHistory,
    activePaths,
    contextHistory = [],
    visualDataHistory = [],
    contextStep,
  } = state;
  const {
    updatePrototypeStatus,
    updatePrototypeVisualsDataHistory = Utils.functional.noop,
    setActiveDiagramID = Utils.functional.noop,
    getLinksByPortID,
    fetchContext,
    updatePrototype,
    updatePrototypeVisualsData = Utils.functional.noop,
    setError = Utils.functional.noop,
  } = actions;
  const [status, setStatus] = React.useState<PMStatus | null>(null);
  const [messages, updateMessages] = React.useState<Message[]>([]);
  const [interactions, setInteractions] = React.useState<Interaction[]>([]);
  const [trackingEvents] = useTrackingEvents();
  const getEngine = useEventualEngine();

  const cacheData: PrototypeToolProps = {
    debug,
    getEngine,
    isMuted,
    isPublic,
    activePaths,
    enterDiagram: setActiveDiagramID,
    waitVisuals,
    contextStep,
    updateStatus: setStatus,
    fetchContext: (request) => (fetchContext ? fetchContext(request, config, { isPublic }) : Promise.resolve(null)),
    addToMessages: (message) => updateMessages((messages) => [...messages, message]),
    flowIDHistory,
    contextHistory,
    activeDiagramID,
    updatePrototype,
    setInteractions,
    getLinksByPortID: (portID: IDSelectorParam) => getLinksByPortID?.(portID) || [],
    visualDataHistory,
    globalMessageDelayMilliseconds: globalDelayInMilliseconds,
    updatePrototypeVisualsData,
    updatePrototypeVisualsDataHistory,
    setError,
  };

  const cache = React.useRef(cacheData);

  Object.assign(cache.current, cacheData);

  const prototype = React.useMemo(() => new PrototypeTool(cache.current), []);

  React.useEffect(() => {
    if (prototypeStatus === PrototypeStatus.IDLE) {
      setStatus(null);
      updateMessages([]);
      setInteractions([]);
      prototype.stop();
    } else if (prototypeStatus === PrototypeStatus.ACTIVE && status !== PMStatus.WAITING_USER_INTERACTION) {
      prototype.start();
    }
  }, [prototypeStatus]);

  React.useEffect(() => {
    if (status === PMStatus.ENDED) {
      updatePrototypeStatus?.(PrototypeStatus.ENDED);
      if (!isPublic) {
        trackingEvents.trackProjectPrototypeEnd();
      }
    }
  }, [status]);

  React.useEffect(() => () => prototype.teardown(), []);

  const onInteraction = React.useCallback(
    ({ name, request }: { name?: string; request: BaseRequest | string }) => {
      let interaction = { name, request };

      if (typeof request === 'string') {
        const match = request.toLowerCase().trim();
        const button = interactions?.find(({ name }) => match === name.toLowerCase().trim());

        if (button?.request) {
          interaction = button;
        }
      }

      return prototype.interact(interaction);
    },
    [prototype, interactions]
  );

  const onPause = React.useCallback(() => prototype.pause(), [prototype]);
  const onContinue = React.useCallback(() => prototype.continue(), [prototype]);

  const onStepBack = React.useCallback(() => {
    setStatus(PMStatus.WAITING_USER_INTERACTION);
    updatePrototypeStatus?.(PrototypeStatus.ACTIVE);
    prototype.stepBack();
    trackingEvents.trackPrototypeManualNavBackwardButton();
  }, [prototype]);

  const onStepForward = React.useCallback(() => {
    prototype.stepForward();
    trackingEvents.trackPrototypeManualNavForwardButton();
  }, [prototype]);

  return {
    status,
    onPause,
    messages,
    onContinue,
    onStepBack,
    interactions,
    onInteraction,
    onStepForward,
    prototypeTool: prototype,
    audioController: prototype.audio,
  };
};

export default usePrototype;
