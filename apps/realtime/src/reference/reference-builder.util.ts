import { Utils } from '@voiceflow/common';
import { Diagram, DiagramType, Intent, ReferenceResource, ReferenceResourceType } from '@voiceflow/dtos';

import { AssistantLoadCreatorResponse } from '@/assistant/dtos/assistant-load-creator.response';

import { ReferenceBaseBuilderUtil } from './reference-base-builder.util';
import { ReferenceNodeBuilderUtil } from './reference-node-builder.util';
export class ReferenceBuilderUtil extends ReferenceBaseBuilderUtil {
  private readonly intents: Intent[];

  private readonly diagrams: Diagram[];

  private intentsMap: Partial<Record<string, Intent>> = {};

  private resourceByIntentID: Partial<Record<string, ReferenceResource>> = {};

  constructor({ intents = [], diagrams, assistant, version }: AssistantLoadCreatorResponse) {
    super({ assistantID: assistant.id, environmentID: version._id });

    this.intents = intents;
    this.diagrams = diagrams;
  }

  async build() {
    this.buildCache();

    await this.buildDiagramsReferences();

    return {
      references: this.references,
      referenceResources: this.referenceResources,
    };
  }

  private buildCache() {
    this.intentsMap = Utils.array.createMap(this.intents, (intent) => intent.id);
  }

  private async buildDiagramsReferences() {
    for (const diagram of this.diagrams) {
      // eslint-disable-next-line no-await-in-loop
      await this.buildDiagramReferences(diagram);
    }
  }

  private async buildDiagramReferences(diagram: Diagram) {
    if (diagram.type !== DiagramType.COMPONENT && diagram.type !== DiagramType.TOPIC) return;

    const diagramResource = this.buildReferenceResource({
      type: ReferenceResourceType.DIAGRAM,
      metadata: null,
      diagramID: null,
      resourceID: diagram.diagramID,
    });

    const nodeBuilder = new ReferenceNodeBuilderUtil({
      nodes: Object.values(diagram.nodes),
      diagramID: diagram.diagramID,
      assistantID: this.assistantID,
      environmentID: this.environmentID,
      diagramResourceID: diagramResource.id,

      getIntentResource: async (intentID) => this.getIntentResource(intentID),
    });

    const result = await nodeBuilder.build();

    this.references.push(...result.references);
    this.referenceResources.push(...result.referenceResources);
  }

  private getIntentResource(intentID: string) {
    const intent = this.intentsMap[intentID];

    if (!intent) return null;

    let intentResource = this.resourceByIntentID[intentID];

    if (!intentResource) {
      intentResource = this.buildReferenceResource({
        type: ReferenceResourceType.INTENT,
        metadata: null,
        diagramID: null,
        resourceID: intent.id,
      });

      this.resourceByIntentID[intentID] = intentResource;
    }

    return intentResource;
  }
}
