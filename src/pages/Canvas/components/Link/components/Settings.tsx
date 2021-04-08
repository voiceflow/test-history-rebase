import { ProjectLinkType } from '@voiceflow/api-sdk';
import React from 'react';

import SvgIcon from '@/components/SvgIcon';
import * as UI from '@/ducks/ui';
import { connect } from '@/hocs';
import { useCache, useHotKeys, useToggle } from '@/hooks';
import { Hotkey } from '@/keymap';
import { EngineContext, LinkEntityContext } from '@/pages/Canvas/contexts';
import { useCanvasPan, useCanvasZoom } from '@/pages/Canvas/hooks';
import { ConnectedProps } from '@/types';
import { stopPropagation } from '@/utils/dom';

import { InternalLinkInstance } from '../types';
import Button from './SettingsButton';
import SettingsColor from './SettingsColor';
import Container from './SettingsContainer';
import Content from './SettingsContent';
import Divider from './SettingsDivider';
import SettingsType from './SettingsType';

const OFFSET = 20;
const SIDEBAR_WIDTH = 250;
const SETTINGS_WIDTH = 195;
const SETTINGS_HEIGHT_WITH_OFFSET = 48;

type SettingsProps = {
  instance: InternalLinkInstance;
  onRemove: () => void;
  isTextActive: boolean;
  onToggleText: (nextValue?: unknown) => void;
  onChangeType: (type: ProjectLinkType) => void;
  onChangeColor: (color: string) => void;
};

const Settings: React.FC<SettingsProps & ConnectedSettingsProps> = ({
  instance,
  onRemove,
  isTextActive,
  onToggleText,
  onChangeType,
  isCanvasOnly,
  onChangeColor,
  isSidebarHidden,
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const engine = React.useContext(EngineContext)!;
  const linkEntity = React.useContext(LinkEntityContext)!;
  const [colorOpened, toggleColorOpened] = useToggle(false);
  const [linkTypeOpened, toggleLinkTypeOpened] = useToggle(false);
  const [colorPickerOpened, toggleColorPickerOpened] = useToggle(false);

  const { linkData } = linkEntity.useState((e) => ({ linkData: e.resolve().data }));

  const cache = useCache({ isCanvasOnly, isSidebarHidden }, { isCanvasOnly, isSidebarHidden });

  const setPosition = React.useCallback(() => {
    const canvasRect = cache.current.isCanvasOnly ? engine.canvas!.getRect() : engine.canvas!.getCachedRect();
    const pathRect = instance.hiddenPathRef.current?.getBoundingClientRect();
    const sidebarWidth = cache.current.isCanvasOnly || cache.current.isSidebarHidden ? 0 : SIDEBAR_WIDTH;

    let x = 0;
    let y = 0;

    if (!pathRect) {
      x = canvasRect.width / 2 - SETTINGS_WIDTH / 2;
      y = canvasRect.top + OFFSET;
    } else {
      y = pathRect.top - SETTINGS_HEIGHT_WITH_OFFSET - OFFSET;
      x = pathRect.left + pathRect.width / 2 - SETTINGS_WIDTH / 2;

      if (y - OFFSET < canvasRect.top && canvasRect.bottom > pathRect.bottom + SETTINGS_HEIGHT_WITH_OFFSET + OFFSET) {
        y = Math.max(pathRect.bottom + OFFSET, canvasRect.top + OFFSET);
      } else if (y + SETTINGS_HEIGHT_WITH_OFFSET + OFFSET > canvasRect.bottom) {
        y = canvasRect.bottom - SETTINGS_HEIGHT_WITH_OFFSET - OFFSET;
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
      containerRef.current!.style.transform = `translate(${x}px, ${y}px)`;
    }
  }, [instance]);

  const onChangeLinkType = (type: ProjectLinkType) => {
    onChangeType(type);
    toggleLinkTypeOpened(false);
  };

  const onChangeLinkColor = (color: string) => {
    onChangeColor(color);
    toggleColorOpened(false);
    toggleColorPickerOpened(false);
  };

  const onToggleColor = () => {
    toggleColorOpened();
    onToggleText(false);
    toggleLinkTypeOpened(false);
    toggleColorPickerOpened(false);
  };

  const onToggleLinkType = () => {
    onToggleText(false);
    toggleColorOpened(false);
    toggleLinkTypeOpened();
    toggleColorPickerOpened(false);
  };

  useHotKeys(Hotkey.DELETE, onRemove);
  useCanvasPan(setPosition, [setPosition]);
  useCanvasZoom(setPosition, [setPosition]);

  React.useImperativeHandle(instance.settingsRef, () => ({ setPosition }), [setPosition]);

  React.useLayoutEffect(() => setPosition(), [linkData?.points, isCanvasOnly, isSidebarHidden]);

  const linkType = instance.getLinkType();
  const linkColor = instance.getLinkColor();

  return (
    <Container ref={containerRef} onClick={stopPropagation(null, true)}>
      <Content>
        <SettingsColor
          color={linkColor}
          isOpen={colorOpened}
          onChange={onChangeLinkColor}
          onToggle={onToggleColor}
          isPickerOpen={colorPickerOpened}
          onPickerChange={onChangeColor}
          onPickerToggle={toggleColorPickerOpened}
        />

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

const mapStateToProps = {
  isCanvasOnly: UI.isCanvasOnlyShowingSelector,
  isSidebarHidden: UI.isCreatorMenuHiddenSelector,
};

type ConnectedSettingsProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps)(Settings) as React.FC<SettingsProps>;
