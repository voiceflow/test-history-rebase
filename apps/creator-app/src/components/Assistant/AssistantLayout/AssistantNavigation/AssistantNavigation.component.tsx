import { Menu, PrimaryNavigation } from '@voiceflow/ui-next';
import React from 'react';

import { useOnLinkClick } from '@/hooks/navigation.hook';
import { useLogoButtonOptions } from '@/pages/Project/components/Header/hooks';

import { useAssistantNavigationHotkeys, useAssistantNavigationItems } from './AssistantNavigation.hook';
import { AssistantNavigationHelpItem } from './AssistantNavigationHelpItem.component';

export const AssistantNavigation: React.FC = () => {
  const onLinkClick = useOnLinkClick();

  const items = useAssistantNavigationItems();
  const logoOptions = useLogoButtonOptions({ uiToggle: false, shortcuts: false });

  useAssistantNavigationHotkeys(items);

  return (
    <PrimaryNavigation testID="assistant__navigation">
      <PrimaryNavigation.Section>
        <PrimaryNavigation.Header menuProps={{ numberOfItemsToShow: logoOptions.length }}>
          {logoOptions.map((option) => option && (option.divider ? <Menu.Divider key={option.key} /> : <Menu.Item key={option.key} {...option} />))}
        </PrimaryNavigation.Header>

        {items.map(({ path, iconName, isActive, testID }) => (
          <PrimaryNavigation.Item
            key={path}
            onClick={onLinkClick(path)}
            isActive={isActive}
            iconName={iconName}
            testID={`assistant__navigation__item--${testID}`}
          />
        ))}
      </PrimaryNavigation.Section>

      <PrimaryNavigation.Section>
        <AssistantNavigationHelpItem />
      </PrimaryNavigation.Section>
    </PrimaryNavigation>
  );
};
