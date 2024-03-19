import * as Realtime from '@voiceflow/realtime-sdk';
import { tid } from '@voiceflow/style';
import { Menu, PrimaryNavigation } from '@voiceflow/ui-next';
import React from 'react';

import { useFeature } from '@/hooks/feature';
import { useOnLinkClick } from '@/hooks/navigation.hook';
import { useLogoButtonOptions } from '@/pages/Project/components/Header/hooks';

import { useAssistantNavigationHotkeys, useAssistantNavigationItems } from './AssistantNavigation.hook';
import { AssistantNavigationHelpItem } from './AssistantNavigationHelpItem.component';

export const AssistantNavigation: React.FC = () => {
  const TEST_ID = 'assistant-navigation';

  const useUpdatedBranding = useFeature(Realtime.FeatureFlag.BRANDING_UPDATE).isEnabled;

  const onLinkClick = useOnLinkClick();

  const items = useAssistantNavigationItems();
  const logoOptions = useLogoButtonOptions({ uiToggle: false, shortcuts: false });

  useAssistantNavigationHotkeys(items);

  return (
    <PrimaryNavigation testID={TEST_ID}>
      <PrimaryNavigation.Section>
        <PrimaryNavigation.Header
          menuProps={{ numberOfItemsToShow: logoOptions.length }}
          testID={tid(TEST_ID, 'home')}
          useNewLogo={useUpdatedBranding}
        >
          {logoOptions.map(
            (option) =>
              option &&
              (option.divider ? (
                <Menu.Divider key={option.key} />
              ) : (
                <Menu.Item key={option.key} {...option} testID={tid(TEST_ID, ['home', 'menu-item'], option.testID || option.key)} />
              ))
          )}
        </PrimaryNavigation.Header>

        {items.map(({ path, params, iconName, isActive, testID }) => (
          <PrimaryNavigation.Item
            key={path}
            testID={tid(TEST_ID, testID)}
            onClick={onLinkClick(path, { params })}
            isActive={isActive}
            iconName={iconName}
          />
        ))}
      </PrimaryNavigation.Section>

      <PrimaryNavigation.Section>
        <AssistantNavigationHelpItem testID={tid(TEST_ID, 'help')} />
      </PrimaryNavigation.Section>
    </PrimaryNavigation>
  );
};
