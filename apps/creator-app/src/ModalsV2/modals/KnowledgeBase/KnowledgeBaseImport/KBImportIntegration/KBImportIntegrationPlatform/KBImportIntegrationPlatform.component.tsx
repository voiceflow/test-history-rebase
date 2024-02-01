import { Utils } from '@voiceflow/common';
import { Box, Dropdown, Menu, MenuItem, Scroll } from '@voiceflow/ui-next';
import React from 'react';

import { Modal } from '@/components/Modal';
import { useHotkey } from '@/hooks/hotkeys';
import { Hotkey } from '@/keymap';

import { INTEGRATION_PLATFORMS, INTEGRATION_PLATFORMS_MAPPER, KBImportPlatformType } from './KBImportIntegrationPlatform.constant';
import { IKBImportIntegrationPlatform } from './KBImportIntegrationPlatform.interface';

export const KBImportIntegrationPlatform: React.FC<IKBImportIntegrationPlatform> = ({ onClose, onContinue, disabled, platform, setPlatform }) => {
  const platformInfo = platform && INTEGRATION_PLATFORMS_MAPPER[platform];
  const [error, setError] = React.useState<string>('');

  const onSubmit = () => {
    if (!platform) {
      setError('Platform is required.');
      return;
    }
    onContinue();
  };

  const onSetPlatform = (value: KBImportPlatformType) => {
    setPlatform(value);
    setError('');
  };

  useHotkey(Hotkey.MODAL_SUBMIT, onSubmit, { preventDefault: true });

  return (
    <Box direction="column">
      <Modal.Header title="Integrate with platform" onClose={onClose} />

      <Scroll style={{ display: 'block' }}>
        <Box mt={20} mx={24} mb={24} direction="column">
          <Dropdown
            value={platformInfo?.label || null}
            prefixIconName={platformInfo?.icon}
            disabled={disabled}
            label="Platform"
            placeholder="Select a platform"
            errorMessage={error}
            error={!!error}
          >
            {({ referenceRef, onClose }) => (
              <Menu width={referenceRef.current?.clientWidth}>
                {INTEGRATION_PLATFORMS.map((item, index) => (
                  <MenuItem
                    key={index}
                    onClick={Utils.functional.chainVoid(onClose, () => onSetPlatform(item.value))}
                    prefixIconName={item.icon}
                    label={item.label}
                  />
                ))}
              </Menu>
            )}
          </Dropdown>
        </Box>
      </Scroll>

      <Modal.Footer>
        <Modal.Footer.Button label="Cancel" variant="secondary" onClick={onClose} disabled={disabled} />

        <Modal.Footer.Button label="Connect" onClick={onSubmit} disabled={disabled} isLoading={disabled} />
      </Modal.Footer>
    </Box>
  );
};
