import * as Realtime from '@voiceflow/realtime-sdk';
import { toast } from '@voiceflow/ui';
import React from 'react';

import * as Account from '@/ducks/account';
import * as ProjectV2 from '@/ducks/projectV2';
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

  const partialImport = React.useCallback((content: string, fileName: string) => {
    try {
      const state = store.getState();

      const activeVersion = VersionV2.active.versionSelector(state);
      const targetVersion = activeVersion?._version as Realtime.SchemaVersion;
      if (!targetVersion) throw new Error('no target version');

      const vf: VF_FILE = JSON.parse(content);

      const projectType = ProjectV2.active.projectTypeSelector(state);
      if (vf.project.type !== projectType) {
        toast.error(`Can not merge a ${vf.project.type} type project into ${projectType} type project`);
        return;
      }

      const [{ diagrams, version }] = Realtime.Migrate.migrateProject(
        {
          ...vf,
          diagrams: Object.values(vf.diagrams),
          creatorID: Account.userIDSelector(state)!,

          cms: {
            intents: [],
            entities: [],
            variables: [],
            assistant: null,
            responses: [],
            utterances: [],
            entityVariants: [],
            requiredEntities: [],
            responseVariants: [],
            responseDiscriminators: [],
          },
        },
        targetVersion
      );

      const next = {
        version: { ...vf.version, ...version },
        project: vf.project,
        diagrams: Object.fromEntries(
          diagrams.map((diagram) => [diagram.diagramID ?? diagram._id, { ...vf.diagrams[diagram.diagramID ?? diagram._id], ...diagram }])
        ),
      } as VF_FILE;

      partialImportModal.openVoid({ next, fileName });
    } catch (error) {
      toast.error(`unable to process\n${error}`);
      log.error(error);
    }
  }, []);

  return () => upload(async (files) => partialImport(await files[0].text(), files[0].name), { accept: '.vf', multiple: false });
};
