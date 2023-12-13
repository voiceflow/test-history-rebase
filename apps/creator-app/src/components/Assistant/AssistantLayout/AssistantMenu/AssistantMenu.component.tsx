import { PrimaryNavigation } from '@voiceflow/ui-next';
import React from 'react';

import { useOnLinkClick } from '@/hooks/navigation.hook';

import { useAssistantMenuHotkeys, useAssistantMenuItems } from './AssistantMenu.hook';
import { AssistantMenuHelpItem } from './AssistantMenuHelpItem.component';

export const AssistantMenu: React.FC = () => {
  const onLinkClick = useOnLinkClick();

  const items = useAssistantMenuItems();

  useAssistantMenuHotkeys(items);

  return (
    <PrimaryNavigation>
      <PrimaryNavigation.Section>
        {items.map(({ path, iconName, isActive }) => (
          <PrimaryNavigation.Item key={path} onClick={onLinkClick(path)} isActive={isActive} iconName={iconName} />
        ))}
      </PrimaryNavigation.Section>

      <PrimaryNavigation.Section>
        <AssistantMenuHelpItem />
      </PrimaryNavigation.Section>
    </PrimaryNavigation>
  );
};
