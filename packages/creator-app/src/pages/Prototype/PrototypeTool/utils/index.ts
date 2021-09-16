import { Context } from '@/ducks/prototype';
import { BaseTraceFrame, V1Trace } from '@/models';

export const isV1Trace = (trace: BaseTraceFrame): trace is V1Trace => Array.isArray(trace.paths);

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
