import { Box, FlexApart, FlexStart, Icon, KeyName, Select, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import Checkbox from '@/components/Checkbox';
import { ReportTag, Sentiment, SentimentArray } from '@/models';

import { ReportTagInputContext } from '../context';
import { TagWrapper } from './components';

export interface BaseReportTagInputProps {
  selectedTags: (string | Icon)[];
  onChange: (value: string[]) => void;
  footerAction?: boolean;
  footerActionLabel?: string;
  onClickFooterAction?: () => void;
  creatable?: boolean;
  hasRadioButtons?: boolean;
  isSelectedFunc?: (id: string) => boolean;
  selectOnly?: boolean;
}

export type TagInputVariantProps = Omit<BaseReportTagInputProps, 'menu' | 'tags'>;

const customMenuLabelRenderer = (option: ReportTag, isSelectedFunc: (val: string) => boolean) => {
  return (
    <FlexApart style={{ width: '100%' }}>
      <FlexStart>
        <Checkbox readOnly checked={isSelectedFunc(option.id)} />
        <div>{option.label}</div>
      </FlexStart>
      {option.builtIn &&
        (!SentimentArray.includes(option.id as Sentiment) ? (
          <SvgIcon icon={option.icon as Icon} color={option.iconColor} />
        ) : (
          <img alt="" width={18} height={18} src={option.icon} />
        ))}
    </FlexApart>
  );
};

const BaseReportTagInput: React.FC<BaseReportTagInputProps> = ({
  footerAction,
  footerActionLabel,
  onClickFooterAction,
  selectedTags = [],
  onChange,
  creatable = true,
  hasRadioButtons,
  isSelectedFunc,
  selectOnly,
}) => {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const {
    state: { searchedTag, allTags, tagsMap },
    actions: { onSearch, onCreateNew },
  } = React.useContext(ReportTagInputContext)!;

  const nonBuiltInTags = allTags.filter((tag) => !tag.builtIn);
  const selectedTagObjects =
    selectedTags
      ?.map((tagId) => {
        return tagsMap[tagId] || null;
      })
      .filter((data) => !!data) || [];

  const onRemove = (tagID: string) => () => {
    onChange(selectedTags.filter((id) => id !== tagID));
  };

  const onToggleTag = (tagID: string) => {
    if (selectedTags.includes(tagID)) {
      const newTagArray = selectedTags.filter((id) => id !== tagID);
      onChange(newTagArray);
    } else {
      onChange([...selectedTags, tagID]);
    }
  };

  const scrollTo = React.useCallback((...args) => containerRef.current?.scrollTo(...args), [selectedTags]);

  const onBackspace = (event: React.KeyboardEvent) => {
    const { key } = event;
    if (key && (key === KeyName.BACKSPACE || key === KeyName.DELETE) && !searchedTag.trim() && !!selectedTags.length) {
      onChange(selectedTags.slice(0, -1));
    }
  };

  React.useLayoutEffect(() => {
    scrollTo({ top: containerRef.current?.scrollHeight });
  }, [selectedTags]);

  return (
    <>
      <Select
        autoUpdatePlacement
        renderOptionLabel={hasRadioButtons && !!isSelectedFunc ? (option) => customMenuLabelRenderer(option, isSelectedFunc) : undefined}
        footerAction={footerAction}
        footerActionLabel={footerActionLabel}
        onClickFooterAction={onClickFooterAction}
        fullWidth
        options={selectOnly ? allTags : nonBuiltInTags}
        autoDismiss={false}
        creatable={creatable}
        onKeyDown={onBackspace}
        withSearchIcon={false}
        createLabel="Add"
        searchable
        onCreate={onCreateNew}
        onSearch={(val) => onSearch(val)}
        getOptionValue={(tag) => {
          return tag!.id;
        }}
        getOptionLabel={(tag) => {
          return tag ? tagsMap[tag]?.label : '';
        }}
        createInputPlaceholder="Add new tag"
        placeholder={selectedTags?.length ? '' : 'Add Tags'}
        onSelect={onToggleTag}
        tags={() => {
          return selectedTagObjects.map((tag, i) => {
            const onlyIcon = SentimentArray.includes(tag.id as Sentiment);
            return (
              <TagWrapper
                key={i}
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
              >
                <Box mr={6}>
                  {onlyIcon ? (
                    <img style={{ position: 'relative', bottom: '1px' }} width={16} height={16} alt={tag.label} src={tag.icon} />
                  ) : (
                    <span>{allTags.find((item) => item.id === tag.id)?.label}</span>
                  )}
                </Box>
                <SvgIcon size={9} icon="close" clickable onClick={onRemove(tag.id)} />
              </TagWrapper>
            );
          });
        }}
      />
    </>
  );
};

export default BaseReportTagInput;
