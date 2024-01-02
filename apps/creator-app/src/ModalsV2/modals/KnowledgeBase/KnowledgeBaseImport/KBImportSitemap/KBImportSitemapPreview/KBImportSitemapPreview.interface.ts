import { BaseModels } from '@voiceflow/base-types';

export interface IKBImportSitemapPreview {
  urls: string;
  refreshRate: BaseModels.Project.KnowledgeBaseDocumentRefreshRate;
  onBack: VoidFunction;
  onClose: VoidFunction;
  setURLs: (urls: string) => void;
  enableClose: VoidFunction;
  disableClose: VoidFunction;
  closePrevented: boolean;
}
