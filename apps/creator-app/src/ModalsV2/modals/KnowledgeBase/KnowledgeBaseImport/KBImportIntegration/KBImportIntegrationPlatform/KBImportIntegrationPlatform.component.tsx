import { BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import { Box, Dropdown, Menu, MenuItem, Scroll, useCreateConst } from '@voiceflow/ui-next';
import { composeValidators, validatorFactory } from '@voiceflow/utils-designer';
import React, { useMemo } from 'react';

import { Modal } from '@/components/Modal';
import { Designer } from '@/ducks';
import { useHotkey } from '@/hooks/hotkeys';
import { useInputState } from '@/hooks/input.hook';
import { useSelector } from '@/hooks/store.hook';
import { useTrackingEvents } from '@/hooks/tracking';
import { useValidators } from '@/hooks/validate.hook';
import { Hotkey } from '@/keymap';

import { INTEGRATION_PLATFORMS, INTEGRATION_PLATFORMS_MAPPER } from './KBImportIntegrationPlatform.constant';
import { IKBImportIntegrationPlatform } from './KBImportIntegrationPlatform.interface';
import { KBImportIntegrationSubdomainInput } from './KBImportIntegrationSubdomainInput.component';

export const KBImportIntegrationPlatform: React.FC<IKBImportIntegrationPlatform> = ({ onClose, disabled, onContinue }) => {
  const ZENDESK_URL_REGEX = /^(?:https:\/\/)?(?:www\.)?([\da-z](?:[\da-z-]{0,61}[\da-z])?)\.zendesk\.com/;

  const integrations = useSelector(Designer.KnowledgeBase.Integration.selectors.all);
  const [trackingEvents] = useTrackingEvents();

  const url = useInputState();
  const platform = useInputState<BaseModels.Project.IntegrationTypes | null>({ value: null });

  const platformInfo = platform.value && INTEGRATION_PLATFORMS_MAPPER[platform.value];

  const hasZendeskIntegration = useMemo(
    () => !!integrations.find((integration) => integration.type === platform.value),
    [integrations, platform.value]
  );

  const validator = useValidators({
    platform: useCreateConst(() => [
      validatorFactory((platform: BaseModels.Project.IntegrationTypes | null) => platform, 'Platform is required.'),
      platform.setError,
    ]),
    url: useCreateConst(() => [
      composeValidators(
        validatorFactory(
          (
            value: string,
            { platform, hasZendeskIntegration }: { platform: BaseModels.Project.IntegrationTypes | null; hasZendeskIntegration: boolean }
          ) => platform !== BaseModels.Project.IntegrationTypes.ZENDESK || value || hasZendeskIntegration,
          'e.g. https://company.zendesk.com'
        ),
        validatorFactory(
          (
            value: string,
            { platform, hasZendeskIntegration }: { platform: BaseModels.Project.IntegrationTypes | null; hasZendeskIntegration: boolean }
          ) => platform !== BaseModels.Project.IntegrationTypes.ZENDESK || value.match(ZENDESK_URL_REGEX) || hasZendeskIntegration,
          'URL is not valid.'
        )
      ),
      url.setError,
    ]),
  });

  const onSubmit = () => {
    const result = validator.validate({ url: url.value, platform: platform.value }, { platform: platform.value, hasZendeskIntegration });

    if (!result.success || !result.data.platform) return;

    trackingEvents.trackAiKnowledgeBaseIntegrationSelected({ IntegrationType: result.data.platform });

    const [, subdomain] = result.data.url.match(ZENDESK_URL_REGEX) ?? [];

    onContinue({
      platform: result.data.platform,
      subdomain,
      authenticate: !hasZendeskIntegration,
    });
  };

  useHotkey(Hotkey.MODAL_SUBMIT, onSubmit, { preventDefault: true, allowInputs: true });

  return (
    <Box direction="column">
      <Modal.Header title="Integrate with platform" onClose={onClose} />

      <Scroll style={{ display: 'block' }}>
        <Box gap={16} pt={20} px={24} pb={24} direction="column">
          <Box width="100%" direction="column">
            <Dropdown
              value={platformInfo?.label || null}
              label="Platform"
              error={!!platform.error}
              disabled={disabled}
              placeholder="Select a platform"
              errorMessage={platform.error ?? undefined}
              prefixIconName={platformInfo?.icon}
            >
              {({ referenceRef, onClose }) => (
                <Menu width={referenceRef.current?.clientWidth}>
                  {INTEGRATION_PLATFORMS.map((item, index) => (
                    <MenuItem
                      key={index}
                      label={item.label}
                      onClick={Utils.functional.chainVoid(onClose, () => platform.setValue(item.value))}
                      prefixIconName={item.icon}
                    />
                  ))}
                </Menu>
              )}
            </Dropdown>
          </Box>

          {platform.value === BaseModels.Project.IntegrationTypes.ZENDESK && !hasZendeskIntegration && (
            <KBImportIntegrationSubdomainInput value={url.value} error={url.error} onValueChange={url.setValue} />
          )}
        </Box>
      </Scroll>

      <Modal.Footer>
        <Modal.Footer.Button label="Cancel" variant="secondary" onClick={onClose} disabled={disabled} />

        <Modal.Footer.Button label="Connect" onClick={onSubmit} disabled={disabled} isLoading={disabled} />
      </Modal.Footer>
    </Box>
  );
};
