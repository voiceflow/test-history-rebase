import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { BaseSelectProps, defaultMenuLabelRenderer, Menu, Select, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import Option from './Option';

interface IntentSelectProps
  extends Omit<BaseSelectProps, 'value' | 'className' | 'options' | 'searchable' | 'optionsFilter' | 'renderOptionLabel' | 'icon'> {
  value: number | null;
  members: Realtime.WorkspaceMember[];
  onChange: (memberID: number | null) => void;
}

const WorkspaceMemberSelect: React.FC<IntentSelectProps> = ({ value, members, onChange, ...props }) => {
  const [search, setSearch] = React.useState('');
  const membersMap = React.useMemo(() => Utils.array.createMap(members, (member) => member.creator_id), [members]);
  const options = React.useMemo(() => members.map((member) => ({ ...member, menuItemProps: { height: 64 } })), [members]);

  return (
    <Select
      showSearchInputIcon={false}
      {...props}
      icon={search || value ? undefined : 'user'}
      value={value}
      options={options}
      onSelect={(memberID) => onChange(memberID)}
      onSearch={setSearch}
      searchable
      iconProps={{ variant: SvgIcon.Variant.STANDARD, opacity: true }}
      placeholder="Add workspace members"
      renderEmpty={({ search }) => <Menu.NotFound>{!search ? 'No members exist in your workspace.' : 'No members found. '}</Menu.NotFound>}
      getOptionKey={({ email }) => email}
      getOptionLabel={(value) => (value != null ? membersMap[value]?.name : undefined)}
      getOptionValue={(option) => option?.creator_id}
      renderOptionLabel={(option, searchLabel, getOptionLabel, getOptionValue, { isFocused }) => (
        <Option option={option} isFocused={isFocused} searchLabel={searchLabel}>
          {defaultMenuLabelRenderer(option, searchLabel, getOptionLabel, getOptionValue)}
        </Option>
      )}
    />
  );
};

export default WorkspaceMemberSelect;
