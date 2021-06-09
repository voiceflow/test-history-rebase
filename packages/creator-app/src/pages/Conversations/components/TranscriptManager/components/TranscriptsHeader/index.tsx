import React from 'react';

import { FlexCenter } from '@/components/Flex';
import SelectMenu, { MenuSection } from '@/components/SelectMenu';
import { ClickableText } from '@/components/Text';

import { Container } from './components';

interface TranscriptsHeaderProps {
  resultCount: number;
}

const TranscriptsHeader = ({ resultCount }: TranscriptsHeaderProps) => (
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
        <ClickableText isActive={isOpen} ref={ref} onClick={onToggle}>
          Add filters
          {/* {numberOfEnabledFilters ? `(${numberOfEnabledFilters})` : ''} */}
        </ClickableText>
      )}
    </SelectMenu>
  </Container>
);

export default TranscriptsHeader;
