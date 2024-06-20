import { BaseNode } from '@voiceflow/base-types';
import {
  BlockNode,
  ChoiceV2Node,
  DiagramNode,
  FunctionNode,
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

import { ReferenceBaseBuilderUtil } from './reference-base-builder.util';
import { ReferenceBuilderCacheUtil } from './reference-builder-cache.util';

export class ReferenceNodeBuilderUtil extends ReferenceBaseBuilderUtil {
  private readonly nodes: DiagramNode[];

  private readonly diagramID: string;

  private readonly diagramResourceID: string;

  private readonly intentResourceCache: ReferenceBuilderCacheUtil;

  private readonly diagramResourceCache: ReferenceBuilderCacheUtil;

  private readonly functionResourceCache: ReferenceBuilderCacheUtil;

  constructor({
    nodes,
    diagramID,
    assistantID,
    environmentID,
    diagramResourceID,
    intentResourceCache,
    diagramResourceCache,
    functionResourceCache,
  }: {
    nodes: DiagramNode[];
    diagramID: string;
    assistantID: string;
    environmentID: string;
    diagramResourceID: string;
    intentResourceCache: ReferenceBuilderCacheUtil;
    diagramResourceCache: ReferenceBuilderCacheUtil;
    functionResourceCache: ReferenceBuilderCacheUtil;
  }) {
    super({ assistantID, environmentID });

    this.nodes = nodes;
    this.diagramID = diagramID;
    this.diagramResourceID = diagramResourceID;
    this.intentResourceCache = intentResourceCache;
    this.diagramResourceCache = diagramResourceCache;
    this.functionResourceCache = functionResourceCache;
  }

  async build() {
    for (const node of this.nodes) {
      // eslint-disable-next-line no-await-in-loop
      await this.buildNode(node);
    }

    return {
      references: this.references,
      referenceResources: this.referenceResources,
    };
  }

  async buildNode(node: DiagramNode) {
    if (Realtime.Utils.typeGuards.isIntentDBNode(node)) {
      await this.buildIntentNodeReferences(node);
    } else if (Realtime.Utils.typeGuards.isTriggerDBNode(node)) {
      await this.buildTriggerNodeReferences(node);
    } else if (Realtime.Utils.typeGuards.isStartDBNode(node)) {
      await this.buildStartNodeReferences(node);
    } else if (Realtime.Utils.typeGuards.isBlockDBNode(node)) {
      await this.buildBlockNodeReferences(node as BlockNode);
    } else if (Realtime.Utils.typeGuards.isComponentDBNode(node)) {
      await this.buildComponentNodeReferences(node);
    } else if (Realtime.Utils.typeGuards.isFunctionDBNode(node)) {
      await this.buildFunctionNodeReferences(node);
    } else if (Realtime.Utils.typeGuards.isInteractionDBNode(node)) {
      await this.buildInteractionNodeReferences(node);
    } else if (Realtime.Utils.typeGuards.isButtonsDBNode(node)) {
      await this.buildButtonsNodeReferences(node);
    } else if (Realtime.Utils.typeGuards.isChoiceV2DBNode(node)) {
      await this.buildChoiceV2NodeReferences(node);
    }
  }

  private async buildIntentNodeReferences(node: BaseNode.Intent.Step) {
    const nodeReference = this.buildNodeReference({
      nodeID: node.nodeID,
      metadata: { nodeType: node.type },
      diagramID: this.diagramID,
      referrerResourceID: this.diagramResourceID,
    });

    await this.buildIntentReference(nodeReference, node.data.intent || null, {
      isGlobal: !node.data.availability || node.data.availability === BaseNode.Intent.IntentAvailability.GLOBAL,
    });
  }

  private async buildTriggerNodeReferences(node: TriggerNode) {
    const nodeReference = this.buildNodeReference({
      nodeID: node.nodeID,
      metadata: { nodeType: node.type },
      diagramID: this.diagramID,
      referrerResourceID: this.diagramResourceID,
    });

    await this.buildTriggerNodeItemsReferences(nodeReference, node.data.items);
  }

  private async buildStartNodeReferences(node: StartNode) {
    const nodeReference = this.buildNodeReference({
      nodeID: node.nodeID,
      metadata: { nodeType: node.type, name: node.data.label || '' },
      diagramID: this.diagramID,
      referrerResourceID: this.diagramResourceID,
    });

    await this.buildTriggerNodeItemsReferences(nodeReference, node.data.triggers ?? []);
  }

  private buildBlockNodeReferences(node: BlockNode) {
    this.buildNodeReference({
      nodeID: node.nodeID,
      metadata: { nodeType: node.type, name: node.data.name || '' },
      diagramID: this.diagramID,
      referrerResourceID: this.diagramResourceID,
    });
  }

  private async buildComponentNodeReferences(node: BaseNode.Component.Step) {
    const nodeReference = this.buildNodeReference({
      nodeID: node.nodeID,
      metadata: { nodeType: node.type },
      diagramID: this.diagramID,
      referrerResourceID: this.diagramResourceID,
    });

    await this.buildDiagramReference(nodeReference, node.data.diagramID);
  }

  private async buildFunctionNodeReferences(node: FunctionNode) {
    const nodeReference = this.buildNodeReference({
      nodeID: node.nodeID,
      metadata: { nodeType: node.type },
      diagramID: this.diagramID,
      referrerResourceID: this.diagramResourceID,
    });

    await this.buildFunctionReference(nodeReference, node.data.functionID);
  }

  private async buildInteractionNodeReferences(node: BaseNode.Interaction.Step) {
    const nodeReference = this.buildNodeReference({
      nodeID: node.nodeID,
      metadata: { nodeType: node.type },
      diagramID: this.diagramID,
      referrerResourceID: this.diagramResourceID,
    });

    await Promise.all(node.data.choices.map((choice) => this.buildIntentReference(nodeReference, choice.intent)));
  }

  private async buildButtonsNodeReferences(node: BaseNode.Buttons.Step) {
    const nodeReference = this.buildNodeReference({
      nodeID: node.nodeID,
      metadata: { nodeType: node.type },
      diagramID: this.diagramID,
      referrerResourceID: this.diagramResourceID,
    });

    await Promise.all(
      node.data.buttons.map((button) => this.buildIntentReference(nodeReference, button.intent ?? null))
    );
  }

  private async buildChoiceV2NodeReferences(node: ChoiceV2Node) {
    const nodeReference = this.buildNodeReference({
      nodeID: node.nodeID,
      metadata: { nodeType: node.type },
      diagramID: this.diagramID,
      referrerResourceID: this.diagramResourceID,
    });

    await Promise.all(node.data.items.map((choice) => this.buildIntentReference(nodeReference, choice.intentID)));
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

  private async buildTriggerNodeItemsReferences(referrerResource: ReferenceResource, triggers: TriggerNodeItem[]) {
    await Promise.all(
      triggers.map(async (trigger) => {
        if (trigger.type !== TriggerNodeItemType.INTENT) return;

        await this.buildIntentReference(referrerResource, trigger.resourceID, { isGlobal: !trigger.settings.local });
      })
    );
  }

  private async buildIntentReference(
    referrerResource: ReferenceResource,
    intentID: string | null,
    metadata: ReferenceIntentNodeMetadata | null = null
  ) {
    if (!intentID) return;

    const intentResource = await this.intentResourceCache.getOrCreate(intentID);

    if (!intentResource) return;

    this.buildReference({
      metadata,
      resourceID: intentResource.id,
      referrerResourceID: referrerResource.id,
    });
  }

  private async buildDiagramReference(referrerResource: ReferenceResource, diagramID: string | null) {
    if (!diagramID) return;

    const diagramResource = await this.diagramResourceCache.getOrCreate(diagramID);

    if (!diagramResource) return;

    this.buildReference({
      metadata: null,
      resourceID: diagramResource.id,
      referrerResourceID: referrerResource.id,
    });
  }

  private async buildFunctionReference(referrerResource: ReferenceResource, functionID: string | null) {
    if (!functionID) return;

    const functionResource = await this.functionResourceCache.getOrCreate(functionID);

    if (!functionResource) return;

    this.buildReference({
      metadata: null,
      resourceID: functionResource.id,
      referrerResourceID: referrerResource.id,
    });
  }
}
