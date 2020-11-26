import React from 'react';

// import { activePathLinkIDsSelector } from '@/ducks/prototype';
// import { compose, connect } from '@/hocs';
// import { useDidUpdateEffect } from '@/hooks';
import { EngineContext, LinkEntityContext, PlatformContext } from '@/pages/Canvas/contexts';
import { useEditingMode } from '@/pages/Skill/hooks';
import { ClassName } from '@/styles/constants';

// import { ConnectedProps } from '@/types';
import { Group, HeadMarker, Overlay, Path, RemoveButton, Styles } from './components';
import { useLinkHandlers, useLinkInstance } from './hooks';
import { buildHeadMarker } from './utils';

export * from './constants';
export * from './components';
export * from './utils';

// const NODE_CENTER_WAIT_TIME = 400;

// const Link: React.FC<ConnectedLinkStyleProps> = ({ activePathLinkIDs }) => {
const Link: React.FC = () => {
  const linkEntity = React.useContext(LinkEntityContext)!;
  const isEditingMode = useEditingMode();
  const engine = React.useContext(EngineContext)!;
  const platform = React.useContext(PlatformContext)!;
  const instance = useLinkInstance();
  const { isSupported, isHighlighted } = linkEntity.useState((e) => ({
    isSupported: e.isSupported,
    isHighlighted: e.isHighlighted || e.isPrototypeHighlighted,
  }));
  const { onMouseEnter, onMouseLeave, onRemove } = useLinkHandlers();

  linkEntity.useInstance(instance);
  linkEntity.useLifecycle();

  // useDidUpdateEffect(() => {
  //   setTimeout(() => {
  //     engine.link.redrawLinked(linkEntity.linkID);
  //   }, NODE_CENTER_WAIT_TIME);
  // }, [activePathLinkIDs]);

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
        {isEditingMode && <RemoveButton x={centerX} y={centerY} isHovering={isHighlighted} onMouseLeave={onMouseLeave} onClick={onRemove} />}
      </Group>
    </>
  );
};

// const mapStateToProps = {
//   activePathLinkIDs: activePathLinkIDsSelector,
// };

// type ConnectedLinkStyleProps = ConnectedProps<typeof mapStateToProps>;

// export default compose(React.memo, connect(mapStateToProps))(Link);
export default React.memo(Link);
