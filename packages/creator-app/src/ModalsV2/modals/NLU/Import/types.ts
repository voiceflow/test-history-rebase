import { NLUImportModel } from '@/models';

import { ImportType } from './constants';

export interface CSVFile {
  data: string[];
  fileName: string;
}

export interface IntentImportState {
  importedModel: NLUImportModel | null;
  file: File | null;
}

export interface IntentUnclassifiedData {
  file: CSVFile | null;
}

export type ModalsState = Record<ImportType, IntentImportState | IntentUnclassifiedData>;
