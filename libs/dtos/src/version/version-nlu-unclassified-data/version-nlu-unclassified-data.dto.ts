import { z } from 'zod';

import { VersionNLUUnclassifiedDataType } from './version-nlu-unclassified-data-type.enum';

export const VersionNLUUnclassifiedUtteranceDTO = z
  .object({
    id: z.string().optional(),
    sourceID: z.string().optional(),
    utterance: z.string(),

    /**
     * @deprecated in favor of unclassifiedData.importedAt
     */

    importedAt: z.string().optional().describe('@deprecated in favor of UnclassifiedData.importedAt'),
  })
  .strict();

export type VersionNLUUnclassifiedUtterance = z.infer<typeof VersionNLUUnclassifiedUtteranceDTO>;

export const VersionNLUUnclassifiedDataDTO = z
  .object({
    key: z.string().optional(),
    name: z.string(),
    type: z.nativeEnum(VersionNLUUnclassifiedDataType),
    creatorID: z.number().optional(),
    utterances: z.array(VersionNLUUnclassifiedUtteranceDTO),
    importedAt: z.string().optional(),

    /**
     * @deprecated in favor of key
     */
    id: z.number().optional().describe('@deprecated in favor of key'),
  })
  .strict();

export type VersionNLUUnclassifiedData = z.infer<typeof VersionNLUUnclassifiedDataDTO>;
