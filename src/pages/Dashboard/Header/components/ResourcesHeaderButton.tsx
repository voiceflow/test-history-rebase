import React from 'react';
import { Tooltip } from 'react-tippy';

import IconButton, { IconButtonVariant } from '@/components/IconButton';
import Select from '@/components/Select';
import SvgIcon, { Icon } from '@/components/SvgIcon';
import { ModalType } from '@/constants';
import * as Tracking from '@/ducks/tracking';
import { useModals, useTrackingEvents } from '@/hooks';
import { STATIC_RESOURCES, StaticResource } from '@/pages/Canvas/components/CanvasControls/constants';
import { useDashboardMode } from '@/pages/Skill/hooks';
import { ClassName } from '@/styles/constants';

import OptionLabel from './ResourceOptionLabel';

type Option = {
  link?: string;
  icon: Icon;
  label: string;
  onClick?: () => void;
  resourceName?: Tracking.CanvasControlHelpMenuResource;
};

export type Resource = Omit<StaticResource, 'link'> & {
  link?: string;
  onClick?: () => void;
};

const ResourcesHeaderButton = ({ hasShortcuts = false }) => {
  const [trackEvents] = useTrackingEvents();
  const shortcutModal = useModals(ModalType.SHORTCUTS);
  const isDashboardMode = useDashboardMode();
  const dropdownOptions: Option[] = hasShortcuts
    ? [
        ...STATIC_RESOURCES,
        {
          icon: 'shortcuts',
          label: 'Shortcuts',
          onClick: shortcutModal.toggle,
          resourceName: Tracking.CanvasControlHelpMenuResource.SHORTCUTS,
        },
      ]
    : STATIC_RESOURCES;

  return (
    <Tooltip title="Learn" position="bottom">
      <Select
        className={`${ClassName.MENU}--resources`}
        options={dropdownOptions}
        minWidth={false}
        maxHeight={225}
        placement="bottom-end"
        onSelect={(option) => {
          if (option.link) {
            window.open(option.link, '_blank', 'toolbar=0,location=0,menubar=0');
          } else {
            option.onClick?.();
          }
          if (!isDashboardMode) {
            trackEvents.trackCanvasControlHelpMenuResource({ resource: option.resourceName! });
          }
        }}
        autoWidth={false}
        getOptionKey={(option) => option?.icon}
        getOptionLabel={(option) => option?.label}
        triggerRenderer={({ isOpen }) => (
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
