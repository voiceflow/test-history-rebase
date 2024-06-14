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
    const resourceIDsByDiagramIDMap: Partial<Record<string, string[]>> = {};
    const refererIDsByResourceIDMap: Partial<Record<string, string[]>> = {};
    const resourceIDsByRefererIDMap: Partial<Record<string, string[]>> = {};
    const referenceIDsByResourceIDMap: Partial<Record<string, string[]>> = {};
    const referenceIDsByReferrerIDMap: Partial<Record<string, string[]>> = {};

    data.references.forEach((reference) => {
      resourceIDsByRefererIDMap[reference.referrerResourceID] ??= [];
      resourceIDsByRefererIDMap[reference.referrerResourceID]!.push(reference.resourceID);

      refererIDsByResourceIDMap[reference.resourceID] ??= [];
      refererIDsByResourceIDMap[reference.resourceID]!.push(reference.referrerResourceID);

      referenceIDsByResourceIDMap[reference.resourceID] ??= [];
      referenceIDsByResourceIDMap[reference.resourceID]!.push(reference.id);

      referenceIDsByReferrerIDMap[reference.referrerResourceID] ??= [];
      referenceIDsByReferrerIDMap[reference.referrerResourceID]!.push(reference.id);
    });

    data.referenceResources.forEach((resource) => {
      if (resource.diagramID) {
        resourceIDsByDiagramIDMap[resource.diagramID] ??= [];
        resourceIDsByDiagramIDMap[resource.diagramID]!.push(resource.id);
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
      resourceIDsByDiagramIDMap,
      resourceIDsByRefererIDMap,
      refererIDsByResourceIDMap,
      referenceIDsByResourceIDMap,
      referenceIDsByReferrerIDMap,
    };
  }
);
