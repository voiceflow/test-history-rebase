import { Diagram, DiagramType, ReferenceResource, ReferenceResourceType } from '@voiceflow/dtos';

import { ReferenceBaseBuilderUtil } from './reference-base-builder.util';
import { ReferenceNodeBuilderUtil } from './reference-node-builder.util';

export class ReferenceDiagramBuilderUtil extends ReferenceBaseBuilderUtil {
  private readonly diagrams: Diagram[];

  private resourceByIntentID: Partial<Record<string, ReferenceResource | null>> = {};

  private readonly getIntentResource: (intentID: string) => Promise<ReferenceResource | null>;

  constructor({
    diagrams,
    assistantID,
    environmentID,
    getIntentResource,
  }: {
    diagrams: Diagram[];
    assistantID: string;
    environmentID: string;
    getIntentResource: (intentID: string) => Promise<ReferenceResource | null>;
  }) {
    super({ assistantID, environmentID });

    this.diagrams = diagrams;

    this.getIntentResource = async (intentID) => {
      let resource = this.resourceByIntentID[intentID];

      if (resource !== undefined) return resource;

      resource = await getIntentResource(intentID);

      this.resourceByIntentID[intentID] = resource;

      return resource;
    };
  }

  async build() {
    await this.buildDiagramsReferences();

    return {
      references: this.references,
      referenceResources: this.referenceResources,
    };
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
}
