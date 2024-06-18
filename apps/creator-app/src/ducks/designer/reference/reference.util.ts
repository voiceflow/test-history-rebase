import { NodeType, Reference, ReferenceResource, ReferenceResourceType } from '@voiceflow/dtos';

export const buildReferenceCache = (references: Reference[], referenceResources: ReferenceResource[]) => {
  const blockNodeResourceIDs: string[] = [];
  const triggerNodeResourceIDs: string[] = [];
  const diagramIDResourceIDMap: Partial<Record<string, string>> = {};
  const resourceIDsByDiagramIDMap: Partial<Record<string, string[]>> = {};
  const refererIDsByResourceIDMap: Partial<Record<string, string[]>> = {};
  const resourceIDsByRefererIDMap: Partial<Record<string, string[]>> = {};
  const referenceIDsByResourceIDMap: Partial<Record<string, string[]>> = {};
  const referenceIDsByReferrerIDMap: Partial<Record<string, string[]>> = {};

  references.forEach((reference) => {
    resourceIDsByRefererIDMap[reference.referrerResourceID] ??= [];
    resourceIDsByRefererIDMap[reference.referrerResourceID]!.push(reference.resourceID);

    refererIDsByResourceIDMap[reference.resourceID] ??= [];
    refererIDsByResourceIDMap[reference.resourceID]!.push(reference.referrerResourceID);

    referenceIDsByResourceIDMap[reference.resourceID] ??= [];
    referenceIDsByResourceIDMap[reference.resourceID]!.push(reference.id);

    referenceIDsByReferrerIDMap[reference.referrerResourceID] ??= [];
    referenceIDsByReferrerIDMap[reference.referrerResourceID]!.push(reference.id);
  });

  referenceResources.forEach((resource) => {
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
    } else if (resource.type === ReferenceResourceType.DIAGRAM) {
      diagramIDResourceIDMap[resource.resourceID] = resource.id;
    }
  });

  return {
    blockNodeResourceIDs,
    triggerNodeResourceIDs,
    diagramIDResourceIDMap,
    resourceIDsByDiagramIDMap,
    refererIDsByResourceIDMap,
    resourceIDsByRefererIDMap,
    referenceIDsByResourceIDMap,
    referenceIDsByReferrerIDMap,
  };
};
