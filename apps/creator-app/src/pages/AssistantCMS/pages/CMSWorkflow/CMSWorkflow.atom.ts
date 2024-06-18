import { atom } from 'jotai';

import { nonEmptyTriggersMapByDiagramIDAtom } from '@/atoms/reference.atom';
import { activeWorkspaceNormalizedMembersAtom } from '@/atoms/workspace.atom';

import type { CMSWorkflowSortContext } from './CMSWorkflow.interface';

export const cmsWorkflowSortContextAtom = atom(
  (get): CMSWorkflowSortContext => ({
    membersMap: get(activeWorkspaceNormalizedMembersAtom)?.byKey ?? {},
    triggersMapByDiagramID: get(nonEmptyTriggersMapByDiagramIDAtom),
  })
);
