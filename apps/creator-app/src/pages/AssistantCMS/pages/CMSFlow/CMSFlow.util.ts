import type { CMSFlow } from '../../contexts/CMSManager/CMSManager.interface';
import { withFolderSearch } from '../../contexts/CMSManager/CMSManager.util';

export const flowSearch = withFolderSearch<CMSFlow>((item, { search }) =>
  item.name.toLocaleLowerCase().includes(search)
);
