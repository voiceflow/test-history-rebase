export interface IKBImportSitemapURL {
  onClose: VoidFunction;
  addURLs: (urls: string[]) => void;
  sitemapURL: string;
  onContinue: VoidFunction;
  enableClose: VoidFunction;
  disableClose: VoidFunction;
  setSitemapURL: (url: string) => void;
  closePrevented: boolean;
}
