import { BaseModels } from '@voiceflow/base-types';
import { BaseProps } from '@voiceflow/ui-next';

export interface IKBImportSitemapPreview extends BaseProps {
  urls: string;
  refreshRate: BaseModels.Project.KnowledgeBaseDocumentRefreshRate;
  onBack: VoidFunction;
  onClose: VoidFunction;
  setURLs: (urls: string) => void;
  enableClose: VoidFunction;
  disableClose: VoidFunction;
  closePrevented: boolean;
}
