import { Utils } from '@voiceflow/common';
import type * as Realtime from '@voiceflow/realtime-sdk';
import { Select } from '@voiceflow/ui';
import React from 'react';

interface WorkspaceSelectProps {
  value: string | null;
  onChange: (value: string | null) => void;
  workspaces: Realtime.Identity.Workspace[];
}

const WorkspaceSelect: React.FC<WorkspaceSelectProps> = ({ value, onChange, workspaces }) => {
  const optionsMap = React.useMemo(() => Utils.array.createMap(workspaces, (option) => option.id), [workspaces]);

  return (
    <Select
      value={value}
      prefix="WORKSPACE"
      options={workspaces}
      onSelect={(value) => onChange(value)}
      minWidth={false}
      maxWidth={238}
      autoWidth
      clearable
      noOverflow
      placeholder={value ?? 'Select'}
      getOptionKey={(option) => option.id}
      getOptionValue={(option) => option?.id}
      autoInputWidth
      getOptionLabel={(value) => value && optionsMap[value].name}
      clearOnSelectActive
    />
  );
};

export default WorkspaceSelect;
