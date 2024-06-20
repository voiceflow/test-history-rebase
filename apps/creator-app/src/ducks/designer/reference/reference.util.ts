import { NodeType, Reference, ReferenceResource, ReferenceResourceType } from '@voiceflow/dtos';

export const buildReferenceCache = (references: Reference[], referenceResources: ReferenceResource[]) => {
  const blockNodeResourceIDs: string[] = [];
  const triggerNodeResourceIDs: string[] = [];
  const intentIDResourceIDMap: Partial<Record<string, string>> = {};
  const diagramIDResourceIDMap: Partial<Record<string, string>> = {};
  const functionIDResourceIDMap: Partial<Record<string, string>> = {};
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

    switch (resource.type) {
      case ReferenceResourceType.INTENT:
        intentIDResourceIDMap[resource.resourceID] = resource.id;
        break;

      case ReferenceResourceType.FUNCTION:
        functionIDResourceIDMap[resource.resourceID] = resource.id;
        break;

      case ReferenceResourceType.DIAGRAM:
        diagramIDResourceIDMap[resource.resourceID] = resource.id;
        break;

      case ReferenceResourceType.NODE:
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
        break;

      default:
        break;
    }
  });

  return {
    blockNodeResourceIDs,
    intentIDResourceIDMap,
    triggerNodeResourceIDs,
    diagramIDResourceIDMap,
    functionIDResourceIDMap,
    resourceIDsByDiagramIDMap,
    refererIDsByResourceIDMap,
    resourceIDsByRefererIDMap,
    referenceIDsByResourceIDMap,
    referenceIDsByReferrerIDMap,
  };
};
