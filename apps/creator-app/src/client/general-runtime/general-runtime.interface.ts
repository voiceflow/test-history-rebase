import { IntentClassificationSettings } from '@voiceflow/dtos';

export interface GeneralRuntimeFunctionTestRequest {
  definition: {
    code: string;
    pathCodes: string[];
    inputVars: Record<string, { type: string }>;
    outputVars: Record<string, { type: string }>;
  };
  invocation: {
    inputVars: Record<string, string>;
  };
}

export interface GeneralRuntimeFunctionTestResponse {
  success: boolean;
  latencyMS: number;
  runtimeCommands: {
    next?: Record<string, string>;
    trace?: Array<{ type: string; payload: any }>;
    outputVars?: Record<string, string>;
  };
}

interface GeneralRuntimeIntentResponse {
  name: string;
}

interface GeneralRuntimeNLUIntentResponse extends GeneralRuntimeIntentResponse {
  confidence: number;
}

export interface GeneralRuntimeIntentPreviewUtteranceRequest {
  projectID: string;
  versionID: string;
  utterance: string;
  intentClassificationSettings: IntentClassificationSettings;
}

export interface GeneralRuntimeIntentPreviewUtteranceResponse {
  nlu: GeneralRuntimeNLUIntentResponse[];
  llm: GeneralRuntimeIntentResponse[];
  unusedIntents: [];
}
