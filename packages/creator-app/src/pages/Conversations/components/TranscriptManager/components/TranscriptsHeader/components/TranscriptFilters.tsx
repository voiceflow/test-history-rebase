import { TimeRange } from '@voiceflow/internal';
import { Box, ButtonVariant, ClickableText } from '@voiceflow/ui';
import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import ReportTagInput, { InputVariant } from '@/components/ReportTagInput';
import SelectMenu, { MenuSection } from '@/components/SelectMenu';
import { useTrackingEvents } from '@/hooks';
import { FILTER_TAG, isBuiltInRange } from '@/pages/Conversations/constants';
import { ClassName } from '@/styles/constants';
import THEME from '@/styles/theme';

import ApplyFiltersButton from './ApplyFiltersButton';
import DatePicker from './TimeRangePicker/DatePicker';

const TranscriptFilters = () => {
  const history = useHistory();
  const location = useLocation();

  const [trackingEvents] = useTrackingEvents();
  const [timeRangeOpen, setTimeRangeOpen] = React.useState(false);
  const [tagsOpen, setTagsOpen] = React.useState(false);
  const [currentRange, setCurrentRange] = React.useState('' as TimeRange | string);
  const [tags, setTags] = React.useState<string[]>([]);

  const filtersCounter = React.useMemo(() => {
    let counter = 0;
    const params = new URLSearchParams(location.search);

    if (params.has(FILTER_TAG.RANGE) || params.has(FILTER_TAG.START_DATE) || params.has(FILTER_TAG.END_DATE)) {
      counter++;
    }

    if (params.has(FILTER_TAG.TAG)) {
      counter++;
    }

    return counter;
  }, [location.search]);

  const clearTranscriptFilter = () => {
    setTimeRangeOpen(false);
    setTagsOpen(false);
    history.replace({ search: '' });
  };

  const addDateRangeParams = (params: URLSearchParams) => {
    if (isBuiltInRange(currentRange)) {
      params.append(FILTER_TAG.RANGE, currentRange || '');
    } else {
      const split = currentRange.split('-');
      const from = new Date(split[0]).getTime();
      const to = new Date(split[1]).getTime();

      from && params.append(FILTER_TAG.START_DATE, from.toString() || '');
      to && params.append(FILTER_TAG.END_DATE, to.toString() || '');
    }
  };

  const addTagsParams = (params: URLSearchParams) => {
    tags.forEach((tag) => {
      params.append(FILTER_TAG.TAG, tag);
    });
  };

  const appendURL = () => {
    const params = new URLSearchParams();

    if (!currentRange && tags.length === 0) {
      history.replace({ search: '' });
      return;
    }

    if (timeRangeOpen) addDateRangeParams(params);
    if (tagsOpen) addTagsParams(params);

    history.replace({ search: params.toString() });
  };

  return (
    <SelectMenu
      clearData={clearTranscriptFilter}
      actionDisabled={!timeRangeOpen && !tagsOpen}
      sections={({ onToggle }) => {
        return (
          <>
            <MenuSection
              title="Time Range"
              enabled={timeRangeOpen}
              toggleSection={() => setTimeRangeOpen(!timeRangeOpen)}
              className={ClassName.TRANSCRIPT_FILTERS_DATE_CHECKBOX}
            >
              <DatePicker currentRange={currentRange} onChange={(newRange: TimeRange | string) => setCurrentRange(newRange)} placement="right" />
            </MenuSection>

            <MenuSection
              title="Tags"
              enabled={tagsOpen}
              toggleSection={() => setTagsOpen(!tagsOpen)}
              className={ClassName.TRANSCRIPT_FILTERS_TAGS_CHECKBOX}
            >
              <ReportTagInput
                variant={InputVariant.SELECT_ONLY}
                onChange={(tags: string[]) => setTags([...new Set([...tags])])}
                selectedTags={tags}
              />
            </MenuSection>
            <Box borderTop={`1px solid ${THEME.colors.borders}`}>
              <ApplyFiltersButton
                className={ClassName.TRANSCRIPT_FILTERS_MENU_APPLY_BUTTON}
                variant={ButtonVariant.PRIMARY}
                onClick={() => {
                  appendURL();
                  onToggle();
                  trackingEvents.trackConversationListFiltered();
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
        <ClickableText isActive={isOpened} ref={ref} onClick={onToggle} className={ClassName.TRANSCRIPT_FILTERS_MENU_TEXT}>
          Add filters {filtersCounter > 0 && `(${filtersCounter})`}
        </ClickableText>
      )}
    </SelectMenu>
  );
};
export default TranscriptFilters;
