import { GeneralRequest } from '@voiceflow/general-types';
import _isString from 'lodash/isString';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { toast } from '@/components/Toast';
import * as Creator from '@/ducks/creator';
import * as Modal from '@/ducks/modal';
import * as Prototype from '@/ducks/prototype';
import * as Skill from '@/ducks/skill';
import { useEventualEngine, useTrackingEvents } from '@/hooks';
import { Dispatch } from '@/store/types';
import * as Utils from '@/utils/string';

import PrototypeTool, { PrototypeToolProps } from '../PrototypeTool';
import { Interaction, Message, PMStatus } from '../types';

const usePrototype = ({
  debug,
  isPublic,
  waitVisuals = true,
  prototypeStatus,
}: {
  debug: boolean;
  isPublic?: boolean;
  waitVisuals?: boolean;
  prototypeStatus: Prototype.PrototypeStatus;
}) => {
  const dispatch = useDispatch() as Dispatch;

  const isMuted = useSelector(Prototype.prototypeMutedSelector);
  const activePathLinkIDs = useSelector(Prototype.activePathLinkIDsSelector);
  const activePathBlockIDs = useSelector(Prototype.activePathBlockIDsSelector);
  const getLinksByPortID = useSelector(Creator.linksByPortIDSelector);
  const contextHistory = useSelector(Prototype.prototypeContextHistorySelector);
  const visualDataHistory = useSelector(Prototype.prototypeVisualDataHistorySelector);
  const webhook = useSelector(Prototype.prototypeWebhookDataSelector);
  const activeDiagramID = useSelector(Skill.activeDiagramIDSelector);
  const flowIDHistory = useSelector(Prototype.prototypeFlowIDHistorySelector);
  const getNodeByID = useSelector(Creator.nodeByIDSelector);
  const contextStep = useSelector(Prototype.prototypeContextStepSelector);
  const [status, setStatus] = React.useState<PMStatus | null>(null);
  const [messages, updateMessages] = React.useState<Message[]>([]);
  const [interactions, setInteractions] = React.useState<Interaction[]>([]);
  const [trackingEvents] = useTrackingEvents();
  const engine = useEventualEngine()()!;

  const cacheData: PrototypeToolProps = {
    debug,
    engine,
    isMuted,
    isPublic,
    setError: (error) => dispatch(Modal.setError(error)),
    enterFlow: (diagramID) => dispatch(Skill.updateDiagramID(diagramID)),
    waitVisuals,
    contextStep,
    getNodeByID,
    updateStatus: setStatus,
    fetchContext: (request) => dispatch(Prototype.fetchContext(request)),
    addToMessages: (message) => updateMessages([...messages, message]),
    flowIDHistory,
    contextHistory,
    activeDiagramID,
    updatePrototype: (payload) => dispatch(Prototype.updatePrototype(payload)),
    setInteractions,
    getLinksByPortID,
    activePathLinkIDs,
    visualDataHistory,
    activePathBlockIDs,
    updatePrototypeVisualsData: (data) => dispatch(Prototype.updatePrototypeVisualData(data)),
    updatePrototypeVisualsDataHistory: (dataHistory) => dispatch(Prototype.updatePrototypeVisualDataHistory(dataHistory)),
  };

  const cache = React.useRef(cacheData);

  Object.assign(cache.current, cacheData);

  const prototype = React.useMemo(() => new PrototypeTool(cache.current), []);

  React.useEffect(() => {
    if (prototypeStatus === Prototype.PrototypeStatus.IDLE) {
      setStatus(null);
      updateMessages([]);
      setInteractions([]);
      prototype.stop();
    } else if (prototypeStatus === Prototype.PrototypeStatus.ACTIVE && status !== PMStatus.WAITING_USER_INTERACTION) {
      prototype.start();
    }
  }, [prototypeStatus]);

  React.useEffect(() => {
    if (status === PMStatus.ENDED) {
      dispatch(Prototype.updatePrototypeStatus(Prototype.PrototypeStatus.ENDED));
    }
  }, [status]);

  React.useEffect(() => () => prototype.stop(), []);

  React.useEffect(() => {
    if (!(webhook?.type && webhook.payload)) return;

    if (!status || status === PMStatus.IDLE) {
      toast.info('Please start the test.');
    }
    onInteraction(webhook);
  }, [webhook]);

  const onInteraction = React.useCallback(
    (request: GeneralRequest | string) => {
      if (_isString(request) && Utils.checkForSpecialCharacters(request)) {
        return prototype.interact(Utils.removeSpecialCharacters(request));
      }
      return prototype.interact(request);
    },
    [prototype]
  );
  const onPlay = React.useCallback(
    (src: string) => {
      prototype.play(src);
    },
    [prototype]
  );

  const onStepBack = React.useCallback(() => {
    setStatus(PMStatus.WAITING_USER_INTERACTION);
    dispatch(Prototype.updatePrototypeStatus(Prototype.PrototypeStatus.ACTIVE));
    prototype.stepBack();
    trackingEvents.trackPrototypeManualNavBackwardButton();
  }, [prototype]);

  const onStepForward = React.useCallback(() => {
    prototype.stepForward();
    trackingEvents.trackPrototypeManualNavForwardButton();
  }, [prototype]);

  return {
    audio: prototype.audio,
    status,
    messages,
    interactions,
    onInteraction,
    onPlay,
    onStepBack,
    onStepForward,
  };
};

export default usePrototype;
