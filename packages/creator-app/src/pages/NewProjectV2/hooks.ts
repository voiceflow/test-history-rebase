import { BaseModels } from '@voiceflow/base-types';
import { pickRandomDefaultColor, toast } from '@voiceflow/ui';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';

import client from '@/client';
import { FILE_EXTENSION_LABEL_MAP } from '@/pages/NewProjectV2/constants';
import { FileExtension, ImportModel } from '@/pages/NewProjectV2/types';
import { upload } from '@/utils/dom';

export const useNLUImport = ({
  onImportModel,
  fileExtensions = [],
  platform,
}: {
  fileExtensions?: FileExtension[];
  platform: VoiceflowConstants.PlatformType;
  onImportModel?: (data: any) => void;
}) => {
  const [isImporting, setIsImporting] = React.useState(false);
  const platformClient = client.platform(platform);
  const acceptedFileFormats = fileExtensions?.join(',');
  const acceptedFileFormatsLabel = fileExtensions?.map((fileExtension) => FILE_EXTENSION_LABEL_MAP[fileExtension]).join(', ');
  const onImport = async (files: FileList) => {
    if (!files.length) return;

    try {
      setIsImporting(true);
      const formData = new FormData();
      formData.append('file', files[0]);

      const importModelResponse: ImportModel = await platformClient.modelImport.import(platform, formData);
      setIsImporting(false);
      if (importModelResponse) {
        importModelResponse.slots = importModelResponse.slots?.map((slot: BaseModels.Slot) =>
          slot.color ? slot : { ...slot, color: pickRandomDefaultColor() }
        );
        toast.success(`${importModelResponse.intents.length} intents successfully imported!`);
        onImportModel?.(importModelResponse);
      }
    } catch (err) {
      setIsImporting(false);

      toast.error('File failed to import');
    }
  };

  const onUploadClick = () => {
    if (acceptedFileFormats) {
      upload(onImport, { accept: acceptedFileFormats, multiple: false });
    }
  };

  return {
    onUploadClick,
    isImporting,
    acceptedFileFormatsLabel,
  };
};
