export type Function<A extends any[] = any[], R = any> = (...args: A) => R;

export type AnyFunction = Function<any[], any>;

export type ArgumentsType<T extends AnyFunction> = T extends Function<infer A> ? A : never[];
