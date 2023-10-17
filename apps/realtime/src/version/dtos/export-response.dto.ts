import { z } from 'nestjs-zod/z';

const Privacy = z.enum(['private', 'public']);
const LinkType = z.enum(['CURVED', 'STRAIGHT']);
const ProjectNLP = z.enum(['LUIS', 'VFNLU']);
const KnowledgeBaseDocumentStatus = z.enum(['ERROR', 'SUCCESS', 'PENDING', 'INITIALIZED']);

const PrototypeNLPBase = z.object({
  type: ProjectNLP,
});

const PrototypeNLPLuis = PrototypeNLPBase.extend({
  type: z.literal('LUIS'),
  appID: z.string(),
  resourceID: z.string().optional(),
});

const PrototypeNLPVFNLU = PrototypeNLPBase.extend({
  type: z.literal('VFNLU'),
});

const PrototypeNLP = z.union([PrototypeNLPLuis, PrototypeNLPVFNLU]);

const Sticker = z.object({
  id: z.string(),
  url: z.string(),
});

const ReportTag = z.object({
  tagID: z.string(),
  label: z.string(),
});

const SlotType = z.object({
  value: z.string().optional(),
});

const Slot = z.object({
  key: z.string(),
  name: z.string(),
  type: SlotType,
  color: z.string().optional(),
  inputs: z.array(z.string()),
});

const PrototypeModel = z.object({
  slots: z.array(Slot),
  intents: z.array(z.any()),
});

const Prototype = z.object({
  nlp: PrototypeNLP.optional(),
  data: z.any(),
  trainedModel: PrototypeModel.optional(),
  lastTrainedTime: z.number().optional(),
});

const Shades = z.object({
  '50': z.string(),
  '100': z.string(),
  '200': z.string(),
  '300': z.string(),
  '400': z.string(),
  '500': z.string(),
  '600': z.string(),
  '700': z.string(),
  '800': z.string(),
  '900': z.string(),
});

const Theme = z.object({
  palette: Shades,
  standardColor: z.string(),
  name: z.string().optional(),
});

const AIAssistSettings = z.object({
  aiPlayground: z.boolean().optional(),
  generateStep: z.boolean().optional(),
  generateNoMatch: z.boolean().optional(),
  generativeTasks: z.boolean().optional(),
});

const Member = z.object({
  creatorID: z.number(),
  platformData: z.any(),
});

const KBTag = z.object({
  tagID: z.string(),
  label: z.string(),
});

const KnowledgeBaseDocument = z.object({
  data: z.any(),
  status: z.object({
    type: KnowledgeBaseDocumentStatus,
    data: z.any().optional(),
  }),
  creatorID: z.number(),
  updatedAt: z.date(),
  documentID: z.string(),
  s3ObjectRef: z.string(),
  version: z.number().optional(),
  tags: z.record(KBTag).optional(),
});

const RecursiveTextSplitter = z.object({
  type: z.literal('recursive_text_splitter'),
  size: z.number().optional(),
  overlap: z.number().optional(),
});

const KnowledgeBaseSettings = z.object({
  chunkStrategy: RecursiveTextSplitter,
  summarization: z.any(),
  search: z.object({
    limit: z.number(),
    metric: z.string(),
  }),
});

const KnowledgeBaseSetFaq = z.object({
  name: z.string(),
  status: z.object({
    type: KnowledgeBaseDocumentStatus,
    data: z.any().optional(),
  }),
  creatorID: z.number(),
  updatedAt: z.date(),
  faqSetID: z.string(),
  version: z.number().optional(),
  tags: z.record(z.string()).optional(),
});

const KnowledgeBase = z.object({
  settings: KnowledgeBaseSettings.optional(),
  documents: z.record(KnowledgeBaseDocument),
  tags: z.record(KBTag).optional(),
  faqSets: z.record(KnowledgeBaseSetFaq).optional(),
});

const Project = z.object({
  _id: z.string(),
  teamID: z.string(),
  _version: z.number().optional(),
  creatorID: z.number(),
  devVersion: z.string().optional(),
  liveVersion: z.string().optional(),
  name: z.string(),
  type: z.string().optional(),
  image: z.string().optional(),
  privacy: Privacy.optional(),
  platform: z.string(),
  stickers: z.array(Sticker).optional(),
  linkType: LinkType.optional(),
  prototype: Prototype.optional(),
  apiPrivacy: Privacy.optional(),
  reportTags: z.record(ReportTag).optional(),
  customThemes: z.array(Theme),
  updatedAt: z.string().optional(),
  updatedBy: z.number().optional(),
  aiAssistSettings: AIAssistSettings.optional(),
  members: z.array(Member),
  platformData: z.any(),
  knowledgeBase: KnowledgeBase.optional(),
});

export const ExportResponse = z.object({
  url: z.string(),
  attachmentID: z.string(),

  _version: z.string(),
  project: Project.extend({
    createdAt: z.dateString(),
  }),
  // version,
  // diagrams: mappedDiagrams,
  // ...(programs && { programs }),
  // variableStates,

  // temporary for JPMC, remove after they have migrated
  // ...(Object.keys(version.customBlocks || {}).length > 0 && {
  //   customBlocks: Object.values(version.customBlocks!).map(({ key, ...block }: any) => ({ ...block, _id: key, projectID: version.projectID })),
  // }),
});

export type ExportResponse = z.infer<typeof ExportResponse>;
