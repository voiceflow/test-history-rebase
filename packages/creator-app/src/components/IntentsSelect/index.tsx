import { Menu } from '@voiceflow/ui';
import React from 'react';

import TagSelect from '@/components/TagSelect';
import * as IntentV2 from '@/ducks/intentV2';
import * as ProjectV2 from '@/ducks/projectV2';
import { useSelector } from '@/hooks';
import { fmtIntentName } from '@/utils/intent';

interface IntentsSelectProps {
  value: string[];
  onChange: (intents: string[]) => void;
}

const IntentsSelect: React.FC<IntentsSelectProps> = ({ value, onChange }) => {
  const platform = useSelector(ProjectV2.active.platformSelector);
  const intents = useSelector(IntentV2.allIntentsSelector);
  const intentsMap = useSelector(IntentV2.intentsMapSelector);

  return (
    <TagSelect
      value={value}
      options={intents}
      onChange={onChange}
      getOptionKey={(option) => option.id}
      getOptionLabel={(id) => id && fmtIntentName(intentsMap[id], platform)}
      getOptionValue={(option) => option?.id ?? null}
      createInputPlaceholder="intents"
      selectAllLabel="Select All Intents"
      renderEmpty={({ search }) => <Menu.NotFound>{!search ? 'No intents exist in this assistant.' : 'No intent found.'}</Menu.NotFound>}
    />
  );
};

export default IntentsSelect;
