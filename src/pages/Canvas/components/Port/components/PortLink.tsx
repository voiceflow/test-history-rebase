import React from 'react';

import { FeatureFlag } from '@/config/features';
import { BlockType } from '@/constants';
import * as Skill from '@/ducks/skill';
import { connect } from '@/hocs';
import { useDidUpdateEffect, useFeature, useToggle } from '@/hooks';
import { isPortLinkReversed } from '@/pages/Canvas/components/Link';
import { EngineContext } from '@/pages/Canvas/contexts';
import { ConnectedProps, Pair, Point } from '@/types';

import { LINK_WIDTH } from '../constants';
import LinkPath from './PortLinkPath';
import LinkSvg from './PortLinkSvg';

export type PortProps = {
  linkID?: string;
  isHighlighted: boolean;
};

const PortLink: React.FC<PortProps & ConnectedPortProps> = ({ linkID, isStraightLinks, isHighlighted }) => {
  const ref = React.useRef<SVGSVGElement>(null);
  const [reversed, toggleReversed] = useToggle(false);
  const engine = React.useContext(EngineContext)!;
  const straightLines = useFeature(FeatureFlag.STRAIGHT_LINES);
  const targetNodeIsBlock = React.useMemo(() => {
    if (linkID) {
      const link = engine.getLinkByID(linkID);
      const node = engine.getNodeByID(link.target.nodeID);

      return node.type === BlockType.COMBINED;
    }

    return false;
  }, []);

  const cache = React.useRef({ isStraightLinks });

  const onReverseUpdate = React.useCallback((points: Pair<Point> | null) => {
    let targetIsBlock = targetNodeIsBlock;

    if (!linkID && engine.linkCreation.sourcePortID && engine.linkCreation.activeTargetPortID) {
      const port = engine.getPortByID(engine.linkCreation.activeTargetPortID);
      const node = engine.getNodeByID(port.nodeID);

      targetIsBlock = node.type === BlockType.COMBINED;
    }

    toggleReversed(isPortLinkReversed(points, { straight: straightLines.isEnabled && cache.current.isStraightLinks, targetIsBlock }));
  }, []);

  const api = React.useMemo(() => ({ updatePosition: onReverseUpdate }), []);

  useDidUpdateEffect(() => {
    onReverseUpdate((linkID && engine.link.api(linkID)?.getPoints()) || null);
  }, [isStraightLinks]);

  React.useEffect(() => {
    const id = linkID || engine.linkCreation.sourcePortID;

    if (id) {
      engine.registerPortLinkInstance(id, api);
    }

    onReverseUpdate((linkID && engine.link.api(linkID)?.getPoints()) || null);

    return () => {
      if (id) {
        engine.expirePortLinkInstance(id);
      }
    };
  }, []);

  return (
    <LinkSvg ref={ref} reversed={reversed}>
      <LinkPath isHighlighted={isHighlighted} d={`M 0 4 L ${LINK_WIDTH} 4`} />
    </LinkSvg>
  );
};

const mapStateToProps = {
  isStraightLinks: Skill.activeProjectStraightLinkSelector,
};

type ConnectedPortProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps)(PortLink) as React.FC<PortProps>;
