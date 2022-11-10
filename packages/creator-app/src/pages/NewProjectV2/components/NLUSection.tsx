import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, getNestedMenuFormattedLabel, MenuItemGrouped, Select, SvgIcon, ThemeColor } from '@voiceflow/ui';
import React from 'react';

import PlanPermittedMenuItem from '@/components/PlanPermittedMenuItem';
import Section, { SectionVariant } from '@/components/Section';
import * as NLU from '@/config/nlu';
import { UpgradePrompt } from '@/ducks/tracking';
import { useFeature, useHasPermission, useHover } from '@/hooks';
import { NLUImportModel } from '@/models';
import { Identifier } from '@/styles/constants';

import { NLU_OPTIONS, NLU_OPTIONS_LEGACY, NLUOption } from '../constants';
import ModelImport from './ModelImport';
import NLUSectionHeader from './NLUSectionHeader';
import SectionErrorMessage from './SectionErrorMessage';

interface NLUSectionProps {
  value: Platform.Constants.NLUType | null;
  error: string;
  onSelect: (value: Platform.Constants.NLUType | null) => void;
  platform: Platform.Constants.PlatformType | null;
  importModel: NLUImportModel | null;
  onImportModel: (model: NLUImportModel) => void;
}

const getPrefixIcon = (isImportLoading: boolean, nluConfig: NLU.Base.Config | null) => {
  if (isImportLoading) return <SvgIcon size={16} icon="arrowSpin" spin />;

  return nluConfig && <SvgIcon size={16} color={nluConfig.icon.color} icon={nluConfig.icon.name} />;
};

const NLUSection: React.FC<NLUSectionProps> = ({ value, platform, error, onSelect, onImportModel, importModel }) => {
  const platformConfig = Platform.Config.get(platform);

  const hasPermission = useHasPermission();
  const isDialogflowCXEnabled = useFeature(Realtime.FeatureFlag.DIALOGFLOW_CX);
  const [isHovered, , hoverHandlers] = useHover();
  const [isImportLoading, setIsImportLoading] = React.useState(false);

  const onSelectNLU = (value: Platform.Constants.NLUType | null) => {
    if (!value || hasPermission(NLU.Config.get(value).permission)) {
      onSelect(value);
    }
  };

  const nluConfig = value && NLU.Config.get(value);

  const isNLULocked = !!platform && platformConfig.supportedNLUs.length === 1;

  return (
    <Section
      {...hoverHandlers}
      header={<NLUSectionHeader showInfoIcon={isHovered} />}
      variant={SectionVariant.FORM}
      dividers={false}
      customHeaderStyling={{ paddingTop: '24px' }}
      customContentStyling={{ paddingBottom: '0px' }}
    >
      <Select<NLUOption, MenuItemGrouped<NLUOption>, Platform.Constants.NLUType>
        id={Identifier.PROJECT_CREATE_SELECT_NLU}
        value={value}
        disabled={isNLULocked}
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
        getOptionLabel={(value) => (value === Platform.Constants.NLUType.VOICEFLOW ? 'Voiceflow (default)' : value && NLU.Config.get(value).name)}
        clearOnSelectActive
        renderOptionLabel={(option, searchLabel, getOptionLabel, getOptionValue, { isFocused }) => (
          <PlanPermittedMenuItem
            data={{ nluType: option.type }}
            label={getNestedMenuFormattedLabel(getOptionLabel(getOptionValue(option)), searchLabel)}
            isFocused={isFocused}
            permission={option.permission}
            tooltipProps={{ distance: 30 }}
            labelTooltip={option.labelTooltip}
            upgradePrompt={UpgradePrompt.SUPPORTED_NLUS}
          />
        )}
      />

      {isNLULocked ? (
        <Box fontSize={13} color={ThemeColor.SECONDARY} mt={12}>
          NLU is predefined for the {Platform.Config.get(platform).name} channel
        </Box>
      ) : (
        value &&
        nluConfig?.nlps[0].import && (
          <ModelImport
            platform={Platform.Config.isSupported(nluConfig.type) ? nluConfig.type : platform ?? Platform.Constants.PlatformType.VOICEFLOW}
            nluConfig={nluConfig}
            importModel={importModel}
            onImportModel={onImportModel}
            isImportLoading={isImportLoading}
            setIsImportLoading={setIsImportLoading}
          />
        )
      )}

      {!!error && <SectionErrorMessage>{error}</SectionErrorMessage>}
    </Section>
  );
};

export default NLUSection;
