import { Button, createDividerMenuItemOption, Menu, Select } from '@voiceflow/ui';
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
          <Menu.Footer>
            <Menu.Footer.Action>Create New Stuff</Menu.Footer.Action>
          </Menu.Footer>
        )}
      />
    );
  })
);

const suggestionDropdown = createExample(
  'suggestions dropdown',
  wrapContainer(() => {
    const [value] = React.useState('');
    const options = [
      {
        id: '1233',
        label: 'Intent name',
        note: '12%',
      },
      { id: '1232313', label: 'Intent name', score: 84 },
      { id: '1232saaaa13', label: 'Intent name', score: 72 },
      { id: '12334adsdaisn', label: 'Intent name' },
      { id: '1233sadoan', label: 'Intent name' },
    ];

    const dropdownOptions = React.useMemo(() => {
      const suggestedOptions = options.filter((option) => option.score);
      const otherOptions = options.filter((option) => !option.score);
      return [...suggestedOptions, createDividerMenuItemOption(), ...otherOptions];
    }, [options]);

    return (
      <Select<{ id: string; label: string; score?: number }, string>
        value={value}
        options={dropdownOptions}
        creatable
        inDropdownSearch
        alwaysShowCreate
        searchable
        clearable
        onSelect={() => {}}
        getOptionKey={(option) => option.id}
        getOptionValue={(option) => option?.id}
        getOptionLabel={(value) => (value ? options.find((option) => option.id === value)?.label : undefined)}
        createInputPlaceholder="intents"
        renderOptionLabel={({ label, score }) => (
          <>
            {label}
            {score && <Menu.ItemNote>{score}%</Menu.ItemNote>}
          </>
        )}
        renderFooterAction={() => (
          <Menu.Footer onClick={() => {}}>
            <Menu.Footer.Action>New Intent from selection</Menu.Footer.Action>
          </Menu.Footer>
        )}
        renderTrigger={({ onClick }) => <Button onClick={onClick}>Assign to intent</Button>}
      />
    );
  })
);

export default createSection('Select', 'src/components/Select/index.tsx', [searchableDropdown, suggestionDropdown]);
