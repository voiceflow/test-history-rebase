import { Utils } from '@voiceflow/common';

import type * as Prototype from '@/ducks/prototype';

export const appendActivePaths = (
  activePaths: Record<string, Prototype.ActivePath>,
  { diagramID, blockIDs = [], linkIDs = [] }: { diagramID: string; blockIDs?: string[]; linkIDs?: string[] }
) => {
  const existingBlockIDs = activePaths[diagramID]?.blockIDs ?? [];
  const combinedBlockIDs = Utils.array.unique([...existingBlockIDs, ...blockIDs]);

  const existingLinkIDs = activePaths[diagramID]?.linkIDs ?? [];
  const combinedLinkIDs = Utils.array.unique([...existingLinkIDs, ...linkIDs]);

  return {
    ...activePaths,
    [diagramID]: {
      blockIDs: combinedBlockIDs,
      linkIDs: combinedLinkIDs,
    },
  };
};

export const getUpdatedActivePathContextHistory = (
  contextStep: number,
  contextHistory: Partial<Prototype.Context>[],
  newData: Record<string, Prototype.ActivePath>
): Partial<Prototype.Context>[] => {
  const currentHistoryStep = contextStep;
  const contextHistoryCopy = [...contextHistory];
  const targetHistoryContext = contextHistory[currentHistoryStep];

  contextHistoryCopy[currentHistoryStep] = { ...targetHistoryContext, activePaths: newData };

  return contextHistoryCopy;
};
