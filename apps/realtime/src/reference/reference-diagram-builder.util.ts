import { Diagram, DiagramType, ReferenceResourceType } from '@voiceflow/dtos';

import { ReferenceBaseBuilderUtil } from './reference-base-builder.util';
import { ReferenceBuilderCacheUtil } from './reference-builder-cache.util';
import { ReferenceNodeBuilderUtil } from './reference-node-builder.util';

export class ReferenceDiagramBuilderUtil extends ReferenceBaseBuilderUtil {
  private readonly diagrams: Diagram[];

  private readonly intentResourceCache: ReferenceBuilderCacheUtil;

  private readonly diagramResourceCache: ReferenceBuilderCacheUtil;

  private readonly functionResourceCache: ReferenceBuilderCacheUtil;

  public static isSupportedDiagram(diagram: Diagram) {
    return diagram.type === DiagramType.COMPONENT || diagram.type === DiagramType.TOPIC;
  }

  constructor({
    diagrams,
    assistantID,
    environmentID,
    intentResourceCache,
    diagramResourceCache,
    functionResourceCache,
  }: {
    diagrams: Diagram[];
    assistantID: string;
    environmentID: string;
    intentResourceCache: ReferenceBuilderCacheUtil;
    diagramResourceCache: ReferenceBuilderCacheUtil;
    functionResourceCache: ReferenceBuilderCacheUtil;
  }) {
    super({ assistantID, environmentID });

    this.diagrams = diagrams;
    this.intentResourceCache = intentResourceCache;
    this.diagramResourceCache = diagramResourceCache;
    this.functionResourceCache = functionResourceCache;
  }

  async build() {
    await this.buildDiagramsReferences();

    return {
      references: this.references,
      referenceResources: this.referenceResources,
    };
  }

  private async buildDiagramsReferences() {
    // prebuild diagram resources so nodes from different diagrams can reference each other
    this.diagrams.forEach((diagram) => {
      if (!ReferenceDiagramBuilderUtil.isSupportedDiagram(diagram)) return;

      const diagramResource = this.buildReferenceResource({
        type: ReferenceResourceType.DIAGRAM,
        metadata: null,
        diagramID: null,
        resourceID: diagram.diagramID,
      });

      this.diagramResourceCache.set(diagram.diagramID, diagramResource);
    });

    for (const diagram of this.diagrams) {
      // eslint-disable-next-line no-await-in-loop
      await this.buildDiagramNodesReferences(diagram);
    }
  }

  private async buildDiagramNodesReferences(diagram: Diagram) {
    if (!ReferenceDiagramBuilderUtil.isSupportedDiagram(diagram)) return;

    const diagramResource = this.diagramResourceCache.get(diagram.diagramID);

    if (!diagramResource) {
      throw new Error(`diagram resource not found for diagram "${diagram.diagramID}"`);
    }

    const nodeBuilder = new ReferenceNodeBuilderUtil({
      nodes: Object.values(diagram.nodes),
      diagramID: diagram.diagramID,
      assistantID: this.assistantID,
      environmentID: this.environmentID,
      diagramResourceID: diagramResource.id,
      intentResourceCache: this.intentResourceCache,
      diagramResourceCache: this.diagramResourceCache,
      functionResourceCache: this.functionResourceCache,
    });

    const result = await nodeBuilder.build();

    this.references.push(...result.references);
    this.referenceResources.push(...result.referenceResources);
  }
}
