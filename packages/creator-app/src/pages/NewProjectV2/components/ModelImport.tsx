import { BaseModels } from '@voiceflow/base-types';
import { Box, Flex, pickRandomDefaultColor, Text, toast } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import { styled } from '@/hocs';
import { upload } from '@/utils/dom';

import { FILE_EXTENSION_LABEL_MAP, PLATFORM_PROJECT_META_MAP } from '../constants';
import { ImportModel, SupportedPlatformType } from '../types';

interface ModelImportProps {
  platform: SupportedPlatformType;
  importModel: ImportModel | null;
  onImportModel: (importModel: ImportModel) => void;
  isImportLoading: boolean;
  setIsImportLoading: (isLoadingImport: boolean) => void;
}

export const ImportLink = styled(Text)<{ disabled: boolean }>`
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  color: ${({ disabled }) => (disabled ? 'rgba(93, 157, 245, 0.5)' : 'rgba(93, 157, 245, 1)')};

  &:hover {
    color: #3d82e2 !important;
  }
`;

const ModelImport: React.FC<ModelImportProps> = ({ platform, onImportModel, importModel, isImportLoading, setIsImportLoading }) => {
  const platformClient = client.platform(platform);

  const onImport = async (files: FileList) => {
    if (!files.length) return;

    try {
      setIsImportLoading(true);
      const formData = new FormData();
      formData.append('file', files[0]);

      const importModelResponse: ImportModel = await platformClient.modelImport.import(platform, formData);
      if (importModelResponse) {
        importModelResponse.slots = importModelResponse.slots?.map((slot: BaseModels.Slot) =>
          slot.color ? slot : { ...slot, color: pickRandomDefaultColor() }
        );
        onImportModel(importModelResponse);
      }

      toast.success(`${importModelResponse.intents.length} intents successfully imported!`);
    } catch (err) {
      toast.error('File failed to import');
    } finally {
      setIsImportLoading(false);
    }
  };

  const fileExtensions = platform && PLATFORM_PROJECT_META_MAP[platform]?.importMeta?.fileExtensions;

  const acceptedFileFormats = fileExtensions?.join(',');
  const acceptedFileFormatsLabel = fileExtensions?.map((fileExtension) => FILE_EXTENSION_LABEL_MAP[fileExtension]).join(', ');

  const onUploadClick = () => {
    upload(onImport, { accept: acceptedFileFormats, multiple: false });
  };

  const importName = platform && PLATFORM_PROJECT_META_MAP[platform]?.importMeta?.name;

  const textColor = isImportLoading ? 'rgba(98, 119, 140, 0.5)' : 'rgba(98, 119, 140, 1)';

  return (
    <Box mt={12}>
      {importModel ? (
        <Text fontSize={13} color={textColor}>
          <Text color="#132144">{`${importModel.intents.length} `}</Text>intents containing{' '}
          <Text color="#132144">{`${importModel.slots.length} `}</Text> entities successfully imported.
        </Text>
      ) : (
        <Flex>
          <ImportLink disabled={isImportLoading} fontSize={13} onClick={onUploadClick}>
            {`Import ${importName} NLU model`}
          </ImportLink>
          <Box color="rgba(141, 162, 181, 0.5)" pl={8} pr={8}>
            •
          </Box>
          <Text fontSize={13} color={textColor}>
            {`${acceptedFileFormatsLabel} files supported`}
          </Text>
        </Flex>
      )}
    </Box>
  );
};

export default ModelImport;
