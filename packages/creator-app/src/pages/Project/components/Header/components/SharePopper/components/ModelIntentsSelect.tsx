import startCase from 'lodash/startCase';
import React from 'react';

import TagSelect from '@/components/TagSelect';
import * as IntentV2 from '@/ducks/intentV2';
import { useSelector } from '@/hooks';

import { ExportContext } from '../contexts';

const ModelIntentsSelect: React.FC = () => {
  const { setModelExportIntents: setSelectedIntents, modelExportIntents: selectedIntents } = React.useContext(ExportContext)!;

  const intents = useSelector(IntentV2.allIntentsSelector);
  const intentsMap = useSelector(IntentV2.intentsMapSelector);

  return (
    <TagSelect
      value={selectedIntents}
      options={intents}
      onChange={setSelectedIntents}
      getOptionKey={(option) => option.id}
      getOptionLabel={(id) => id && startCase(intentsMap[id]?.name.toLowerCase())}
      getOptionValue={(option) => option?.id ?? null}
      createInputPlaceholder="intents"
    />
  );
};

export default ModelIntentsSelect;
