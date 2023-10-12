export interface MarkupSpan {
  text: Markup;
  attributes?: Record<string, unknown>;
}

export type Markup = Array<string | { variableID: string } | { entityID: string } | MarkupSpan>;
