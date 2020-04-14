import NLC from '@voiceflow/natural-language-commander';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { EventualEngineContext } from '@/contexts';
import { setError } from '@/ducks/modal';
import { activeLocalesSelector, updateDiagramID } from '@/ducks/skill';
import { Context, TestStatus, fetchContext, testingNLCSelector, testingVariablesSelector } from '@/ducks/testingV2';

import TestTool from '../TestTool';
import { Interaction, Message, TMStatus } from '../types';

const useTesting = (
  testToolStatus: TestStatus,
  debug: boolean
): [TMStatus | null, Message[], Interaction[], (input: string) => void, (src: string) => void] => {
  const dispatch = useDispatch();

  const nlc = useSelector(testingNLCSelector) as NLC;
  const variables = useSelector(testingVariablesSelector);
  const [locale] = useSelector(activeLocalesSelector) as string[];

  const [status, setStatus] = React.useState<TMStatus | null>(null);
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
    setError: (error: string) => dispatch(setError(error)),
    enterFlow: (diagramID: string) => dispatch(updateDiagramID(diagramID)),
    updateStatus: setStatus,
    fetchContext: (request: any) => (dispatch(fetchContext(request)) as unknown) as Promise<Context | null>,
    addToMessages: (message: Message) => updateMessages([...messages, message]),
    setInteractions,
  };

  const cache = React.useRef(cacheData);

  Object.assign(cache.current, cacheData);

  const testing = React.useMemo(() => new TestTool(cache.current), []);

  React.useEffect(() => {
    if (testToolStatus === TestStatus.IDLE) {
      setStatus(null);
      updateMessages([]);
      testing.stop();
    } else {
      testing.start();
    }
  }, [testToolStatus]);

  React.useEffect(() => () => testing.stop(), []);

  const onInteraction = React.useCallback((input: string) => testing.interact(input), [testing]);
  const onPlay = React.useCallback((src: string) => testing.play(src), [testing]);

  return [status, messages, interactions, onInteraction, onPlay];
};

export default useTesting;
