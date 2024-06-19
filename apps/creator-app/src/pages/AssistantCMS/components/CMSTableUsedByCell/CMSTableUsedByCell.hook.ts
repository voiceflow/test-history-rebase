import { useAtomValue } from 'jotai';
import { getOne } from 'normal-store';
import { useCallback } from 'react';

import { flowMapByDiagramIDAtom } from '@/atoms/flow.atom';
import { normalizedResourcesAtom } from '@/atoms/reference.atom';
import { workflowMapByDiagramIDAtom } from '@/atoms/workflow.atom';
import { Router } from '@/ducks';
import { useDispatch } from '@/hooks/store.hook';

import { CMSTableUsedByCellItem } from './CMSTableUsedByCell.interface';
import { CMSTableUsedByCellItemType } from './CMSTableUsedByCellItemType.enum';

export const useCMStableUsedByCellGetItem = () => {
  const goToDiagram = useDispatch(Router.goToDiagram);

  const flowMapByDiagramID = useAtomValue(flowMapByDiagramIDAtom);
  const normalizedResources = useAtomValue(normalizedResourcesAtom);
  const workflowMapByDiagramID = useAtomValue(workflowMapByDiagramIDAtom);

  const getReferrerItem = useCallback(
    (id: string | null): null | CMSTableUsedByCellItem => {
      const resource = id ? getOne(normalizedResources, id) : null;

      if (!id || !resource?.diagramID) return null;

      const flow = flowMapByDiagramID[resource.diagramID];
      const workflow = workflowMapByDiagramID[resource.diagramID];

      const flowOrWorkflow = flow ?? workflow;

      if (!flowOrWorkflow) return null;

      return {
        id,
        type: workflow ? CMSTableUsedByCellItemType.WORKFLOW : CMSTableUsedByCellItemType.FLOW,
        label: flowOrWorkflow.name,
        onClick: () => goToDiagram(flowOrWorkflow.diagramID, resource.resourceID),
      };
    },
    [normalizedResources, flowMapByDiagramID, workflowMapByDiagramID]
  );

  return getReferrerItem;
};
