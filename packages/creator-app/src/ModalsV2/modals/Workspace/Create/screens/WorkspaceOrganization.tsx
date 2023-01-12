import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Button, Modal, Select, Text } from '@voiceflow/ui';
import React from 'react';

interface WorkspaceOrganizationProps {
  onNext: VoidFunction;
  onClose: VoidFunction;
  onSelect: (value: Realtime.Organization) => void;
  organizations: Realtime.Organization[];
}

const WorkspaceOrganization: React.FC<WorkspaceOrganizationProps> = ({ onClose, onNext, onSelect, organizations }) => {
  const [selectedOrganization, setSelectedOrganization] = React.useState<Realtime.Organization>();

  const onSelectOrganization = (value: Realtime.Organization) => {
    setSelectedOrganization(value);
    onSelect(value);
  };

  return (
    <>
      <Modal.Body>
        <Box.FlexApart fullWidth gap={16} flexDirection="column">
          <Text>Select the Organization that this workspace should be a part of.</Text>
          <Select
            autoWidth
            fullWidth
            placeholder="Select Organization"
            options={organizations}
            onSelect={(value: Realtime.Organization) => onSelectOrganization(value)}
            getOptionLabel={(value) => value?.name}
            value={selectedOrganization}
          />
        </Box.FlexApart>
      </Modal.Body>
      <Modal.Footer gap={12}>
        <Button variant={Button.Variant.TERTIARY} onClick={() => onClose()} squareRadius>
          Cancel
        </Button>

        <Button disabled={!selectedOrganization} onClick={onNext}>
          Continue
        </Button>
      </Modal.Footer>
    </>
  );
};

export default WorkspaceOrganization;
