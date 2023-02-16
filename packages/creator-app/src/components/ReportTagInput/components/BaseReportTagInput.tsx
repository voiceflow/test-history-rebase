import { Utils } from '@voiceflow/common';
import { Box, createDividerMenuItemOption, KeyName, Select, SelectInputVariant, SvgIcon, swallowEvent, UIOnlyMenuItemOption } from '@voiceflow/ui';
import _findLastIndex from 'lodash/findLastIndex';
import React from 'react';

import * as ReportTags from '@/ducks/reportTag';
import * as Transcript from '@/ducks/transcript';
import { useDispatch, useSelector, useTrackingEvents } from '@/hooks';
import { ReportTag } from '@/models';
import { ClassName } from '@/styles/constants';
import { isBuiltInTag, isSentimentTag } from '@/utils/reportTag';

import customMenuLabelRenderer from './customMenuLabelRenderer';
import TagWrapper from './TagWrapper';

export interface BaseReportTagInputProps {
  addTag: (tagID: string) => void;
  onChange: (value: string[]) => void;
  removeTag: (tagID: string) => void;
  className: string;
  creatable?: boolean;
  selectOnly?: boolean;
  selectedTags: string[];
  isSelectedFunc?: (id: string) => boolean;
  hasRadioButtons?: boolean;
  renderFooterAction?: (options: { close: VoidFunction }) => JSX.Element;
}

const filterOutSelected = (id: string, selectedTagIDs: string[]) => !selectedTagIDs.includes(id);

const BaseReportTagInput: React.FC<BaseReportTagInputProps> = ({
  addTag,
  removeTag,
  className,
  creatable = true,
  selectOnly,
  selectedTags,
  isSelectedFunc,
  hasRadioButtons,
  renderFooterAction,
}) => {
  const [trackingEvents] = useTrackingEvents();

  const allTags = useSelector(ReportTags.allReportTagsSelector);
  const tagsMap = useSelector(ReportTags.mapReportTagsSelector);
  const currentTranscriptID = useSelector(Transcript.currentTranscriptIDSelector);

  const addReportTag = useDispatch(Transcript.addTag);
  const createReportTag = useDispatch(ReportTags.createTag);
  const [search, setSearch] = React.useState('');

  const onCreateTag = React.useCallback(
    async (label: string) => {
      if (!currentTranscriptID) return;

      const tagID = await createReportTag(label);

      if (tagID) {
        addReportTag(currentTranscriptID, tagID);
        setSearch('');
      }
    },
    [createReportTag, addReportTag, currentTranscriptID]
  );

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

  const onKeyDown = ({ key }: React.KeyboardEvent<HTMLElement>) => {
    if ((key === KeyName.BACKSPACE || key === KeyName.DELETE) && !search.trim() && !!selectedTags.length) {
      const lastTagID = selectedTags[selectedTags.length - 1];
      removeTag(lastTagID);
    }
  };

  // Only use tags that exist in redux (they can be deleted in the tags manager)
  const selectedValidTagIDs = React.useMemo(() => selectedTags.filter((tag) => !!tagsMap[tag]), [selectedTags, tagsMap]);

  const options = React.useMemo(() => {
    if (selectOnly) {
      const sortedAllTags = [...allTags].sort((lTag, rTag) => Number(isBuiltInTag(rTag.id)) - Number(isBuiltInTag(lTag.id)));
      const lastBuiltInIndex = _findLastIndex(sortedAllTags, (tag) => isBuiltInTag(tag.id));

      if (lastBuiltInIndex === -1 || lastBuiltInIndex === sortedAllTags.length - 1) {
        return sortedAllTags;
      }

      return Utils.array.insert<ReportTag | UIOnlyMenuItemOption>(sortedAllTags, lastBuiltInIndex + 1, createDividerMenuItemOption());
    }

    return allTags.filter((tag) => !isBuiltInTag(tag.id) && filterOutSelected(tag.id, selectedValidTagIDs));
  }, [selectOnly, allTags, selectedValidTagIDs]);

  return (
    <Select
      className={className}
      autoUpdatePlacement
      renderOptionLabel={
        hasRadioButtons && !!isSelectedFunc
          ? (option, searchLabel, getOptionLabel, getOptionValue) =>
              customMenuLabelRenderer(option, searchLabel, getOptionLabel, getOptionValue, isSelectedFunc)
          : undefined
      }
      renderFooterAction={renderFooterAction}
      fullWidth
      selectedOptions={selectedValidTagIDs}
      renderOptionsFilter={selectOnly ? undefined : ({ id }) => filterOutSelected(id, selectedValidTagIDs)}
      options={options}
      autoDismiss={false}
      creatable={creatable}
      onKeyDown={onKeyDown}
      createLabel="Add"
      searchable
      onSelect={onToggleTag}
      onSearch={setSearch}
      onCreate={onCreateTag}
      getOptionKey={(tag) => tag?.id}
      getOptionValue={(tag) => tag?.id}
      getOptionLabel={(tag) => (tag ? tagsMap[tag]?.label : '')}
      placeholder={selectedValidTagIDs.length ? '' : 'Add tags'}
      inputVariant={SelectInputVariant.TAGS}
      createInputPlaceholder="New tag"
      renderTags={() =>
        selectedValidTagIDs.map((tagID) => {
          const tag = tagsMap[tagID];

          return !tag ? null : (
            <TagWrapper key={tagID} onClick={swallowEvent()}>
              <Box mr={8}>
                {isSentimentTag(tagID) ? (
                  <img
                    style={{ position: 'relative', bottom: '1px' }}
                    alt={tag.label}
                    src={tag.icon}
                    width={16}
                    height={16}
                    className={ClassName.BASE_REPORT_TAG_INPUT_ICON}
                  />
                ) : (
                  <span>{tag.label}</span>
                )}
              </Box>

              <SvgIcon size={9} icon="closeSmall" clickable onClick={onRemove(tagID)} color="#8da2b5" mt={2} />
            </TagWrapper>
          );
        })
      }
    />
  );
};

export default BaseReportTagInput;
