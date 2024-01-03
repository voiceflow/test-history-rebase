import { BaseModels } from '@voiceflow/base-types';

export interface IKBImportSitemapURL {
  onClose: VoidFunction;
  addURLs: (urls: string[]) => void;
  sitemapURL: string;
  onContinue: VoidFunction;
  enableClose: VoidFunction;
  disableClose: VoidFunction;
  setSitemapURL: (url: string) => void;
  closePrevented: boolean;
  canSetRefreshRate: boolean;
  refreshRate: BaseModels.Project.KnowledgeBaseDocumentRefreshRate;
  setRefreshRate: React.Dispatch<React.SetStateAction<BaseModels.Project.KnowledgeBaseDocumentRefreshRate>>;
}
