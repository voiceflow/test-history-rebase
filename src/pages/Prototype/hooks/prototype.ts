import NLC from '@voiceflow/natural-language-commander';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { EventualEngineContext } from '@/contexts';
import { setError } from '@/ducks/modal';
import { Context, PrototypeStatus, fetchContext, prototypeNLCSelector, prototypeVariablesSelector, updatePrototypeStatus } from '@/ducks/prototype';
import { activeLocalesSelector, updateDiagramID } from '@/ducks/skill';
import { Slot } from '@/models';

import PrototypeTool from '../PrototypeTool';
import { Interaction, Message, PMStatus } from '../types';

const usePrototype = (
  prototypeToolStatus: PrototypeStatus,
  debug: boolean,
  slots: Array<Slot>
): [PMStatus | null, Message[], Interaction[], (input: string) => void, (src: string) => void] => {
  const dispatch = useDispatch();

  const nlc = useSelector(prototypeNLCSelector) as NLC;
  const variables = useSelector(prototypeVariablesSelector);
  const [locale] = useSelector(activeLocalesSelector) as string[];

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
    enterFlow: (diagramID: string) => dispatch(updateDiagramID(diagramID)),
    updateStatus: setStatus,
    fetchContext: (request: any) => (dispatch(fetchContext(request)) as unknown) as Promise<Context | null>,
    addToMessages: (message: Message) => updateMessages([...messages, message]),
    setInteractions,
  };

  const cache = React.useRef(cacheData);

  Object.assign(cache.current, cacheData);

  const prototype = React.useMemo(() => new PrototypeTool(cache.current), []);

  React.useEffect(() => {
    if (prototypeToolStatus === PrototypeStatus.IDLE) {
      setStatus(null);
      updateMessages([]);
      prototype.stop();
    } else if (prototypeToolStatus === PrototypeStatus.ACTIVE) {
      prototype.start();
    }
  }, [prototypeToolStatus]);

  React.useEffect(() => {
    if (status === PMStatus.ENDED) {
      dispatch(updatePrototypeStatus(PrototypeStatus.ENDED));
    }
  }, [status]);

  React.useEffect(() => () => prototype.stop(), []);

  const onInteraction = React.useCallback((input: string) => prototype.interact(input), [prototype]);
  const onPlay = React.useCallback((src: string) => prototype.play(src), [prototype]);

  return [status, messages, interactions, onInteraction, onPlay];
};

export default usePrototype;
