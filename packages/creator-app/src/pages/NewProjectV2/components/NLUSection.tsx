import * as Realtime from '@voiceflow/realtime-sdk';
import { MenuItemGrouped, Select, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import Section, { SectionVariant } from '@/components/Section';
import UpgradeOption from '@/components/UpgradeOption';
import { Permission } from '@/config/permissions';
import { getProjectNluLimitDetails, isGatedNLUType } from '@/config/planLimits/projects';
import { UpgradePrompt } from '@/ducks/tracking';
import { useFeature, useHover, usePermission } from '@/hooks';
import { Identifier } from '@/styles/constants';

import { NLU_OPTIONS, NLU_OPTIONS_NO_CX, PLATFORM_PROJECT_META_MAP } from '../constants';
import { ImportModel, PlatformAndProjectMeta, PlatformAndProjectMetaType, SupportedPlatformType } from '../types';
import ModelImport from './ModelImport';
import NLUSectionHeader from './NLUSectionHeader';
import SectionErrorMessage from './SectionErrorMessage';

interface NLUSectionProps {
  value: SupportedPlatformType | null;
  error: boolean;
  onSelect: (value: SupportedPlatformType) => void;
  importModel: ImportModel | null;
  onImportModel: (importModel: ImportModel) => void;
}

const getPrefixIcon = (isImportLoading: boolean, value: SupportedPlatformType | null) => {
  if (isImportLoading) return <SvgIcon size={16} icon="arrowSpin" spin />;

  const meta = value && PLATFORM_PROJECT_META_MAP[value];

  return meta?.icon ? <SvgIcon size={16} color={meta?.iconColor} icon={meta.icon} /> : undefined;
};

const NLUSection: React.FC<NLUSectionProps> = ({ value, onSelect, error, onImportModel, importModel }) => {
  const [isImportLoading, setIsImportLoading] = React.useState(false);
  const [permissionCustomNLU] = usePermission(Permission.NLU_CUSTOM);
  const [isHovered, , hoverHandlers] = useHover();
  const hasImport = value && PLATFORM_PROJECT_META_MAP[value]?.importMeta;

  const chooseCustomNLU = (value: PlatformAndProjectMetaType) => {
    if (!isGatedNLUType(value, permissionCustomNLU) && !PLATFORM_PROJECT_META_MAP[value]?.disabled) {
      onSelect(value as SupportedPlatformType);
    }
  };

  const isDialogflowCXEnabled = !!useFeature(Realtime.FeatureFlag.DIALOGFLOW_CX)?.isEnabled;

  return (
    <Section
      {...hoverHandlers}
      header={<NLUSectionHeader showInfoIcon={isHovered} />}
      variant={SectionVariant.FORM}
      dividers={false}
      customHeaderStyling={{ paddingTop: '24px' }}
      customContentStyling={{ paddingBottom: '0px' }}
    >
      <Select<PlatformAndProjectMeta, MenuItemGrouped<PlatformAndProjectMeta>, PlatformAndProjectMetaType>
        id={Identifier.PROJECT_CREATE_SELECT_NLU}
        value={value as PlatformAndProjectMetaType}
        error={error}
        prefix={getPrefixIcon(isImportLoading, value)}
        options={isDialogflowCXEnabled ? NLU_OPTIONS : NLU_OPTIONS_NO_CX}
        grouped
        useLayers
        onSelect={chooseCustomNLU}
        searchable
        placeholder="Select NLU"
        getOptionKey={(option) => option.type}
        getOptionValue={(option) => option?.type}
        getOptionLabel={(option) => (option ? PLATFORM_PROJECT_META_MAP[option]?.name : '')}
        renderOptionLabel={(option, searchLabel, getOptionLabel, getOptionValue, { isFocused }) => (
          <UpgradeOption<PlatformAndProjectMeta, PlatformAndProjectMetaType>
            option={option}
            isFocused={isFocused}
            searchLabel={searchLabel}
            getOptionLabel={getOptionLabel}
            getOptionValue={getOptionValue}
            isGated={isGatedNLUType(option.type, permissionCustomNLU)}
            popperEnabled={true}
            planDetails={getProjectNluLimitDetails(option)}
            promptOrigin={UpgradePrompt.SUPPORTED_NLUS}
          />
        )}
      />

      {hasImport && (
        <ModelImport
          platform={value}
          importModel={importModel}
          onImportModel={onImportModel}
          isImportLoading={isImportLoading}
          setIsImportLoading={setIsImportLoading}
        />
      )}

      {error && (
        <SectionErrorMessage>
          NLU selection is required. If you don’t already use one of these providers we recommend selecting the Voiceflow option.
        </SectionErrorMessage>
      )}
    </Section>
  );
};

export default NLUSection;
