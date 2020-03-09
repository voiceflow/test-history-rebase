import React from 'react';
import { setDisplayName, wrapDisplayName } from 'recompose';

import { AnyFunction, ArgumentsType } from '@/types';
import { identity } from '@/utils/functional';

export type WithHookOptions<T, P extends object> = {
  shouldRender?: (props: P & T) => boolean;
  getProps?: (props: T) => P;
};

export const withHook = <T extends AnyFunction, P extends object = {}>(
  useHook: T,
  { getProps = identity, shouldRender }: WithHookOptions<ReturnType<T>, P> = {},
  ...args: ArgumentsType<typeof useHook>
) => (Component: React.FC<P & ReturnType<T>>) =>
  setDisplayName(wrapDisplayName(Component, 'withHook'))(
    // eslint-disable-next-line react/display-name
    React.forwardRef<HTMLElement, P & ReturnType<T>>((props, ref) => {
      const value = useHook(...args, props);
      const allProps = { ...getProps(value), ...props, ref };

      if (shouldRender && !shouldRender(allProps)) {
        return null;
      }

      return <Component {...allProps} />;
    })
  );
