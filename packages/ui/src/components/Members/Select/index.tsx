import Menu from '@ui/components/Menu';
import { defaultMenuLabelRenderer } from '@ui/components/NestedMenu';
import Select, { BaseSelectProps } from '@ui/components/Select';
import SvgIcon from '@ui/components/SvgIcon';
import { Utils } from '@voiceflow/common';
import React from 'react';
import { DeepNonNullable } from 'utility-types';

import { Member } from '../types';
import Option from './Option';

interface MemberSelectProps
  extends Omit<BaseSelectProps, 'value' | 'className' | 'options' | 'searchable' | 'optionsFilter' | 'renderOptionLabel' | 'icon'> {
  value: number | null;
  members: DeepNonNullable<Omit<Member, 'expiry'>>[];
  onChange: (memberID: number | null) => void;
}

const MemberSelect: React.FC<MemberSelectProps> = ({ value, members, onChange, ...props }) => {
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
      clearable
      searchable
      iconProps={{ variant: SvgIcon.Variant.STANDARD, opacity: true }}
      placeholder="Add workspace members"
      renderEmpty={({ search }) => <Menu.NotFound>{!search ? 'No members exist in your workspace.' : 'No members found. '}</Menu.NotFound>}
      getOptionKey={({ email }) => email}
      getOptionLabel={(value) => (value != null ? membersMap[value]?.name : undefined)}
      getOptionValue={(option) => option?.creator_id}
      clearOnSelectActive
      renderOptionLabel={(option, searchLabel, getOptionLabel, getOptionValue, { isFocused }) => (
        <Option option={option} isFocused={isFocused} searchLabel={searchLabel}>
          {defaultMenuLabelRenderer(option, searchLabel, getOptionLabel, getOptionValue)}
        </Option>
      )}
    />
  );
};

export default MemberSelect;
