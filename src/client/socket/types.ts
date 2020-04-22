import { AnyAction } from '@/store/types';

export type DiagramUpdateEvent<T extends AnyAction = AnyAction> = {
  action: T;
  tabId: string;
  timestamp?: number;
};

export type SubscriptionConfig = {
  onReload: () => void;
  onDisconnect: () => void;
  onReconnect: () => Promise<void>;
  updateTimestamp: (timestamp: number) => void;
  handleSessionTakeOver: (data: { browserID: string }) => void;
  handleSessionTaken: () => void;
};

export type ActionHandler<T extends object = object> = (action: T, tabID: string) => void;

export type UpdateActionHandler<T extends AnyAction = AnyAction> = (action: T, tabID: string, options?: { volatile: boolean }) => void;

export type RealtimeSubscription = {
  on: <T extends object>(event: string, callback: (action: T, tabID: string) => void) => void;
  onUpdate: <T extends AnyAction>(callback: (action: T, tabID: string, options?: { volatile?: boolean }) => void) => () => void;
  destroy: () => void;
};
