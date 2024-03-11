import { z } from 'zod';

import { VersionKnowledgeBaseDTO } from '../version/version-knowledge-base.dto';
import { ProjectAIAssistSettingsDTO } from './project-ai-assist-settings.dto';
import { ProjectCustomThemeDTO } from './project-custom-theme.dto';
import { ProjectMemberDTO } from './project-member.dto';
import { ProjectPrivacy } from './project-privacy.enum';
import { ProjectPrototypeDTO } from './project-prototype.dto';
import { ProjectReportTagDTO } from './project-report-tag.dto';
import { ProjectStickerDTO } from './project-sticker.dto';

export const ProjectDTO = z
  .object({
    _id: z.string(),

    nlu: z.string().optional(),

    type: z.string().optional(),

    name: z.string(),

    image: z.string().optional(),

    teamID: z.string(),

    members: z.array(ProjectMemberDTO),

    privacy: z.nativeEnum(ProjectPrivacy).optional(),

    platform: z.string(),

    _version: z.number().optional(),

    linkType: z.string().optional(),

    stickers: z.array(ProjectStickerDTO).optional(),

    creatorID: z.number(),

    updatedBy: z.number().optional(),

    createdAt: z.string().nullable().optional(),

    updatedAt: z.string().optional(),

    prototype: z.optional(ProjectPrototypeDTO),

    apiPrivacy: z.nativeEnum(ProjectPrivacy).optional(),

    devVersion: z.string().optional(),

    liveVersion: z.string().optional(),

    reportTags: z.record(ProjectReportTagDTO).optional(),

    platformData: z.record(z.unknown()),

    customThemes: z.array(ProjectCustomThemeDTO).optional(),

    knowledgeBase: z.optional(VersionKnowledgeBaseDTO).describe('@deprecated use version.knowledgeBase'),

    previewVersion: z.string().optional(),

    aiAssistSettings: z.optional(ProjectAIAssistSettingsDTO),
  })
  .strict();

export type Project = z.infer<typeof ProjectDTO>;
