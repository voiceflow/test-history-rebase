import NLC from '@voiceflow/natural-language-commander';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { EventualEngineContext } from '@/contexts';
import { setError } from '@/ducks/modal';
import * as Prototype from '@/ducks/prototype';
import * as Skill from '@/ducks/skill';
import { Slot } from '@/models';
import { TAudio } from '@/pages/Prototype/PrototypeTool/Audio';

import PrototypeTool from '../PrototypeTool';
import { Interaction, Message, PMStatus } from '../types';

const usePrototype = (
  prototypeToolStatus: Prototype.PrototypeStatus,
  debug: boolean,
  slots: Array<Slot>
): [PMStatus | null, Message[], Interaction[], (input: string) => Promise<void>, (src: string) => void, TAudio | null] => {
  const dispatch = useDispatch();

  const nlc = useSelector(Prototype.prototypeNLCSelector) as NLC;
  const variables = useSelector(Prototype.prototypeVariablesSelector);
  const [locale] = useSelector(Skill.activeLocalesSelector) as string[];

  const [status, setStatus] = React.useState<PMStatus | null>(null);
  const [messages, updateMessages] = React.useState<Message[]>([]);
  const [interactions, setInteractions] = React.useState<Interaction[]>([]);
  const eventualEngine = React.useContext(EventualEngineContext)!;

  const engine = eventualEngine.get();

  const cacheData = {
    nlc,
    debug,
    locale,
    engine,
    variables,
    slots,
    setError: (error: string) => dispatch(setError(error)),
    enterFlow: (diagramID: string) => dispatch(Skill.updateDiagramID(diagramID)),
    updateStatus: setStatus,
    fetchContext: (request: any) => (dispatch(Prototype.fetchContext(request)) as unknown) as Promise<Prototype.Context | null>,
    addToMessages: (message: Message) => updateMessages([...messages, message]),
    setInteractions,
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
    } else if (prototypeToolStatus === Prototype.PrototypeStatus.ACTIVE) {
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

  return [status, messages, interactions, onInteraction, onPlay, audioInstance];
};

export default usePrototype;
