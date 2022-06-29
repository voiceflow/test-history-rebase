import { Nullable, Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { NestedMenuComponents, Select } from '@voiceflow/ui';
import React from 'react';

interface ComponentSelectProps {
  selectedDiagramID: Nullable<string>;
  diagrams: Realtime.Diagram[];
  onChange: (selectedDiagramID: string) => void;
  onCreate: (diagramName: string) => void;
}

const ComponentSelect: React.FC<ComponentSelectProps> = ({ selectedDiagramID, diagrams, onChange, onCreate }) => {
  const optionLookup = React.useMemo<Record<string, typeof diagrams[number]>>(
    () => Utils.array.createMap(diagrams, Utils.object.selectID),
    [diagrams]
  );

  return (
    <Select
      value={selectedDiagramID}
      options={diagrams}
      onCreate={onCreate}
      onSelect={onChange}
      inDropdownSearch
      alwaysShowCreate
      searchable
      placeholder="Select flow"
      getOptionValue={(option) => option?.id}
      getOptionLabel={(value) => (value ? optionLookup[value]?.name : undefined)}
      createInputPlaceholder="flows"
      renderFooterAction={({ searchLabel }) => (
        <NestedMenuComponents.FooterActionContainer onClick={() => onCreate(searchLabel)}>Create New Flow</NestedMenuComponents.FooterActionContainer>
      )}
      fullWidth
    />
  );
};

export default ComponentSelect;
