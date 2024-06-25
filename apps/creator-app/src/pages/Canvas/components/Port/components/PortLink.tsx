import { BaseModels } from '@voiceflow/base-types';
import type { Nullish } from '@voiceflow/common';
import { useDidUpdateEffect, useToggle } from '@voiceflow/ui';
import React from 'react';

import { STROKE_DEFAULT_COLOR } from '@/pages/Canvas/components/Link';
import { EngineContext, IsStraightLinksContext, PortEntityContext } from '@/pages/Canvas/contexts';
import type { PathPoints } from '@/types';

import { NODE_LINK_WIDTH } from '../constants';
import LinkPath from './PortLinkPath';
import LinkSvg from './PortLinkSvg';

export interface PortLinkProps {
  linkID?: Nullish<string>;
  isHighlighted: boolean;
  isNew?: boolean;
}

const PortLink: React.FC<PortLinkProps> = ({ linkID, isHighlighted, isNew }) => {
  const engine = React.useContext(EngineContext)!;
  const portEntity = React.useContext(PortEntityContext)!;
  const isStraightLinks = React.useContext(IsStraightLinksContext)!;

  const { link } = portEntity.useState((e) => ({ link: e.resolveLink() }));

  const [reversed, toggleReversed] = useToggle(link?.data?.points?.[0]?.reversed ?? false);

  const straight = link?.data?.type ? link.data.type === BaseModels.Project.LinkType.STRAIGHT : isStraightLinks;

  const onReverseUpdate = React.useCallback(
    (points: PathPoints | null) => toggleReversed(points?.[0].reversed ?? false),
    []
  );

  const api = React.useMemo(() => ({ updatePosition: onReverseUpdate }), []);

  useDidUpdateEffect(() => {
    onReverseUpdate(straight ? link?.data?.points ?? null : null);
  }, [straight, link?.data?.points]);

  React.useEffect(() => {
    const id = linkID ?? engine.linkCreation.sourcePortID;

    if (!id) return undefined;

    engine.registerPortLinkInstance(id, api);

    return () => {
      engine.expirePortLinkInstance(id);
    };
  }, []);

  return (
    <LinkSvg reversed={reversed} shapeRendering="geometricPrecision">
      <LinkPath
        strokeDasharray={isNew ? '6,6' : undefined}
        strokeColor={link?.data?.color ?? STROKE_DEFAULT_COLOR}
        isHighlighted={isHighlighted}
        d={`M 0 4 L ${NODE_LINK_WIDTH} 4`}
      />
    </LinkSvg>
  );
};

export default PortLink;
