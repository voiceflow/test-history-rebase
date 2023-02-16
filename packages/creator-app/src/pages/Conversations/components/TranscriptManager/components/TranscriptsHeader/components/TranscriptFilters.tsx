import { System } from '@voiceflow/ui';
import queryString from 'query-string';
import React from 'react';
import { useHistory } from 'react-router-dom';

import ReportTagInput, { InputVariant } from '@/components/ReportTagInput';
import SelectMenu, { MenuSection } from '@/components/SelectMenu';
import { useLinkedState, useTrackingEvents } from '@/hooks';
import { FilterTag, isBuiltInRange } from '@/pages/Conversations/constants';
import { ClassName } from '@/styles/constants';

import DatePicker from './TimeRangePicker/DatePicker';

export interface TranscriptFiltersProps {
  tags: string[];
  range: string;
  endDate: string;
  startDate: string;
}

const TranscriptFilters: React.FC<TranscriptFiltersProps> = ({ tags, range, endDate, startDate }) => {
  const history = useHistory();

  const [trackingEvents] = useTrackingEvents();

  const initialRange = React.useMemo(() => {
    if (!endDate || !startDate) return range;

    return `${new Date(parseInt(endDate, 10)).toLocaleDateString()} - ${new Date(parseInt(startDate, 10)).toLocaleDateString()}`;
  }, [startDate, endDate]);

  const [tagsOpen, setTagsOpen] = React.useState(!!tags.length);
  const [timeRangeOpen, setTimeRangeOpen] = React.useState(!!initialRange);

  const [currentTags, setCurrentTags] = useLinkedState(tags);
  const [currentRange, setCurrentRange] = useLinkedState(initialRange);

  const onClear = () => {
    setCurrentTags([]);
    setCurrentRange('');

    setTagsOpen(false);
    setTimeRangeOpen(false);
  };

  const onClose = () => {
    setTagsOpen(!!currentTags.length);
    setTimeRangeOpen(!!currentRange);
  };

  const onToggleTags = () => {
    if (tagsOpen) {
      setCurrentTags([]);
    }

    setTagsOpen(!tagsOpen);
  };

  const onToggleRange = () => {
    if (timeRangeOpen) {
      setCurrentRange('');
    }

    setTimeRangeOpen(!timeRangeOpen);
  };

  const onApplyFilters = () => {
    if (!currentRange && currentTags.length === 0) {
      history.replace({ search: '' });
    } else {
      const params: queryString.ParsedQuery = {};

      if (currentTags.length) {
        params[FilterTag.TAG] = currentTags;
      }

      if (isBuiltInRange(currentRange)) {
        params[FilterTag.RANGE] = currentRange;
      } else if (currentRange) {
        const [startStr, endStr] = currentRange.split('-');

        params[FilterTag.START_DATE] = new Date(startStr).getTime().toString();
        params[FilterTag.END_DATE] = new Date(endStr).getTime().toString();
      }

      history.replace({ search: queryString.stringify(params) });
    }
  };

  React.useEffect(() => {
    onApplyFilters();
    trackingEvents.trackConversationListFiltered();
  }, [currentRange, currentTags]);

  return (
    <SelectMenu
      onClear={onClear}
      onClose={onClose}
      actionDisabled={!currentTags.length && !currentRange}
      sections={() => (
        <>
          <MenuSection
            title="Time Range"
            enabled={timeRangeOpen}
            className={ClassName.TRANSCRIPT_FILTERS_DATE_CHECKBOX}
            toggleSection={onToggleRange}
          >
            <DatePicker currentRange={currentRange} onChange={setCurrentRange} placement="right" />
          </MenuSection>

          <MenuSection title="Tags" enabled={tagsOpen} className={ClassName.TRANSCRIPT_FILTERS_TAGS_CHECKBOX} toggleSection={onToggleTags}>
            <ReportTagInput variant={InputVariant.SELECT_ONLY} onChange={setCurrentTags} selectedTags={currentTags} />
          </MenuSection>
        </>
      )}
    >
      {({ ref, isOpened, onToggle }) => (
        <System.IconButtonsGroup.Base>
          <System.IconButton.Base ref={ref} icon="filter" active={isOpened} onClick={onToggle} className={ClassName.TRANSCRIPT_FILTERS_MENU_TEXT} />
        </System.IconButtonsGroup.Base>
      )}
    </SelectMenu>
  );
};
export default TranscriptFilters;
