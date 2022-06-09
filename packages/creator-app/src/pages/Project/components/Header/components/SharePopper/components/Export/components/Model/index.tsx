import { BlockText, Select } from '@voiceflow/ui';
import React from 'react';
import { useSelector } from 'react-redux';

import Divider from '@/components/Divider';
import UpgradeOption from '@/components/UpgradeOption';
import { FeatureFlag } from '@/config/features';
import { Permission } from '@/config/permissions';
import { getNLUExportLimitPlan, getNLUExportTooltipTitle, isGatedNLUExportType } from '@/config/planLimits/nluExport';
import { NLPProvider, NLPProviderLabels } from '@/constants';
import * as IntentV2 from '@/ducks/intentV2';
import { useFeature, usePermission } from '@/hooks';

import { ExportContext } from '../../Context';
import { IntentsSelect } from './components';

const ExportModel: React.FC<{
  selectedIntents?: string[];
}> = ({ selectedIntents }) => {
  const { modelExportProvider, setModelExportProvider, setModelExportIntents, modelExportIntents, nlpProviderOptions, setCanExport } =
    React.useContext(ExportContext)!;
  const intents = useSelector(IntentV2.allIntentsSelector);
  const noModelData = intents.length === 0;
  const revisedEntitlements = useFeature(FeatureFlag.REVISED_CREATOR_ENTITLEMENTS);
  const [permissionToExport] = usePermission(revisedEntitlements.isEnabled ? Permission.NLU_EXPORT_ALL : Permission.MODEL_EXPORT);
  const [permissionToExportCSV] = usePermission(Permission.NLU_EXPORT_CSV);

  const modelExportSelection = (value: NLPProvider) => {
    setModelExportProvider(value);
    setCanExport(!(revisedEntitlements.isEnabled && (!permissionToExport || !(permissionToExportCSV && value === NLPProvider.VF_CSV))));
  };

  React.useEffect(() => {
    if (nlpProviderOptions.length === 1) {
      setModelExportProvider(nlpProviderOptions[0]);
    }
  }, [nlpProviderOptions]);

  React.useEffect(() => {
    if (selectedIntents) {
      setModelExportIntents(selectedIntents);
    }
  }, [selectedIntents]);

  return (
    <>
      {revisedEntitlements.isEnabled ? (
        <Select
          value={modelExportProvider}
          options={nlpProviderOptions}
          onSelect={modelExportSelection}
          disabled={nlpProviderOptions.length === 1}
          searchable
          placeholder="Choose an option"
          getOptionLabel={(value) => value && NLPProviderLabels[value]}
          renderOptionLabel={(option, searchLabel, getOptionLabel, getOptionValue, { isFocused }) => (
            <UpgradeOption
              option={option}
              isFocused={isFocused}
              searchLabel={searchLabel}
              getOptionLabel={getOptionLabel}
              getOptionValue={getOptionValue}
              isGated={isGatedNLUExportType(option, permissionToExport, permissionToExportCSV)}
              tooltipTitle={getNLUExportTooltipTitle(option)}
              plan={getNLUExportLimitPlan(option)}
            />
          )}
        />
      ) : (
        <Select
          value={modelExportProvider}
          options={nlpProviderOptions}
          onSelect={setModelExportProvider}
          disabled={nlpProviderOptions.length === 1}
          searchable
          placeholder="Choose an option"
          getOptionLabel={(value) => value && NLPProviderLabels[value]}
        />
      )}

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
