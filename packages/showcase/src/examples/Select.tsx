import { NestedMenuComponents, Select } from '@voiceflow/ui';
import React from 'react';

import { withBox } from './hocs';
import { createExample, createSection } from './utils';

const wrapContainer = withBox({ width: 300, backgroundColor: '#fff' });

const searchableDropdown = createExample(
  'searchable dropdown',
  wrapContainer(() => {
    const [value] = React.useState('');
    const options = [
      { id: '1233', label: 'test 123' },
      { id: '12334', label: 'test 1234' },
    ];
    const optionLookup: Record<string, string> = { '1233': 'test 123', '12334': 'test 1234' };

    return (
      <Select
        value={value}
        options={options}
        onCreate={() => {}}
        onSelect={() => {}}
        creatable
        inDropdownSearch
        alwaysShowCreate
        searchable
        placeholder="Select something"
        getOptionValue={(option) => option?.id}
        getOptionLabel={(value) => (value ? optionLookup[value] : undefined)}
        createInputPlaceholder="for something"
        renderFooterAction={() => (
          <NestedMenuComponents.FooterActionContainer onClick={() => {}}>Create New Stuff</NestedMenuComponents.FooterActionContainer>
        )}
      />
    );
  })
);

export default createSection('Select', 'src/components/Select/index.tsx', [searchableDropdown]);
