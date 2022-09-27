import { BaseModels } from '@voiceflow/base-types';
import { pickRandomDefaultColor, toast } from '@voiceflow/ui';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import React from 'react';

import client from '@/client';
import { NLUImportOrigin, PlatformToNLPProvider } from '@/constants';
import { useTrackingEvents } from '@/hooks';
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
  const [trackingEvents] = useTrackingEvents();
  const platformClient = client.platform(platform);
  const acceptedFileFormats = fileExtensions?.join(',');
  const acceptedFileFormatsLabel = fileExtensions?.map((fileExtension) => FILE_EXTENSION_LABEL_MAP[fileExtension]).join(', ');

  const getSlots = (importModelResponse: ImportModel) => {
    return importModelResponse.slots?.map((slot: BaseModels.Slot) => (slot.color ? slot : { ...slot, color: pickRandomDefaultColor() }));
  };

  const onImport = (origin: NLUImportOrigin) => async (files: FileList) => {
    if (!files.length) return;

    try {
      setIsImporting(true);
      const formData = new FormData();
      formData.append('file', files[0]);

      const importModelResponse: ImportModel | void = await platformClient.modelImport?.import(platform, formData);
      setIsImporting(false);
      if (importModelResponse) {
        importModelResponse.slots = getSlots(importModelResponse);
        toast.success(`${importModelResponse.intents.length} intents successfully imported!`);
        onImportModel?.(importModelResponse);
      }
    } catch (err) {
      setIsImporting(false);

      toast.error('File failed to import');
      trackingEvents.trackProjectNLUImportFailed({
        platform,
        origin,
        nluType: PlatformToNLPProvider[platform],
      });
    }
  };

  const onUploadClick = (origin: NLUImportOrigin) => {
    if (acceptedFileFormats) {
      upload(onImport(origin), { accept: acceptedFileFormats, multiple: false });
    }
  };

  return {
    onUploadClick,
    isImporting,
    acceptedFileFormatsLabel,
  };
};
