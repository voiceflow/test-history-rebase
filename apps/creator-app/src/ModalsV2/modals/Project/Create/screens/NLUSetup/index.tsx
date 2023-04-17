import * as Platform from '@voiceflow/platform-config';
import { Box, Button, defaultMenuLabelRenderer, getNestedMenuFormattedLabel, Modal, SectionV2, Select, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import LocalesSelect from '@/components/LocalesSelect';
import PermittedMenuItem from '@/components/PermittedMenuItem';
import * as NLU from '@/config/nlu';
import { useGetPermission } from '@/hooks';
import { NLUImportModel } from '@/models';
import { Identifier } from '@/styles/constants';

import { ModelImport } from './components';
import { Modality, NLU as NLUConstants } from './constants';

interface PlatformSetupProps {
  nlu: Platform.Constants.NLUType | null;
  type: null | Platform.Constants.ProjectType;
  onNext: VoidFunction;
  onClose: VoidFunction;
  locales: string[];
  platform: null | Platform.Constants.PlatformType;
  importModel: NLUImportModel | null;
  onChangeNLU: (options: { platform: Platform.Constants.PlatformType | null; nlu: Platform.Constants.NLUType | null }) => void;
  onChangeType: (type: Platform.Constants.ProjectType | null) => void;
  onImportModel: (model: NLUImportModel) => void;
  onChangeLocales: (locales: string[]) => void;
}

const getIcon = ({ nluConfig, isImportLoading }: { nluConfig: NLU.Base.Config | null; isImportLoading?: boolean }) => {
  if (isImportLoading) return <SvgIcon size={16} icon="arrowSpin" spin />;

  return nluConfig && <SvgIcon size={16} color={nluConfig.icon.color} icon={nluConfig.icon.name} />;
};

const PlatformSetup: React.FC<PlatformSetupProps> = ({
  nlu,
  type,
  onNext: onNextProp,
  onClose,
  locales,
  platform,
  importModel,
  onChangeNLU,
  onChangeType,
  onImportModel,
  onChangeLocales,
}) => {
  const nluConfig = nlu && NLU.Config.get(nlu);
  const projectConfig = Platform.Config.getTypeConfig({ type, platform });

  const gasPermission = useGetPermission();

  const [nluError, setNLUError] = React.useState('');
  const [modalityError, setModalityError] = React.useState('');
  const [isImportLoading, setIsImportLoading] = React.useState(false);

  const onSelectNLU = (value: Platform.Constants.NLUType | null) => {
    if (value && !gasPermission(NLU.Config.get(value).permission).allowed) return;

    onChangeNLU({
      nlu: value,
      // some NLUs can be a platforms
      platform: Platform.Config.isSupported(value) ? value : Platform.Constants.PlatformType.VOICEFLOW,
    });
  };

  const onNext = () => {
    if (!type) {
      setModalityError('Modality selection is required.');
      return;
    }

    if (!nlu || !platform) {
      setNLUError('NLU selection is required. If you don’t already use one of these providers we recommend selecting the Voiceflow option.');
      return;
    }

    onNextProp();
  };

  const handleSelectModality = (type: Platform.Constants.ProjectType | null) => {
    if (modalityError) setModalityError('');
    onChangeType(type);
  };

  const handleSelectNLU = (value: Platform.Constants.NLUType | null) => {
    if (nluError) setNLUError('');
    onSelectNLU(value);
  };

  return (
    <>
      <Modal.Body>
        <SectionV2.SimpleContentSection
          header={
            <SectionV2.Title bold secondary>
              Modality
            </SectionV2.Title>
          }
          headerProps={{ px: 0, bottomUnit: 1.5 }}
          contentProps={{ px: 0, bottomOffset: 0 }}
        >
          <Select
            id={Identifier.PROJECT_CREATE_SELECT_MODALITY}
            value={type}
            error={!!modalityError}
            prefix={type && <SvgIcon size={16} icon={Modality.OPTIONS_MAP[type].icon} color={Modality.OPTIONS_MAP[type].iconColor} />}
            options={Modality.OPTIONS}
            onSelect={handleSelectModality}
            useLayers
            clearable
            searchable
            placeholder="Select modality"
            getOptionKey={(option) => option.type}
            getOptionValue={(option) => option?.type}
            getOptionLabel={(value) => value && Modality.OPTIONS_MAP[value].name}
            clearOnSelectActive
            renderOptionLabel={(option, ...args) => (
              <Box.Flex gap={16}>
                <SvgIcon size={16} icon={option.icon} color={option.iconColor} />
                {defaultMenuLabelRenderer(option, ...args)}
              </Box.Flex>
            )}
          />

          {!!modalityError && <SectionV2.ErrorMessage>{modalityError}</SectionV2.ErrorMessage>}
        </SectionV2.SimpleContentSection>

        <SectionV2.SimpleContentSection
          header={
            <SectionV2.Title bold secondary>
              NLU
            </SectionV2.Title>
          }
          headerProps={{ px: 0, bottomUnit: 1.5 }}
          contentProps={{ px: 0, bottomOffset: 0 }}
        >
          <Select
            id={Identifier.PROJECT_CREATE_SELECT_NLU}
            value={nlu}
            error={!!nluError}
            prefix={getIcon({ nluConfig, isImportLoading })}
            options={NLUConstants.OPTIONS}
            onSelect={handleSelectNLU}
            useLayers
            clearable
            searchable
            placeholder="Select NLU"
            getOptionKey={(option) => option.type}
            getOptionValue={(option) => option?.type}
            getOptionLabel={(value) => (value === Platform.Constants.NLUType.VOICEFLOW ? 'Voiceflow (default)' : value && NLU.Config.get(value).name)}
            clearOnSelectActive
            renderOptionLabel={(option, searchLabel, getOptionLabel, getOptionValue, { isFocused }) => (
              <PermittedMenuItem
                data={{ nluType: option.type }}
                label={
                  <Box.Flex gap={16}>
                    {getIcon({ nluConfig: NLU.Config.get(option.type) })}

                    <span>{getNestedMenuFormattedLabel(getOptionLabel(getOptionValue(option)), searchLabel)}</span>
                  </Box.Flex>
                }
                isFocused={isFocused}
                permission={option.permission}
                tooltipProps={{ offset: [0, 30] }}
                labelTooltip={option.labelTooltip}
              />
            )}
          />

          {nlu && nluConfig?.nlps[0].import && (
            <ModelImport
              platform={Platform.Config.isSupported(nluConfig.type) ? nluConfig.type : platform ?? Platform.Constants.PlatformType.VOICEFLOW}
              nluConfig={nluConfig}
              importModel={importModel}
              onImportModel={onImportModel}
              isImportLoading={isImportLoading}
              setIsImportLoading={setIsImportLoading}
            />
          )}

          {!!nluError && <SectionV2.ErrorMessage>{nluError}</SectionV2.ErrorMessage>}
        </SectionV2.SimpleContentSection>

        <SectionV2.SimpleContentSection
          header={
            <SectionV2.Title bold secondary>
              {projectConfig.project.locale.name}
            </SectionV2.Title>
          }
          headerProps={{ px: 0, bottomUnit: 1.5 }}
          contentProps={{ px: 0, bottomOffset: 0 }}
        >
          <LocalesSelect type={type} platform={platform} locales={locales} onChange={onChangeLocales} />
        </SectionV2.SimpleContentSection>
      </Modal.Body>

      <Modal.Footer gap={12}>
        <Button variant={Button.Variant.TERTIARY} onClick={() => onClose()} squareRadius>
          Cancel
        </Button>

        <Button onClick={() => onNext()}>Continue</Button>
      </Modal.Footer>
    </>
  );
};

export default PlatformSetup;
