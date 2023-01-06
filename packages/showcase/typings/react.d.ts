import * as React from 'react';

declare module 'react' {
  /**
   * @deprecated use React.PropsWithChildren instead
   */
  interface OldFC<P = unknown> {
    (props: P extends { children?: unknown } ? P : React.PropsWithChildren<P>, context?: any): ReactElement<any, any> | null;
    propTypes?: WeakValidationMap<P> | undefined;
    contextTypes?: ValidationMap<any> | undefined;
    defaultProps?: Partial<P> | undefined;
    displayName?: string | undefined;
  }
}
