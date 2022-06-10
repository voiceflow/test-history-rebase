import { ActionInvalidator, ActionReverter } from '@/ducks/utils';

export type ReverterLookup = Partial<Record<string, ActionReverter<any>[]>>;

export type InvalidatorLookup = Partial<Record<string, Partial<Record<string, ActionInvalidator<any, any>[]>>>>;
