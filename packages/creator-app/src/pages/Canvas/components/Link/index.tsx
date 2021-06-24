import { Portal, swallowEvent, useDidUpdateEffect } from '@voiceflow/ui';
import React from 'react';

import { FeatureFlag } from '@/config/features';
import { useFeature } from '@/hooks';
import { EngineContext, LinkEntityContext } from '@/pages/Canvas/contexts';
import { PlatformContext } from '@/pages/Skill/contexts';
import { useEditingMode } from '@/pages/Skill/hooks';
import { ClassName } from '@/styles/constants';

import { Caption, Group, HeadMarker, Overlay, Path, RemoveButton, Settings, Styles } from './components';
import { useLinkHandlers, useLinkInstance } from './hooks';
import { buildHeadMarker, getPathPointsCenter } from './utils';

export * from './components';
export * from './constants';
export * from './utils';

const Link: React.FC = () => {
  const linkEntity = React.useContext(LinkEntityContext)!;
  const isEditingMode = useEditingMode();
  const engine = React.useContext(EngineContext)!;
  const platform = React.useContext(PlatformContext)!;
  const linkCustomization = useFeature(FeatureFlag.LINK_CUSTOMIZATION);
  const { linkData, isSupported, isHighlighted, sourceTargetPoints } = linkEntity.useState((e) => ({
    linkData: e.resolve().data ?? null,
    isSupported: e.isSupported,
    isHighlighted: e.isHighlighted || e.isPrototypeHighlighted,
    sourceTargetPoints: e.getSourceTargetPoints(),
  }));

  const instance = useLinkInstance();
  const {
    isActive,
    onClick,
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

  React.useLayoutEffect(() => {
    linkEntity.portLinkInstance?.api.updatePosition(instance.getPoints().current);
  }, [linkData?.points, sourceTargetPoints]);

  useDidUpdateEffect(() => {
    if (!isActive && isCaptionEditing) {
      onToggleCaptionEditing(false);
    }
  }, [isActive]);

  if (!isSupported) return null;

  const path = instance.getPath();
  const points = instance.getPoints();

  if (!path) return null;

  const isVisible = engine.link.isVisible(linkEntity.linkID, platform);

  return (
    <>
      <Styles />

      <Group className={ClassName.CANVAS_LINK} isVisible={isVisible} ref={instance.containerRef}>
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

        {linkCustomization.isEnabled && (isCaptionEditing || !!linkData?.caption) && (
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

        {!linkCustomization.isEnabled && isEditingMode && isHighlighted && !!points.current && (
          <RemoveButton
            onClick={onRemove}
            position={getPathPointsCenter(points.current, { straight: instance.isStraight() })}
            onMouseLeave={onMouseLeave}
          />
        )}

        {linkCustomization.isEnabled && isEditingMode && isActive && (
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
      </Group>
    </>
  );
};

export default React.memo(Link);
