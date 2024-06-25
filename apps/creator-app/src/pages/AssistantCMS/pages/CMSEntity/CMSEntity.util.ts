import type { CMSEntity } from '../../contexts/CMSManager/CMSManager.interface';
import { withFolderSearch } from '../../contexts/CMSManager/CMSManager.util';

export const entitySearch = withFolderSearch<CMSEntity>((item, { search }) =>
  item.name.toLocaleLowerCase().includes(search)
);
