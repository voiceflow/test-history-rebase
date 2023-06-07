import { id } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { toast } from '@voiceflow/ui';
import React from 'react';

import client from '@/client';
import * as Account from '@/ducks/account';
import * as DiagramV2 from '@/ducks/diagramV2';
import * as Domain from '@/ducks/domain';
import * as VersionV2 from '@/ducks/versionV2';
import { useStore } from '@/hooks/redux';
import * as ModalsV2 from '@/ModalsV2';
import { upload } from '@/utils/dom';
import log from '@/utils/logger';

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

      const { version: importedVersion, diagrams: importedDiagrams } = Realtime.Migrate.migrateProject(
        { ...vf, diagrams: Object.values(vf.diagrams) },
        targetVersion
      );

      // TODO: we need a canonical ID system!!!
      // get a dictionary of imported diagram names (with domains) to their IDs
      const importedTopicDomainMap = Object.fromEntries(
        importedVersion.domains?.flatMap((domain) => domain.topicIDs.map((topicID) => [topicID, domain.id])) || []
      );
      const importedDiagramNameToIDMap = Object.fromEntries(
        importedDiagrams.map((diagram) => [(importedTopicDomainMap[diagram._id] || '') + diagram.name, diagram._id])
      );

      // get a dictionary of current diagram names (with domains) to their IDs
      const currentDiagrams = DiagramV2.allDiagramsSelector(store.getState());
      const currentDomains = Domain.allDomainsSelector(store.getState());

      const currentTopicDomainMap = Object.fromEntries(
        currentDomains.flatMap((domain) => domain.topicIDs.map((topicID) => [topicID, domain.id])) || []
      );

      const currentDiagramNameToIDMap = Object.fromEntries(
        currentDiagrams.map((diagram) => [(currentTopicDomainMap[diagram.id] || '') + diagram.name, diagram.id])
      );

      // create a mapping of imported diagram IDs to current diagram IDs based on the names
      const importedToCurrentDiagramIDMap = Object.fromEntries(
        Object.entries(importedDiagramNameToIDMap)
          .map(([name, id]) => [id, currentDiagramNameToIDMap[name]])
          .filter(([, id]) => id)
      );

      // replace all referenced diagramIDs in the imported diagrams with the current diagram IDs
      const remappedImportedDiagrams = id.remapObjectIDs(importedDiagrams, importedToCurrentDiagramIDMap);
      const remappedImportedVersion = id.remapObjectIDs(importedVersion, importedToCurrentDiagramIDMap);

      const save = async (topicIDs: string[], targetDomainID: string) => {
        const diagramsToSave = remappedImportedDiagrams.filter((diagram) => topicIDs.includes(diagram._id));
        toast.info('Saving topics');

        const remappedDiagramIDs = new Set(Object.values(importedToCurrentDiagramIDMap));
        const currentDiagramIDs = new Set(DiagramV2.allDiagramIDsSelector(store.getState()));
        const targetDomain = Domain.domainByIDSelector(store.getState(), { id: targetDomainID });
        if (!targetDomain) throw new Error('no target domain');

        await Promise.all(
          diagramsToSave.map(async ({ _id, ...diagram }) => {
            // only overwrite the diagram if rewritten, and already exists in project
            let topicID: string;
            if (remappedDiagramIDs.has(_id) && currentDiagramIDs.has(_id)) {
              await client.api.diagram.update(_id, diagram);
              topicID = _id;
            } else {
              const newTopic = await client.api.diagram.create({
                ...diagram,
                versionID: activeVersion.id,
                creatorID: Account.userIDSelector(store.getState())!,
              });
              topicID = newTopic._id;
            }

            // all topics and subtopics in the target domain
            const topicsInDomain = new Set([
              ...targetDomain.topicIDs,
              ...targetDomain.topicIDs.flatMap((diagramID) =>
                currentDiagrams.find((diagram) => diagramID === diagram.id)?.menuItems?.map((item) => item.sourceID)
              ),
            ]);

            if (!topicsInDomain.has(topicID)) {
              await client.api.fetch.post(`/versions/${activeVersion.id}/domains/${targetDomainID}/topics`, { topicID });
            }
          })
        );
        toast.success('Topics saved. Reloading page...');

        // reload the page
        window.location.reload();
      };

      partialImportModal.open({
        data: {
          diagrams: remappedImportedDiagrams,
          project: vf.project,
          version: remappedImportedVersion,
        },
        save,
      });
    } catch (error) {
      toast.error(`unable to process\n${error}`);
      log.error(error);
    }
  }, []);

  return () => upload(async (files) => partialImport(await files[0].text()), { accept: '.vf', multiple: false });
};
