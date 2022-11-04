import * as Platform from '@voiceflow/platform';
import * as Realtime from '@voiceflow/realtime-sdk';
import { getNestedMenuFormattedLabel, MenuItemGrouped, Select, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import PlanPermittedMenuItem from '@/components/PlanPermittedMenuItem';
import Section, { SectionVariant } from '@/components/Section';
import * as NLU from '@/config/nlu';
import { Permission } from '@/config/permissions';
import { isGatedNLUType } from '@/config/planLimits/projects';
import { UpgradePrompt } from '@/ducks/tracking';
import { useFeature, useHover, usePermission } from '@/hooks';
import { NLUImportModel } from '@/models';
import { Identifier } from '@/styles/constants';
import { isVoiceflowNLUOnlyPlatform } from '@/utils/typeGuards';

import { NLU_OPTIONS, NLU_OPTIONS_LEGACY, NLUOption } from '../constants';
import ModelImport from './ModelImport';
import NLUSectionHeader from './NLUSectionHeader';
import SectionErrorMessage from './SectionErrorMessage';

interface NLUSectionProps {
  nlu: NLU.Constants.NLUType | null;
  error: string;
  onSelect: (value: NLU.Constants.NLUType | null) => void;
  platform: Platform.Constants.PlatformType | null;
  importModel: NLUImportModel | null;
  onImportModel: (model: NLUImportModel) => void;
}

const getPrefixIcon = (isImportLoading: boolean, nluConfig: NLU.Base.Config | null) => {
  if (isImportLoading) return <SvgIcon size={16} icon="arrowSpin" spin />;

  return nluConfig && <SvgIcon size={16} color={nluConfig.icon.color} icon={nluConfig.icon.name} />;
};

const NLUSection: React.FC<NLUSectionProps> = ({ nlu, platform, error, onSelect, onImportModel, importModel }) => {
  const value = isVoiceflowNLUOnlyPlatform(platform) ? NLU.Constants.NLUType.VOICEFLOW : nlu;

  const [isHovered, , hoverHandlers] = useHover();
  const [permissionCustomNLU] = usePermission(Permission.NLU_CUSTOM);
  const isDialogflowCXEnabled = useFeature(Realtime.FeatureFlag.DIALOGFLOW_CX);
  const [isImportLoading, setIsImportLoading] = React.useState(false);

  const onSelectNLU = (value: NLU.Constants.NLUType | null) => {
    if (!value || !isGatedNLUType(value, permissionCustomNLU)) {
      onSelect(value);
    }
  };

  const nluConfig = value && NLU.Config.get(value);

  return (
    <Section
      {...hoverHandlers}
      header={<NLUSectionHeader showInfoIcon={isHovered} />}
      variant={SectionVariant.FORM}
      dividers={false}
      customHeaderStyling={{ paddingTop: '24px' }}
      customContentStyling={{ paddingBottom: '0px' }}
    >
      <Select<NLUOption, MenuItemGrouped<NLUOption>, NLU.Constants.NLUType>
        id={Identifier.PROJECT_CREATE_SELECT_NLU}
        value={value}
        disabled={isVoiceflowNLUOnlyPlatform(platform)}
        error={!!error}
        prefix={getPrefixIcon(isImportLoading, nluConfig)}
        options={isDialogflowCXEnabled ? NLU_OPTIONS : NLU_OPTIONS_LEGACY}
        grouped
        useLayers
        onSelect={onSelectNLU}
        clearable
        searchable
        placeholder="Select NLU"
        getOptionKey={(option) => option.type}
        getOptionValue={(option) => option?.type}
        getOptionLabel={(value) => value && NLU.Config.get(value).name}
        clearOnSelectActive
        renderOptionLabel={(option, searchLabel, getOptionLabel, getOptionValue, { isFocused }) => (
          <PlanPermittedMenuItem
            data={{ nluType: option.type }}
            label={getNestedMenuFormattedLabel(getOptionLabel(getOptionValue(option)), searchLabel)}
            isFocused={isFocused}
            permission={option.planType ? Permission.NLU_CUSTOM : null}
            tooltipProps={{ distance: 30 }}
            labelTooltip={option.labelTooltip}
            upgradePrompt={UpgradePrompt.SUPPORTED_NLUS}
          />
        )}
      />

      {value && nluConfig?.nlps[0].import && (
        <ModelImport
          nluConfig={nluConfig}
          importModel={importModel}
          onImportModel={onImportModel}
          isImportLoading={isImportLoading}
          setIsImportLoading={setIsImportLoading}
        />
      )}

      {!!error && <SectionErrorMessage>{error}</SectionErrorMessage>}
    </Section>
  );
};

export default NLUSection;
