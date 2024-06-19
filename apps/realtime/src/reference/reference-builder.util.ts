import { Diagram, Function as CMSFunction, Intent, ReferenceResourceType } from '@voiceflow/dtos';

import { AssistantLoadCreatorResponse } from '@/assistant/dtos/assistant-load-creator.response';

import { ReferenceBaseBuilderUtil } from './reference-base-builder.util';
import { ReferenceBuilderCacheUtil } from './reference-builder-cache.util';
import { ReferenceDiagramBuilderUtil } from './reference-diagram-builder.util';

export class ReferenceBuilderUtil extends ReferenceBaseBuilderUtil {
  private readonly diagrams: Diagram[];

  private readonly intentMap: Map<string, Intent>;

  private readonly diagramMap: Map<string, Diagram>;

  private readonly functionMap: Map<string, CMSFunction>;

  private readonly intentResourceCache: ReferenceBuilderCacheUtil;

  private readonly diagramResourceCache: ReferenceBuilderCacheUtil;

  private readonly functionResourceCache: ReferenceBuilderCacheUtil;

  constructor({ intents = [], functions = [], diagrams, assistant, version }: AssistantLoadCreatorResponse) {
    super({ assistantID: assistant.id, environmentID: version._id });

    this.diagrams = diagrams;
    this.intentMap = new Map(intents.map((intent) => [intent.id, intent]));
    this.diagramMap = new Map(diagrams.map((diagram) => [diagram.diagramID, diagram]));
    this.functionMap = new Map(functions.map((fn) => [fn.id, fn]));
    this.intentResourceCache = new ReferenceBuilderCacheUtil(this.getIntentResource);
    this.diagramResourceCache = new ReferenceBuilderCacheUtil(this.getDiagramResource);
    this.functionResourceCache = new ReferenceBuilderCacheUtil(this.getFunctionResource);
  }

  async build() {
    await this.buildDiagramsReferences();

    return {
      references: this.references,
      referenceResources: this.referenceResources,
    };
  }

  private async buildDiagramsReferences() {
    const builder = new ReferenceDiagramBuilderUtil({
      diagrams: this.diagrams,
      assistantID: this.assistantID,
      environmentID: this.environmentID,
      intentResourceCache: this.intentResourceCache,
      diagramResourceCache: this.diagramResourceCache,
      functionResourceCache: this.functionResourceCache,
    });

    const result = await builder.build();

    this.references.push(...result.references);
    this.referenceResources.push(...result.referenceResources);
  }

  private getIntentResource = async (intentID: string) => {
    const intent = this.intentMap.get(intentID);

    if (!intent) return null;

    return this.buildReferenceResource({
      type: ReferenceResourceType.INTENT,
      metadata: null,
      diagramID: null,
      resourceID: intent.id,
    });
  };

  private getDiagramResource = async (diagramID: string) => {
    const diagram = this.diagramMap.get(diagramID);

    if (!diagram || !ReferenceDiagramBuilderUtil.isSupportedDiagram(diagram)) return null;

    return this.buildReferenceResource({
      type: ReferenceResourceType.DIAGRAM,
      metadata: null,
      diagramID: null,
      resourceID: diagram.diagramID,
    });
  };

  private getFunctionResource = async (functionID: string) => {
    const fn = this.functionMap.get(functionID);

    if (!fn) return null;

    return this.buildReferenceResource({
      type: ReferenceResourceType.FUNCTION,
      metadata: null,
      diagramID: null,
      resourceID: fn.id,
    });
  };
}
