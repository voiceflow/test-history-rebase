import { Nullable, Utils } from '@voiceflow/common';
import { BaseSelectProps, Menu, Select, System } from '@voiceflow/ui';
import React from 'react';

import * as Diagram from '@/ducks/diagram';
import * as DiagramV2 from '@/ducks/diagramV2';
import { useDispatch, useSelector } from '@/hooks';

interface ComponentSelectProps extends Pick<BaseSelectProps, 'icon' | 'iconProps'> {
  onChange: (componentID: string | null) => void;
  componentID: Nullable<string>;
}

const ComponentSelect: React.FC<ComponentSelectProps> = ({ componentID, onChange, ...props }) => {
  const diagrams = useSelector(DiagramV2.allDiagramsSelector);

  const createEmptyComponent = useDispatch(Diagram.createEmptyComponent);

  const onCreate = async (diagramName: string) => {
    const newDiagramID = await createEmptyComponent(diagramName);

    onChange(newDiagramID);
  };

  const optionLookup = React.useMemo(() => Utils.array.createMap(diagrams, Utils.object.selectID), [diagrams]);

  return (
    <Select
      {...props}
      value={componentID}
      options={diagrams}
      onCreate={onCreate}
      onSelect={onChange}
      fullWidth
      clearable
      searchable
      placeholder="Select or create component"
      getOptionValue={(option) => option?.id}
      getOptionLabel={(value) => (value ? optionLookup[value]?.name : undefined)}
      inDropdownSearch
      alwaysShowCreate
      clearOnSelectActive
      createInputPlaceholder="components"
      renderEmpty={({ search }) => <Menu.NotFound>{!search ? 'No components exist in your assistant. ' : 'No components found. '}</Menu.NotFound>}
      renderSearchSuffix={({ close, searchLabel }) => (
        <System.IconButtonsGroup.Base>
          <System.IconButton.Base icon="plus" onClick={Utils.functional.chainVoid(close, () => onCreate(searchLabel))} />
        </System.IconButtonsGroup.Base>
      )}
      renderFooterAction={({ close, searchLabel }) => (
        <Menu.Footer>
          <Menu.Footer.Action onClick={Utils.functional.chainVoid(close, () => onCreate(searchLabel))}>Create New Component</Menu.Footer.Action>
        </Menu.Footer>
      )}
    />
  );
};

export default ComponentSelect;
