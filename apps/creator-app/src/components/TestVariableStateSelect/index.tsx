import { Utils } from '@voiceflow/common';
import type { BaseSelectProps } from '@voiceflow/ui';
import {
  isNotUIOnlyMenuItemOption,
  isUIOnlyMenuItemOption,
  Menu,
  OverflowText,
  OverflowTippyTooltip,
  SvgIcon,
  TippyTooltip,
} from '@voiceflow/ui';
import React from 'react';

import { Permission } from '@/constants/permissions';
import * as variableState from '@/ducks/variableState';
import { useCreateVariableState, useSelector } from '@/hooks';
import { usePermission } from '@/hooks/permission';
import * as ModalsV2 from '@/ModalsV2';

import { SelectContainer } from './components';
import { baseOptions, dividerOption } from './constants';
import type { VariableStateOption } from './types';

interface TestVariableStateSelectProps extends BaseSelectProps {
  value?: string | null;
  loading: boolean;
  onChange: (value: string | null) => void;
  onUpdateStateValues: () => Promise<void>;
}

const TestVariableStateSelect: React.FC<TestVariableStateSelectProps> = ({
  value,
  loading,
  onChange,
  onUpdateStateValues,
  className,
  ...props
}) => {
  const variableStates = useSelector(variableState.allVariableStatesSelector);
  const isSelectedStateUnsync = useSelector(variableState.IsVariableStateUnsyncSelector);

  const [canRenderPrototype] = usePermission(Permission.PROJECT_PROTOTYPE_RENDER);

  const variableStateManageModal = ModalsV2.useModal(ModalsV2.VariableStates.Manage);

  const onCreateVariableState = useCreateVariableState();

  const options = React.useMemo(() => {
    const statesOptions = variableStates.map((variableState) => ({
      label: variableState.name,
      value: variableState.id,
    }));

    if (statesOptions.length === 0) return baseOptions;

    return [...baseOptions, dividerOption, ...statesOptions];
  }, [variableStates]);

  const optionsMap = React.useMemo(
    () => Utils.array.createMap(options.filter(isNotUIOnlyMenuItemOption), Utils.object.selectValue),
    [options]
  );

  const selected = React.useMemo(
    () => options.find((option) => !isUIOnlyMenuItemOption(option) && option.value === value) || null,
    [options, value]
  );

  return (
    <SelectContainer
      value={selected?.value}
      options={options}
      onSelect={onChange}
      searchable
      placeholder="Select a variable state"
      getOptionKey={(option) => option.value}
      getOptionValue={(option) => option?.value}
      getOptionLabel={(value) => value && optionsMap[value]?.label}
      renderOptionLabel={(option: VariableStateOption) => (
        <>
          <OverflowTippyTooltip content={option.label} overflow placement="top-start">
            {(overflowref) => <OverflowText ref={overflowref}>{option.label}</OverflowText>}
          </OverflowTippyTooltip>

          {option.label !== 'All agent variables' && (
            <Menu.ItemActionIcon
              icon="edit"
              onClick={() => variableStateManageModal.openVoid({ variableStateID: option.value })}
            />
          )}
        </>
      )}
      icon={loading ? 'arrowSpin' : undefined}
      iconProps={{ clickable: true, color: '#132144', spin: true, size: 16, marginRight: '-4px' }}
      disabled={loading}
      prefix={
        isSelectedStateUnsync &&
        !loading &&
        canRenderPrototype && (
          <TippyTooltip content="Update state values">
            <SvgIcon icon="arrowSpin" clickable color="#132144" onClick={onUpdateStateValues} size={16} />
          </TippyTooltip>
        )
      }
      renderFooterAction={({ close }) =>
        canRenderPrototype && (
          <Menu.Footer>
            <Menu.Footer.Action onClick={Utils.functional.chainVoid(close, onCreateVariableState)}>
              Create New Persona
            </Menu.Footer.Action>
          </Menu.Footer>
        )
      }
      {...props}
    />
  );
};

export default TestVariableStateSelect;
