import { BaseUtils } from '@voiceflow/base-types';

interface BaseRequest {
  locales: string[];
  quantity: number;
  requestID: string;
  workspaceID: string;
}

interface BaseResponse {
  requestID: string;
}

export interface UtteranceGenRequest extends BaseRequest {
  /**
   * intent name
   */
  intent: string;

  /**
   * utterances to generate, can include entities
   * @example ["hello {name}", "hi {name}"]
   */
  examples: string[];
}

export interface UtteranceGenResponse extends BaseResponse {
  /**
   * generated utterances, can include entities
   * @example ["hello {name}", "hi {name}"]
   */
  results: string[];

  suggestedIntentName?: string;
}

export interface ResponseGenRequest extends BaseRequest {
  /**
   * request format
   * markdown - markdown format is not supported yet
   */
  format: 'text' | 'ssml' | 'markdown';

  /**
   * response examples, can include smml tags, variables, in future can include markdown
   * @example ["hello {name} <break />", "hi {name}"]
   */
  examples: string[];
}

export interface ResponseGenResponse extends BaseResponse {
  /**
   * response examples, can include smml tags, variables, in future can include markdown
   * @example ["hello {name} <break />", "hi {name}"]
   */
  results: string[];
}

export interface EntityValuesGenRequest extends BaseRequest {
  /**
   * type of the entity
   */
  type: string;

  /**
   * name of the entity
   */
  name: string;

  /**
   * entity values and synonyms, first value is the value, others are synonyms
   * @example [["tesla", "model 3", "model y", "cybertrack"], ["world", "earth"]]
   */
  examples: string[][];
}

export interface EntityValuesGenResponse extends BaseResponse {
  /**
   * entity values and synonyms, first value is the value, others are synonyms
   * @example [["hello", "hi"], ["world", "earth"]]
   */
  results: string[][];
}

export interface EntityPromptGenRequest extends BaseResponse {
  /**
   * type of the entity
   * voiceflow built-in types or "custom"
   */
  type: string;

  /**
   * name of the entity
   */
  name: string;

  /**
   * entity prompts
   * can be empty an array
   */
  examples: string[];

  /**
   * name of the intent that uses this entity
   */
  intentName: string;

  /**
   * intent's utterances
   */
  intentInputs: string[];
}

export interface EntityPromptGenResponse extends BaseResponse {
  /**
   * entity prompts
   */
  results: string[];
}

export interface GenerativeResponseRequest extends BaseUtils.ai.AIModelParams, Omit<BaseRequest, 'quantity'> {
  prompt: string;
}

export interface GenerativeResponseResponse {
  result: string;
}
