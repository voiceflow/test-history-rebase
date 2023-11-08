import { Nullable } from '@voiceflow/common';
import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import {
  Box,
  Button,
  defaultMenuLabelRenderer,
  Input,
  Modal,
  SectionV2,
  Select,
  SvgIcon,
  Upload,
  UploadIconVariant,
  useLinkedState,
} from '@voiceflow/ui';
import React from 'react';

import LocalesSelect from '@/components/LocalesSelect';
import { useFeature } from '@/hooks';
import { NLUImportModel } from '@/models';
import { Identifier } from '@/styles/constants';

import { ModelImport } from './components';
import { Modality } from './constants';

interface SetupProps {
  name: string;
  image: string | null;
  type: null | Platform.Constants.ProjectType;
  onNext: (options: { name: string; image: string | null }) => void;
  onClose: VoidFunction;
  locales: string[];
  platform: null | Platform.Constants.PlatformType;
  importModel: NLUImportModel | null;
  onChangeType: (type: Platform.Constants.ProjectType | null, platform: Platform.Constants.PlatformType | null) => void;
  onImportModel: (model: NLUImportModel) => void;
  onChangeLocales: (locales: string[]) => void;
}

const Setup: React.FC<SetupProps> = ({
  name: nameProp,
  image: imageProp,
  type,
  onNext: onNextProp,
  onClose,
  locales,
  platform,
  importModel,
  onChangeType,
  onImportModel,
  onChangeLocales,
}) => {
  const { isEnabled: canUseAlexa } = useFeature(Realtime.FeatureFlag.ALEXA_DEPRECATED);
  const projectConfig = Platform.Config.getTypeConfig({ type, platform });

  const [name, setName] = useLinkedState(nameProp);
  const [image, setImage] = useLinkedState<string | null>(imageProp);

  const [modalityError, setModalityError] = React.useState('');
  const [isImportLoading, setIsImportLoading] = React.useState(false);

  const onNext = () => {
    if (!name) return;
    if (!type) {
      setModalityError('Modality selection is required.');
      return;
    }

    onNextProp({ name, image });
  };

  const handleSelectModality = (platform: Nullable<Platform.Constants.PlatformType>) => {
    if (modalityError) setModalityError('');
    onChangeType((platform && Modality.OPTIONS_MAP[platform].type) || null, platform);
  };

  const modalityOptions = Modality.OPTIONS.filter((option) => option.platform !== Platform.Alexa.CONFIG.type || canUseAlexa);

  return (
    <>
      <Modal.Body>
        <SectionV2.SimpleContentSection
          header={
            <SectionV2.Title bold secondary>
              Name
            </SectionV2.Title>
          }
          headerProps={{ px: 0, bottomUnit: 1.5 }}
          contentProps={{ px: 0, bottomOffset: 0 }}
        >
          <Box.Flex gap={12}>
            <Input autoFocus value={name} placeholder="Enter assistant name" onChangeText={setName} />

            <Upload.IconUpload size={UploadIconVariant.EXTRA_SMALL} image={image} update={setImage} isSquare />
          </Box.Flex>
        </SectionV2.SimpleContentSection>

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
            value={platform}
            error={!!modalityError}
            prefix={platform && <SvgIcon size={16} icon={Modality.OPTIONS_MAP[platform].icon} color={Modality.OPTIONS_MAP[platform].iconColor} />}
            options={modalityOptions}
            onSelect={handleSelectModality}
            useLayers
            clearable
            searchable
            placeholder="Select modality"
            getOptionKey={(option) => option.platform}
            getOptionValue={(option) => option?.platform}
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
          <ModelImport
            importModel={importModel}
            onImportModel={onImportModel}
            isImportLoading={isImportLoading}
            setIsImportLoading={setIsImportLoading}
          />
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
          <LocalesSelect type={type} platform={platform} locales={locales} onChange={onChangeLocales} disabled={!platform} />
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

export default Setup;
