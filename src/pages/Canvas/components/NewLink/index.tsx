import React from 'react';

import * as Skill from '@/ducks/skill';
import { compose, connect } from '@/hocs';
import { useRegistration, useTeardown } from '@/hooks';
import {
  buildHeadMarker,
  buildPath,
  getMarkerAttrs,
  getPathPoints,
  getVirtualPoints,
  HeadMarker,
  Path,
  STROKE_DEFAULT_COLOR,
} from '@/pages/Canvas/components/Link';
import { EngineContext } from '@/pages/Canvas/contexts';
import { ConnectedProps } from '@/types';

import { Container } from './components';
import { useNewLinkAPI } from './hooks';

const NEW_LINK_ID = 'newLink';
const HEAD_MARKER = buildHeadMarker(NEW_LINK_ID);

const NewLink: React.FC<ConnectedNewLink> = ({ straight }) => {
  const engine = React.useContext(EngineContext)!;
  const api = useNewLinkAPI<SVGPathElement>();
  const points = api.getSourceTargetPoints();

  useRegistration(() => engine.linkCreation.register('newLink', api), [api]);
  useTeardown(() => api.hide(), [api.hide]);

  const pathPoints = React.useMemo(() => getPathPoints(getVirtualPoints(points), { straight }), [points, straight]);
  const path = React.useMemo(() => buildPath(pathPoints, straight), [pathPoints]);
  const markerAttrs = React.useMemo(() => getMarkerAttrs(pathPoints, straight), [pathPoints]);

  if (!points || !api.isVisible) return null;

  return (
    <Container>
      <HeadMarker id={NEW_LINK_ID} ref={api.markerRef} isHighlighted {...markerAttrs} />

      <Path d={path} strokeColor={STROKE_DEFAULT_COLOR} markerEnd={HEAD_MARKER} ref={api.ref} isHighlighted />
    </Container>
  );
};

const mapStateToProps = {
  straight: Skill.activeProjectStraightLinkSelector,
};

type ConnectedNewLink = ConnectedProps<typeof mapStateToProps>;

export default compose(React.memo, connect(mapStateToProps))(NewLink) as React.FC;
