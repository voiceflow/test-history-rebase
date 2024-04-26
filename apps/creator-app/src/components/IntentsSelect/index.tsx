import { Utils } from '@voiceflow/common';
import { Menu } from '@voiceflow/ui';
import React from 'react';

import TagSelect from '@/components/TagSelect';
import { Designer } from '@/ducks';
import { useSelector } from '@/hooks/store.hook';

interface IntentsSelectProps {
  value: string[];
  onChange: (intents: string[]) => void;
}

const IntentsSelect: React.FC<IntentsSelectProps> = ({ value, onChange }) => {
  const intents = useSelector(Designer.Intent.selectors.allWithFormattedBuiltInNames);
  const intentsMap = useSelector(Designer.Intent.selectors.mapWithFormattedBuiltInName);

  return (
    <TagSelect
      value={value}
      options={Utils.array.inferUnion(intents)}
      onChange={onChange}
      getOptionKey={(option) => option.id}
      getOptionLabel={(id) => id && intentsMap[id]?.name}
      getOptionValue={(option) => option?.id ?? null}
      createInputPlaceholder="intents"
      selectAllLabel="Select All Intents"
      renderEmpty={({ search }) => (
        <Menu.NotFound>{!search ? 'No intents exist in this assistant.' : 'No intent found.'}</Menu.NotFound>
      )}
    />
  );
};

export default IntentsSelect;
