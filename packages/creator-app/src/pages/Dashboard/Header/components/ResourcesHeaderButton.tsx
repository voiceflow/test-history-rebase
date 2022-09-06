import { IconButton, IconButtonVariant, Select, SvgIcon, SvgIconTypes } from '@voiceflow/ui';
import React from 'react';
import { Tooltip } from 'react-tippy';

import * as Tracking from '@/ducks/tracking';
import { useTrackingEvents } from '@/hooks';
import * as ModalsV2 from '@/ModalsV2';
import { VoidInternalProps } from '@/ModalsV2/types';
import { STATIC_RESOURCES, StaticResource } from '@/pages/Canvas/components/CanvasControls/constants';
import { useDashboardMode } from '@/pages/Project/hooks';
import { ClassName } from '@/styles/constants';
import { openURLInANewTab } from '@/utils/window';

import OptionLabel from './ResourceOptionLabel';

interface Option {
  link?: string;
  icon: SvgIconTypes.Icon;
  label: string;
  onClick?: (props?: (void & VoidInternalProps) | undefined) => Promise<unknown>;
  resourceName?: Tracking.CanvasControlHelpMenuResource;
}

export type Resource = Omit<StaticResource, 'link'> & {
  link?: string;
  onClick?: () => void;
};

const ResourcesHeaderButton = ({ hasShortcuts = false }) => {
  const [trackEvents] = useTrackingEvents();
  const shortcutModal = ModalsV2.useModal(ModalsV2.Canvas.Shortcuts);
  const isDashboardMode = useDashboardMode();
  const dropdownOptions: Option[] = hasShortcuts
    ? [
        ...STATIC_RESOURCES,
        {
          icon: 'forward',
          label: 'Shortcuts',
          onClick: shortcutModal.openVoid,
          resourceName: Tracking.CanvasControlHelpMenuResource.SHORTCUTS,
        },
      ]
    : STATIC_RESOURCES;

  const onSelect = (option: Option) => {
    if (option.link) {
      openURLInANewTab(option.link);
    } else {
      option.onClick?.();
    }

    if (!isDashboardMode) {
      trackEvents.trackCanvasControlHelpMenuResource({ resource: option.resourceName! });
    }
  };

  return (
    <Tooltip title="Learn" position="bottom">
      <Select
        className={`${ClassName.MENU}--resources`}
        options={dropdownOptions}
        minWidth={false}
        maxHeight={225}
        placement="bottom-end"
        onSelect={onSelect}
        autoWidth={false}
        getOptionKey={(option) => option?.icon}
        getOptionLabel={(option) => option?.label}
        renderTrigger={({ isOpen }) => (
          <IconButton variant={IconButtonVariant.OUTLINE} icon="information" active={isOpen} large iconProps={{ width: 16, height: 15 }} />
        )}
        renderOptionLabel={(option) => (
          <>
            <SvgIcon icon={option.icon} size={16} color="#6e849a" />
            <OptionLabel>{option.label}</OptionLabel>
          </>
        )}
      />
    </Tooltip>
  );
};

export default ResourcesHeaderButton;
