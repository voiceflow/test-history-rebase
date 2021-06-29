import { Box, ButtonVariant, ClickableText } from '@voiceflow/ui';
import React from 'react';
import { useHistory } from 'react-router-dom';

import ReportTagInput, { InputVariant } from '@/components/ReportTagInput';
import SelectMenu, { MenuSection } from '@/components/SelectMenu';
import { FILTER_TAG } from '@/pages/Conversations/constants';
import THEME from '@/styles/theme';

import ApplyFiltersButton from './ApplyFiltersButton';
import DatePicker from './TimeRangePicker/DatePicker';

const TranscriptFilters = () => {
  const history = useHistory();
  const params = new URLSearchParams();
  const [startDate, setStartDate] = React.useState('' as string | Date);
  const [timeRangeOpen, setTimeRangeOpen] = React.useState(false);
  const [tagsOpen, setTagsOpen] = React.useState(false);
  const [tags, setTags] = React.useState<string[]>([]);

  const clearTranscriptFilter = () => {
    setTimeRangeOpen(false);
    setTagsOpen(false);

    history.replace({ search: '' });
  };

  const setTagsFilter = () => {
    tags.forEach((tag) => {
      params.append(FILTER_TAG.TAG, tag);
    });
    history.replace({ search: params.toString() });
  };

  return (
    <SelectMenu
      clearData={clearTranscriptFilter}
      actionDisabled={!timeRangeOpen && !tagsOpen}
      sections={(_setData, _data) => (
        <>
          <MenuSection title="Time Range" enabled={timeRangeOpen} toggleSection={() => setTimeRangeOpen(!timeRangeOpen)}>
            <DatePicker date={startDate} isToggledOpen={timeRangeOpen} onChange={(newDate) => setStartDate(newDate)} />
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
                setTagsFilter();
              }}
              selectedTags={tags}
            />
          </MenuSection>
          <Box borderTop={`1px solid ${THEME.colors.borders}`}>
            <ApplyFiltersButton variant={ButtonVariant.PRIMARY} onClick={() => alert('Filters Applied!')}>
              Apply
            </ApplyFiltersButton>
          </Box>
        </>
      )}
    >
      {(ref, onToggle, isOpen, _data) => (
        // const numberOfEnabledFilters = _data.filters
        <ClickableText isActive={isOpen} ref={ref} onClick={onToggle}>
          Add filters
          {/* {numberOfEnabledFilters ? `(${numberOfEnabledFilters})` : ''} */}
        </ClickableText>
      )}
    </SelectMenu>
  );
};
export default TranscriptFilters;
