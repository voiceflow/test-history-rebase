import { Eventual } from '@voiceflow/common';
import React from 'react';

export type TransactionContextValue = (callback: () => Eventual<void>) => Eventual<void>;

export const TransactionContext = React.createContext<TransactionContextValue>((callback) => callback());
export const { Consumer: TransactionConsumer, Provider: TransactionProvider } = TransactionContext;
