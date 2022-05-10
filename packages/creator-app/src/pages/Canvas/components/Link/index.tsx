import { Portal, swallowEvent, useDidUpdateEffect } from '@voiceflow/ui';
import React from 'react';

import { useRAF } from '@/hooks';
import { LinkEntityContext } from '@/pages/Canvas/contexts';
import { useEditingMode } from '@/pages/Project/hooks';
import { ClassName } from '@/styles/constants';

import { Caption, HeadMarker, Overlay, Path, Settings, Styles } from './components';
import { useLinkHandlers, useLinkInstance } from './hooks';
import { buildHeadMarker } from './utils';

export * from './components';
export * from './constants';
export type { LinkedRects } from './utils';
export * from './utils';

const Link: React.FC = () => {
  const linkEntity = React.useContext(LinkEntityContext)!;
  const isEditingMode = useEditingMode();

  const [scheduler] = useRAF();

  const { linkData, isSupported, isHighlighted } = linkEntity.useState((entity) => ({
    linkData: entity.resolve().data ?? null,
    isSupported: entity.isSupported,
    isHighlighted: entity.isHighlighted || entity.isPrototypeHighlighted,
  }));

  const instance = useLinkInstance();

  const {
    onClick,
    isActive,
    onRemove,
    onMouseMove,
    onMouseDown,
    onMouseEnter,
    onChangeType,
    onMouseLeave,
    onChangeColor,
    onChangeCaption,
    isCaptionEditing,
    onToggleCaptionEditing,
  } = useLinkHandlers(instance);

  linkEntity.useInstance(instance);
  linkEntity.useLifecycle();

  useDidUpdateEffect(() => {
    if (!isActive && isCaptionEditing) {
      scheduler(() => onToggleCaptionEditing(false));
    }
  }, [isActive]);

  if (!isSupported) return null;

  const path = instance.getPath();

  if (!path) return null;

  return (
    <>
      <Styles />

      <g className={ClassName.CANVAS_LINK} ref={instance.containerRef}>
        {isEditingMode && (
          <Overlay
            d={path}
            id={linkEntity.linkID}
            ref={instance.hiddenPathRef}
            onClick={onClick}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onContextMenu={swallowEvent(onClick)}
            isEditingMode={isEditingMode}
          />
        )}

        <Path d={path} ref={instance.pathRef} markerEnd={buildHeadMarker(linkEntity.linkID)} strokeColor={instance.getLinkColor()} />

        {(isCaptionEditing || !!linkData?.caption) && (
          <Caption
            color={instance.getLinkColor()}
            linkID={linkEntity.linkID}
            onChange={onChangeCaption}
            instance={instance}
            disabled={!isEditingMode}
            isEditing={isCaptionEditing}
            isLineActive={isActive}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            isHighlighted={isHighlighted}
            onToggleActive={onClick}
            onToggleEditing={onToggleCaptionEditing}
          />
        )}

        <HeadMarker
          id={linkEntity.linkID}
          ref={instance.markerRef}
          color={instance.getLinkColor()}
          isHighlighted={isHighlighted}
          {...instance.getMarkerAttrs()}
        />

        {isEditingMode && isActive && (
          <Portal>
            <Settings
              instance={instance}
              onRemove={onRemove}
              onToggleText={onToggleCaptionEditing}
              onChangeType={onChangeType}
              onChangeColor={onChangeColor}
              isTextActive={isCaptionEditing}
            />
          </Portal>
        )}
      </g>
    </>
  );
};

export default React.memo(Link);
