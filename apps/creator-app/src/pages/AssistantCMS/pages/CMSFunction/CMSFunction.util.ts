import type { CMSFunction } from '../../contexts/CMSManager/CMSManager.interface';
import { withFolderSearch } from '../../contexts/CMSManager/CMSManager.util';

export const functionSearch = withFolderSearch<CMSFunction>(
  (item, { search }) => item.name.toLocaleLowerCase().includes(search) || !!item.description?.toLocaleLowerCase().includes(search)
);
