import * as Realtime from '@voiceflow/realtime-sdk';
import { toast } from '@voiceflow/ui';
import React from 'react';

import * as VersionV2 from '@/ducks/versionV2';
import { useStore } from '@/hooks/redux';
import * as ModalsV2 from '@/ModalsV2';
import { upload } from '@/utils/dom';
import log from '@/utils/logger';

import type { VF_FILE } from './diff';
import PartialImportManager from './modal';

export const usePartialImport = () => {
  const partialImportModal = ModalsV2.useModal(PartialImportManager);
  const store = useStore();

  const partialImport = React.useCallback((content: string) => {
    try {
      const activeVersion = VersionV2.active.versionSelector(store.getState());
      const targetVersion = activeVersion?._version;
      if (!targetVersion) throw new Error('no target version');

      const vf = JSON.parse(content);

      const { diagrams, version } = Realtime.Migrate.migrateProject({ ...vf, diagrams: Object.values(vf.diagrams) }, targetVersion);

      const next = {
        version: { ...vf.version, ...version },
        project: vf.project,
        diagrams: Object.fromEntries(diagrams.map((diagram) => [diagram._id, diagram])),
      } as VF_FILE;

      partialImportModal.open({
        next,
      });
    } catch (error) {
      toast.error(`unable to process\n${error}`);
      log.error(error);
    }
  }, []);

  return () => upload(async (files) => partialImport(await files[0].text()), { accept: '.vf', multiple: false });
};
