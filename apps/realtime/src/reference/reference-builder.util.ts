import { ObjectId } from '@mikro-orm/mongodb';
import { BaseNode } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import {
  BlockNode,
  Diagram,
  DiagramType,
  Intent,
  Reference,
  ReferenceIntentNodeMetadata,
  ReferenceResource,
  ReferenceResourceNodeMetadata,
  ReferenceResourceType,
  StartNode,
  TriggerNode,
  TriggerNodeItem,
  TriggerNodeItemType,
} from '@voiceflow/dtos';
import * as Realtime from '@voiceflow/realtime-sdk/backend';

import { AssistantLoadCreatorResponse } from '@/assistant/dtos/assistant-load-creator.response';

export class ReferenceBuilderUtil {
  private readonly intents: Intent[];

  private readonly diagrams: Diagram[];

  private readonly assistantID: string;

  private readonly environmentID: string;

  private references: Reference[] = [];

  private referenceResources: ReferenceResource[] = [];

  private intentsMap: Partial<Record<string, Intent>> = {};

  private intentIDReferenceResourceIDMap: Partial<Record<string, string>> = {};

  constructor({ intents = [], diagrams, assistant, version }: AssistantLoadCreatorResponse) {
    this.intents = intents;
    this.diagrams = diagrams;
    this.assistantID = assistant.id;
    this.environmentID = version._id;
  }

  build() {
    this.buildCache();
    this.buildReferences();

    return {
      references: this.references,
      referenceResources: this.referenceResources,
    };
  }

  private genID() {
    return new ObjectId().toJSON();
  }

  private buildCache() {
    this.intentsMap = Utils.array.createMap(this.intents, (intent) => intent.id);
  }

  private buildReferences() {
    this.diagrams.forEach((diagram) => this.buildDiagramReferences(diagram));
  }

  private buildDiagramReferences(diagram: Diagram) {
    if (diagram.type !== DiagramType.COMPONENT && diagram.type !== DiagramType.TOPIC) return;

    const diagramResource = this.buildReferenceResource({
      type: ReferenceResourceType.DIAGRAM,
      metadata: null,
      diagramID: null,
      resourceID: diagram.diagramID,
    });

    Object.values(diagram.nodes).forEach((node) => {
      if (Realtime.Utils.typeGuards.isIntentDBNode(node)) {
        this.buildIntentNodeReferences(diagramResource, node);
      } else if (Realtime.Utils.typeGuards.isTriggerDBNode(node)) {
        this.buildTriggerNodeReferences(diagramResource, node);
      } else if (Realtime.Utils.typeGuards.isStartDBNode(node)) {
        this.buildStartNodeReferences(diagramResource, node);
      } else if (Realtime.Utils.typeGuards.isBlockDBNode(node)) {
        this.buildBlockNodeReferences(diagramResource, node as BlockNode);
      }
    });
  }

  private buildIntentNodeReferences(diagramResource: ReferenceResource, node: BaseNode.Intent.Step) {
    const nodeReference = this.buildNodeReference({
      nodeID: node.nodeID,
      metadata: { nodeType: node.type },
      diagramID: diagramResource.resourceID,
      referrerResourceID: diagramResource.id,
    });

    this.buildIntentReference(nodeReference, node.data.intent || null, {
      isGlobal: !node.data.availability || node.data.availability === BaseNode.Intent.IntentAvailability.GLOBAL,
    });
  }

  private buildTriggerNodeReferences(diagramResource: ReferenceResource, node: TriggerNode) {
    const nodeReference = this.buildNodeReference({
      nodeID: node.nodeID,
      metadata: { nodeType: node.type },
      diagramID: diagramResource.resourceID,
      referrerResourceID: diagramResource.id,
    });

    this.buildTriggerNodeItemsReferences(nodeReference, node.data.items);
  }

  private buildStartNodeReferences(diagramResource: ReferenceResource, node: StartNode) {
    const nodeReference = this.buildNodeReference({
      nodeID: node.nodeID,
      metadata: { nodeType: node.type, name: node.data.label || '' },
      diagramID: diagramResource.resourceID,
      referrerResourceID: diagramResource.id,
    });

    this.buildTriggerNodeItemsReferences(nodeReference, node.data.triggers ?? []);
  }

  private buildBlockNodeReferences(diagramResource: ReferenceResource, node: BlockNode) {
    this.buildNodeReference({
      nodeID: node.nodeID,
      metadata: { nodeType: node.type, name: node.data.name || '' },
      diagramID: diagramResource.resourceID,
      referrerResourceID: diagramResource.id,
    });
  }

  private buildNodeReference<Data extends ReferenceResourceNodeMetadata>({
    nodeID,
    metadata,
    diagramID,
    resourceID,
    referrerResourceID,
  }: {
    nodeID: string;
    metadata: Data;
    diagramID: string;
    resourceID?: string;
    referrerResourceID: string;
  }) {
    const nodeResource = this.buildReferenceResource({
      id: resourceID,
      type: ReferenceResourceType.NODE,
      metadata,
      diagramID,
      resourceID: nodeID,
    });

    this.buildReference({
      metadata: null,
      resourceID: nodeResource.id,
      referrerResourceID,
    });

    return nodeResource;
  }

  private buildTriggerNodeItemsReferences(referrerResource: ReferenceResource, triggers: TriggerNodeItem[]) {
    triggers.forEach((trigger) => {
      if (trigger.type !== TriggerNodeItemType.INTENT) return;

      this.buildIntentReference(referrerResource, trigger.resourceID, { isGlobal: !trigger.settings.local });
    });
  }

  private buildIntentReference(
    referrerResource: ReferenceResource,
    intentID: string | null,
    metadata: ReferenceIntentNodeMetadata
  ) {
    if (!intentID) return;

    const intent = this.intentsMap[intentID];

    if (!intent) return;

    let intentResourceID = this.intentIDReferenceResourceIDMap[intentID];

    if (!intentResourceID) {
      const intentResource = this.buildReferenceResource({
        type: ReferenceResourceType.INTENT,
        metadata: null,
        diagramID: null,
        resourceID: intent.id,
      });

      intentResourceID = intentResource.id;
      this.intentIDReferenceResourceIDMap[intentID] = intentResourceID;
    }

    this.buildReference({
      metadata,
      resourceID: intentResourceID,
      referrerResourceID: referrerResource.id,
    });
  }

  private buildReference({ id = this.genID(), ...data }: Omit<Reference, 'id' | 'environmentID'> & { id?: string }) {
    const resource: Reference = { ...data, id, environmentID: this.environmentID };

    this.references.push(resource);

    return resource;
  }

  private buildReferenceResource({
    id = this.genID(),
    ...data
  }: Omit<ReferenceResource, 'id' | 'assistantID' | 'environmentID'> & { id?: string }) {
    const referenceResource: ReferenceResource = {
      ...data,
      id,
      assistantID: this.assistantID,
      environmentID: this.environmentID,
    };

    this.referenceResources.push(referenceResource);

    return referenceResource;
  }
}
