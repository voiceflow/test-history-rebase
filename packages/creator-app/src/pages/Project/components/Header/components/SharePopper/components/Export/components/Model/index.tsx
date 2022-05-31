import { BlockText, Select } from '@voiceflow/ui';
import React from 'react';
import { useSelector } from 'react-redux';

import Divider from '@/components/Divider';
import { NLPProviderLabels } from '@/constants';
import * as IntentV2 from '@/ducks/intentV2';

import { ExportContext } from '../../Context';
import { IntentsSelect } from './components';

const ExportModel: React.FC = () => {
  const { modelExportProvider, setModelExportProvider, setModelExportIntents, modelExportIntents, nlpProviderOptions } =
    React.useContext(ExportContext)!;
  const intents = useSelector(IntentV2.allIntentsSelector);
  const noModelData = intents.length === 0;

  React.useEffect(() => {
    if (nlpProviderOptions.length === 1) {
      setModelExportProvider(nlpProviderOptions[0]);
    }
  }, [nlpProviderOptions]);

  return (
    <>
      <Select
        value={modelExportProvider}
        options={nlpProviderOptions}
        onSelect={setModelExportProvider}
        disabled={nlpProviderOptions.length === 1}
        searchable
        placeholder="Choose an option"
        getOptionLabel={(value) => value && NLPProviderLabels[value]}
      />

      {noModelData ? (
        <BlockText fontSize={13} color="#62778c" lineHeight="normal" marginTop={12}>
          No model data currently exists
        </BlockText>
      ) : (
        <>
          <Divider style={{ margin: '20px 0px', width: 'calc(100% + 64px)' }} />
          <IntentsSelect value={modelExportIntents} onChange={setModelExportIntents} />
        </>
      )}
    </>
  );
};

export default ExportModel;
