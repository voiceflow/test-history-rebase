import { BaseModels } from '@voiceflow/base-types';

export type NluUnclassifiedData = BaseModels.Version.NLUUnclassifiedData;

interface NLUUnclassifiedUtteranceModel {
  id: string;
  datasourceID: number;
  importedByUser?: string;
}

export type NLUUnclassifiedUtterances = BaseModels.Version.NLUUnclassifiedUtterances & NLUUnclassifiedUtteranceModel;

export const { NLUUnclassifiedDataType } = BaseModels.Version;
