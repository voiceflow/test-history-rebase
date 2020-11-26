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

export const waitForFlowLoad = async (targetBlockID: string, getNodeByID: (targetBlockID: string) => void) => {
  if (targetBlockID) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    while (!getNodeByID(targetBlockID)) {
      // eslint-disable-next-line no-await-in-loop
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, 100);
      });
    }
  }
};
