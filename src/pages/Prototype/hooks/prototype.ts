import NLC from '@voiceflow/natural-language-commander';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { EventualEngineContext } from '@/contexts';
import * as Creator from '@/ducks/creator';
import * as Modal from '@/ducks/modal';
import * as Prototype from '@/ducks/prototype';
import * as Skill from '@/ducks/skill';
import { Slot } from '@/models';
import { Dispatch } from '@/store/types';

import PrototypeTool, { PrototypeToolProps } from '../PrototypeTool';
import { Interaction, Message, PMStatus } from '../types';

const usePrototype = (prototypeToolStatus: Prototype.PrototypeStatus, debug: boolean, slots: Array<Slot>, isPublic?: boolean) => {
  const dispatch = useDispatch() as Dispatch;

  const nlc = useSelector(Prototype.prototypeNLCSelector) as NLC;
  const variables = useSelector(Prototype.prototypeVariablesSelector);
  const [locale] = useSelector(Skill.activeLocalesSelector) as string[];
  const activePathLinkIDs = useSelector(Prototype.activePathLinkIDsSelector);
  const activePathBlockIDs = useSelector(Prototype.activePathBlockIDsSelector);
  const getLinksByPortID = useSelector(Creator.linksByPortIDSelector);
  const contextHistory = useSelector(Prototype.prototypeContextHistorySelector);
  const activeDiagramID = useSelector(Skill.activeDiagramIDSelector);
  const flowIDHistory = useSelector(Prototype.prototypeFlowIDHistorySelector);
  const getNodeByID = useSelector(Creator.nodeByIDSelector);
  const getLinkByID = useSelector(Creator.linkByIDSelector);
  const getJoiningLinkIDs = useSelector(Creator.joiningLinkIDsSelector);
  const contextStep = useSelector(Prototype.prototypeContextStepSelector);
  const [status, setStatus] = React.useState<PMStatus | null>(null);
  const [messages, updateMessages] = React.useState<Message[]>([]);
  const [interactions, setInteractions] = React.useState<Interaction[]>([]);
  const eventualEngine = React.useContext(EventualEngineContext)!;

  const engine = eventualEngine.get();

  const cacheData: PrototypeToolProps = {
    nlc,
    debug,
    locale,
    engine,
    variables,
    isPublic,
    contextHistory,
    contextStep,
    slots,
    activeDiagramID,
    flowIDHistory,
    getNodeByID,
    getJoiningLinks: (sourceNodeID, targetNodeID) => getJoiningLinkIDs(sourceNodeID, targetNodeID, true).map(getLinkByID),
    updatePrototype: (payload) => dispatch(Prototype.updatePrototype(payload)),
    setError: (error) => dispatch(Modal.setError(error)),
    enterFlow: (diagramID) => dispatch(Skill.updateDiagramID(diagramID)),
    updateStatus: setStatus,
    fetchContext: (request) => dispatch(Prototype.fetchContext(request)),
    addToMessages: (message) => updateMessages([...messages, message]),
    setInteractions,
    activePathLinkIDs,
    getLinksByPortID,
    activePathBlockIDs,
  };

  const cache = React.useRef(cacheData);

  Object.assign(cache.current, cacheData);

  const prototype = React.useMemo(() => new PrototypeTool(cache.current), []);

  const audioInstance = prototype.audio?.audio || null;

  React.useEffect(() => {
    if (prototypeToolStatus === Prototype.PrototypeStatus.IDLE) {
      setStatus(null);
      updateMessages([]);
      setInteractions([]);
      prototype.stop();
    } else if (prototypeToolStatus === Prototype.PrototypeStatus.ACTIVE && status !== PMStatus.WAITING_USER_INTERACTION) {
      prototype.start();
    }
  }, [prototypeToolStatus]);

  React.useEffect(() => {
    if (status === PMStatus.ENDED) {
      dispatch(Prototype.updatePrototypeStatus(Prototype.PrototypeStatus.ENDED));
    }
  }, [status]);

  React.useEffect(() => () => prototype.stop(), []);

  const onInteraction = React.useCallback((input: string) => prototype.interact(input), [prototype]);
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
  }, [prototype]);

  const onStepForward = React.useCallback(() => prototype.stepForward(), [prototype]);

  return {
    status,
    messages,
    interactions,
    onInteraction,
    onPlay,
    audioInstance,
    onStepBack,
    onStepForward,
  };
};

export default usePrototype;
