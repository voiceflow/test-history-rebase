import { System } from '@voiceflow/ui';
import queryString from 'query-string';
import React from 'react';
import { useHistory } from 'react-router-dom';

import ReportTagInput, { InputVariant } from '@/components/ReportTagInput';
import SelectMenu, { MenuSection } from '@/components/SelectMenu';
import { useLinkedState, useTrackingEvents } from '@/hooks';
import { FilterTag, isBuiltInRange } from '@/pages/Conversations/constants';
import { ClassName } from '@/styles/constants';

import PersonasSelect from './PersonasSelect';
import DatePicker from './TimeRangePicker/DatePicker';

export interface TranscriptFiltersProps {
  tags: string[];
  range: string;
  personas: string[];
  endDate: string;
  startDate: string;
}

const TranscriptFilters: React.FC<TranscriptFiltersProps> = ({ tags, personas, range, endDate, startDate }) => {
  const history = useHistory();

  const [trackingEvents] = useTrackingEvents();

  const initialRange = React.useMemo(() => {
    if (!endDate || !startDate) return range;

    return `${new Date(parseInt(endDate, 10)).toLocaleDateString()} - ${new Date(parseInt(startDate, 10)).toLocaleDateString()}`;
  }, [startDate, endDate]);

  const [tagsOpen, setTagsOpen] = React.useState(!!tags.length);
  const [personasOpen, setPersonasOpen] = React.useState(!!personas.length);
  const [timeRangeOpen, setTimeRangeOpen] = React.useState(!!initialRange);

  const [currentTags, setCurrentTags] = useLinkedState(tags);
  const [currentRange, setCurrentRange] = useLinkedState(initialRange);
  const [currentPersonas, setCurrentPersonas] = useLinkedState(personas);

  const onClear = () => {
    setCurrentTags([]);
    setCurrentRange('');
    setCurrentPersonas([]);

    setTagsOpen(false);
    setPersonasOpen(false);
    setTimeRangeOpen(false);
  };

  const onClose = () => {
    setTagsOpen(!!currentTags.length);
    setTimeRangeOpen(!!currentRange);
    setPersonasOpen(!!currentPersonas.length);
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

  const onTogglePersonas = () => {
    if (personasOpen) {
      setCurrentPersonas([]);
    }

    setPersonasOpen(!personasOpen);
  };

  const onApplyFilters = () => {
    if (!currentRange && !currentTags.length && !currentPersonas.length) {
      history.replace({ search: '' });
    } else {
      const params: queryString.ParsedQuery = {};

      if (currentTags.length) {
        params[FilterTag.TAG] = currentTags;
      }

      if (currentPersonas.length) {
        params[FilterTag.PERSONA] = currentPersonas;
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
  }, [currentRange, currentTags, currentPersonas]);

  return (
    <SelectMenu
      onClear={onClear}
      onClose={onClose}
      actionDisabled={!currentTags.length && !currentRange && !currentPersonas.length}
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

          <MenuSection
            title="Tags"
            enabled={tagsOpen}
            className={ClassName.TRANSCRIPT_FILTERS_TAGS_CHECKBOX}
            toggleSection={onToggleTags}
          >
            <ReportTagInput variant={InputVariant.SELECT_ONLY} onChange={setCurrentTags} selectedTags={currentTags} />
          </MenuSection>

          <MenuSection
            title="Test Persona"
            enabled={personasOpen}
            className={ClassName.TRANSCRIPT_FILTERS_TAGS_CHECKBOX}
            toggleSection={onTogglePersonas}
          >
            <PersonasSelect onChange={setCurrentPersonas} value={currentPersonas} />
          </MenuSection>
        </>
      )}
    >
      {({ ref, isOpened, onToggle }) => (
        <System.IconButtonsGroup.Base>
          <System.IconButton.Base
            ref={ref}
            icon="filter"
            active={isOpened}
            onClick={onToggle}
            className={ClassName.TRANSCRIPT_FILTERS_MENU_TEXT}
          />
        </System.IconButtonsGroup.Base>
      )}
    </SelectMenu>
  );
};
export default TranscriptFilters;
