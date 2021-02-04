import * as ReactRedux from 'react-redux';
import { getDisplayName } from 'recompose';
import { createStructuredSelector } from 'reselect';

import { IS_PRODUCTION } from '@/config';
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
import Logger from '@/utils/logger';

type MergePropsType<T extends AnyFunction> = T extends (...args: MergeArguments<any, any, infer R>) => any ? R : {};

type ConnectOptions = { debug?: boolean; removeDispatch?: boolean; merge?: boolean } & Omit<ReactRedux.Options, 'forwardRef'>;

type Connect = {
  <S extends SelectorLookup<any>, D extends ActionCreatorLookup, M extends (...args: MergeArguments<S, D, any>) => any>(
    mapStateToProps: S | null,
    mapDispatchToProps?: D | null,
    mergeProps?: M | null,
    options?: ConnectOptions & { forwardRef?: false }
  ): <P extends object>(component: React.FC<P & ConnectedProps<S, D, M>>) => React.FC<Omit<P, keyof ConnectedProps<S, D, M>>>;
  <S extends SelectorLookup<any>, D extends ActionCreatorLookup, M extends (...args: MergeArguments<S, D, any>) => any>(
    mapStateToProps: S | null,
    mapDispatchToProps?: D | null,
    mergeProps?: M | null,
    options?: ConnectOptions & { forwardRef: true }
  ): <P extends object, R>(
    component: React.ForwardRefRenderFunction<R, P & ConnectedProps<S, D, M>>
  ) => React.ForwardRefRenderFunction<R, Omit<P, keyof ConnectedProps<S, D, M>>>;
};

// eslint-disable-next-line import/prefer-default-export
export const connect: Connect = (
  mapStateToProps: SelectorLookup<any> | null,
  mapDispatchToProps: ActionCreatorLookup | null = null,
  mergeProps: Function<MergeArguments<any, any, any>, any> | null = null,
  options: ConnectOptions = {}
) => (component: React.FC<any>) => {
  const isDebug = !IS_PRODUCTION && options.debug;
  const removeDispatch = options.removeDispatch;
  const shouldMerge = options.merge ?? true;
  const log = Logger.child(`connect(${getDisplayName(component)})`);

  return ReactRedux.connect(
    (typeof mapStateToProps === 'function' ? mapStateToProps : mapStateToProps && createStructuredSelector(mapStateToProps)) || null,

    mapDispatchToProps || null,

    mergeProps || isDebug || removeDispatch
      ? (
          stateProps: MappedStateProps<any>,
          { dispatch, ...dispatchProps }: MappedDispatchProps<any> & { dispatch: Dispatch },
          props: MergePropsType<any>
        ) => {
          if (isDebug) {
            log.debug('connect() was called', { stateProps, dispatchProps, props });
          }

          const mergedProps = mergeProps?.(stateProps, dispatchProps, props);

          return shouldMerge
            ? {
                ...stateProps,
                ...dispatchProps,
                ...(removeDispatch ? { dispatch } : null),
                ...props,
                ...mergedProps,
              }
            : {
                ...(removeDispatch ? { dispatch } : null),
                ...props,
                ...mergedProps,
              };
        }
      : (null as any),
    options
  )(component);
};
