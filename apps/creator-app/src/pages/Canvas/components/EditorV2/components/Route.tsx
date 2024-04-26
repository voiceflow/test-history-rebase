import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';
import type { RouteProps } from 'react-router-dom';
import { Route, Switch, useRouteMatch } from 'react-router-dom';

import { Path } from '@/config/routes';
import { useFeature } from '@/hooks/feature';

import { EditorParentMatchProvider } from '../context';

interface EditorRouteProps extends NonNullable<Pick<RouteProps, 'component'>>, Pick<RouteProps, 'path' | 'render'> {
  children?: React.ReactElement<EditorRouteProps> | React.ReactElement<EditorRouteProps>[];
}

const EditorRoute = ({ path, children, ...props }: EditorRouteProps) => {
  const cmsWorkflows = useFeature(Realtime.FeatureFlag.CMS_WORKFLOWS);

  const match = useRouteMatch(
    (path ?? (cmsWorkflows.isEnabled ? Path.CANVAS_NODE : Path.DOMAIN_CANVAS_NODE)) as string
  );

  if (!match) return null;

  return (
    <Switch>
      {children &&
        React.Children.map(children, (child) => {
          const { path, component: Component } = child.props;

          return React.cloneElement(child, {
            path: `${match.path}/${path}`,
            component: undefined,
            render:
              Component &&
              ((props) => (
                <EditorParentMatchProvider value={match}>
                  <Component {...props} />
                </EditorParentMatchProvider>
              )),
          });
        })}

      <Route path={path} {...props} />
    </Switch>
  );
};

export default EditorRoute;
