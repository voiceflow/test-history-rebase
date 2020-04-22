import * as ReactRedux from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { IS_PRODUCTION } from '@/config';
import type { State } from '@/ducks/_root';
import { Dispatch } from '@/store/types';
import {
  ActionCreatorLookup,
  AnyFunction,
  ConnectedProps,
  Function,
  MappedDispatchProps,
  MappedStateProps,
  MergeArguments,
  SelectorLookup,
} from '@/types';

type MergePropsType<T extends AnyFunction> = T extends (...args: MergeArguments<any, any, infer R>) => any ? R : {};

type ConnectOptions = { debug?: boolean; removeDispatch?: boolean } & Omit<ReactRedux.Options, 'forwardRef'>;

type Connect = {
  <S extends SelectorLookup, D extends ActionCreatorLookup, M extends (...args: MergeArguments<S, D, any>) => any>(
    mapStateToProps: S | null,
    mapDispatchToProps?: D | null,
    mergeProps?: M | null,
    options?: ConnectOptions & { forwardRef?: false }
  ): <P extends object>(component: React.FC<P & ConnectedProps<S, D, M>>) => React.FC<Omit<P, keyof ConnectedProps<S, D, M>>>;
  <S extends SelectorLookup, D extends ActionCreatorLookup, M extends (...args: MergeArguments<S, D, any>) => any>(
    mapStateToProps: S | null,
    mapDispatchToProps?: D | null,
    mergeProps?: M | null,
    options?: ConnectOptions & { forwardRef: true }
  ): <P extends object, R>(
    component: React.RefForwardingComponent<R, P & ConnectedProps<S, D, M>>
  ) => React.RefForwardingComponent<R, Omit<P, keyof ConnectedProps<S, D, M>>>;
};

// eslint-disable-next-line import/prefer-default-export
export const connect: Connect = (
  mapStateToProps: SelectorLookup | null,
  mapDispatchToProps: ActionCreatorLookup | null = null,
  mergeProps: Function<MergeArguments<any, any, any>, any> | null = null,
  options: ConnectOptions = {}
) => (component: React.FC<any>) => {
  const isDebug = !IS_PRODUCTION && options.debug;
  const removeDispatch = options.removeDispatch;

  return ReactRedux.connect(
    (typeof mapStateToProps === 'function' ? mapStateToProps : mapStateToProps && createStructuredSelector<State, any>(mapStateToProps)) || null,

    (mapDispatchToProps as any) || null,

    mergeProps || isDebug || removeDispatch
      ? (
          stateProps: MappedStateProps<any>,
          { dispatch, ...dispatchProps }: MappedDispatchProps<any> & { dispatch: Dispatch },
          props: MergePropsType<any>
        ) =>
          // eslint-disable-next-line no-console
          (isDebug && console.log('connect() was called', { stateProps, dispatchProps, props })) || {
            ...stateProps,
            ...dispatchProps,
            ...(removeDispatch ? { dispatch } : null),
            ...props,
            ...mergeProps?.(stateProps, dispatchProps as any, props),
          }
      : (null as any),

    options
  )(component);
};
