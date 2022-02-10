import { BaseModels } from '@voiceflow/base-types';
import { Nullish } from '@voiceflow/common';
import { useDidUpdateEffect, useToggle } from '@voiceflow/ui';
import React from 'react';

import { STROKE_DEFAULT_COLOR } from '@/pages/Canvas/components/Link';
import { EngineContext, IsStraightLinksContext, PortEntityContext } from '@/pages/Canvas/contexts';
import { PathPoints } from '@/types';

import { LINK_WIDTH } from '../constants';
import LinkPath from './PortLinkPath';
import LinkSvg from './PortLinkSvg';

export interface PortLinkProps {
  linkID?: Nullish<string>;
  isHighlighted: boolean;
}

const PortLink: React.FC<PortLinkProps> = ({ linkID, isHighlighted }) => {
  const engine = React.useContext(EngineContext)!;
  const portEntity = React.useContext(PortEntityContext)!;
  const isStraightLinks = React.useContext(IsStraightLinksContext)!;

  const ref = React.useRef<SVGSVGElement>(null);

  const { link } = portEntity.useState((e) => ({ link: e.resolveLink() }));

  const [reversed, toggleReversed] = useToggle(false);

  const straight = link?.data?.type ? link.data.type === BaseModels.Project.LinkType.STRAIGHT : isStraightLinks;

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

export default PortLink;
