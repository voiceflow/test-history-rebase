import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { FeatureFlag } from '@/config/features';
import { Path } from '@/config/routes';
import { useFeature } from '@/hooks';

import { CanvasIconMenu, ConversationsSidebar, IntegrationsSidebar, PrototypeIconMenu, SettingsSidebar, TestVariablesSidebar } from './components';

const ProjectSidebar: React.FC = () => {
  const { isEnabled: hasVariableStates } = useFeature(FeatureFlag.VARIABLE_STATES);

  return (
    <Switch>
      <Route
        path={[Path.PROJECT_CANVAS, Path.CANVAS_COMMENTING, Path.CANVAS_COMMENTING_THREAD, Path.CANVAS_MODEL, Path.CANVAS_MODEL_ENTITY]}
        component={CanvasIconMenu}
      />

      <Route path={Path.PROJECT_PROTOTYPE} component={hasVariableStates ? TestVariablesSidebar : PrototypeIconMenu} />

      <Route path={Path.PROJECT_PUBLISH} component={IntegrationsSidebar} />

      <Route path={Path.PROJECT_SETTINGS} component={SettingsSidebar} />

      <Route path={Path.CONVERSATIONS} component={ConversationsSidebar} />
    </Switch>
  );
};

export default ProjectSidebar;
