import { BaseModels } from '@voiceflow/base-types';
import * as Platform from '@voiceflow/platform-config';
import { pickRandomDefaultColor, toast } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import * as NLU from '@/config/nlu';
import { NLUImportOrigin } from '@/constants';
import { useTrackingEvents } from '@/hooks';
import { NLUImportModel } from '@/models';
import { upload } from '@/utils/dom';

interface Options {
  nluType: Platform.Constants.NLUType;
  platform: Platform.Constants.PlatformType;
  onImport?: (data: NLUImportModel) => void;
}

export const useNLUImport = ({ nluType, platform, onImport }: Options) => {
  const [trackingEvents] = useTrackingEvents();
  const [isImporting, setIsImporting] = React.useState(false);

  const nlu = NLU.Config.get(nluType);

  const fileExtensions = React.useMemo(() => nlu.nlps[0].import?.extensions ?? [], [nlu]);

  const acceptedFileFormatsLabel = React.useMemo(
    () => fileExtensions.map((fileExtension) => fileExtension.replace('.', '').toUpperCase()).join(', '),
    [fileExtensions]
  );

  const onFileChangeFactory = (origin: NLUImportOrigin) => async (files: FileList | File[]) => {
    if (!files.length) return;

    try {
      setIsImporting(true);

      const formData = new FormData();
      formData.append('file', files[0]);

      const importModelResponse = await client.platform(platform).modelImport?.import(nluType, formData);

      setIsImporting(false);

      if (!importModelResponse) return;

      importModelResponse.slots =
        importModelResponse.slots?.map((slot: BaseModels.Slot) => (slot.color ? slot : { ...slot, color: pickRandomDefaultColor() })) ?? [];

      toast.success(`${importModelResponse.intents.length} intents successfully imported!`);

      onImport?.(importModelResponse);
    } catch (err) {
      setIsImporting(false);

      toast.error('File failed to import');
      trackingEvents.trackProjectNLUImportFailed({
        origin,
        importNLPType: nlu.nlps[0].type,
        targetNLUType: nlu.type,
      });
    }
  };

  const onUploadClick = (origin: NLUImportOrigin) => {
    if (!fileExtensions.length) return;

    upload(onFileChangeFactory(origin), { accept: fileExtensions.join(','), multiple: false });
  };

  return {
    isImporting,
    onUploadClick,
    fileExtensions,
    acceptedFileFormatsLabel,
    onFileChangeFactory,
  };
};
