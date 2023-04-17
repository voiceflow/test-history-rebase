import { Eventual } from '@voiceflow/common';
import React from 'react';

// needs this complex type to accept nested promise.alls
type EventualVoid = Eventual<void | void[] | Array<void | void[]>>;

export type TransactionContextValue = (callback: () => EventualVoid) => EventualVoid;

export const TransactionContext = React.createContext<TransactionContextValue>((callback) => callback());
export const { Consumer: TransactionConsumer, Provider: TransactionProvider } = TransactionContext;
