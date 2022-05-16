import { MenuItemGrouped, Select, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import Section, { SectionVariant } from '@/components/Section';
import { useHover } from '@/hooks';

import { NLU_OPTIONS, PLATFORM_PROJECT_META_MAP } from '../constants';
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
  if (isImportLoading) return <SvgIcon size={16} icon="sync" spin />;

  const meta = value && PLATFORM_PROJECT_META_MAP[value];

  return meta?.icon ? <SvgIcon size={16} color={meta?.iconColor} icon={meta.icon} /> : undefined;
};

const NLUSection: React.FC<NLUSectionProps> = ({ value, onSelect, error, onImportModel, importModel }) => {
  const [isImportLoading, setIsImportLoading] = React.useState(false);

  const [isHovered, , hoverHandlers] = useHover();
  const hasImport = value && PLATFORM_PROJECT_META_MAP[value]?.importMeta;

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
        value={value as PlatformAndProjectMetaType}
        error={error}
        prefix={getPrefixIcon(isImportLoading, value)}
        options={NLU_OPTIONS}
        grouped
        useLayers
        onSelect={(value) => onSelect(value as SupportedPlatformType)}
        searchable
        placeholder="Select NLU"
        getOptionKey={(option) => option.type}
        getOptionValue={(option) => option?.type}
        getOptionLabel={(option) => (option ? PLATFORM_PROJECT_META_MAP[option]?.name : '')}
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
