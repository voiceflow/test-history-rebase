import type { BaseModels } from '@voiceflow/base-types';
import { stopPropagation, SvgIcon, useCache, useToggle } from '@voiceflow/ui';
import React from 'react';

import { useHotkey } from '@/hooks';
import { Hotkey } from '@/keymap';
import { CanvasSidebarContext, EngineContext, IsCanvasOnlyContext, LinkEntityContext } from '@/pages/Canvas/contexts';
import { useCanvasPan, useCanvasZoom } from '@/pages/Canvas/hooks/canvas';
import { ClassName } from '@/styles/constants';

import type { InternalLinkInstance } from '../types';
import Button from './SettingsButton';
import SettingsColor from './SettingsColor';
import Container from './SettingsContainer';
import Content from './SettingsContent';
import Divider from './SettingsDivider';
import SettingsType from './SettingsType';

const OFFSET = 20;
const NAV_WIDTH = 65;
const HEADER_HEIGHT = 64;
const SIDEBAR_WIDTH = 250;
const SETTINGS_WIDTH = 195;
const SETTINGS_HEIGHT_WITH_OFFSET = 48;

interface SettingsProps {
  instance: InternalLinkInstance;
  onRemove: () => void;
  isTextActive: boolean;
  onToggleText: (nextValue?: unknown) => void;
  onChangeType: (type: BaseModels.Project.LinkType) => void;
  onChangeColor: (color: string) => void;
}

const Settings: React.FC<SettingsProps> = ({
  instance,
  onRemove,
  isTextActive,
  onToggleText,
  onChangeType,
  onChangeColor,
}) => {
  const engine = React.useContext(EngineContext)!;
  const linkEntity = React.useContext(LinkEntityContext)!;
  const isCanvasOnly = React.useContext(IsCanvasOnlyContext)!;
  const canvasSidebar = React.useContext(CanvasSidebarContext);

  const containerRef = React.useRef<HTMLDivElement>(null);

  const [colorOpened, toggleColorOpened] = useToggle(false);
  const [linkTypeOpened, toggleLinkTypeOpened] = useToggle(false);

  const { linkData } = linkEntity.useState((e) => ({ linkData: e.resolve().data }));

  const cache = useCache({ isCanvasOnly, canvasSidebar }, { isCanvasOnly, canvasSidebar });

  // eslint-disable-next-line sonarjs/cognitive-complexity
  const setPosition = React.useCallback(() => {
    if (!engine.canvas) return;

    const pathRect = instance.hiddenPathRef.current?.getBoundingClientRect();
    const canvasRect = engine.canvas.getRect();
    const captionRect = instance.getCaptionRect();
    const sidebarWidth =
      (cache.current.isCanvasOnly || cache.current.canvasSidebar?.visible ? 0 : SIDEBAR_WIDTH) + NAV_WIDTH;

    const zoom = engine.canvas.getZoom() ?? 1;
    const zoomedOffset = OFFSET * zoom;

    let x = 0;
    let y = 0;

    if (!pathRect) {
      x = canvasRect.width / 2 - SETTINGS_WIDTH / 2;
      y = canvasRect.top + zoomedOffset;
    } else {
      y = pathRect.top - SETTINGS_HEIGHT_WITH_OFFSET - zoomedOffset - ((captionRect.current.height ?? 0) * zoom) / 2;
      x = pathRect.left + pathRect.width / 2 - SETTINGS_WIDTH / 2;

      if (
        y - zoomedOffset < canvasRect.top &&
        canvasRect.bottom > pathRect.bottom + SETTINGS_HEIGHT_WITH_OFFSET + zoomedOffset
      ) {
        y = Math.max(pathRect.bottom + zoomedOffset, canvasRect.top + zoomedOffset);
      } else if (y + SETTINGS_HEIGHT_WITH_OFFSET + OFFSET > canvasRect.bottom) {
        y = canvasRect.bottom - SETTINGS_HEIGHT_WITH_OFFSET - zoomedOffset;
      } else if (y < HEADER_HEIGHT + zoomedOffset) {
        y = HEADER_HEIGHT + zoomedOffset;
      }

      if (pathRect.left < sidebarWidth && pathRect.right > canvasRect.right) {
        x = canvasRect.width / 2 - SETTINGS_WIDTH / 2;
      } else if (pathRect.left < sidebarWidth) {
        const overflowWidth = sidebarWidth - pathRect.left;

        x = pathRect.left + overflowWidth + (pathRect.width - overflowWidth) / 2 - SETTINGS_WIDTH / 2;

        if (x - OFFSET < sidebarWidth) {
          x = sidebarWidth + OFFSET;
        }
      } else if (pathRect.right > canvasRect.right) {
        const overflowWidth = pathRect.right - canvasRect.right;

        x = pathRect.right - overflowWidth - (pathRect.width - overflowWidth) / 2 - SETTINGS_WIDTH / 2;

        if (x + SETTINGS_WIDTH + OFFSET > canvasRect.right) {
          x = canvasRect.right - SETTINGS_WIDTH - OFFSET;
        }
      }
    }

    if (containerRef.current) {
      containerRef.current.style.transform = `translate(${x}px, ${y}px)`;
    }
  }, [instance]);

  const onChangeLinkType = (type: BaseModels.Project.LinkType) => {
    onChangeType(type);
    toggleLinkTypeOpened(false);
  };

  const onChangeLinkColor = (color: string) => onChangeColor(color);

  const onToggleColor = () => {
    toggleColorOpened();
    onToggleText(false);
    toggleLinkTypeOpened(false);
  };

  const onToggleLinkType = () => {
    onToggleText(false);
    toggleColorOpened(false);
    toggleLinkTypeOpened();
  };

  useHotkey(Hotkey.DELETE, onRemove);
  useCanvasPan(setPosition, [setPosition]);
  useCanvasZoom(setPosition, [setPosition]);

  React.useImperativeHandle(instance.settingsRef, () => ({ setPosition }), [setPosition]);

  React.useLayoutEffect(() => setPosition(), [linkData?.points, isCanvasOnly, canvasSidebar]);

  const linkType = instance.getLinkType();
  const linkColor = instance.getLinkColor();

  return (
    <Container ref={containerRef} className={ClassName.LINK_SETTINGS} onClick={stopPropagation(null, true)}>
      <Content>
        <SettingsColor color={linkColor} isOpen={colorOpened} onChange={onChangeLinkColor} onToggle={onToggleColor} />

        <Divider />

        <SettingsType type={linkType} isOpen={linkTypeOpened} onChange={onChangeLinkType} onToggle={onToggleLinkType} />

        <Divider />

        <Button isActive={isTextActive} onClick={onToggleText} tooltipTitle="Line text">
          <SvgIcon icon="lineText" />
        </Button>

        <Divider />

        <Button onClick={onRemove} tooltipTitle="Delete" tooltipHotkey="Del">
          <SvgIcon icon="trash" />
        </Button>
      </Content>
    </Container>
  );
};

export default Settings;
