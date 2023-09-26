import { Header, Icon, Menu, MenuItem, Popper, PrimaryNavigation } from '@voiceflow/ui-next';
import React from 'react';

import { SearchContext } from '@/contexts/SearchContext';
import { usePopperModifiers } from '@/hooks/popper.hook';
import { useLogoButtonOptions } from '@/pages/Project/components/Header/hooks';

import { button, container, nubIcon } from './AssistantMenuHeader.css';

export const AssistantMenuHeader: React.FC = () => {
  const search = React.useContext(SearchContext);
  const logoOptions = useLogoButtonOptions({ uiToggle: true, shortcuts: true, toggleSearch: search?.toggle });

  const modifiers = usePopperModifiers([{ name: 'offset', options: { offset: [0, 0] } }]);

  return (
    <Popper
      placement="bottom-end"
      modifiers={modifiers}
      referenceElement={({ ref, isOpen, onOpen, onClose }) => (
        <Header kind="primaryNavigation" className={container}>
          <div ref={ref}>
            <PrimaryNavigation.Item
              onClick={isOpen ? onClose : onOpen}
              iconName="VoiceflowLogomark"
              className={button({ isActive: isOpen })}
              iconProps={{
                viewBox: '0 0 30 24',
              }}
            />

            <Icon className={nubIcon} name="NubDown" />
          </div>
        </Header>
      )}
    >
      {() => (
        <Menu>
          {logoOptions.map((option) => option && (option.divider ? <Menu.Divider key={option.key} /> : <MenuItem key={option.key} {...option} />))}
        </Menu>
      )}
    </Popper>
  );
};
