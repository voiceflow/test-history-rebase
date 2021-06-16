import React from 'react';

import { Flex, FlexApart } from '@/components/Box';
import Checkbox from '@/components/Checkbox';
import Menu, { MenuItem } from '@/components/Menu';
import SvgIcon from '@/components/SvgIcon';
import { ReportTag } from '@/models';

import { DEFAULT_TAGS } from '../constants';
import { ReportTagInputContext } from '../context';
import BaseTagInput, { TagInputVariantProps } from './BaseReportTagInput';

const SelectOnlyTagInput = (props: TagInputVariantProps) => {
  const {
    state: { filteredTags },
  } = React.useContext(ReportTagInputContext)!;

  const onTagChange = (tag: ReportTag | { label: string; icon: string; id: string }) => () => {
    props.onChange([...props.selectedTags, tag.id]);
  };

  return (
    <BaseTagInput
      menu={() => (
        <Menu fullWidth>
          {DEFAULT_TAGS.map((tag, index) => (
            <MenuItem key={index} onClick={onTagChange(tag)}>
              <Flex fullWidth>
                <Checkbox readOnly checked={props.selectedTags.includes(tag.id)} />
                <FlexApart fullWidth>
                  {tag.label}
                  <SvgIcon size={22} icon={tag.icon} />
                </FlexApart>
              </Flex>
            </MenuItem>
          ))}
          {filteredTags.length > 0 && <MenuItem divider />}
          {filteredTags.map((tag: ReportTag, index: number) => (
            <MenuItem key={index} onClick={onTagChange(tag)}>
              <Checkbox readOnly checked={props.selectedTags.includes(tag.id)} /> {tag.label}
            </MenuItem>
          ))}
        </Menu>
      )}
      {...props}
    />
  );
};

export default SelectOnlyTagInput;
