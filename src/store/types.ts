// state

export type RootState<T extends string, S, R = Record<string, any>> = Record<T, S> & R;

// action

export type Action<T extends string = string, P = never, M extends object = never> = {
  type: T;
  payload: P;
  meta: M;
};

export type AnyAction = Action<string, any, any>;

export type ActionType<T> = T extends Action<infer R, any, any> ? R : never;

export type ActionPayload<T> = T extends Action<any, infer R, any> ? R : never;

// thunk

export type Thunk<S = Record<string, any>, R = void> = (dispatch: ThunkDispatch, getState: () => S) => Promise<R> | R;

export type AnyThunk = Thunk<any, any>;

export type ThunkResult<T> = T extends (...args: any[]) => any ? ReturnType<T> : never;

export type ThunkDispatch = <A>(action: A) => ThunkResult<A>;

// reducer

export type RootReducer<S, A extends AnyAction = never> = (state: S | undefined, action: A) => S;

export type Reducer<S, A extends AnyAction = never> = (state: S, action: A) => S;

export type BasicReducer<S> = (state: S) => S;
