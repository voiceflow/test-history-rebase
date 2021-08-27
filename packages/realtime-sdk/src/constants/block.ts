export enum BlockType {
  // internal
  START = 'start',
  COMBINED = 'combined',
  COMMAND = 'command',
  COMMENT = 'comment',

  // basic
  TEXT = 'text',
  SPEAK = 'speak',
  CHOICE_OLD = 'choice',
  // logic
  SET = 'set',
  SETV2 = 'setV2',
  IF = 'if',
  IFV2 = 'ifV2',
  CAPTURE = 'capture',
  RANDOM = 'random',
  // advanced
  CHOICE = 'interaction',
  BUTTONS = 'buttons',
  INTENT = 'intent',
  STREAM = 'stream',
  INTEGRATION = 'integration',
  FLOW = 'flow',
  CODE = 'code',
  EXIT = 'exit',
  PROMPT = 'prompt',
  TRACE = 'trace',
  // visuals
  CARD = 'card',
  VISUAL = 'visual',
  DISPLAY = 'display',
  // user
  PERMISSION = 'permission',
  ACCOUNT_LINKING = 'account_linking',
  USER_INFO = 'user_info',
  PAYMENT = 'payment',
  CANCEL_PAYMENT = 'cancel_payment',
  REMINDER = 'reminder',
  DEPRECATED = 'deprecated',
  INVALID_PLATFORM = 'invalid_platform',

  // event
  DIRECTIVE = 'directive',
  EVENT = 'event',

  MARKUP_TEXT = 'markup_text',
  MARKUP_IMAGE = 'markup_image',
}

export type RootBlockType = BlockType.COMBINED | BlockType.START | BlockType.COMMENT;
export const ROOT_NODES: ReadonlyArray<RootBlockType> = [BlockType.COMBINED, BlockType.START, BlockType.COMMENT];
export const isRootBlockType = (type: BlockType): type is RootBlockType => ROOT_NODES.includes(type as RootBlockType);

export type InternalBlockType = BlockType.DEPRECATED | BlockType.COMMAND | RootBlockType;
export const INTERNAL_NODES: ReadonlyArray<InternalBlockType> = [BlockType.DEPRECATED, BlockType.COMMAND, ...ROOT_NODES];
export const isInternalBlockType = (type: BlockType): type is InternalBlockType => INTERNAL_NODES.includes(type as RootBlockType);

export type MarkupBlockType = BlockType.MARKUP_TEXT | BlockType.MARKUP_IMAGE;
export const MARKUP_NODES: ReadonlyArray<MarkupBlockType> = [BlockType.MARKUP_TEXT, BlockType.MARKUP_IMAGE];

export type RootOrMarkupBlockType = RootBlockType | MarkupBlockType;
export const ROOT_AND_MARKUP_NODES: ReadonlyArray<RootOrMarkupBlockType> = [...ROOT_NODES, ...MARKUP_NODES];

export type MarkupOrCombinedBlockType = BlockType.COMBINED | MarkupBlockType;
export const MARKUP_AND_COMBINED_NODES: ReadonlyArray<MarkupOrCombinedBlockType> = [BlockType.COMBINED, ...MARKUP_NODES];

export type DiagramReferenceBlockType = BlockType.COMMAND | BlockType.FLOW;
export const DIAGRAM_REFERENCE_NODES: ReadonlyArray<DiagramReferenceBlockType> = [BlockType.COMMAND, BlockType.FLOW];

export const NO_IN_PORT_NODES = new Set([BlockType.INTENT, BlockType.COMMAND, BlockType.EVENT, BlockType.START]);
