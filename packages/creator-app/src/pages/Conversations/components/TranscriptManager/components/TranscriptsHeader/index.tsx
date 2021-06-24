import { ClickableText } from '@voiceflow/ui';
import React from 'react';
import { useHistory } from 'react-router-dom';

import ReportTagInput, { InputVariant } from '@/components/ReportTagInput';
import SelectMenu, { MenuSection } from '@/components/SelectMenu';
import { FILTER_TAG } from '@/pages/Conversations/constants';

import { Container } from './components';
import DatePicker from './TimeRangePicker/DatePicker';

interface TranscriptsHeaderProps {
  resultCount: number;
}

const getRandNumString = () => {
  return Math.floor(Math.random() * 90 + 10).toString();
};

const TranscriptsHeader = ({ resultCount }: TranscriptsHeaderProps) => {
  const history = useHistory();
  const [tags, setTags] = React.useState<string[]>(['positiveEmpotion']);

  const handleFilterChange = () => {
    const params = new URLSearchParams();
    params.append(FILTER_TAG.TAG, getRandNumString());
    params.append(FILTER_TAG.TAG, getRandNumString());
    history.push({ search: params.toString() });
  };

  // TODO: set to default dates
  const [startDate, setStartDate] = React.useState('' as string | Date);
  const [timeRangeOpen, setTimeRangeOpen] = React.useState(true);
  const [tagsOpen, setTagsOpen] = React.useState(false);
  return (
    <Container>
      <b>Conversations ({resultCount})</b>
      <SelectMenu
        // Based off if any filters are enabled
        actionDisabled={true}
        sections={(_setData, _data) => (
          <>
            <MenuSection title="Time Range" enabled={timeRangeOpen} toggleSection={() => setTimeRangeOpen(!timeRangeOpen)}>
              <>
                <DatePicker date={startDate} onChange={(newDate) => setStartDate(newDate)}></DatePicker>
              </>
            </MenuSection>
            <MenuSection
              title="Tags"
              enabled={tagsOpen}
              toggleSection={() => {
                setTagsOpen(!tagsOpen);
              }}
            >
              <ReportTagInput variant={InputVariant.SELECT_ONLY} onChange={(value: string[]) => setTags(value)} selectedTags={tags} />
            </MenuSection>
          </>
        )}
      >
        {(ref, onToggle, isOpen, _data) => (
          // const numberOfEnabledFilters = data.filters
          <ClickableText
            isActive={isOpen}
            ref={ref}
            onClick={() => {
              onToggle();
              handleFilterChange();
            }}
          >
            Add filters
            {/* {numberOfEnabledFilters ? `(${numberOfEnabledFilters})` : ''} */}
          </ClickableText>
        )}
      </SelectMenu>
    </Container>
  );
};

export default TranscriptsHeader;
