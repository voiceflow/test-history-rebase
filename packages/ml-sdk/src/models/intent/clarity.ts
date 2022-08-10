import { BaseModels } from '@voiceflow/base-types';

export interface OverallScores {
  clarity: number;
  confidence: number;
}

export interface ProblematicSentence {
  sentence: string;
  conflictingSentence: string;
  intentID: string;
}

export type ClarityModelIntent = Omit<BaseModels.Intent, 'noteID'>;

export interface ClarityModelRequest {
  intents: ClarityModelIntent[];
  platform: string;
  slots: BaseModels.Slot[];
  topConflicting: number;
}

export interface ClarityModelResponse {
  clarityByClass: Record<string, number>;
  overallScores: OverallScores;
  problematicSentences: Record<string, ProblematicSentence[]>;
  utteranceMapper: Record<string, string>;
}
