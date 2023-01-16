import { UNCLASSIFIED_KEY } from '@ml-sdk/constants';

import { createAsyncAction, createType } from './utils';

const unclassifiedType = createType(UNCLASSIFIED_KEY);

export interface ClusterRequestPayload {
  utterancesIntentsMap: Record<string, string>;
}

export type ClusteringData = Record<string, Record<string, number>>;

export interface ClusterResponsePayload {
  utterancesNewIntentsMap: ClusteringData;
}

export interface FindSimilarRequestPayload {
  utterances: string[];
  targetPhrase: string;
}

export type FindSimilarData = Record<string, Record<string, number>>;

export interface FindSimilarResponsePayload {
  utterancesNewIntentsMap: FindSimilarData;
}

export const cluster = createAsyncAction<ClusterRequestPayload, ClusterResponsePayload>(unclassifiedType('CLUSTER'));

export const findSimilar = createAsyncAction<FindSimilarRequestPayload, FindSimilarResponsePayload>(unclassifiedType('FIND_SIMILAR'));
