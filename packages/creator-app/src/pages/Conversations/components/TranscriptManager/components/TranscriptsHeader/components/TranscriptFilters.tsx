import { Box, ButtonVariant, ClickableText } from '@voiceflow/ui';
import React from 'react';
import { useHistory } from 'react-router-dom';

import ReportTagInput, { InputVariant } from '@/components/ReportTagInput';
import SelectMenu, { MenuSection } from '@/components/SelectMenu';
import { FILTER_TAG } from '@/pages/Conversations/constants';
import THEME from '@/styles/theme';

import ApplyFiltersButton from './ApplyFiltersButton';
import DatePicker, { TimeRange } from './TimeRangePicker/DatePicker';

const TranscriptFilters = () => {
  const history = useHistory();
  const params = new URLSearchParams();
  const startDate = '' as string | Date;

  const [timeRangeOpen, setTimeRangeOpen] = React.useState(false);
  const [tagsOpen, setTagsOpen] = React.useState(false);
  const [currentRange, setCurrentRange] = React.useState('' as TimeRange | string);
  const [tags, setTags] = React.useState<string[]>([]);
  const clearTranscriptFilter = () => {
    setTimeRangeOpen(false);
    setTagsOpen(false);

    history.replace({ search: '' });
  };

  const appendURL = (range: TimeRange | string) => {
    if (!range && tags.length === 0) {
      history.replace({ search: '' });
      return;
    }
    if (
      range === TimeRange.TODAY ||
      range === TimeRange.YESTERDAY ||
      range === TimeRange.WEEK ||
      range === TimeRange.MONTH ||
      range === TimeRange.ALLTIME
    ) {
      params.append(FILTER_TAG.RANGE, range || '');
    } else {
      const from = range.substring(0, range.indexOf('-'));
      const to = range.substring(range.indexOf('-') + 2);

      params.append(FILTER_TAG.START_DATE, from || '');
      params.append(FILTER_TAG.END_DATE, to || '');
    }

    tags.forEach((tag) => {
      params.append(FILTER_TAG.TAG, tag);
    });

    history.replace({ search: params.toString() });
  };

  return (
    <SelectMenu
      clearData={clearTranscriptFilter}
      actionDisabled={!timeRangeOpen && !tagsOpen}
      sections={({ onToggle }) => {
        return (
          <>
            <MenuSection title="Time Range" enabled={timeRangeOpen} toggleSection={() => setTimeRangeOpen(!timeRangeOpen)}>
              <DatePicker date={startDate} onChange={(newRange: TimeRange | string) => setCurrentRange(newRange)} placement="right" />
            </MenuSection>

            <MenuSection
              title="Tags"
              enabled={tagsOpen}
              toggleSection={() => {
                setTagsOpen(!tagsOpen);
              }}
            >
              <ReportTagInput
                variant={InputVariant.SELECT_ONLY}
                onChange={(value: string[]) => {
                  const newTag = value.slice(-1)[0];
                  if (!tags.includes(newTag)) {
                    setTags([...tags, newTag]);
                  }
                }}
                selectedTags={tags}
              />
            </MenuSection>
            <Box borderTop={`1px solid ${THEME.colors.borders}`}>
              <ApplyFiltersButton
                variant={ButtonVariant.PRIMARY}
                onClick={() => {
                  appendURL(currentRange);
                  onToggle();
                }}
              >
                Apply
              </ApplyFiltersButton>
            </Box>
          </>
        );
      }}
    >
      {({ ref, isOpened, onToggle }) => (
        <ClickableText isActive={isOpened} ref={ref} onClick={onToggle}>
          Add filters
        </ClickableText>
      )}
    </SelectMenu>
  );
};
export default TranscriptFilters;
