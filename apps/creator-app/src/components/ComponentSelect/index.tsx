import type { Nullable } from '@voiceflow/common';
import { Utils } from '@voiceflow/common';
import type { BaseSelectProps } from '@voiceflow/ui';
import { Menu, Select, System } from '@voiceflow/ui';
import React from 'react';

import * as Designer from '@/ducks/designer';
import { useSelector } from '@/hooks';
import * as ModalsV2 from '@/ModalsV2';

interface ComponentSelectProps extends Pick<BaseSelectProps, 'icon' | 'iconProps'> {
  onChange: (diagramID: string | null) => void;
  diagramID: Nullable<string>;
}

const ComponentSelect: React.FC<ComponentSelectProps> = ({ diagramID, onChange, ...props }) => {
  const flows = useSelector(Designer.Flow.selectors.allOrderedByName);
  const createModal = ModalsV2.useModal(ModalsV2.Flow.Create);

  const onCreate = async (diagramName: string) => {
    const result = await createModal.openVoid({ name: diagramName, folderID: null });

    if (result) onChange(result.diagramID);
  };

  const optionLookup = React.useMemo(
    () => Utils.array.createMap(flows, Utils.object.selectField('diagramID')),
    [flows]
  );

  return (
    <Select
      {...props}
      value={diagramID}
      options={flows}
      onCreate={onCreate}
      onSelect={onChange}
      fullWidth
      clearable
      searchable
      placeholder="Select or create component"
      getOptionValue={(option) => option?.diagramID}
      getOptionLabel={(value) => (value ? optionLookup[value]?.name : undefined)}
      inDropdownSearch
      alwaysShowCreate
      clearOnSelectActive
      createInputPlaceholder="components"
      renderEmpty={({ search }) => (
        <Menu.NotFound>{!search ? 'No components exist in your assistant. ' : 'No components found. '}</Menu.NotFound>
      )}
      renderSearchSuffix={({ close, searchLabel }) => (
        <System.IconButtonsGroup.Base>
          <System.IconButton.Base
            icon="plus"
            onClick={Utils.functional.chainVoid(close, () => onCreate(searchLabel))}
          />
        </System.IconButtonsGroup.Base>
      )}
      renderFooterAction={({ close, searchLabel }) => (
        <Menu.Footer>
          <Menu.Footer.Action onClick={Utils.functional.chainVoid(close, () => onCreate(searchLabel))}>
            Create New Component
          </Menu.Footer.Action>
        </Menu.Footer>
      )}
    />
  );
};

export default ComponentSelect;
