import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Button, Modal, Select, Text } from '@voiceflow/ui';
import React from 'react';

interface WorkspaceOrganizationProps {
  value: string | null;
  onNext: VoidFunction;
  onClose: VoidFunction;
  onSelect: (value: string | null) => void;
  organizations: Realtime.Organization[];
}

const WorkspaceOrganization: React.FC<WorkspaceOrganizationProps> = ({ value, onClose, onNext, onSelect, organizations }) => {
  const organizationMap = React.useMemo(() => Utils.array.createMap(organizations, (org) => org.id), [organizations]);

  return (
    <>
      <Modal.Body>
        <Box.FlexApart fullWidth gap={16} flexDirection="column">
          <Text>Select the Organization that this workspace should be a part of.</Text>
          <Select
            value={value}
            options={organizations}
            onSelect={onSelect}
            autoWidth
            fullWidth
            clearable
            placeholder="Select Organization"
            getOptionKey={(value) => value?.id}
            getOptionValue={(value) => value?.id}
            getOptionLabel={(value) => value && organizationMap[value]?.name}
            clearOnSelectActive
          />
        </Box.FlexApart>
      </Modal.Body>

      <Modal.Footer gap={12}>
        <Button variant={Button.Variant.TERTIARY} onClick={() => onClose()} squareRadius>
          Cancel
        </Button>

        <Button disabled={!value} onClick={onNext}>
          Continue
        </Button>
      </Modal.Footer>
    </>
  );
};

export default WorkspaceOrganization;
