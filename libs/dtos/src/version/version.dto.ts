import { z } from 'zod';

import { VersionCanvasTemplateDTO } from './version-canvas-template.dto';
import { VersionCustomBlockDTO } from './version-custom-block.dto';
import { VersionDomainDTO } from './version-domain.dto';
import { VersionFolderDTO, VersionFolderItemDTO } from './version-folder.dto';
import { VersionKnowledgeBaseDTO } from './version-knowledge-base.dto';
import { VersionNLUUnclassifiedDataDTO } from './version-nlu-unclassified-data/version-nlu-unclassified-data.dto';
import { VersionNoteDTO } from './version-note.dto';

export const VersionDTO = z
  .object({
    _id: z.string(),

    name: z.string(),

    notes: z.record(VersionNoteDTO).optional(),

    /**
     * @deprecated use domains instead
     */
    topics: z.array(VersionFolderItemDTO).optional().describe('@deprecated in favor of domains'),

    folders: z.record(VersionFolderDTO).optional(),

    domains: z.array(VersionDomainDTO).optional(),

    legacyID: z.string().optional(),

    _version: z.number(),

    creatorID: z.number(),

    projectID: z.string(),

    prototype: z.record(z.unknown()).optional(),

    variables: z.array(z.string()),

    components: z.array(VersionFolderItemDTO).optional(),

    manualSave: z.boolean().optional(),

    platformData: z.record(z.unknown()),

    customBlocks: z.record(VersionCustomBlockDTO).optional(),

    rootDiagramID: z.string(),

    knowledgeBase: z.optional(VersionKnowledgeBaseDTO),

    canvasTemplates: z.array(VersionCanvasTemplateDTO).optional(),

    templateDiagramID: z.string().optional(),

    defaultStepColors: z.record(z.string()).optional(),

    /**
     * @deprecated in favor of legacyID
     */
    secondaryVersionID: z.number().optional().describe('@deprecated in favor of legacyID'),

    autoSaveFromRestore: z.boolean().optional(),

    nluUnclassifiedData: z.array(VersionNLUUnclassifiedDataDTO).optional(),
  })
  .strict();

export type Version = z.infer<typeof VersionDTO>;
