import { NodeType, ReferenceResourceType } from '@voiceflow/dtos';
import { Actions } from '@voiceflow/sdk-logux-designer';
import { normalize } from 'normal-store';
import { reducerWithInitialState } from 'typescript-fsa-reducers';

import { INITIAL_STATE, type ReferenceState } from './reference.state';

export const referenceReducer = reducerWithInitialState<ReferenceState>(INITIAL_STATE).case(
  Actions.Reference.Replace,
  (_, { data }) => {
    const blockNodeResourceIDs: string[] = [];
    const triggerNodeResourceIDs: string[] = [];
    const resourceIDsByDiagramID: Partial<Record<string, string[]>> = {};
    const refererIDsByResourceID: Partial<Record<string, string[]>> = {};
    const resourceIDsByRefererID: Partial<Record<string, string[]>> = {};

    data.references.forEach((reference) => {
      resourceIDsByRefererID[reference.referrerResourceID] ??= [];
      resourceIDsByRefererID[reference.referrerResourceID]!.push(reference.resourceID);

      refererIDsByResourceID[reference.resourceID] ??= [];
      refererIDsByResourceID[reference.resourceID]!.push(reference.referrerResourceID);
    });

    data.referenceResources.forEach((resource) => {
      if (resource.diagramID) {
        resourceIDsByDiagramID[resource.diagramID] ??= [];
        resourceIDsByDiagramID[resource.diagramID]!.push(resource.id);
      }

      if (resource.type === ReferenceResourceType.NODE) {
        if (resource.metadata?.nodeType === NodeType.BLOCK || resource.metadata?.nodeType === NodeType.START) {
          blockNodeResourceIDs.push(resource.id);
        }

        if (
          resource.metadata?.nodeType === NodeType.INTENT ||
          resource.metadata?.nodeType === NodeType.START ||
          resource.metadata?.nodeType === NodeType.TRIGGER
        ) {
          triggerNodeResourceIDs.push(resource.id);
        }
      }
    });

    return {
      resources: normalize(data.referenceResources),
      references: normalize(data.references),
      blockNodeResourceIDs,
      triggerNodeResourceIDs,
      resourceIDsByDiagramID,
      resourceIDsByRefererID,
      refererIDsByResourceID,
    };
  }
);
