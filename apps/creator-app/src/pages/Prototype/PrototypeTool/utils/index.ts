import type { BaseTraceFrame, V1Trace } from '@/models';

export * from './paths';

export const isV1Trace = (trace: BaseTraceFrame): trace is V1Trace => Array.isArray(trace.paths);
