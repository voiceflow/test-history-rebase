import type { BaseModels } from '@voiceflow/base-types';
import type { BaseProps } from '@voiceflow/ui-next';

export interface IKBImportSitemapURL extends BaseProps {
  onClose: VoidFunction;
  addURLs: (urls: string[]) => void;
  sitemapURL: string;
  onContinue: VoidFunction;
  enableClose: VoidFunction;
  disableClose: VoidFunction;
  setSitemapURL: (url: string) => void;
  closePrevented: boolean;
  refreshRate: BaseModels.Project.KnowledgeBaseDocumentRefreshRate;
  setRefreshRate: React.Dispatch<React.SetStateAction<BaseModels.Project.KnowledgeBaseDocumentRefreshRate>>;
}
