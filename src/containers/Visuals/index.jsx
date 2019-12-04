import React from 'react';
import { Switch } from 'react-router-dom';

import PrivateRoute from '@/Routes/PrivateRoute';
import { LockedResourceOverlay } from '@/containers/CanvasV2/components/LockedEditorOverlay';
import * as Realtime from '@/ducks/realtime';
import { styled } from '@/hocs';

import Display from './Display';
import Multimodal from './Multimodal';

const VisualsPageContainer = styled.div`
  display: flex;
  height: 100%;
  overflow-y: auto;
`;

const VisualsPageContent = styled.div`
  min-height: 100%;
  position: relative;
  flex: 1 1;
`;

function Visuals(props) {
  const {
    match: { path },
    history,
    location,
    ...ownProps
  } = props;

  return (
    <LockedResourceOverlay type={Realtime.ResourceType.DISPLAYS}>
      {({ forceUpdateKey }) => (
        <VisualsPageContainer>
          <VisualsPageContent>
            <Switch>
              <PrivateRoute {...ownProps} key={forceUpdateKey} exact path={path} component={Multimodal} />
              <PrivateRoute {...ownProps} key={forceUpdateKey} path={`${path}/:id`} component={Display} />
            </Switch>
          </VisualsPageContent>
        </VisualsPageContainer>
      )}
    </LockedResourceOverlay>
  );
}

export default Visuals;
