import { Box, FlexApart, FlexStart, Icon, KeyName, Select, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import Checkbox from '@/components/Checkbox';
import { isBuiltInTag } from '@/ducks/transcript/utils';
import { useTrackingEvents } from '@/hooks';
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
  addTag: (tagID: string) => void;
  removeTag: (tagID: string) => void;
  className: string;
}

export type TagInputVariantProps = Omit<BaseReportTagInputProps, 'menu' | 'tags'>;

const customMenuLabelRenderer = (option: ReportTag, isSelectedFunc: (val: string) => boolean) => {
  return (
    <FlexApart style={{ width: '100%' }}>
      <FlexStart>
        <Checkbox readOnly checked={isSelectedFunc(option.id)} />
        <div data-testid={option.id}>{option.label}</div>
      </FlexStart>
      {isBuiltInTag(option.id) &&
        (!SentimentArray.includes(option.id as Sentiment) ? (
          <SvgIcon icon={option.icon as Icon} color={option.iconColor} />
        ) : (
          <img alt="" width={18} height={18} src={option.icon} />
        ))}
    </FlexApart>
  );
};

const filterOutSelected = (id: string, selectedTagIDs: string[]) => {
  return !selectedTagIDs.includes(id);
};

const BaseReportTagInput: React.FC<BaseReportTagInputProps> = ({
  footerAction,
  footerActionLabel,
  onClickFooterAction,
  selectedTags = [],
  creatable = true,
  hasRadioButtons,
  isSelectedFunc,
  selectOnly,
  addTag,
  removeTag,
  className,
}) => {
  const {
    state: { searchedTag, allTags, tagsMap },
    actions: { onSearch, onCreateNew },
  } = React.useContext(ReportTagInputContext)!;

  const [trackingEvents] = useTrackingEvents();
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  // Only use tags that exist in redux (they can be deleted in the tags manager)
  const [selectedValidTags, setSelectedValidTags] = React.useState(() => {
    return selectedTags.filter((tag) => !!tagsMap[tag]);
  });

  React.useEffect(() => {
    const validTags = selectedTags.filter((tag) => !!tagsMap[tag]);
    setSelectedValidTags(validTags);
  }, [tagsMap, selectedTags]);

  const nonBuiltInTags = allTags.filter((tag) => !isBuiltInTag(tag.id));
  const selectedTagObjects =
    selectedTags
      ?.map((tagId) => {
        return tagsMap[tagId] || null;
      })
      .filter((data) => !!data) || [];

  const onRemove = (tagID: string) => () => {
    removeTag(tagID);
  };

  const onToggleTag = (tagID: string) => {
    if (selectedTags.includes(tagID)) {
      removeTag(tagID);
    } else {
      addTag(tagID);
      trackingEvents.trackConversationTagAdded({ tagLabel: tagsMap[tagID].label });
    }
  };

  const scrollTo = React.useCallback((...args) => containerRef.current?.scrollTo(...args), [selectedTags]);

  const onBackspace = (event: React.KeyboardEvent) => {
    const { key } = event;

    if (key && (key === KeyName.BACKSPACE || key === KeyName.DELETE) && !searchedTag.trim() && !!selectedTags.length) {
      const lastTagID = selectedTags[selectedTags.length - 1];
      removeTag(lastTagID);
    }
  };

  React.useLayoutEffect(() => {
    scrollTo({ top: containerRef.current?.scrollHeight });
  }, [selectedTags]);

  return (
    <>
      <Select
        className={className}
        autoUpdatePlacement
        renderOptionLabel={hasRadioButtons && !!isSelectedFunc ? (option) => customMenuLabelRenderer(option, isSelectedFunc) : undefined}
        footerAction={footerAction}
        footerActionLabel={footerActionLabel}
        onClickFooterAction={onClickFooterAction}
        fullWidth
        selectedOptions={selectedValidTags}
        renderOptionsFilter={selectOnly ? undefined : ({ id }: { id: string }) => filterOutSelected(id, selectedValidTags)}
        options={selectOnly ? allTags : nonBuiltInTags.filter(({ id }) => filterOutSelected(id, selectedValidTags))}
        autoDismiss={false}
        creatable={creatable}
        onKeyDown={onBackspace}
        withSearchIcon={false}
        createLabel="Add"
        searchable
        onCreate={onCreateNew}
        onSearch={(val) => onSearch(val)}
        getOptionValue={(tag) => tag!.id}
        getOptionLabel={(tag) => (tag ? tagsMap[tag]?.label : '')}
        createInputPlaceholder="New tag"
        placeholder={Object.keys(selectedTagObjects).length ? '' : 'Add Tags'}
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
