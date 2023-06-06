export enum BlockType {
  // internal
  START = 'start',
  COMBINED = 'combined',
  COMMAND = 'command',
  COMMENT = 'comment',
  ACTIONS = 'actions',

  // ai
  AI_RESPONSE = 'generative',
  AI_SET = 'ai_set',

  // basic
  TEXT = 'text',
  SPEAK = 'speak',
  CHOICE_OLD = 'choice',

  // navigation
  EXIT = 'exit',
  GO_TO_NODE = 'goToNode',
  GO_TO_INTENT = 'goTo',

  // logic
  SET = 'set',
  SETV2 = 'setV2',
  IF = 'if',
  IFV2 = 'ifV2',
  RANDOM = 'random',
  RANDOMV2 = 'randomV2',

  // advanced
  CHOICE = 'interaction',
  BUTTONS = 'buttons',
  CAPTURE = 'capture',
  CAPTUREV2 = 'captureV2',
  INTENT = 'intent',
  INTEGRATION = 'integration',
  COMPONENT = 'component',
  CODE = 'code',
  PROMPT = 'prompt',
  TRACE = 'trace',
  URL = 'url',

  // visuals
  CAROUSEL = 'carousel',
  CARDV2 = 'cardV2',
  VISUAL = 'visual',

  // user
  DEPRECATED = 'deprecated',
  INVALID_PLATFORM = 'invalid_platform',

  DEPRECATED_CUSTOM_PAYLOAD = 'custom_payload',
  PAYLOAD = 'payload',

  MARKUP_TEXT = 'markup_text',
  MARKUP_IMAGE = 'markup_image',
  MARKUP_VIDEO = 'markup_video',
}

export type DeprecatedBlockType = BlockType.COMMENT | BlockType.CHOICE_OLD;

export type RootBlockType = BlockType.COMBINED | BlockType.START;
export const ROOT_NODES: ReadonlyArray<RootBlockType> = [BlockType.COMBINED, BlockType.START];
export const isRootBlockType = (type: BlockType): type is RootBlockType => ROOT_NODES.includes(type as RootBlockType);

export type InternalBlockType = BlockType.DEPRECATED | BlockType.COMMAND | RootBlockType;
export const INTERNAL_NODES: ReadonlyArray<InternalBlockType> = [BlockType.DEPRECATED, BlockType.COMMAND, ...ROOT_NODES];
export const isInternalBlockType = (type: BlockType): type is InternalBlockType => INTERNAL_NODES.includes(type as RootBlockType);

export type MarkupMediaBlockType = BlockType.MARKUP_IMAGE | BlockType.MARKUP_VIDEO;
export const MARKUP_MEDIA_NODES: ReadonlyArray<MarkupMediaBlockType> = [BlockType.MARKUP_IMAGE, BlockType.MARKUP_VIDEO];

export type MarkupBlockType = BlockType.MARKUP_TEXT | MarkupMediaBlockType;
export const MARKUP_NODES: ReadonlyArray<MarkupBlockType> = [BlockType.MARKUP_TEXT, ...MARKUP_MEDIA_NODES];

export type RootOrMarkupBlockType = RootBlockType | MarkupBlockType;
export const ROOT_AND_MARKUP_NODES: ReadonlyArray<RootOrMarkupBlockType> = [...ROOT_NODES, ...MARKUP_NODES];

export type MarkupOrCombinedBlockType = BlockType.COMBINED | MarkupBlockType;
export const MARKUP_AND_COMBINED_NODES: ReadonlyArray<MarkupOrCombinedBlockType> = [BlockType.COMBINED, ...MARKUP_NODES];

export type CanvasTemplateType = BlockType.COMBINED | BlockType.ACTIONS | MarkupBlockType;
export const CANVAS_TEMPLATE_NODES: ReadonlyArray<CanvasTemplateType> = [BlockType.COMBINED, BlockType.ACTIONS, ...MARKUP_NODES];

export type NavigationBlockType = BlockType.EXIT | BlockType.GO_TO_NODE | BlockType.GO_TO_INTENT;
export const NAVIGATION_NODES: ReadonlyArray<NavigationBlockType> = [BlockType.EXIT, BlockType.GO_TO_NODE, BlockType.GO_TO_INTENT];

export type CanvasChipBlockType = BlockType.INTENT | BlockType.START;
export const CANVAS_CHIPS_NODES: ReadonlyArray<CanvasChipBlockType> = [BlockType.INTENT, BlockType.START];

export type DiagramMenuBlockType = BlockType.START | BlockType.INTENT | BlockType.COMPONENT;
export const DIAGRAM_MENU_NODES: ReadonlyArray<DiagramMenuBlockType> = [BlockType.START, BlockType.INTENT, BlockType.COMPONENT];

export type StaringBlockType = BlockType.START | BlockType.COMBINED;
export const STARTING_NODES: ReadonlyArray<StaringBlockType> = [BlockType.START, BlockType.COMBINED];

export type SharedBlockType = DiagramMenuBlockType | BlockType.COMBINED;
export const SHARED_NODES: ReadonlyArray<SharedBlockType> = [...DIAGRAM_MENU_NODES, BlockType.COMBINED];

export type StepBlockType = Exclude<BlockType, RootOrMarkupBlockType | DeprecatedBlockType>;

export const NO_IN_PORT_NODES = new Set([BlockType.INTENT, BlockType.COMMAND, BlockType.START]);
