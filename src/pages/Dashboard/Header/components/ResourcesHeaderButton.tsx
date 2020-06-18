import React from 'react';

import IconButton, { IconButtonVariant } from '@/components/IconButton';
import Select from '@/components/Select';
import SvgIcon, { Icon } from '@/components/SvgIcon';
import { ModalType } from '@/constants';
import * as Tracking from '@/ducks/tracking';
import { useModals } from '@/hooks';
import { OptionLabel } from '@/pages/Canvas/components/CanvasControls/components/ResourcesDropdown/components';
import { STATIC_RESOURCES, StaticResource } from '@/pages/Canvas/components/CanvasControls/constants';

const SelectComponent: React.FC<any> = Select;

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
  const shortcutModal = useModals(ModalType.SHORTCUTS);
  const dropdownOptions = hasShortcuts
    ? [
        ...STATIC_RESOURCES,
        ({
          icon: 'shortcuts',
          label: 'Shortcuts',
          onClick: shortcutModal.toggle,
          resourceName: Tracking.CanvasControlHelpMenuResource.SHORTCUTS,
        } as Option) as StaticResource,
      ]
    : STATIC_RESOURCES;

  return (
    <SelectComponent
      options={dropdownOptions}
      minWidth={false}
      maxHeight={225}
      placement="bottom-end"
      onSelect={(option: Option) => {
        if (option.link) {
          window.open(option.link, '_blank', 'toolbar=0,location=0,menubar=0');
        } else {
          option.onClick?.();
        }
      }}
      autoWidth={false}
      getOptionKey={(option: Option) => option?.icon}
      getOptionLabel={(option: Option) => option?.label}
      triggerRenderer={({ isOpen }: { isOpen: boolean }) => (
        <IconButton variant={IconButtonVariant.OUTLINE} icon="information" active={isOpen} large iconProps={{ width: 16, height: 15 }} />
      )}
      renderOptionLabel={(option: Option) => (
        <>
          <SvgIcon icon={option.icon} size={16} color="#6e849a" />
          <OptionLabel>{option.label}</OptionLabel>
        </>
      )}
    />
  );
};

export default ResourcesHeaderButton;
