import { Context } from '@/ducks/prototype';
import { TraceFrame, V1Trace } from '@/models';

export const isV1Trace = (trace: TraceFrame): trace is V1Trace => !!(trace.paths && typeof trace.defaultPath === 'number');

export const getUpdatedContextHistory = (
  contextStep: number,
  contextHistory: Partial<Context>[],
  targetPropertyName: 'activePathBlockIDs' | 'activePathLinkIDs',
  newData: string[]
): Partial<Context>[] => {
  const currentHistoryStep = contextStep;
  const contextHistoryCopy = [...contextHistory];
  const targetHistoryContext = contextHistory[currentHistoryStep];

  contextHistoryCopy[currentHistoryStep] = { ...targetHistoryContext, [targetPropertyName]: newData };

  return contextHistoryCopy;
};
