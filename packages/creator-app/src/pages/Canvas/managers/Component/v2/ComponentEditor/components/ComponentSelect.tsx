import { Nullable, Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { IconButton, NestedMenuComponents, Select } from '@voiceflow/ui';
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
      fullWidth
      onSelect={onChange}
      searchable
      placeholder="Select or create flow"
      getOptionValue={(option) => option?.id}
      getOptionLabel={(value) => (value ? optionLookup[value]?.name : undefined)}
      inDropdownSearch
      alwaysShowCreate
      clearOnSelectActive
      createInputPlaceholder="flows"
      renderEmpty={({ search }) => <Select.NotFound>{!search ? 'No flows exist in your assistant. ' : 'No flows found. '}</Select.NotFound>}
      renderSearchSuffix={({ close, searchLabel }) => (
        <IconButton
          size={16}
          icon="plus"
          variant={IconButton.Variant.BASIC}
          onClick={Utils.functional.chainVoid(close, () => onCreate(searchLabel))}
        />
      )}
      renderFooterAction={({ close, searchLabel }) => (
        <NestedMenuComponents.FooterActionContainer onClick={Utils.functional.chainVoid(close, () => onCreate(searchLabel))}>
          Create New Flow
        </NestedMenuComponents.FooterActionContainer>
      )}
    />
  );
};

export default ComponentSelect;
