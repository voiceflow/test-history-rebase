import { BaseRequest } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import { toast } from '@voiceflow/ui';
import _isString from 'lodash/isString';
import React from 'react';

import { PrototypeStatus } from '@/constants/prototype';
import { IDSelectorParam } from '@/ducks/utils/crudV2';
import { useEventualEngine, useTrackingEvents } from '@/hooks';
import perf, { PerfAction } from '@/performance';

import PrototypeTool, { PrototypeToolProps } from '../PrototypeTool';
import { Interaction, Message, PMStatus, PrototypeAllTypes } from '../types';

interface Options extends PrototypeAllTypes {
  debug: boolean;
  isPublic?: boolean;
  waitVisuals?: boolean;
  prototypeStatus: PrototypeStatus;
  globalDelayInMilliseconds?: number;
}

const usePrototype = ({ debug, config, state, actions, isPublic, waitVisuals = true, prototypeStatus, globalDelayInMilliseconds }: Options) => {
  const { isMuted } = config;
  const { webhook, activeDiagramID = null, flowIDHistory, activePaths, contextHistory = [], visualDataHistory = [], contextStep } = state;
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

  React.useEffect(() => {
    if (!(webhook?.type && webhook.payload)) return;

    if (!status || status === PMStatus.IDLE) {
      toast.info('Please start the test.');
    }

    onInteraction({ request: webhook });
  }, [webhook]);

  const onInteraction = React.useCallback(
    ({ name, request }: { name?: string; request: BaseRequest.BaseRequest | string }) => {
      perf.action(PerfAction.PROTOTYPE_INTERACTION);

      let interaction = { name, request };

      if (_isString(request)) {
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
