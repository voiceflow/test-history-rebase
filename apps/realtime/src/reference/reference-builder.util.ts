import {
  Diagram,
  Function as CMSFunction,
  Intent,
  ReferenceResourceType,
  RequiredEntity,
  Response,
} from '@voiceflow/dtos';

import { AssistantLoadCreatorResponse } from '@/assistant/dtos/assistant-load-creator.response';

import { ReferenceBaseBuilderUtil } from './reference-base-builder.util';
import { ReferenceBuilderCacheUtil } from './reference-builder-cache.util';
import { ReferenceDiagramBuilderUtil } from './reference-diagram-builder.util';
import { ReferenceRequiredEntityUtil } from './reference-required-entity-builder.util';

export class ReferenceBuilderUtil extends ReferenceBaseBuilderUtil {
  private readonly diagrams: Diagram[];

  private readonly intentMap: Map<string, Intent>;

  private readonly diagramMap: Map<string, Diagram>;

  private readonly responseMap: Map<string, Response>;

  private readonly functionMap: Map<string, CMSFunction>;

  private readonly requiredEntities: RequiredEntity[];

  private readonly intentResourceCache: ReferenceBuilderCacheUtil;

  private readonly messageResourceCache: ReferenceBuilderCacheUtil;

  private readonly diagramResourceCache: ReferenceBuilderCacheUtil;

  private readonly functionResourceCache: ReferenceBuilderCacheUtil;

  constructor({
    intents = [],
    version,
    diagrams,
    assistant,
    functions = [],
    responses = [],
    requiredEntities = [],
  }: AssistantLoadCreatorResponse) {
    super({ assistantID: assistant.id, environmentID: version._id });

    this.diagrams = diagrams;
    this.intentMap = new Map(intents.map((intent) => [intent.id, intent]));
    this.diagramMap = new Map(diagrams.map((diagram) => [diagram.diagramID, diagram]));
    this.responseMap = new Map(responses.map((response) => [response.id, response]));
    this.functionMap = new Map(functions.map((fn) => [fn.id, fn]));
    this.requiredEntities = requiredEntities;
    this.intentResourceCache = new ReferenceBuilderCacheUtil(this.getIntentResource);
    this.messageResourceCache = new ReferenceBuilderCacheUtil(this.getMessageResource);
    this.diagramResourceCache = new ReferenceBuilderCacheUtil(this.getDiagramResource);
    this.functionResourceCache = new ReferenceBuilderCacheUtil(this.getFunctionResource);
  }

  async build() {
    await this.buildCMSReferences();
    await this.buildDiagramsReferences();

    return {
      references: this.references,
      referenceResources: this.referenceResources,
    };
  }

  private async buildCMSReferences() {
    await this.buildRequiredEntitiesReferences();
  }

  private async buildRequiredEntitiesReferences() {
    const builder = new ReferenceRequiredEntityUtil({
      assistantID: this.assistantID,
      environmentID: this.environmentID,
      requiredEntities: this.requiredEntities,
      intentResourceCache: this.intentResourceCache,
      messageResourceCache: this.messageResourceCache,
    });

    const result = await builder.build();

    this.references.push(...result.references);
    this.referenceResources.push(...result.referenceResources);
  }

  private async buildDiagramsReferences() {
    const builder = new ReferenceDiagramBuilderUtil({
      diagrams: this.diagrams,
      assistantID: this.assistantID,
      environmentID: this.environmentID,
      intentResourceCache: this.intentResourceCache,
      messageResourceCache: this.messageResourceCache,
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

  private getMessageResource = async (messageID: string) => {
    const response = this.responseMap.get(messageID);

    // TODO: add response type check here
    if (!response) return null;

    return this.buildReferenceResource({
      type: ReferenceResourceType.MESSAGE,
      metadata: null,
      diagramID: null,
      resourceID: response.id,
    });
  };
}
