import React from 'react';

import { FeatureFlag } from '@/config/features';
import * as Skill from '@/ducks/skill';
import { compose, connect } from '@/hocs';
import { useFeature, useRegistration, useTeardown } from '@/hooks';
import { buildHeadMarker, buildPath, getMarkerAttrs, getVirtualPoints, HeadMarker, Path } from '@/pages/Canvas/components/Link';
import { EngineContext } from '@/pages/Canvas/contexts';
import { ConnectedProps } from '@/types';

import { Container } from './components';
import { useNewLinkAPI } from './hooks';

const NEW_LINK_ID = 'newLink';
const HEAD_MARKER = buildHeadMarker(NEW_LINK_ID);

const NewLink: React.FC<ConnectedNewLink> = ({ isStraightLinks }) => {
  const engine = React.useContext(EngineContext)!;
  const api = useNewLinkAPI<SVGPathElement>();
  const straightLines = useFeature(FeatureFlag.STRAIGHT_LINES);
  const points = api.getPoints();

  useRegistration(() => engine.linkCreation.register('newLink', api), [api]);
  useTeardown(() => api.hide(), [api.hide]);

  if (!points || !api.isVisible) return null;

  const virtualPoints = getVirtualPoints(points);

  const path = buildPath(virtualPoints, { straight: straightLines.isEnabled && isStraightLinks, unconnected: true });
  const markerAttrs = getMarkerAttrs(virtualPoints, { straight: straightLines.isEnabled && isStraightLinks, unconnected: true });

  return (
    <Container>
      <HeadMarker id={NEW_LINK_ID} ref={api.markerRef} isHighlighted {...markerAttrs} />
      <Path d={path} markerEnd={HEAD_MARKER} ref={api.ref} isHighlighted />
    </Container>
  );
};

const mapStateToProps = {
  isStraightLinks: Skill.activeProjectStraightLinkSelector,
};

type ConnectedNewLink = ConnectedProps<typeof mapStateToProps>;

export default compose(React.memo, connect(mapStateToProps))(NewLink) as React.FC;
