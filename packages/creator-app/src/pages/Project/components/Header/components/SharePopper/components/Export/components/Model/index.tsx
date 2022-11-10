import * as Realtime from '@voiceflow/realtime-sdk';
import { BlockText, Select, SvgIcon } from '@voiceflow/ui';
import React from 'react';
import { useSelector } from 'react-redux';

import IntentsSelect from '@/components/IntentsSelect';
import UpgradeOption from '@/components/UpgradeOption';
import * as NLP from '@/config/nlp';
import { Permission } from '@/config/permissions';
import { getNLUExportLimitDetails, isGatedNLUExportType } from '@/config/planLimits/nluExport';
import * as IntentV2 from '@/ducks/intentV2';
import * as ProjectV2 from '@/ducks/projectV2';
import { UpgradePrompt } from '@/ducks/tracking';
import { useActiveNLUConfig, usePermission } from '@/hooks';

import { ExportContext } from '../../Context';

const ExportModel: React.FC<{
  selectedIntentsIds?: string[];
}> = ({ selectedIntentsIds }) => {
  const nluConfig = useActiveNLUConfig();

  const { exportNLPType, setExportNLPType, setExportIntents, exportIntents, nlpTypes, setCanExport, setCheckedExportIntents } =
    React.useContext(ExportContext)!;
  const intents = useSelector(IntentV2.allIntentsSelector);
  const platform = useSelector(ProjectV2.active.platformSelector);
  const [permissionToExport] = usePermission(Permission.NLU_EXPORT_ALL);
  const [permissionToExportCSV] = usePermission(Permission.NLU_EXPORT_CSV);
  const [selectedIntents, setSelectedIntents] = React.useState(exportIntents);

  const noModelData = intents.length === 0;
  const exportNLPConfig = exportNLPType && NLP.Config.get(exportNLPType);

  const modelExportSelection = (value: NLP.Constants.NLPType) => {
    setExportNLPType(value);

    const isVoiceflow = value === NLP.Constants.NLPType.VOICEFLOW;

    if ((!permissionToExportCSV && isVoiceflow) || (!isVoiceflow && !permissionToExport)) {
      setCanExport(false);
    } else {
      setCanExport(true);
    }
  };

  React.useEffect(() => {
    if (nlpTypes.length === 1) {
      setExportNLPType(nlpTypes[0]);
    }
  }, [nlpTypes]);

  const handleOnChange = (intents: string[]) => {
    setExportIntents(intents);
    setSelectedIntents(intents);
  };

  React.useEffect(() => {
    if (selectedIntentsIds) {
      setCheckedExportIntents(selectedIntentsIds);
      setSelectedIntents(Array.from(new Set([...selectedIntentsIds, ...exportIntents])));
    }
  }, [selectedIntentsIds]);

  return (
    <>
      <label style={{ marginTop: 21 }}>Export format</label>
      <Select
        value={exportNLPType}
        prefix={exportNLPConfig ? <SvgIcon icon={exportNLPConfig.icon.name} color={exportNLPConfig.icon.color} /> : null}
        options={nlpTypes}
        onSelect={modelExportSelection}
        disabled={nlpTypes.length === 1}
        searchable
        placeholder="Choose an option"
        getOptionLabel={(value) => value && NLP.Config.get(value).name}
        renderOptionLabel={(option, searchLabel, getOptionLabel, getOptionValue, { isFocused }) => (
          <UpgradeOption
            option={option}
            isFocused={isFocused}
            searchLabel={searchLabel}
            getOptionLabel={getOptionLabel}
            getOptionValue={getOptionValue}
            isGated={isGatedNLUExportType(option, permissionToExport, permissionToExportCSV)}
            planDetails={getNLUExportLimitDetails(option)}
            promptOrigin={UpgradePrompt.EXPORT_NLU}
          />
        )}
      />

      {/* change this text */}
      <BlockText fontSize={13} color="#62778c" lineHeight="normal" marginTop={11}>
        <span>
          Export as .CSV, or as consumable file for {Realtime.Utils.typeGuards.isVoiceflowPlatform(platform) ? 'any NLU vendor' : nluConfig.name}.
        </span>
      </BlockText>

      <label style={{ marginTop: 24 }}>Intents</label>

      {noModelData ? (
        <BlockText fontSize={13} color="#62778c" lineHeight="normal" marginTop={12}>
          No model data currently exists
        </BlockText>
      ) : (
        <>
          <IntentsSelect value={selectedIntents} onChange={handleOnChange} />
        </>
      )}
    </>
  );
};

export default ExportModel;
