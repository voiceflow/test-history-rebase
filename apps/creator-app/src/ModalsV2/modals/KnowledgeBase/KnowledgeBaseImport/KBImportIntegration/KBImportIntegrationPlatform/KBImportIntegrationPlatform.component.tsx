import { Utils } from '@voiceflow/common';
import { Box, Dropdown, Menu, MenuItem } from '@voiceflow/ui-next';
import React from 'react';

import { Modal } from '@/components/Modal';

import { INTEGRATION_PLATFORMS, INTEGRATION_PLATFORMS_MAPPER } from './KBImportIntegrationPlatform.constant';
import { IKBImportIntegrationPlatform } from './KBImportIntegrationPlatform.interface';

export const KBImportIntegrationPlatform: React.FC<IKBImportIntegrationPlatform> = ({ onClose, onContinue, disabled, platform, setPlatform }) => {
  const platformInfo = platform && INTEGRATION_PLATFORMS_MAPPER[platform];
  return (
    <>
      <Modal.Header title="Integrate with platform" onClose={onClose} />

      <Box mt={20} mx={24} mb={24} direction="column" gap={16}>
        <Dropdown value={platformInfo?.label || null} prefixIconName={platformInfo?.icon} disabled={disabled} placeholder="Select a platform">
          {({ referenceRef, onClose }) => (
            <Menu width={referenceRef.current?.clientWidth}>
              {INTEGRATION_PLATFORMS.map((item, index) => (
                <MenuItem
                  key={index}
                  onClick={Utils.functional.chainVoid(onClose, () => setPlatform(item.value))}
                  prefixIconName={item.icon}
                  label={item.label}
                />
              ))}
            </Menu>
          )}
        </Dropdown>
      </Box>

      <Modal.Footer>
        <Modal.Footer.Button label="Cancel" variant="secondary" onClick={onClose} disabled={disabled} />

        <Modal.Footer.Button label="Connect" onClick={onContinue} disabled={disabled} isLoading={disabled} />
      </Modal.Footer>
    </>
  );
};
