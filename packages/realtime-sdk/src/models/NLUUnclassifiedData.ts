import { BaseModels } from '@voiceflow/base-types';

export interface NLUUnclassifiedUtterances extends BaseModels.Version.NLUUnclassifiedUtterances {
  id: string;
  importedAt: Date;
  datasourceID: string;
  datasourceName: string;
}

export interface NLUUnclassifiedData extends Omit<BaseModels.Version.NLUUnclassifiedData, 'key'> {
  id: string;
  utterances: NLUUnclassifiedUtterances[];
}

export const { NLUUnclassifiedDataType } = BaseModels.Version;
