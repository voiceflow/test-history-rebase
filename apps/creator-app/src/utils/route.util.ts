import type { ExtractRouteParams, RouteProps } from 'react-router';
import type { match } from 'react-router-dom';
import { matchPath as rrMatchPath } from 'react-router-dom';

export const matchPath = <
  Path extends string,
  Params extends Record<string, string | undefined> = ExtractRouteParams<Path, string>,
>(
  pathname: string,
  props: Path | Path[] | RouteProps<Path, Params>,
  parent?: match<Params> | null
) => rrMatchPath(pathname, props as any, parent) as match<Params> | null;
