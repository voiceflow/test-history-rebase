import { Context as ContextUtils } from '@/utils';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Value {}

export const { extend, Context, notInjected, useContext } = ContextUtils.createContext<Value>({});
