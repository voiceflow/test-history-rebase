import { AnyAction } from '@/store/types';

export type DiagramUpdateEvent<T extends AnyAction = AnyAction> = {
  action: T;
  tabId: string;
  timestamp?: number;
};

export type ActionHandler<T extends object = object> = (action: T, tabID: string) => void;

export type UpdateActionHandler<T extends AnyAction = AnyAction> = (action: T, tabID: string, options?: { volatile?: boolean }) => void;
