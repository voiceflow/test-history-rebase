import { Utils } from '@voiceflow/common';
import { Diagram, Intent, ReferenceResource, ReferenceResourceType } from '@voiceflow/dtos';

import { AssistantLoadCreatorResponse } from '@/assistant/dtos/assistant-load-creator.response';

import { ReferenceBaseBuilderUtil } from './reference-base-builder.util';
import { ReferenceDiagramBuilderUtil } from './reference-diagram-builder.util';

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
    const builder = new ReferenceDiagramBuilderUtil({
      diagrams: this.diagrams,
      assistantID: this.assistantID,
      environmentID: this.environmentID,
      getIntentResource: async (intentID) => this.getIntentResource(intentID),
    });

    const result = await builder.build();

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
