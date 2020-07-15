import React from 'react';

import IconButton from '@/components/IconButton';
import Select from '@/components/Select';
import SvgIcon from '@/components/SvgIcon';
import { ModalType } from '@/constants';
import * as Tracking from '@/ducks/tracking';
import { useEnableDisable, useHotKeys, useModals, useTrackingEvents } from '@/hooks';
import { Hotkey } from '@/keymap';
import { Identifier } from '@/styles/constants';

import { STATIC_RESOURCES, StaticResource } from '../../constants';
import { OptionLabel } from './components';

export type Resource = Omit<StaticResource, 'link'> & {
  link?: string;
  onClick?: () => void;
};

const ResourcesDropdown: React.FC = () => {
  const [trackEvents] = useTrackingEvents();
  const { open: openShortcutModal } = useModals(ModalType.SHORTCUTS);
  const [isOpen, onOpen, onClose] = useEnableDisable(false);

  const resources: Resource[] = React.useMemo(
    () => [
      ...STATIC_RESOURCES,
      {
        icon: 'shortcuts',
        label: 'Shortcuts',
        onClick: openShortcutModal,
        resourceName: Tracking.CanvasControlHelpMenuResource.SHORTCUTS,
      } as Resource,
    ],
    [openShortcutModal]
  );

  const onSelect = React.useCallback(
    (option: Resource) => {
      trackEvents.trackCanvasControlHelpMenuResource({ resource: option.resourceName });

      if (option.link) {
        window.open(option.link, '_blank', 'toolbar=0,location=0,menubar=0');
      } else {
        option.onClick?.();
      }
    },
    [trackEvents]
  );

  useHotKeys(Hotkey.OPEN_RESOURCES_DROPDOWN, onOpen, { preventDefault: true });

  return (
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    <Select
      id={Identifier.RESOURCE_MENU}
      open={isOpen}
      onOpen={onOpen}
      onClose={onClose}
      options={resources}
      onSelect={onSelect}
      minWidth={false}
      maxHeight={225}
      autoWidth={false}
      getOptionKey={(option: Resource) => option?.icon}
      getOptionLabel={(option: Resource) => option?.label}
      triggerRenderer={() => <IconButton icon="information" active={isOpen} />}
      renderOptionLabel={(option: Resource) => (
        <>
          <SvgIcon icon={option.icon} size={16} color="#6e849a" />
          <OptionLabel>{option.label}</OptionLabel>
        </>
      )}
    />
  );
};

export default ResourcesDropdown;
