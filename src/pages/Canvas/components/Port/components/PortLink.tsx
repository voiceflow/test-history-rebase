import { ProjectLinkType } from '@voiceflow/api-sdk';
import React from 'react';

import * as Skill from '@/ducks/skill';
import { connect } from '@/hocs';
import { useDidUpdateEffect, useToggle } from '@/hooks';
import { STROKE_DEFAULT_COLOR } from '@/pages/Canvas/components/Link';
import { EngineContext, PortEntityContext } from '@/pages/Canvas/contexts';
import { ConnectedProps, PathPoints } from '@/types';

import { LINK_WIDTH } from '../constants';
import LinkPath from './PortLinkPath';
import LinkSvg from './PortLinkSvg';

export type PortLinkProps = {
  linkID?: string;
  isHighlighted: boolean;
};

const PortLink: React.FC<PortLinkProps & ConnectedPortProps> = ({ linkID, isStraightLinks, isHighlighted }) => {
  const ref = React.useRef<SVGSVGElement>(null);
  const engine = React.useContext(EngineContext)!;
  const portEntity = React.useContext(PortEntityContext)!;
  const { link } = portEntity.useState((e) => ({ link: e.resolveLink() }));

  const [reversed, toggleReversed] = useToggle(false);

  const straight = link?.data?.type ? link.data.type === ProjectLinkType.STRAIGHT : isStraightLinks;

  const onReverseUpdate = React.useCallback((points: PathPoints | null) => {
    toggleReversed(points?.[0].reversed ?? false);
  }, []);

  const api = React.useMemo(() => ({ updatePosition: onReverseUpdate }), []);

  useDidUpdateEffect(() => {
    const points = link?.data?.points || null;

    onReverseUpdate(points);
  }, [straight, link?.data?.points]);

  React.useEffect(() => {
    const id = linkID || engine.linkCreation.sourcePortID;

    if (id) {
      engine.registerPortLinkInstance(id, api);
    }

    return () => {
      if (id) {
        engine.expirePortLinkInstance(id);
      }
    };
  }, []);

  return (
    <LinkSvg ref={ref} reversed={reversed} shapeRendering="geometricPrecision">
      <LinkPath strokeColor={link?.data?.color ?? STROKE_DEFAULT_COLOR} isHighlighted={isHighlighted} d={`M 0 4 L ${LINK_WIDTH} 4`} />
    </LinkSvg>
  );
};

const mapStateToProps = {
  isStraightLinks: Skill.activeProjectStraightLinkSelector,
};

type ConnectedPortProps = ConnectedProps<typeof mapStateToProps, {}>;

export default connect(mapStateToProps)(PortLink as any) as React.FC<PortLinkProps>;
