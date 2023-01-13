import { BaseModels } from '@voiceflow/base-types';

export interface NLUUnclassifiedUtterances extends BaseModels.Version.NLUUnclassifiedUtterances {
  id: string;
}

export interface NluUnclassifiedData extends Omit<BaseModels.Version.NLUUnclassifiedData, 'key'> {
  id: string;
  utterances: NLUUnclassifiedUtterances[];
}

export const { NLUUnclassifiedDataType } = BaseModels.Version;
