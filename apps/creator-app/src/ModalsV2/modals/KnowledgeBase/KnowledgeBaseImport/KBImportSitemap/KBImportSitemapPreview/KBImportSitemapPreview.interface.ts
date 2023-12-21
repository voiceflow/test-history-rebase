export interface IKBImportSitemapPreview {
  urls: string;
  onBack: VoidFunction;
  onClose: VoidFunction;
  setURLs: (urls: string) => void;
  enableClose: VoidFunction;
  disableClose: VoidFunction;
  closePrevented: boolean;
}
