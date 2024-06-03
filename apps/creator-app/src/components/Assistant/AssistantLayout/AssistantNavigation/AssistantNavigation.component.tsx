import composeRefs from '@seznam/compose-react-refs';
import { tid } from '@voiceflow/style';
import { Menu, PrimaryNavigation } from '@voiceflow/ui-next';
import React from 'react';

import { AssistantExportPopper } from '@/components/Assistant/AssistantExportPopper/AssistantExportPopper.component';
import { AssistantSharePrototypePopper } from '@/components/Assistant/AssistantSharePrototypePopper/AssistantSharePrototypePopper.component';
import { useIsAIFeaturesEnabled } from '@/hooks/ai.hook';
import { useOnLinkClick } from '@/hooks/navigation.hook';

import {
  useAssistantNavigationHotkeys,
  useAssistantNavigationItems,
  useAssistantNavigationLogoItems,
} from './AssistantNavigation.hook';
import { AssistantNavigationHelpItem } from './AssistantNavigationHelpItem.component';
import { AssistantNavigationTokenUsage } from './AssistantNavigationTokenUsage.component';

export const AssistantNavigation: React.FC = () => {
  const TEST_ID = 'assistant-navigation';

  const onLinkClick = useOnLinkClick();
  const isAIFeaturesEnabled = useIsAIFeaturesEnabled();

  const items = useAssistantNavigationItems();
  const logoItems = useAssistantNavigationLogoItems();

  useAssistantNavigationHotkeys(items);

  return (
    <PrimaryNavigation testID={TEST_ID}>
      <PrimaryNavigation.Section>
        <AssistantExportPopper
          referenceElement={(exportProps) => (
            <AssistantSharePrototypePopper
              referenceElement={(sharePrototypeProps) => (
                <div ref={composeRefs(exportProps.ref, sharePrototypeProps.ref)}>
                  <PrimaryNavigation.Header
                    menuProps={{ numberOfItemsToShow: logoItems.length }}
                    testID={tid(TEST_ID, 'home')}
                    useNewLogo
                  >
                    {logoItems.map((item) =>
                      'divider' in item ? (
                        <Menu.Divider key={item.key} />
                      ) : (
                        <Menu.Item
                          key={item.key}
                          label={item.label}
                          testID={tid(TEST_ID, ['home', 'menu-item'], item.key)}
                          onClick={() =>
                            item.onClick({ export: exportProps.onOpen, sharePrototype: sharePrototypeProps.onOpen })
                          }
                          prefixIconName={item.iconName}
                        />
                      )
                    )}
                  </PrimaryNavigation.Header>
                </div>
              )}
            />
          )}
        />

        {items.map(({ path, params, iconName, isActive, testID, hotkey, tooltipLabel }) => (
          <PrimaryNavigation.Item
            key={path}
            testID={tid(TEST_ID, testID)}
            onClick={onLinkClick(path, { params })}
            hotkeys={[{ label: hotkey }]}
            isActive={isActive}
            iconName={iconName}
            tooltipLabel={tooltipLabel}
          />
        ))}
      </PrimaryNavigation.Section>

      <PrimaryNavigation.Section>
        {isAIFeaturesEnabled && <AssistantNavigationTokenUsage testID={tid(TEST_ID, 'tokens-usage')} />}

        <AssistantNavigationHelpItem testID={tid(TEST_ID, 'help')} />
      </PrimaryNavigation.Section>
    </PrimaryNavigation>
  );
};
