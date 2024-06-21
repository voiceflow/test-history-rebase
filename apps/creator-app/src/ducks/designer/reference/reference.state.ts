import type { Reference, ReferenceResource } from '@voiceflow/dtos';

export const STATE_KEY = 'reference';

export interface ReferenceState {
  resourceMap: { [resourceID: string]: ReferenceResource | undefined };

  referenceMap: { [referenceID: string]: Reference | undefined };

  // caches to optimize selectors
  /**
   * resource.id of all block nodes
   */
  blockNodeResourceIDs: string[];
  /**
   * intent.id -> resource.id
   */
  intentIDResourceIDMap: { [intentID: string]: string | undefined };
  /**
   * resource.id of all trigger nodes
   */
  triggerNodeResourceIDs: string[];
  /**
   * diagram.diagramID -> resource.id
   */
  diagramIDResourceIDMap: { [diagramID: string]: string | undefined };
  /**
   * message.id -> resource.id
   */
  messageIDResourceIDMap: { [messageID: string]: string | undefined };
  /**
   * function.id -> resource.id
   */
  functionIDResourceIDMap: { [functionID: string]: string | undefined };
  /**
   * diagram.diagramID -> resource.id[]
   */
  resourceIDsByDiagramIDMap: { [diagramID: string]: string[] | undefined };
  /**
   * resource.id -> refererResource.id[]
   */
  refererIDsByResourceIDMap: { [resourceID: string]: string[] | undefined };
  /**
   * refererResource.id -> resource.id[]
   */
  resourceIDsByRefererIDMap: { [referrerID: string]: string[] | undefined };
  /**
   * resource.id -> reference.id[]
   */
  referenceIDsByResourceIDMap: { [resourceID: string]: string[] | undefined };
  /**
   * referrerResource.id -> reference.id[]
   */
  referenceIDsByReferrerIDMap: { [referrerID: string]: string[] | undefined };
  /**
   * diagram.id -> intent.id -> triggerNode.id[]
   */
  globalTriggerNodeIDsByIntentIDMapByDiagramIDMap: {
    [diagramID: string]: { [intentID: string]: string[] | undefined } | undefined;
  };
}

export const INITIAL_STATE: ReferenceState = {
  resourceMap: {},
  referenceMap: {},
  blockNodeResourceIDs: [],
  intentIDResourceIDMap: {},
  triggerNodeResourceIDs: [],
  diagramIDResourceIDMap: {},
  messageIDResourceIDMap: {},
  functionIDResourceIDMap: {},
  resourceIDsByDiagramIDMap: {},
  refererIDsByResourceIDMap: {},
  resourceIDsByRefererIDMap: {},
  referenceIDsByResourceIDMap: {},
  referenceIDsByReferrerIDMap: {},
  globalTriggerNodeIDsByIntentIDMapByDiagramIDMap: {},
};
