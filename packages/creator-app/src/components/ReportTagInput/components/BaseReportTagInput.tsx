import { Utils } from '@voiceflow/common';
import {
  Box,
  createUIOnlyMenuItemOption,
  FlexApart,
  FlexStart,
  Icon,
  KeyName,
  Select,
  SelectInputVariant,
  SvgIcon,
  swallowEvent,
  UIOnlyMenuItemOption,
} from '@voiceflow/ui';
import _findLastIndex from 'lodash/findLastIndex';
import React from 'react';

import Checkbox from '@/components/Checkbox';
import { isBuiltInTag } from '@/ducks/transcript/utils';
import { useTrackingEvents } from '@/hooks';
import { ReportTag, Sentiment, SentimentArray } from '@/models';
import { ClassName } from '@/styles/constants';

import { ReportTagInputContext } from '../context';
import { TagWrapper } from './components';

export interface BaseReportTagInputProps {
  addTag: (tagID: string) => void;
  onChange: (value: string[]) => void;
  removeTag: (tagID: string) => void;
  className: string;
  creatable?: boolean;
  selectOnly?: boolean;
  selectedTags: (string | Icon)[];
  isSelectedFunc?: (id: string) => boolean;
  hasRadioButtons?: boolean;
  renderFooterAction?: (options: { close: VoidFunction }) => JSX.Element;
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
  addTag,
  removeTag,
  className,
  creatable = true,
  selectOnly,
  selectedTags = [],
  isSelectedFunc,
  hasRadioButtons,
  renderFooterAction,
}) => {
  const {
    state: { searchedTag, allTags, tagsMap },
    actions: { onSearch, onCreateNew },
  } = React.useContext(ReportTagInputContext)!;

  const [trackingEvents] = useTrackingEvents();
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  // Only use tags that exist in redux (they can be deleted in the tags manager)
  const [selectedValidTags, setSelectedValidTags] = React.useState(() => selectedTags.filter((tag) => !!tagsMap[tag]));

  const options = React.useMemo(() => {
    if (selectOnly) {
      const sortedAllTags = [...allTags].sort((lTag, rTag) => Number(isBuiltInTag(rTag.id)) - Number(isBuiltInTag(lTag.id)));
      const lastBuiltInIndex = _findLastIndex(sortedAllTags, (tag) => isBuiltInTag(tag.id));

      if (lastBuiltInIndex === -1 || lastBuiltInIndex === sortedAllTags.length - 1) {
        return sortedAllTags;
      }

      return Utils.array.insert<ReportTag | UIOnlyMenuItemOption>(
        sortedAllTags,
        lastBuiltInIndex + 1,
        createUIOnlyMenuItemOption('divider', { divider: true })
      );
    }

    return allTags.filter((tag) => !isBuiltInTag(tag.id) && filterOutSelected(tag.id, selectedValidTags));
  }, [selectOnly, allTags, selectedValidTags]);

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

  React.useEffect(() => {
    const validTags = selectedTags.filter((tag) => !!tagsMap[tag]);

    setSelectedValidTags(validTags);
  }, [tagsMap, selectedTags]);

  React.useLayoutEffect(() => {
    scrollTo({ top: containerRef.current?.scrollHeight });
  }, [selectedTags]);

  return (
    <>
      <Select
        className={className}
        autoUpdatePlacement
        renderOptionLabel={hasRadioButtons && !!isSelectedFunc ? (option) => customMenuLabelRenderer(option, isSelectedFunc) : undefined}
        renderFooterAction={renderFooterAction}
        fullWidth
        selectedOptions={selectedValidTags}
        renderOptionsFilter={selectOnly ? undefined : ({ id }) => filterOutSelected(id, selectedValidTags)}
        options={options}
        autoDismiss={false}
        creatable={creatable}
        onKeyDown={onBackspace}
        createLabel="Add"
        searchable
        onCreate={onCreateNew}
        onSearch={onSearch}
        getOptionValue={(tag) => tag?.id}
        getOptionLabel={(tag) => (tag ? tagsMap[tag]?.label : '')}
        createInputPlaceholder="New tag"
        placeholder={Object.keys(selectedTagObjects).length ? '' : 'Add tags'}
        onSelect={onToggleTag}
        inputVariant={SelectInputVariant.TAGS}
        renderTags={() => (
          <>
            {selectedTagObjects.map((tag) => (
              <TagWrapper key={tag.id} onClick={swallowEvent()}>
                <Box mr={6}>
                  {SentimentArray.includes(tag.id as Sentiment) ? (
                    <img
                      style={{ position: 'relative', bottom: '1px' }}
                      alt={tag.label}
                      src={tag.icon}
                      width={16}
                      height={16}
                      className={ClassName.BASE_REPORT_TAG_INPUT_ICON}
                    />
                  ) : (
                    <span>{allTags.find((item) => item.id === tag.id)?.label}</span>
                  )}
                </Box>
                <SvgIcon size={9} icon="close" clickable onClick={onRemove(tag.id)} />
              </TagWrapper>
            ))}
          </>
        )}
      />
    </>
  );
};

export default BaseReportTagInput;
