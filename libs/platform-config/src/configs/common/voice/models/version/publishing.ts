import type * as Base from '@/configs/base';

export interface Model extends Base.Models.Version.Publishing.Model {}

export type Extends<T> = Model & Omit<T, keyof Model>;
