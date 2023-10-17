import type { AnyRecord } from '@voiceflow/common';

import type { BaseResource } from '@/common';
import type { NodeType } from '@/main';

import type { CanvasTemplate } from './canvas-template/canvas-template.interface';
import type { Domain } from './domain/domain.interface';
import type { Folder, FolderItem } from './folder/folder.interface';
import type { Intent } from './intent/intent.interface';
import type { NLUUnclassifiedData } from './nlu-unclassified-data/nlu-unclassified-data';
import type { BaseNote } from './note/note.interface';
import type { Prototype } from './prototype/prototype.interface';
import type { Slot } from './slot/slot.interface';

export interface PlatformData {
  slots: Slot[];
  intents: Intent[];
  settings: AnyRecord;
  publishing: AnyRecord;
}

export interface CustomBlock {
  key: string;
  name: string;
  parameters: Record<
    string,
    {
      id: string;
      name: string;
    }
  >;
  body: string;
  stop: boolean;
  paths: string[];
  defaultPath: number;
}

export declare type DefaultStepColors = Partial<Record<NodeType, string>>;

export interface Version extends BaseResource {
  _id: string;
  _version?: number;
  creatorID: number;
  projectID: string;
  rootDiagramID: string;
  name: string;
  notes?: Record<string, BaseNote>;
  domains?: Domain[];
  folders?: Record<string, Folder>;
  variables: string[];
  prototype?: Prototype;
  components?: FolderItem[];
  platformData: PlatformData;
  canvasTemplates?: CanvasTemplate[];
  templateDiagramID?: string;
  defaultStepColors?: DefaultStepColors;
  manualSave: boolean;
  autoSaveFromRestore: boolean;
  customBlocks?: Record<string, CustomBlock>;
  /**
   * @deprecated replaced with domains
   */
  topics?: FolderItem[];
  nluUnclassifiedData?: NLUUnclassifiedData[];
}
