import { FullSpinner, FullSpinnerProps } from '@voiceflow/ui';
import React from 'react';
import { matchPath, useLocation } from 'react-router-dom';

import Page from '@/components/Page';
import { CANVAS_COLOR } from '@/constants/canvas';

import { DIAGRAM_ROUTES } from '../constants';
import { LogoOnlyHeader } from './Header/components';
import { LogoOffsetSidebar } from './Sidebar/components';

const ProjectLoader: React.FC<FullSpinnerProps> = (props) => {
  const location = useLocation();

  const isDiagram = React.useMemo(() => matchPath(location.pathname, { path: DIAGRAM_ROUTES }), [location.pathname]);

  return (
    <Page renderHeader={() => <LogoOnlyHeader />} renderSidebar={() => <LogoOffsetSidebar />}>
      <FullSpinner isAbs {...props} backgroundColor={isDiagram ? CANVAS_COLOR : props.backgroundColor ?? '#f9f9f9'} />
    </Page>
  );
};

export default ProjectLoader;
