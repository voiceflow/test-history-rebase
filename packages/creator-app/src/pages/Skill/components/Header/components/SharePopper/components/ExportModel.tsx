import { BlockText, Box, Select } from '@voiceflow/ui';
import React from 'react';
import { useSelector } from 'react-redux';

import ChatWithUsLink from '@/components/ChatLink';
import Divider from '@/components/Divider';
import RadioGroup from '@/components/RadioGroup';
import { NLPProviderLabels } from '@/constants';
import * as ProjectV2 from '@/ducks/projectV2';

import { getNplModelProvider, MODEL_EXPORT_OPTIONS, ModelExportConfig } from '../constants';
import { ExportContext } from '../contexts';
import ModelIntentsSelect from './ModelIntentsSelect';

const ExportModel: React.FC = () => {
  const platform = useSelector(ProjectV2.active.platformSelector);
  const { modelExportConfig, setModelExportConfig, modelExportProvider, setModelExportProvider } = React.useContext(ExportContext)!;

  const nplProviderOptions = React.useMemo(() => getNplModelProvider(platform), [platform]);

  React.useEffect(() => {
    if (nplProviderOptions.length === 1) {
      setModelExportProvider(nplProviderOptions[0]);
    }
  }, [nplProviderOptions]);

  return (
    <>
      <Select
        value={modelExportProvider}
        options={nplProviderOptions}
        onSelect={setModelExportProvider}
        searchable
        placeholder="Choose an option"
        getOptionLabel={(value) => NLPProviderLabels[value!]}
        disabled={nplProviderOptions.length === 1}
      />

      <BlockText fontSize={13} color="#62778c" lineHeight="normal" marginTop={12}>
        <span>Don't see the export format you're looking for? </span>
        <ChatWithUsLink>Contact Us.</ChatWithUsLink>
      </BlockText>

      <Divider />

      <BlockText color="#62778c" fontSize={13} mb={10} fontWeight="bold">
        Configuration
      </BlockText>

      <Box mb={16}>
        <RadioGroup isFlat options={MODEL_EXPORT_OPTIONS} checked={modelExportConfig} onChange={setModelExportConfig} />
      </Box>

      {modelExportConfig === ModelExportConfig.INTENTS && <ModelIntentsSelect />}
    </>
  );
};

export default ExportModel;
