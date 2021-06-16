import React from 'react';

import Menu, { MenuItem } from '@/components/Menu';
import Text from '@/components/Text';
import { ReportTag } from '@/models';
import { preventDefault } from '@/utils/dom';

import { ReportTagInputContext } from '../context';
import BaseTagInput, { MenuProps, TagInputVariantProps } from './BaseReportTagInput';

const ManageTagInput = (props: TagInputVariantProps) => {
  const {
    state: { filteredTags, searchedTag },
  } = React.useContext(ReportTagInputContext)!;

  const onAdd = () => () => {
    // TODO: implement with Manage Tags component
  };

  const onTagChange = (tag: ReportTag) => () => {
    props.onChange([...props.selectedTags, tag.id]);
  };

  return (
    <BaseTagInput
      menu={({ exists }: MenuProps) => {
        return (
          <Menu maxVisibleItems={5.5} fullWidth>
            {!exists && !!searchedTag.trim() && (
              <>
                <MenuItem onClick={preventDefault(onAdd())}>
                  <Text color="#8da2b5" mr="4px">
                    Add
                  </Text>
                  <Text>"{searchedTag}"</Text>
                </MenuItem>
                <MenuItem divider />
              </>
            )}
            {!!filteredTags.length && (
              <>
                {filteredTags.map((tag: ReportTag, index: number) => (
                  <MenuItem key={index} onClick={preventDefault(onTagChange(tag))}>
                    {tag.label}
                  </MenuItem>
                ))}
                <MenuItem divider />
              </>
            )}
            <MenuItem bottomAction>Manage Tags</MenuItem>
          </Menu>
        );
      }}
      {...props}
    />
  );
};

export default ManageTagInput;
