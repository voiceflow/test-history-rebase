import React from 'react';

import IconButton from '@/components/IconButton';
import Select from '@/components/Select';
import SvgIcon from '@/components/SvgIcon';
import * as Tracking from '@/ducks/tracking';
import { useEnableDisable, useHotKeys, useTrackingEvents } from '@/hooks';
import { Hotkey } from '@/keymap';
import { ShortcutModalContext } from '@/pages/Skill/contexts';

import { STATIC_RESOURCES, StaticResource } from '../../constants';
import { OptionLabel } from './components';

type Resource = Omit<StaticResource, 'link'> & {
  link?: string;
  onClick?: () => void;
};

const ResourcesDropdown: React.FC = () => {
  const [trackEvents] = useTrackingEvents();
  const [isOpen, onOpen, onClose] = useEnableDisable(false);
  const shortcutModal = React.useContext(ShortcutModalContext)!;

  const resources: Resource[] = React.useMemo(
    () => [
      ...STATIC_RESOURCES,
      {
        icon: 'shortcuts',
        label: 'Shortcuts',
        onClick: shortcutModal.toggle,
        resourceName: Tracking.CanvasControlHelpMenuResource.SHORTCUTS,
      } as Resource,
    ],
    [shortcutModal.toggle]
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
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    <Select
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
