import React from 'react';

import { EngineContext, LinkEntityContext, PlatformContext } from '@/pages/Canvas/contexts';
import { EditPermissionContext } from '@/pages/Skill/contexts';
import { ClassName } from '@/styles/constants';

import { Group, HeadMarker, Overlay, Path, RemoveButton, Styles } from './components';
import { useLinkHandlers, useLinkInstance } from './hooks';
import { buildHeadMarker } from './utils';

export * from './constants';
export * from './components';
export * from './utils';

const Link = () => {
  const linkEntity = React.useContext(LinkEntityContext)!;
  const editPermission = React.useContext(EditPermissionContext)!;
  const engine = React.useContext(EngineContext)!;
  const platform = React.useContext(PlatformContext)!;
  const instance = useLinkInstance();
  const { isSupported, isHighlighted } = linkEntity.useState((e) => ({
    isSupported: e.isSupported,
    isHighlighted: e.isHighlighted,
  }));
  const { onMouseEnter, onMouseLeave, onRemove } = useLinkHandlers();

  linkEntity.useInstance(instance);
  linkEntity.useLifecycle();

  if (!isSupported) return null;

  const path = instance.getPath();
  const center = instance.getCenter();

  if (!path || !center) return null;

  const [centerX, centerY] = center;
  const isVisible = engine.link.isVisible(linkEntity.linkID, platform);

  return (
    <>
      <Styles />
      <Group className={ClassName.CANVAS_LINK} isVisible={isVisible} ref={instance.containerRef}>
        <HeadMarker id={linkEntity.linkID} isHighlighted={isHighlighted} />
        {/* eslint-disable-next-line jsx-a11y/mouse-events-have-key-events */}
        <Overlay d={path} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} ref={instance.hiddenPathRef} />
        <Path d={path} markerEnd={buildHeadMarker(linkEntity.linkID)} ref={instance.pathRef} />
        {/* eslint-disable-next-line jsx-a11y/mouse-events-have-key-events */}
        {editPermission.canEdit && <RemoveButton x={centerX} y={centerY} isHovering={isHighlighted} onMouseLeave={onMouseLeave} onClick={onRemove} />}
      </Group>
    </>
  );
};

export default React.memo(Link);
