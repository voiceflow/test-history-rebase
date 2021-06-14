import React from 'react';
import { useHistory } from 'react-router-dom';

import { FlexCenter } from '@/components/Flex';
import SelectMenu, { MenuSection } from '@/components/SelectMenu';
import { ClickableText } from '@/components/Text';
import { FILTER_TAG } from '@/pages/Conversations/constants';

import { Container } from './components';

interface TranscriptsHeaderProps {
  resultCount: number;
}

const getRandNumString = () => {
  return Math.floor(Math.random() * 90 + 10).toString();
};

const TranscriptsHeader = ({ resultCount }: TranscriptsHeaderProps) => {
  const history = useHistory();

  const handleFilterChange = () => {
    const params = new URLSearchParams();
    params.append(FILTER_TAG.TAG, getRandNumString());
    params.append(FILTER_TAG.TAG, getRandNumString());
    params.append(FILTER_TAG.START_DATE, getRandNumString());
    params.append(FILTER_TAG.END_DATE, getRandNumString());
    history.push({ search: params.toString() });
  };

  return (
    <Container>
      <b>Conversations ({resultCount})</b>
      <SelectMenu
        // Based off if any filters are enabled
        actionDisabled={true}
        sections={(_setData, _data) => (
          <>
            <MenuSection
              title="Time Range"
              enabled={true}
              toggleSection={() => {
                // _setData()
              }}
            >
              <FlexCenter style={{ flex: 2, color: '#8da2b5', height: '100px' }}> - Date Range Selector - </FlexCenter>
            </MenuSection>
            <MenuSection
              title="Tags"
              enabled={true}
              toggleSection={() => {
                // _setData()
              }}
            >
              <FlexCenter style={{ flex: 2, color: '#8da2b5', height: '100px' }}> - Tag Selector - </FlexCenter>
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
