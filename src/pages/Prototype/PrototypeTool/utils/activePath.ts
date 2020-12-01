import { Context } from '@/ducks/prototype';

export const getUpdatedContextHistory = (
  contextStep: number,
  contextHistory: Partial<Context>[],
  targetPropertyName: 'activePathBlockIDs' | 'activePathLinkIDs',
  newData: string[]
) => {
  const currentHistoryStep = contextStep;
  const contextHistoryCopy = [...contextHistory];
  const targetHistoryContext = contextHistory[currentHistoryStep];

  contextHistoryCopy[currentHistoryStep] = { ...targetHistoryContext, [targetPropertyName]: newData };
  return contextHistoryCopy;
};
